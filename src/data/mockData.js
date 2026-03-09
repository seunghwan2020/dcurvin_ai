// D.CURVIN CEO RPG 경영 시뮬레이터 - Mock 데이터

// ── 캐릭터 정의 ──
export const characters = {
  yujin: {
    id: 'yujin',
    name: '재무 분석관 유진',
    team: '경영지원팀',
    emoji: '📊',
    color: '#6366f1',
    greeting: '대표님, 경영지원팀 유진입니다! 오늘의 매출 현황을 보고드리겠습니다.',
    idle: '매출 데이터를 분석하고 있어요...',
  },
  taehyun: {
    id: 'taehyun',
    name: '물류 대장 태현',
    team: '물류팀',
    emoji: '📦',
    color: '#f59e0b',
    greeting: '대표님! 물류팀 태현 보고드립니다. 재고 상황 말씀드릴게요!',
    idle: '컨테이너 적재율을 계산하는 중...',
  },
  seoyeon: {
    id: 'seoyeon',
    name: '고객 수호자 서연',
    team: 'CS팀',
    emoji: '💬',
    color: '#ec4899',
    greeting: '대표님, CS팀 서연이에요. 고객 문의 현황 보고 올립니다!',
    idle: '고객 피드백을 정리하고 있어요...',
  },
  minjun: {
    id: 'minjun',
    name: '데이터 마법사 민준',
    team: '고객데이터분석팀',
    emoji: '🔮',
    color: '#8b5cf6',
    greeting: '대표님, 데이터 분석 결과를 가져왔습니다. 흥미로운 인사이트가 있어요!',
    idle: '패턴을 분석하고 있어요...',
  },
  haeun: {
    id: 'haeun',
    name: '비서실장 하은',
    team: '비서팀',
    emoji: '📋',
    color: '#14b8a6',
    greeting: '대표님, 좋은 아침이에요! 오늘의 주요 일정과 할 일을 정리해왔어요.',
    idle: '일정을 조율하고 있어요...',
  },
}

// ── CEO 초기 상태 ──
export const initialCeoState = {
  name: 'CEO',
  level: 1,
  exp: 0,
  maxExp: 100,
  title: '신입 대표',
  decisions: [],
  titles: [
    { level: 1, title: '신입 대표' },
    { level: 3, title: '성장하는 리더' },
    { level: 5, title: '전략적 경영자' },
    { level: 8, title: '비전있는 CEO' },
    { level: 10, title: '패션계의 전설' },
    { level: 15, title: '글로벌 패션 황제' },
  ],
}

// ── 경영지원팀 (유진) 데이터 ──

// 일별 매출 (30일)
export const dailySalesData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 1, 8 + i)
  const base = 3_500_000 + Math.sin(i / 3) * 1_200_000
  const weekday = date.getDay()
  const weekendBonus = (weekday === 0 || weekday === 6) ? 800_000 : 0
  return {
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    sales: Math.round(base + weekendBonus + (Math.random() - 0.3) * 600_000),
    orders: Math.round(35 + Math.random() * 30),
    profit: Math.round((base + weekendBonus) * 0.35),
  }
})

// 주별 매출
export const weeklySalesData = [
  { week: '1주차', sales: 24_800_000, orders: 285, growth: 0 },
  { week: '2주차', sales: 27_200_000, orders: 312, growth: 9.7 },
  { week: '3주차', sales: 31_500_000, orders: 358, growth: 15.8 },
  { week: '4주차', sales: 28_900_000, orders: 330, growth: -8.3 },
]

// 월별 매출
export const monthlySalesData = [
  { month: '2025.10', sales: 98_000_000, orders: 1120, profit: 34_300_000 },
  { month: '2025.11', sales: 112_000_000, orders: 1280, profit: 39_200_000 },
  { month: '2025.12', sales: 145_000_000, orders: 1650, profit: 50_750_000 },
  { month: '2026.01', sales: 88_000_000, orders: 1010, profit: 30_800_000 },
  { month: '2026.02', sales: 105_000_000, orders: 1200, profit: 36_750_000 },
  { month: '2026.03', sales: 118_400_000, orders: 1350, profit: 41_440_000 },
]

// 제품별 매출 비중
export const productSalesShare = [
  { name: 'Edge V2', value: 35, amount: 41_440_000, color: '#C4A661' },
  { name: 'Eddy V2', value: 25, amount: 29_600_000, color: '#6366f1' },
  { name: 'Guardian', value: 22, amount: 26_048_000, color: '#14b8a6' },
  { name: 'ConnectBag', value: 18, amount: 21_312_000, color: '#f59e0b' },
]

