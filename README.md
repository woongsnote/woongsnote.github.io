# woongsnote.github.io

@woongsnote의 디지털 명함입니다. 세로형 종이 명함을 닮은 앞뒷면과 연락처 저장, 명함 공유 기능을 제공합니다.

## Live Site

https://woongsnote.github.io

## Stack

- Astro + TypeScript + CSS
- GitHub Pages + GitHub Actions
- npm

## Development

```sh
npm ci
npm run dev
```

## Validation / Build

```sh
npm run check
npm run build
```

브라우저 회귀 테스트는 `tests/gestures.cjs`에 있습니다. 별도로 설치된 Playwright와 Chromium을 사용하며, 프로젝트 의존성을 추가하지 않습니다.

```sh
NODE_PATH=/path/to/external/node_modules node tests/gestures.cjs
```

필요하면 `CHROMIUM_EXECUTABLE`로 브라우저 경로를 지정합니다. `TEST_OUTPUT`은 결과 JSON과 화면 캡처를 저장할 디렉터리이며, 기본값은 임시 디렉터리입니다. 터치는 Chromium에서 에뮬레이션하므로 iOS Safari 실기기 검증을 대신하지 않습니다.

## Deployment

`main`에 push하면 GitHub Actions를 통해 GitHub Pages에 배포합니다. `dev` push는 운영 배포를 실행하지 않습니다.

## Design / Interaction

- 5:9 세로형 명함, 앞면 `#25272C`, 뒷면 `#F8FAFC`, 버튼 `#102552`
- 앞면: W. / woong. / Build. Learn. Record. / 블로그 주소
- 뒷면: BLOG → GITHUB → EMAIL / 연락처 QR / Save Contact
- 카드의 일반 영역을 클릭·탭하면 다음 면으로 전환합니다.
- 링크·QR·Save Contact를 포함한 카드 전체에서 수평 드래그로 회전합니다. 6px 이상 움직이고 수평 이동량이 수직 이동량보다 클 때 회전을 시작하며, 감도는 1.2°/px입니다. 세로 스크롤·핀치 줌·휠 스크롤은 브라우저 기본 동작을 유지합니다.
- 드래그 종료 시 가까운 180° 단위로 스냅하며, 360° 이상 회전도 누적합니다. 드래그 후 발생한 클릭은 링크 이동·다운로드·추가 회전으로 이어지지 않습니다.
- 키보드는 Tab으로 Flip 버튼에 이동한 뒤 ← / →로 각 방향의 다음 면까지 180° 회전합니다. Enter / Space는 클릭과 같으며, 반복 입력은 대기 중인 목표 각도에 누적합니다. Flip 버튼은 포커스 시 표시됩니다.
- 링크·Save Contact는 짧게 탭하면 기존 기능을 실행하고, QR 및 연락처 저장 영역의 여백은 탭해도 회전하지 않습니다.
- 이동 중 양면, 정착 후 숨겨진 면은 `inert` 및 `aria-hidden`으로 포커스와 접근성 트리에서 제외합니다. 속성은 상태가 바뀔 때만 갱신합니다.
- 직접 조작은 각도를 즉시 반영하고, 면 전환은 300ms, 드래그 종료 스냅은 240ms의 `requestAnimationFrame` 기반 cubic ease-out을 사용합니다. Reduced Motion에서는 전환·스냅 애니메이션을 생략하며 직접 조작은 유지합니다.
- 작은 화면은 비율을 유지하고 세로 스크롤을 허용합니다.
- JavaScript를 끄면 앞뒷면을 세로로 표시해 링크와 연락처 저장을 유지합니다.

## Profile / Contact

- `src/data/profile.ts`: 이름, 표시 이름, 태그라인, 이메일, 링크 정보의 단일 기준
- `src/pages/index.astro`: 명함 양면, 프로필에서 파생한 링크, 직접 회전 및 기존 공유 처리
- `src/pages/contact.vcf.ts`: 기존 vCard 3.0 생성 코드 (UTF-8, CRLF)
- `public/contact-qr.svg`: 웹 명함용. `profile.cardUrl` 기준 `/contact.vcf`를 인코딩
- `public/card-qr.svg`: 기존 명함 주소 QR. 추후 실물 명함은 웹 명함 주소를 사용
- 두 QR은 오류 정정 M, 여백 4모듈을 사용합니다. 인쇄용 파일은 포함하지 않습니다.

웹 QR은 빌드 전에 `new URL("/contact.vcf", profile.cardUrl).href`에서 생성한 정적 SVG입니다. 주소를 변경할 때는 `profile.cardUrl`, `astro.config.mjs`의 `site` 및 두 QR을 함께 갱신하고 실제 디코딩으로 확인합니다. QR 렌더링은 외부 서비스나 런타임 의존성을 사용하지 않습니다.

Save Contact는 같은 출처의 `.vcf` 파일을 다운로드하도록 요청합니다. QR 스캔은 같은 파일 URL을 엽니다. 기기와 브라우저에 따라 다운로드 또는 연락처 가져오기 화면이 표시되며, 실제 연락처 추가는 사용자가 확인합니다. 정적 호스팅에서는 HTTP 헤더를 호스트가 결정하므로 파일명은 링크의 `download` 속성에도 지정합니다. iOS·Android 카메라 스캔과 연락처 가져오기 UI는 실기기 확인이 필요합니다.

명함 공유는 기존 Web Share API 처리를 재사용합니다. 미지원 또는 공유 실패 시 클립보드 복사를 시도하고, 취소 시 복사하지 않습니다. 자동 복사도 실패하면 직접 복사할 주소를 표시합니다.
