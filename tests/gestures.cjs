// npm run build first. Use Playwright from an external installation via NODE_PATH;
// no application or lockfile dependency is required. Optional CHROMIUM_EXECUTABLE
// selects a local browser. TEST_OUTPUT selects the evidence directory.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../dist');
const output = process.env.TEST_OUTPUT || fs.mkdtempSync(path.join(os.tmpdir(), 'card-gestures-'));
fs.mkdirSync(output, { recursive: true });
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + (req.url === '/' ? '/index.html' : req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.setHeader('Content-Type', {
    '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
    '.svg': 'image/svg+xml', '.vcf': 'text/vcard',
  }[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({
    ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}),
    args: process.env.CHROMIUM_ARGS ? JSON.parse(process.env.CHROMIUM_ARGS) : [],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const cdp = await page.context().newCDPSession(page);
    const url = `http://127.0.0.1:${server.address().port}`;
    const report = { browser: browser.version(), groups: [], errors: [], areas: [], viewports: [] };
    page.on('pageerror', error => report.errors.push(error.message));
    const angle = () => page.$eval('#card-faces', el => Number(el.style.transform.match(/rotateY\(([-\d.]+)deg\)/)[1]));
    const waitAngle = value => page.waitForFunction(value =>
      document.querySelector('#card-faces').style.transform === `rotateY(${value}deg)`, value);
    const settled = () => page.waitForFunction(() =>
      [...document.querySelectorAll('.card-face')].filter(el => !el.inert).length === 1 &&
      !document.querySelector('.business-card').classList.contains('is-dragging') &&
      !document.querySelector('#flip-card').getAttribute('aria-label').includes('회전 중'));
    const reset = async () => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] }).catch(() => {});
      await page.mouse.up();
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(url);
      await page.waitForSelector('.is-interactive');
    };
    const back = async () => {
      if (await page.$eval('#card-back', el => el.inert)) {
        await page.locator('#flip-card').evaluate(el => el.click());
        await settled();
      }
    };
    const point = async (selector = '.business-card', fraction = .1) => {
      const r = await page.locator(selector).first().boundingBox();
      return { x: r.x + r.width / 2, y: r.y + r.height * fraction };
    };
    const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', {
      type, touchPoints: ['touchEnd', 'touchCancel'].includes(type) ? [] : [{ x, y }],
    });
    const down = async (kind, p) => {
      if (kind === 'touch') await touch('touchStart', p.x, p.y);
      else { await page.mouse.move(p.x, p.y); await page.mouse.down(); }
    };
    const move = (kind, x, y) => kind === 'touch' ? touch('touchMove', x, y) : page.mouse.move(x, y);
    const up = kind => kind === 'touch' ? touch('touchEnd') : page.mouse.up();
    const drag = async (kind, p, dx, steps = 10, release = true) => {
      const start = await angle();
      await down(kind, p);
      for (let n = 1; n <= steps; n++) await move(kind, p.x + dx * n / steps, p.y);
      await waitAngle(start + dx * 1.2);
      if (release) { await up(kind); await settled(); }
    };
    const test = async (name, fn) => {
      if (process.env.TEST_FILTER && !name.includes(process.env.TEST_FILTER)) return;
      try {
        await reset();
        await fn();
        report.groups.push({ name, pass: true });
        console.log('PASS', name);
      } catch (error) {
        report.groups.push({ name, pass: false, error: error.stack });
        console.error('FAIL', name, error.message);
      }
    };

    for (const kind of ['touch', 'mouse']) {
      await test(`${kind}: top / center / bottom / each link / QR / Save Contact drag`, async () => {
        const areas = [
          ['top', '.business-card', .1, false], ['center', '.business-card', .5, false],
          ['bottom', '.business-card', .92, false],
          ['BLOG', '.contact-link:nth-child(1)', .5, true],
          ['GITHUB', '.contact-link:nth-child(2)', .5, true],
          ['EMAIL', '.contact-link:nth-child(3)', .5, true],
          ['QR', '.contact-qr', .5, true], ['Save Contact', '.save-contact', .5, true],
        ];
        for (const [name, selector, fraction, needsBack] of areas) {
          await reset();
          if (needsBack) await back();
          const start = await angle();
          let activations = 0;
          const onPopup = popup => { activations++; popup.close(); };
          const onDownload = () => activations++;
          page.on('popup', onPopup);
          page.on('download', onDownload);
          await page.evaluate(() => {
            window.actions = 0;
            document.querySelectorAll('.business-card a').forEach(el => el.addEventListener('click', () => window.actions++));
          });
          await drag(kind, await point(selector, fraction), 100);
          assert.equal(await angle(), start + 180);
          assert.equal(activations, 0);
          assert.equal(await page.evaluate(() => window.actions), 0);
          page.off('popup', onPopup);
          page.off('download', onDownload);
          report.areas.push({ input: kind, area: name, degrees: 120, snap: start + 180, activation: false });
        }
      });
    }

    await test('tap, 6px intent threshold, vertical/diagonal intent and consecutive inputs', async () => {
      const p = await point();
      await page.touchscreen.tap(p.x, p.y); await settled(); assert.equal(await angle(), 180);
      await page.touchscreen.tap(p.x, p.y); await settled(); assert.equal(await angle(), 360);
      await down('mouse', p);
      await move('mouse', p.x + 5, p.y); assert.equal(await angle(), 360);
      assert.equal(await page.$eval('.business-card', el => el.classList.contains('is-dragging')), false);
      await move('mouse', p.x + 6, p.y); await waitAngle(367.2);
      await up('mouse'); await settled(); assert.equal(await angle(), 360);
      await page.mouse.click(p.x, p.y); await settled(); assert.equal(await angle(), 540);
      await drag('touch', p, -100); assert.equal(await angle(), 360);
      await page.touchscreen.tap(p.x, p.y); await settled(); assert.equal(await angle(), 180);
      for (const [dx, dy] of [[2, 40], [8, 8], [10, 30]]) {
        await down('mouse', p); await move('mouse', p.x + dx, p.y + dy); await up('mouse');
        await settled(); assert.equal(await angle(), 180);
      }
      await page.mouse.click(p.x, p.y); await settled(); assert.equal(await angle(), 0);
    });

    await test('slow/fast drags, reversal, half-turn ties, release mid-rotation and animation interruption', async () => {
      const p = await point();
      await drag('mouse', p, 75, 30); assert.equal(await angle(), 180);
      await drag('touch', p, -75, 1); assert.equal(await angle(), 0);
      await drag('mouse', p, -100, 1); assert.equal(await angle(), -180);
      await drag('mouse', p, 100, 20, false);
      await move('mouse', p.x - 30, p.y); await waitAngle(-216);
      await up('mouse'); await settled(); assert.equal(await angle(), -180);
      await page.mouse.click(p.x, p.y);
      await page.mouse.click(p.x, p.y);
      await settled(); assert.equal(await angle(), -540);
      await page.mouse.click(p.x, p.y);
      await page.waitForFunction(() => document.querySelector('#flip-card').getAttribute('aria-label').includes('회전 중'));
      // An in-flight animation is sampled when the new drag claims the pointer.
      await down('mouse', p); await move('mouse', p.x + 10, p.y);
      const claimed = await angle();
      await move('mouse', p.x + 30, p.y);
      assert.ok(Math.abs(await angle() - claimed - 24) < .01);
      await up('mouse'); await settled(); assert.equal(Math.abs((await angle()) % 180), 0);
    });

    await test('capture-phase suppression of delayed link/download clicks and keyboard recovery', async () => {
      for (const selector of ['.contact-link:nth-child(1)', '.contact-link:nth-child(2)', '.contact-link:nth-child(3)', '.save-contact']) {
        await reset(); await back();
        await drag('touch', await point(selector, .5), 30); // snaps back to the same face
        const value = await page.$eval(selector, el => {
          let reached = false;
          el.addEventListener('click', e => { reached = true; e.preventDefault(); }, { once: true });
          const click = new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 });
          el.dispatchEvent(click);
          const blocked = click.defaultPrevented && !reached;
          el.click(); // keyboard/AT-style activation must still reach the link
          return { blocked, keyboard: reached };
        });
        assert.deepEqual(value, { blocked: true, keyboard: true });
        // A fresh down clears suppression; a short tap is a real link activation.
        await page.$eval(selector, el => {
          window.tapped = false;
          el.addEventListener('click', e => { window.tapped = true; e.preventDefault(); }, { once: true });
        });
        const p = await point(selector, .5);
        await page.touchscreen.tap(p.x, p.y);
        assert.equal(await page.evaluate(() => window.tapped), true);
        assert.equal(await angle(), 180);
      }
    });

    await test('native BLOG/GITHUB popups, EMAIL event, QR tap and vCard download after dragging', async () => {
      await back();
      for (const [index, expected] of [[0, 'https://www.woongsnote.dev/'], [1, 'https://github.com/woongsnote']]) {
        await page.context().route(expected, route => route.fulfill({ contentType: 'text/html', body: 'link test' }));
        const row = page.locator('.contact-link').nth(index);
        assert.equal(await row.getAttribute('target'), '_blank');
        assert.equal(await row.getAttribute('rel'), 'noopener noreferrer');
        const [popup] = await Promise.all([page.waitForEvent('popup'), row.tap()]);
        await popup.waitForLoadState(); assert.equal(popup.url(), expected); await popup.close();
        assert.equal(await angle(), 180);
      }
      await page.$eval('a[href^="mailto:"]', el => el.addEventListener('click', e => {
        window.email = e.currentTarget.href; e.preventDefault();
      }));
      await page.locator('a[href^="mailto:"]').tap();
      assert.equal(await page.evaluate(() => window.email), 'mailto:woongsnote@gmail.com');
      await page.locator('.contact-qr').tap(); assert.equal(await angle(), 180);
      await drag('touch', await point('.save-contact', .5), 30);
      const [download] = await Promise.all([page.waitForEvent('download'), page.locator('.save-contact').tap()]);
      assert.equal(download.suggestedFilename(), 'woongsnote.vcf');
      assert.equal(fs.readFileSync(await download.path(), 'utf8'), fs.readFileSync(path.join(root, 'contact.vcf'), 'utf8'));
      assert.equal(await angle(), 180);
    });

    await test('pointercancel, card capture loss, child capture transfer, blur and hidden-page recovery', async () => {
      for (const mode of ['cancel', 'capture', 'child-transfer', 'blur', 'hidden']) {
        await reset(); await back();
        await page.$eval('.business-card', el => el.addEventListener('pointerdown', e => window.pid = e.pointerId, { once: true }));
        const start = await point('.contact-link', .5);
        await drag('touch', start, -100, 10, false);
        if (mode === 'child-transfer') {
          await page.$eval('.contact-link', el => el.dispatchEvent(new PointerEvent('lostpointercapture', { bubbles: true, pointerId: window.pid })));
          assert.equal(await page.$eval('.business-card', el => el.classList.contains('is-dragging')), true);
        } else {
          await page.evaluate(mode => {
            const card = document.querySelector('.business-card');
            if (mode === 'cancel') card.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: window.pid }));
            if (mode === 'capture') card.releasePointerCapture(window.pid);
            if (mode === 'blur') window.dispatchEvent(new Event('blur'));
            if (mode === 'hidden') {
              Object.defineProperty(document, 'hidden', { configurable: true, value: true });
              document.dispatchEvent(new Event('visibilitychange'));
            }
          }, mode);
          if (mode === 'capture') await touch('touchMove', start.x - 100, start.y);
        }
        await touch('touchEnd'); await settled(); assert.equal(await angle(), 0);
        // End the native touch sequence and let the compositor present the settled face.
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const p = await point();
        await touch('touchStart', p.x, p.y);
        await page.waitForTimeout(50);
        await touch('touchEnd');
        await page.waitForFunction(() => document.querySelector('#card-faces').style.transform === 'rotateY(-180deg)', null, { timeout: 3000 })
          .catch(error => { throw new Error(`${mode}: ${error.message}`); });
        await settled();
        assert.equal(await angle(), -180, mode);
      }
    });

    await test('native vertical touch scroll over background, links, QR and contact control; wheel unchanged', async () => {
      for (const selector of ['.business-card', '.contact-link', '.contact-qr', '.save-contact']) {
        await reset(); await back();
        await page.evaluate(() => document.body.style.minHeight = '1800px');
        const p = await point(selector, selector === '.business-card' ? .4 : .5);
        await down('touch', p);
        for (let n = 1; n <= 8; n++) await touch('touchMove', p.x, p.y - n * 12);
        await touch('touchEnd');
        await page.waitForFunction(() => scrollY > 20, null, { timeout: 3000 }).catch(error => { throw new Error(`${selector}: ${error.message}`); });
        assert.equal(await angle(), 180);
      }
      // Start a fresh document so touch-scroll inertia cannot consume the wheel.
      await reset();
      await page.evaluate(() => document.body.style.minHeight = '1800px');
      await page.mouse.move(180, 180); await page.mouse.wheel(0, 100);
      await page.waitForFunction(() => scrollY > 20); assert.equal(await angle(), 0);
    });

    await test('two-finger pinch retains browser zoom and cancels card drag', async () => {
      const p = await point('.business-card', .5);
      await down('touch', p);
      await touch('touchMove', p.x + 30, p.y); await waitAngle(36);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [
        { id: 0, x: p.x + 30, y: p.y }, { id: 1, x: p.x - 30, y: p.y },
      ] });
      for (let n = 1; n <= 10; n++) await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove', touchPoints: [
          { id: 0, x: p.x + 30 + n * 7, y: p.y }, { id: 1, x: p.x - 30 - n * 7, y: p.y },
        ],
      });
      await touch('touchEnd'); await settled();
      assert.equal(await angle(), 0);
      await page.waitForFunction(() => visualViewport.scale > 1.1);
    });

    await test('keyboard Flip, focus safety, hidden-face access and Reduced Motion', async () => {
      await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => document.activeElement.id), 'flip-card');
      for (const [key, expected] of [['Enter', 180], ['Space', 360], ['ArrowLeft', 180], ['ArrowRight', 360]]) {
        await page.keyboard.press(key); await settled(); assert.equal(await angle(), expected);
      }
      await back(); await page.locator('.contact-link').first().focus();
      await page.$eval('.business-card', el => el.click());
      assert.equal(await page.evaluate(() => document.activeElement.id), 'flip-card');
      assert.equal(await page.locator('.card-face[inert][aria-hidden="true"]').count(), 2);
      await settled(); assert.equal(await page.$eval('#card-back', el => el.inert), true);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.locator('#flip-card').evaluate(el => el.click()); assert.equal(await angle(), 900);
      await settled();
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.locator('#flip-card').evaluate(el => el.click());
      await page.emulateMedia({ reducedMotion: 'reduce' }); await settled(); assert.equal(await angle(), 1080);
      await drag('touch', await point(), 100); assert.equal(await angle(), 1260);
    });

    await test('accessibility attributes change only at drag transitions', async () => {
      await page.evaluate(() => {
        window.attributeWrites = 0;
        new MutationObserver(records => window.attributeWrites += records.length).observe(document.querySelector('.card-stage'), {
          subtree: true, attributes: true, attributeFilter: ['inert', 'aria-hidden', 'aria-label'],
        });
      });
      const p = await point(); await drag('mouse', p, 100, 40, false);
      assert.equal(await page.evaluate(() => window.attributeWrites), 3);
      assert.equal(await page.locator('.card-face[inert][aria-hidden="true"]').count(), 2);
      await up('mouse'); await settled();
      assert.equal(await page.evaluate(() => window.attributeWrites), 6);
      assert.equal(await angle(), 180);
    });

    await test('six viewports: ratio, front/back visibility, overflow and center at 45/90/135/180 degrees', async () => {
      for (const [width, height] of [[320, 568], [360, 640], [390, 844], [430, 932], [768, 1024], [1440, 900]]) {
        await page.setViewportSize({ width, height }); await page.goto(url); await page.waitForSelector('.is-interactive');
        const r = await page.locator('.business-card').boundingBox();
        assert.ok(Math.abs(r.x + r.width / 2 - width / 2) < .1);
        assert.ok(Math.abs(r.height / r.width - 1.8) < .01);
        assert.ok(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight && document.documentElement.scrollWidth <= innerWidth));
        const front = path.join(output, `${width}-front.png`); await page.screenshot({ path: front });
        const p = await point(); await down('mouse', p);
        for (const degrees of [45, 90, 135, 180]) {
          await move('mouse', p.x + degrees / 1.2, p.y); await waitAngle(degrees);
          const center = await page.$eval('#card-faces', el => { const r = el.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
          assert.ok(Math.abs(center[0] - r.x - r.width / 2) < .1);
          assert.ok(Math.abs(center[1] - r.y - r.height / 2) < .1);
        }
        await up('mouse'); await settled(); assert.equal(await angle(), 180);
        for (const selector of ['.contact-link', '.contact-qr', '.save-contact']) {
          for (const el of await page.locator(selector).all()) {
            const b = await el.boundingBox(); assert.ok(b.x >= r.x && b.y >= r.y && b.x + b.width <= r.x + r.width + .1 && b.y + b.height <= r.y + r.height + .1);
          }
        }
        await page.screenshot({ path: path.join(output, `${width}-back.png`) });
        report.viewports.push({ width, height, cardWidth: r.width, cardHeight: r.height, overflow: false, centerTolerancePx: .1 });
      }
    });

    await test('share success, cancel, failure, clipboard and manual fallback', async () => {
      for (const mode of ['success', 'cancel', 'failure', 'clipboard', 'manual']) {
        await page.evaluate(mode => {
          window.shared = null; window.copied = null;
          Object.defineProperty(navigator, 'share', { configurable: true, value: ['clipboard', 'manual'].includes(mode) ? undefined : async data => {
            window.shared = data;
            if (mode === 'cancel') throw new DOMException('cancel', 'AbortError');
            if (mode === 'failure') throw new Error('failure');
          } });
          Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => {
            if (mode === 'manual') throw new Error('denied'); window.copied = text;
          } } });
        }, mode);
        await page.locator('#share-card').click();
        await page.waitForFunction(() => !document.querySelector('#share-card').disabled);
        const state = await page.evaluate(() => ({
          shared: window.shared, copied: window.copied, status: document.querySelector('#share-status').textContent,
          manual: !document.querySelector('#manual-copy').hidden, focus: document.activeElement.id,
        }));
        if (mode === 'success') assert.equal(state.shared.url, 'https://woongsnote.github.io/');
        if (mode === 'cancel') { assert.match(state.status, /취소/); assert.equal(state.copied, null); }
        if (['failure', 'clipboard'].includes(mode)) assert.equal(state.copied, 'https://woongsnote.github.io/');
        if (mode === 'manual') { assert.equal(state.manual, true); assert.equal(state.focus, 'card-url'); }
      }
    });

    await test('JavaScript-disabled fallback exposes both faces, links and contact control', async () => {
      await cdp.send('Emulation.setScriptExecutionDisabled', { value: true });
      await page.goto(url);
      assert.equal(await page.locator('.is-interactive').count(), 0);
      assert.equal(await page.locator('.card-face[inert], .card-face[aria-hidden="true"]').count(), 0);
      assert.equal(await page.locator('.contact-link').count(), 3);
      assert.equal(await page.locator('.save-contact').isVisible(), true);
      assert.equal(await page.locator('#flip-card').isVisible(), false);
      await cdp.send('Emulation.setScriptExecutionDisabled', { value: false });
    });

    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(report, null, 2));
    console.log(`Evidence: ${output}`);
    if (report.groups.some(group => !group.pass) || report.errors.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