// 컬러 트렌드 (밝은색 vs 어두운색)
export const colorTrendData = [
  { month: '10월', bright: 42, dark: 58 },
  { month: '11월', bright: 45, dark: 55 },
  { month: '12월', bright: 38, dark: 62 },
  { month: '1월', bright: 40, dark: 60 },
  { month: '2월', bright: 52, dark: 48 },
  { month: '3월', bright: 58, dark: 42 },
]

export const colorDetailData = [
  { name: '아이보리/크림', sales: 4_820_000, percentage: 22, hex: '#FFFDD0', type: 'bright' },
  { name: '블랙', sales: 3_960_000, percentage: 18, hex: '#2D3748', type: 'dark' },
  { name: '네이비', sales: 3_520_000, percentage: 16, hex: '#1e3a5f', type: 'dark' },
  { name: '베이지', sales: 3_080_000, percentage: 14, hex: '#D4A574', type: 'bright' },
  { name: '그레이', sales: 2_640_000, percentage: 12, hex: '#A0AEC0', type: 'dark' },
  { name: '카키', sales: 1_760_000, percentage: 8, hex: '#6B8E23', type: 'dark' },
  { name: '화이트', sales: 1_540_000, percentage: 7, hex: '#F7FAFC', type: 'bright' },
  { name: '와인', sales: 680_000, percentage: 3, hex: '#722F37', type: 'dark' },
]

// 매출 예측 (향후 30일)
export const salesForecastData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 2, 10 + i)
  const base = 4_000_000 + Math.sin(i / 5) * 800_000
  const trend = i * 30_000
  return {
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    predicted: Math.round(base + trend),
    upper: Math.round((base + trend) * 1.15),
    lower: Math.round((base + trend) * 0.85),
  }
})

// 경쟁사 비교
export const competitorData = [
  { name: 'D.CURVIN', sales: 118, share: 8.2, rank: 4, color: '#C4A661' },
  { name: 'A사 (대형)', sales: 320, share: 22.1, rank: 1, color: '#94a3b8' },
  { name: 'B사 (중형)', sales: 185, share: 12.8, rank: 2, color: '#94a3b8' },
  { name: 'C사 (중형)', sales: 142, share: 9.8, rank: 3, color: '#94a3b8' },
  { name: 'D사 (소형)', sales: 95, share: 6.6, rank: 5, color: '#94a3b8' },
]

// 경영지원팀 의사결정
export const managementDecisions = [
  {
    id: 'mgmt_1',
    question: '봄 시즌 마케팅 예산을 어떻게 배분할까요?',
    context: '현재 밝은 컬러 매출이 급상승 중이고, 전체 매출도 상승세입니다.',
    choices: [
      { id: 'a', text: '밝은 컬러 라인 집중 투자 (+30%)', exp: 50, effect: '밝은 컬러 매출 예상 +25%' },
      { id: 'b', text: '전 라인 균등 배분', exp: 30, effect: '전체 매출 안정적 성장' },
      { id: 'c', text: '추가 데이터 분석 요청', exp: 20, effect: '다음 보고 시 상세 분석 제공' },
    ],
  },
  {
    id: 'mgmt_2',
    question: '경쟁사 대비 가격 전략은 어떻게 할까요?',
    context: '시장 점유율 4위, 하지만 성장률은 업계 1위입니다.',
    choices: [
      { id: 'a', text: '프리미엄 가격 유지 (브랜드 가치)', exp: 40, effect: '마진율 유지, 브랜드 포지셔닝 강화' },
      { id: 'b', text: '공격적 할인으로 점유율 확대', exp: 35, effect: '주문 수 +40%, 마진율 -15%' },
      { id: 'c', text: '멤버십 혜택 강화 (중간 전략)', exp: 45, effect: '재구매율 +20%, 고객 충성도 향상' },
    ],
  },
]

// ── 물류팀 (태현) 데이터 ──

