# D.CURVIN AI Dashboard

## 프로젝트 개요
D.CURVIN AI 대시보드는 패션 브랜드 D.CURVIN의 매출, 재고, 주문/CS를 분석하는 AI 기반 대시보드입니다.

## 기술 스택
- **프레임워크**: React 19 + Vite
- **스타일링**: Tailwind CSS v4
- **차트**: Recharts
- **라우팅**: React Router (HashRouter - GitHub Pages 호환)
- **배포**: GitHub Pages (GitHub Actions)

## 프로젝트 구조
```
src/
├── components/     # 공통 컴포넌트 (Layout, Card, KpiCard)
├── data/           # Mock 데이터
├── pages/          # 페이지 컴포넌트
│   ├── Dashboard.jsx   # 종합 현황
│   ├── Sales.jsx       # 매출 분석
│   ├── Inventory.jsx   # 재고 현황
│   └── Orders.jsx      # 주문/CS
├── App.jsx
├── main.jsx
└── index.css
```

## 개발 명령어
```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:5173)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 미리보기
```

## 배포
- `main` 브랜치에 push하면 GitHub Actions가 자동으로 GitHub Pages에 배포합니다.
- GitHub 저장소 Settings > Pages에서 Source를 "GitHub Actions"로 설정해야 합니다.

## 주의사항
- 모든 UI 텍스트는 한국어입니다.
- `vite.config.js`의 `base`가 `/dcurvin_ai/`로 설정되어 있습니다 (GitHub Pages 경로).
- HashRouter를 사용하므로 URL에 `#`이 포함됩니다.
- 현재 Mock 데이터를 사용하며, 실제 API 연동 시 `src/data/` 하위 파일을 수정합니다.
