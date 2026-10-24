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

## Deployment

`main`에 push하면 GitHub Actions를 통해 GitHub Pages에 배포합니다. `dev` push는 운영 배포를 실행하지 않습니다.

## Design / Interaction

- 5:9 세로형 명함, 앞면 `#25272C`, 뒷면 `#F8FAFC`, 버튼 `#102552`
- 앞면: W. / woong. / Build. Learn. Record. / 블로그 주소
- 뒷면: BLOG → GITHUB → EMAIL / 연락처 QR / Save Contact
- 카드의 빈 영역을 클릭·터치하거나 하단 회전 다이얼을 클릭하면 다음 면으로 전환합니다.
- 다이얼에서 마우스 휠, 좌우 드래그, 모바일 터치 드래그로 회전합니다. 다이얼 밖 스크롤과 세로 터치 스크롤은 유지합니다.
- 휠은 `deltaMode`를 정규화하고 큰 단발 입력은 90°를 넘겨 한 칸으로 면을 전환합니다. 작은·소수 입력은 연속 회전으로 누적하며, 이벤트별 회전량을 제한합니다. 입력값 기반 구분이므로 장치 설정에 따라 차이가 있습니다.
- 드래그 종료 또는 마지막 휠 입력 180ms 후 가까운 180° 단위로 스냅하며, 360° 이상 회전도 누적합니다.
- 키보드는 다이얼에 Tab으로 이동한 뒤 ← / →로 각 방향의 다음 면까지 180° 회전합니다. Enter / Space는 클릭과 같으며, 반복 입력은 대기 중인 목표 각도에 누적합니다.
- 링크, 연락처 QR과 Save Contact는 카드를 회전시키지 않습니다.
- 숨겨진 면은 `inert` 및 `aria-hidden`으로 포커스와 접근성 트리에서 제외합니다.
- 직접 조작은 각도를 즉시 반영하고, 면 전환·스냅은 `requestAnimationFrame` 기반 480ms cubic ease-out을 사용합니다. Reduced Motion에서는 전환·스냅 애니메이션을 생략하며 직접 조작은 유지합니다.
- 작은 화면은 비율을 유지하고 세로 스크롤을 허용합니다.
- JavaScript를 끄면 앞뒷면을 세로로 표시해 링크와 연락처 저장을 유지합니다.

## Profile / Contact

- `src/data/profile.ts`: 이름, 표시 이름, 태그라인, 이메일, 링크 정보의 단일 기준
- `src/pages/index.astro`: 명함 양면, 프로필에서 파생한 링크, 회전 다이얼 및 기존 공유 처리
- `src/pages/contact.vcf.ts`: 기존 vCard 3.0 생성 코드 (UTF-8, CRLF)
- `public/contact-qr.svg`: 웹 명함용. `profile.cardUrl` 기준 `/contact.vcf`를 인코딩
- `public/card-qr.svg`: 기존 명함 주소 QR. 추후 실물 명함은 웹 명함 주소를 사용
- 두 QR은 오류 정정 M, 여백 4모듈을 사용합니다. 인쇄용 파일은 포함하지 않습니다.

웹 QR은 빌드 전에 `new URL("/contact.vcf", profile.cardUrl).href`에서 생성한 정적 SVG입니다. 주소를 변경할 때는 `profile.cardUrl`, `astro.config.mjs`의 `site` 및 두 QR을 함께 갱신하고 실제 디코딩으로 확인합니다. QR 렌더링은 외부 서비스나 런타임 의존성을 사용하지 않습니다.

Save Contact는 같은 출처의 `.vcf` 파일을 다운로드하도록 요청합니다. QR 스캔은 같은 파일 URL을 엽니다. 기기와 브라우저에 따라 다운로드 또는 연락처 가져오기 화면이 표시되며, 실제 연락처 추가는 사용자가 확인합니다. 정적 호스팅에서는 HTTP 헤더를 호스트가 결정하므로 파일명은 링크의 `download` 속성에도 지정합니다. iOS·Android 카메라 스캔과 연락처 가져오기 UI는 실기기 확인이 필요합니다.

명함 공유는 기존 Web Share API 처리를 재사용합니다. 미지원 또는 공유 실패 시 클립보드 복사를 시도하고, 취소 시 복사하지 않습니다. 자동 복사도 실패하면 직접 복사할 주소를 표시합니다.