// N배송 재고
export const nDeliveryStock = [
  { sku: 'EDGE-V2-BK-M', name: 'Edge V2 블랙 M', stock: 45, dailySales: 8, daysLeft: 5.6, status: '주의' },
  { sku: 'EDGE-V2-BK-L', name: 'Edge V2 블랙 L', stock: 32, dailySales: 6, daysLeft: 5.3, status: '주의' },
  { sku: 'EDGE-V2-NV-M', name: 'Edge V2 네이비 M', stock: 12, dailySales: 5, daysLeft: 2.4, status: '긴급' },
  { sku: 'EDDY-V2-BG-F', name: 'Eddy V2 베이지 FREE', stock: 8, dailySales: 4, daysLeft: 2.0, status: '긴급' },
  { sku: 'EDDY-V2-IV-F', name: 'Eddy V2 아이보리 FREE', stock: 28, dailySales: 7, daysLeft: 4.0, status: '주의' },
  { sku: 'GUARD-KH-L', name: 'Guardian 카키 L', stock: 65, dailySales: 3, daysLeft: 21.7, status: '정상' },
  { sku: 'GUARD-BK-M', name: 'Guardian 블랙 M', stock: 52, dailySales: 4, daysLeft: 13.0, status: '정상' },
  { sku: 'CBAG-GY-ONE', name: 'ConnectBag 그레이', stock: 85, dailySales: 2, daysLeft: 42.5, status: '과잉' },
]

// 이지어드민 재고
export const easyAdminStock = [
  { sku: 'EDGE-V2-BK-M', name: 'Edge V2 블랙 M', stock: 120, location: '본사 창고' },
  { sku: 'EDGE-V2-BK-L', name: 'Edge V2 블랙 L', stock: 85, location: '본사 창고' },
  { sku: 'EDGE-V2-NV-M', name: 'Edge V2 네이비 M', stock: 200, location: '본사 창고' },
  { sku: 'EDDY-V2-BG-F', name: 'Eddy V2 베이지 FREE', stock: 150, location: '본사 창고' },
  { sku: 'EDDY-V2-IV-F', name: 'Eddy V2 아이보리 FREE', stock: 95, location: '본사 창고' },
  { sku: 'GUARD-KH-L', name: 'Guardian 카키 L', stock: 180, location: '본사 창고' },
  { sku: 'GUARD-BK-M', name: 'Guardian 블랙 M', stock: 160, location: '본사 창고' },
  { sku: 'CBAG-GY-ONE', name: 'ConnectBag 그레이', stock: 250, location: '본사 창고' },
]

// N배송 입고 필요건
export const restockAlerts = [
  { sku: 'EDGE-V2-NV-M', name: 'Edge V2 네이비 M', daysLeft: 2.4, needed: 50, urgency: '긴급' },
  { sku: 'EDDY-V2-BG-F', name: 'Eddy V2 베이지 FREE', daysLeft: 2.0, needed: 40, urgency: '긴급' },
  { sku: 'EDDY-V2-IV-F', name: 'Eddy V2 아이보리 FREE', daysLeft: 4.0, needed: 35, urgency: '주의' },
  { sku: 'EDGE-V2-BK-M', name: 'Edge V2 블랙 M', daysLeft: 5.6, needed: 40, urgency: '주의' },
  { sku: 'EDGE-V2-BK-L', name: 'Edge V2 블랙 L', daysLeft: 5.3, needed: 30, urgency: '주의' },
]

// 재고 소진 예정일 타임라인
export const depletionTimeline = [
  { name: 'Eddy V2 베이지', days: 2, color: '#ef4444' },
  { name: 'Edge V2 네이비 M', days: 2.4, color: '#ef4444' },
  { name: 'Eddy V2 아이보리', days: 4, color: '#f59e0b' },
  { name: 'Edge V2 블랙 M', days: 5.6, color: '#f59e0b' },
  { name: 'Edge V2 블랙 L', days: 5.3, color: '#f59e0b' },
  { name: 'Guardian 블랙 M', days: 13, color: '#22c55e' },
  { name: 'Guardian 카키 L', days: 21.7, color: '#22c55e' },
  { name: 'ConnectBag 그레이', days: 42.5, color: '#3b82f6' },
]

// OEM 제작 물량 추천
export const oemRecommendation = [
  { product: 'Edge V2', color: '블랙', size: 'M', recommended: 500, reason: '주력 상품, 월 240개 판매' },
  { product: 'Edge V2', color: '네이비', size: 'M', recommended: 300, reason: '빠른 소진 속도' },
  { product: 'Eddy V2', color: '베이지', size: 'FREE', recommended: 400, reason: '봄 시즌 수요 급증' },
  { product: 'Eddy V2', color: '아이보리', size: 'FREE', recommended: 350, reason: '밝은 컬러 트렌드' },
  { product: 'Guardian', color: '블랙', size: 'M', recommended: 200, reason: '안정적 수요' },
]

