# D.CURVIN CEO RPG 경영 시뮬레이터

## 프로젝트 개요
D.CURVIN CEO RPG 경영 시뮬레이터는 패션 브랜드 D.CURVIN의 CEO가 되어 각 팀의 캐릭터들에게 보고를 받으며 경영 의사결정을 하는 RPG 스타일 대시보드입니다.

## 기술 스택
- **프레임워크**: React 19 + Vite
- **스타일링**: Tailwind CSS v4
- **차트**: Recharts
- **애니메이션**: Framer Motion
- **라우팅**: React Router (HashRouter - GitHub Pages 호환)
- **배포**: GitHub Pages (GitHub Actions)

## 프로젝트 구조
```
src/
├── components/         # 공통 컴포넌트
│   ├── Layout.jsx          # 레이아웃 + CEO 프로필 바
│   ├── Card.jsx            # iOS 스타일 카드
│   ├── KpiCard.jsx         # 애니메이션 KPI 카드
│   ├── CountUp.jsx         # 숫자 카운트업 애니메이션
│   ├── DialogBox.jsx       # RPG 대화창 (타이핑 이펙트)
│   ├── CharacterSprite.jsx # 캐릭터 스프라이트 (idle 모션)
│   ├── DecisionPanel.jsx   # 의사결정 선택 패널
│   └── ExpPopup.jsx        # 레벨업 오버레이 이펙트
├── context/
│   └── GameContext.jsx     # 게임 상태 관리 (레벨/경험치/의사결정)
├── data/
│   └── mockData.js         # Mock 데이터 (5개 팀 전체)
├── pages/
│   ├── OfficeMap.jsx       # 사무실 맵 메인 화면
│   ├── ManagementTeam.jsx  # 경영지원팀 - 재무 분석관 유진
│   ├── LogisticsTeam.jsx   # 물류팀 - 물류 대장 태현
│   ├── CSTeam.jsx          # CS팀 - 고객 수호자 서연
│   ├── DataTeam.jsx        # 고객데이터분석팀 - 데이터 마법사 민준
│   └── SecretaryTeam.jsx   # 비서팀 - 비서실장 하은
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
- 브랜드 컬러 골드: #C4A661
