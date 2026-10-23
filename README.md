# woongsnote.github.io

@woongsnote의 디지털 명함입니다. 프로필, 연락처 저장, 명함 공유 및 외부 링크를 제공합니다.

## Live Site

https://woongsnote.github.io

## Links

- Woongsnote
- GitHub
- Email

## Stack

- Astro
- TypeScript
- CSS

## Project

- Static site
- Web Share API 및 URL 복사용 최소한의 클라이언트 JavaScript
- 외부 API 없이 표시되는 정적 SVG QR 코드
- 빌드 시 생성되는 vCard 3.0 연락처 파일
- GitHub Pages deployment

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

## Profile / Contact

- `src/data/profile.ts`: 이름, 사용자명, 소개, 이메일, 링크 정보
- `src/data/links.ts`: 외부 링크의 표시 순서와 설명 (`LinkItem.astro` 사용)
- `src/pages/contact.vcf.ts`: 프로필 데이터로 `/contact.vcf` 생성 (UTF-8, CRLF)
- `public/card-qr.svg`: `https://woongsnote.github.io/`를 인코딩한 정적 QR 코드 (오류 정정 M, 여백 4모듈)

명함 주소를 변경하면 `profile.cardUrl`, `astro.config.mjs`의 `site`, QR 코드 SVG를 함께 갱신합니다. QR 코드는 생성 후 실제 디코딩하여 대상 주소를 확인합니다.

연락처 저장은 같은 출처의 `.vcf` 파일을 다운로드합니다. 기기에 따라 다운로드 또는 연락처 가져오기 화면이 표시될 수 있습니다. 정적 호스팅에서는 HTTP 헤더를 호스트가 결정하므로 다운로드 파일명은 링크의 `download` 속성에도 지정합니다.

명함 공유는 Web Share API를 우선 사용하고, 미지원 또는 공유 실패 시 클립보드 복사를 시도합니다. 공유 취소 시 복사하지 않으며, 자동 복사도 실패하면 직접 복사할 주소를 표시합니다. JavaScript를 끈 경우에도 연락처 저장, QR 표시, 외부 링크는 동작합니다.