// 컨테이너 적재 최적화
export const containerData = {
  containerType: '40ft HQ',
  totalCBM: 76.3,
  usedCBM: 68.2,
  fillRate: 89.4,
  items: [
    { product: 'Edge V2', qty: 500, cbm: 22.5, boxes: 50 },
    { product: 'Eddy V2', qty: 750, cbm: 26.3, boxes: 75 },
    { product: 'Guardian', qty: 200, cbm: 12.0, boxes: 20 },
    { product: 'ConnectBag', qty: 300, cbm: 7.4, boxes: 30 },
  ],
}

// 물류팀 의사결정
export const logisticsDecisions = [
  {
    id: 'log_1',
    question: '긴급 재고가 2건이나 있습니다. 입고 승인하시겠습니까?',
    context: 'Edge V2 네이비 M(2.4일), Eddy V2 베이지(2.0일) 소진 임박!',
    choices: [
      { id: 'a', text: '긴급 입고 승인 (당일 출고)', exp: 50, effect: 'N배송 재고 보충, 품절 방지' },
      { id: 'b', text: '내일 일괄 입고 처리', exp: 30, effect: '물류비 절감, 품절 리스크 존재' },
      { id: 'c', text: '보류 (판매 추이 관찰)', exp: 15, effect: '품절 가능성 높음' },
    ],
  },
  {
    id: 'log_2',
    question: 'OEM 발주를 진행할까요? 컨테이너 적재율을 최적화했습니다.',
    context: '40ft HQ 컨테이너 적재율 89.4%, 예상 비용 $12,500',
    choices: [
      { id: 'a', text: 'OEM 발주 승인', exp: 45, effect: '2주 후 입고, 3개월 치 물량 확보' },
      { id: 'b', text: '물량 10% 추가 (적재율 97%)', exp: 55, effect: '컨테이너 효율 극대화, 비용 +$1,200' },
      { id: 'c', text: '발주 보류 (시장 상황 관찰)', exp: 20, effect: '현금 유동성 확보' },
    ],
  },
]

// ── CS팀 (서연) 데이터 ──

export const csStatusData = [
  { name: '답변완료', value: 32, color: '#22c55e' },
  { name: '처리중', value: 7, color: '#f59e0b' },
  { name: '미답변', value: 8, color: '#ef4444' },
]

export const unansweredCS = [
  { id: 'CS-0341', customer: '김*진', subject: '주문 취소 요청', category: '주문/결제', priority: 'high', hours: 26 },
  { id: 'CS-0339', customer: '이*영', subject: '사이즈 교환 문의', category: '교환/반품', priority: 'high', hours: 28 },
  { id: 'CS-0338', customer: '박*호', subject: '배송 지연 문의', category: '배송', priority: 'high', hours: 36 },
  { id: 'CS-0342', customer: '최*아', subject: '상품 불량 신고', category: '품질', priority: 'medium', hours: 15 },
  { id: 'CS-0343', customer: '정*현', subject: '적립금 사용 문의', category: '주문/결제', priority: 'low', hours: 14 },
  { id: 'CS-0344', customer: '한*수', subject: '배송지 변경 요청', category: '배송', priority: 'medium', hours: 13 },
  { id: 'CS-0345', customer: '윤*미', subject: '쿠폰 적용 오류', category: '주문/결제', priority: 'low', hours: 11 },
  { id: 'CS-0346', customer: '송*준', subject: '재입고 알림 요청', category: '상품문의', priority: 'low', hours: 11 },
]

// 클레임/반품 현황
export const claimData = [
  { month: '10월', claims: 12, returns: 28, refunds: 8 },
  { month: '11월', claims: 15, returns: 32, refunds: 10 },
  { month: '12월', claims: 22, returns: 45, refunds: 18 },
  { month: '1월', claims: 18, returns: 35, refunds: 12 },
  { month: '2월', claims: 10, returns: 25, refunds: 7 },
  { month: '3월', claims: 8, returns: 20, refunds: 5 },
]

// 고객 만족도 트렌드
export const satisfactionData = [
  { month: '10월', score: 4.1, responses: 120 },
  { month: '11월', score: 4.0, responses: 145 },
  { month: '12월', score: 3.8, responses: 180 },
  { month: '1월', score: 4.2, responses: 110 },
  { month: '2월', score: 4.4, responses: 130 },
  { month: '3월', score: 4.5, responses: 95 },
]

// CS팀 의사결정
export const csDecisions = [
  {
    id: 'cs_1',
    question: '24시간 초과 미답변 3건이 있어요. 어떻게 할까요?',
    context: '주문 취소, 사이즈 교환, 배송 지연 문의가 밀려있습니다.',
    choices: [
      { id: 'a', text: '즉시 전원 투입 처리', exp: 50, effect: '고객 만족도 회복, CS팀 야근 발생' },
      { id: 'b', text: '우선순위별 순차 처리', exp: 35, effect: '효율적 처리, 일부 고객 추가 대기' },
      { id: 'c', text: '보상 쿠폰과 함께 답변', exp: 45, effect: '고객 만족도 +0.3, 마케팅 비용 발생' },
    ],
  },
]

// ── 고객데이터분석팀 (민준) 데이터 ──

// 제품별 판매 현황
export const productSalesData = [
  { product: 'Edge V2', total: 1250, thisMonth: 185, growth: 12.5, avgPrice: 189_000 },
  { product: 'Eddy V2', total: 980, thisMonth: 142, growth: 18.2, avgPrice: 129_000 },
  { product: 'Guardian', total: 720, thisMonth: 98, growth: -5.3, avgPrice: 159_000 },
  { product: 'ConnectBag', total: 540, thisMonth: 78, growth: 22.8, avgPrice: 89_000 },
]

// 사이즈별 판매 히트맵
export const sizeColorHeatmap = {
  products: ['Edge V2', 'Eddy V2', 'Guardian', 'ConnectBag'],
  sizes: ['S', 'M', 'L', 'XL', 'FREE'],
  data: [
    // Edge V2
    [15, 42, 38, 12, 0],
    // Eddy V2
    [0, 0, 0, 0, 85],
    // Guardian
    [8, 35, 32, 18, 0],
    // ConnectBag
    [0, 0, 0, 0, 78],
  ],
}

// 컬러별 판매 히트맵
export const colorHeatmap = {
  products: ['Edge V2', 'Eddy V2', 'Guardian', 'ConnectBag'],
  colors: ['블랙', '네이비', '베이지', '아이보리', '카키', '그레이'],
  colorHex: ['#1a1a2e', '#1e3a5f', '#D4A574', '#FFFDD0', '#6B8E23', '#9ca3af'],
  data: [
    [52, 28, 18, 12, 0, 8],
    [15, 10, 35, 42, 0, 12],
    [30, 22, 0, 0, 28, 15],
    [20, 12, 8, 5, 0, 33],
  ],
}

// 고객 구매 패턴
export const purchasePatterns = {
  repeatRate: 34.2,
  avgInterval: 45,
  avgItems: 1.8,
  topCombos: [
    { items: 'Edge V2 + ConnectBag', count: 85, rate: 12.3 },
    { items: 'Eddy V2 + Edge V2', count: 62, rate: 9.0 },
    { items: 'Guardian + ConnectBag', count: 45, rate: 6.5 },
  ],
  timeDistribution: [
    { hour: '09-12', orders: 18 },
    { hour: '12-15', orders: 28 },
    { hour: '15-18', orders: 22 },
    { hour: '18-21', orders: 35 },
    { hour: '21-24', orders: 25 },
    { hour: '00-09', orders: 8 },
  ],
}

// 리뷰 감성 분석
export const reviewSentiment = {
  positive: 72,
  neutral: 18,
  negative: 10,
  totalReviews: 856,
  avgRating: 4.3,
  keywords: {
    positive: ['튼튼해요', '디자인 예뻐요', '수납 좋아요', '가벼워요', '색감 좋아요'],
    negative: ['지퍼 뻑뻑해요', '배송 느려요', '사이즈 작아요', '가격이 좀...', '냄새가 나요'],
  },
  byProduct: [
    { product: 'Edge V2', positive: 78, neutral: 15, negative: 7, avg: 4.5 },
    { product: 'Eddy V2', positive: 75, neutral: 17, negative: 8, avg: 4.4 },
    { product: 'Guardian', positive: 68, neutral: 20, negative: 12, avg: 4.1 },
    { product: 'ConnectBag', positive: 65, neutral: 22, negative: 13, avg: 4.0 },
  ],
}

// 데이터팀 의사결정
export const dataDecisions = [
  {
    id: 'data_1',
    question: 'Edge V2 + ConnectBag 조합 구매가 12.3%나 됩니다. 번들 상품을 만들까요?',
    context: '두 제품 합산 평균 단가 278,000원, 번들 시 258,000원 제안',
    choices: [
      { id: 'a', text: '번들 상품 출시 승인', exp: 50, effect: '주문 단가 +15%, 마진율 -3%' },
      { id: 'b', text: '한정판 패키지로 출시', exp: 55, effect: '프리미엄 이미지, 수량 한정 500세트' },
      { id: 'c', text: '추가 데이터 수집 후 결정', exp: 25, effect: '2주 후 재보고' },
    ],
  },
]

// ── 비서팀 (하은) 데이터 ──

export const mailSummary = [
  { id: 1, from: 'OEM 공장 (중국)', subject: '3월 발주건 생산 완료 통보', time: '09:15', important: true, read: false },
  { id: 2, from: '네이버 담당자', subject: 'N배송 수수료 변경 안내 (4월~)', time: '08:40', important: true, read: false },
  { id: 3, from: '디자인팀', subject: '2026 S/S 신상 디자인 시안 3차', time: '어제', important: false, read: true },
  { id: 4, from: '회계법인', subject: '2025 결산 보고서 초안', time: '어제', important: true, read: true },
  { id: 5, from: '물류 파트너사', subject: '택배 단가 협상 결과', time: '2일 전', important: false, read: true },
  { id: 6, from: '마케팅 에이전시', subject: '3월 SNS 광고 성과 보고', time: '2일 전', important: false, read: true },
]

export const todoList = [
  { id: 1, text: 'OEM 발주 최종 승인', priority: 'high', done: false, dueDate: '오늘' },
  { id: 2, text: 'N배송 수수료 변경 검토', priority: 'high', done: false, dueDate: '오늘' },
  { id: 3, text: 'S/S 디자인 시안 피드백', priority: 'medium', done: false, dueDate: '내일' },
  { id: 4, text: '월간 경영 회의 준비', priority: 'medium', done: false, dueDate: '3/12' },
  { id: 5, text: '결산 보고서 검토', priority: 'low', done: true, dueDate: '완료' },
  { id: 6, text: '택배 단가 협상 결과 확인', priority: 'low', done: true, dueDate: '완료' },
]

export const scheduleData = [
  { time: '09:00', event: '모닝 브리핑', team: '전체', type: 'meeting' },
  { time: '10:30', event: 'OEM 발주 미팅', team: '물류팀', type: 'meeting' },
  { time: '12:00', event: '점심 (거래처 대표)', team: '외부', type: 'lunch' },
  { time: '14:00', event: 'S/S 디자인 리뷰', team: '디자인팀', type: 'review' },
  { time: '15:30', event: '마케팅 전략 회의', team: '마케팅팀', type: 'meeting' },
  { time: '17:00', event: '일일 결산 보고', team: '경영지원팀', type: 'report' },
]

export const keyDecisions = [
  { id: 1, title: 'OEM 3차 발주 승인', urgency: 'high', deadline: '오늘 18시', status: '미결정' },
  { id: 2, title: 'N배송 수수료 변경 대응', urgency: 'high', deadline: '3/15', status: '검토중' },
  { id: 3, title: 'S/S 컬렉션 출시일 확정', urgency: 'medium', deadline: '3/20', status: '미결정' },
  { id: 4, title: '멤버십 리뉴얼 방안', urgency: 'low', deadline: '3/31', status: '기획중' },
]

// 비서팀 의사결정
export const secretaryDecisions = [
  {
    id: 'sec_1',
    question: '오늘 핵심 의사결정 2건이 있어요. 어떤 것부터 처리하시겠어요?',
    context: 'OEM 발주 승인(오늘 18시 마감)과 N배송 수수료 변경 검토(3/15 마감)',
    choices: [
      { id: 'a', text: 'OEM 발주부터 (마감 임박)', exp: 40, effect: '물류팀에 발주 승인 전달' },
      { id: 'b', text: 'N배송 수수료부터 (전략적)', exp: 45, effect: '수수료 협상 여지 확보' },
      { id: 'c', text: '두 건 모두 관련 팀장 소집', exp: 50, effect: '빠른 의사결정, 회의 30분 소요' },
    ],
  },
]

// ── KPI 요약 (메인 화면용) ──
export const kpiSummary = {
  todaySales: 4_280_000,
  yesterdaySales: 3_950_000,
  monthlySales: 118_400_000,
  totalOrders: 342,
  pendingCS: 8,
  lowStockItems: 5,
  ceoLevel: 1,
  ceoExp: 0,
}
