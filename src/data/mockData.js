// D.CURVIN AI 대시보드 Mock 데이터

// ── KPI 요약 ──
export const kpiData = {
  todaySales: 4_280_000,
  yesterdaySales: 3_950_000,
  weeklySales: 28_760_000,
  monthlySales: 118_400_000,
  totalOrders: 342,
  pendingOrders: 18,
  totalSKU: 256,
  lowStockSKU: 12,
  csTotal: 47,
  csUnanswered: 8,
  returnRate: 2.3,
  avgOrderValue: 125_000,
}

// ── AI 인사이트 ──
export const aiInsights = [
  {
    id: 1,
    type: 'warning',
    title: '재고 부족 경고',
    message: '베이지 트렌치코트(M) 재고가 3일 내 소진 예상됩니다. 긴급 발주를 권장합니다.',
    timestamp: '10분 전',
  },
  {
    id: 2,
    type: 'success',
    title: '매출 상승 트렌드',
    message: '이번 주 매출이 전주 대비 15.2% 상승했습니다. 봄 신상 컬렉션이 주요 원인입니다.',
    timestamp: '1시간 전',
  },
  {
    id: 3,
    type: 'info',
    title: '인기 컬러 분석',
    message: '최근 7일간 아이보리/크림 계열 상품 판매가 32% 증가했습니다.',
    timestamp: '2시간 전',
  },
  {
    id: 4,
    type: 'danger',
    title: 'CS 응답 지연',
    message: '미답변 문의 8건 중 3건이 24시간을 초과했습니다. 즉시 처리가 필요합니다.',
    timestamp: '30분 전',
  },
]

// ── 주간 매출 데이터 ──
export const weeklySalesData = [
  { day: '월', sales: 3_800_000, orders: 42 },
  { day: '화', sales: 4_120_000, orders: 48 },
  { day: '수', sales: 3_650_000, orders: 38 },
  { day: '목', sales: 4_580_000, orders: 52 },
  { day: '금', sales: 5_210_000, orders: 61 },
  { day: '토', sales: 4_200_000, orders: 55 },
  { day: '일', sales: 3_200_000, orders: 46 },
]

// ── 주간 재고 변동 ──
export const weeklyStockData = [
  { day: '월', inbound: 120, outbound: 85 },
  { day: '화', inbound: 45, outbound: 92 },
  { day: '수', inbound: 200, outbound: 78 },
  { day: '목', inbound: 30, outbound: 105 },
  { day: '금', inbound: 80, outbound: 130 },
  { day: '토', inbound: 0, outbound: 95 },
  { day: '일', inbound: 0, outbound: 60 },
]

// ── 일별 매출 (30일) ──
export const dailySalesData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 2, i + 1)
  const base = 3_500_000 + Math.sin(i / 3) * 1_200_000
  const random = (Math.random() - 0.5) * 800_000
  return {
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    sales: Math.round(base + random),
    orders: Math.round(35 + Math.random() * 30),
  }
})

// ── 컬러 트렌드 ──
export const colorTrendData = [
  { name: '아이보리/크림', sales: 4_820_000, percentage: 22, color: '#FFFDD0' },
  { name: '블랙', sales: 3_960_000, percentage: 18, color: '#2D3748' },
  { name: '네이비', sales: 3_520_000, percentage: 16, color: '#1e3a5f' },
  { name: '베이지', sales: 3_080_000, percentage: 14, color: '#D4A574' },
  { name: '그레이', sales: 2_640_000, percentage: 12, color: '#A0AEC0' },
  { name: '카키', sales: 1_760_000, percentage: 8, color: '#6B8E23' },
  { name: '와인', sales: 1_320_000, percentage: 6, color: '#722F37' },
  { name: '기타', sales: 880_000, percentage: 4, color: '#CBD5E0' },
]

// ── 카테고리별 매출 ──
export const categorySalesData = [
  { category: '아우터', sales: 8_200_000, orders: 68 },
  { category: '상의', sales: 5_400_000, orders: 95 },
  { category: '하의', sales: 4_800_000, orders: 82 },
  { category: '원피스', sales: 3_600_000, orders: 45 },
  { category: '악세서리', sales: 2_100_000, orders: 52 },
]

// ── 재고 현황 ──
export const inventoryStatusData = [
  { name: '정상', value: 178, color: '#38a169' },
  { name: '부족', value: 42, color: '#d69e2e' },
  { name: '긴급', value: 12, color: '#e53e3e' },
  { name: '과잉', value: 24, color: '#3182ce' },
]

export const skuTableData = [
  { sku: 'DC-TC-001', name: '베이지 트렌치코트', category: '아우터', size: 'M', stock: 3, status: '긴급', trend: 'down' },
  { sku: 'DC-TC-002', name: '네이비 트렌치코트', category: '아우터', size: 'L', stock: 8, status: '부족', trend: 'down' },
  { sku: 'DC-BL-015', name: '아이보리 블라우스', category: '상의', size: 'S', stock: 5, status: '부족', trend: 'down' },
  { sku: 'DC-KN-008', name: '크림 니트 가디건', category: '상의', size: 'FREE', stock: 2, status: '긴급', trend: 'down' },
  { sku: 'DC-PT-022', name: '블랙 와이드팬츠', category: '하의', size: 'M', stock: 45, status: '정상', trend: 'up' },
  { sku: 'DC-SK-011', name: '네이비 플리츠스커트', category: '하의', size: 'S', stock: 32, status: '정상', trend: 'stable' },
  { sku: 'DC-OP-005', name: '플로럴 원피스', category: '원피스', size: 'M', stock: 7, status: '부족', trend: 'down' },
  { sku: 'DC-JK-003', name: '그레이 울 재킷', category: '아우터', size: 'L', stock: 18, status: '정상', trend: 'stable' },
  { sku: 'DC-BG-009', name: '레더 토트백', category: '악세서리', size: 'ONE', stock: 65, status: '과잉', trend: 'up' },
  { sku: 'DC-SC-014', name: '실크 스카프', category: '악세서리', size: 'ONE', stock: 52, status: '과잉', trend: 'stable' },
  { sku: 'DC-CT-007', name: '캐시미어 코트', category: '아우터', size: 'M', stock: 4, status: '긴급', trend: 'down' },
  { sku: 'DC-TS-019', name: '스트라이프 티셔츠', category: '상의', size: 'L', stock: 28, status: '정상', trend: 'up' },
]

// ── CS / 주문 데이터 ──
export const csStatusData = [
  { name: '답변완료', value: 32, color: '#38a169' },
  { name: '처리중', value: 7, color: '#d69e2e' },
  { name: '미답변', value: 8, color: '#e53e3e' },
]

export const unansweredCS = [
  {
    id: 'CS-2026-0341',
    customer: '김*진',
    subject: '주문 취소 요청',
    category: '주문/결제',
    priority: 'high',
    createdAt: '2026-03-09 08:15',
    elapsedHours: 26,
  },
  {
    id: 'CS-2026-0339',
    customer: '이*영',
    subject: '사이즈 교환 문의',
    category: '교환/반품',
    priority: 'high',
    createdAt: '2026-03-09 06:42',
    elapsedHours: 28,
  },
  {
    id: 'CS-2026-0338',
    customer: '박*호',
    subject: '배송 지연 문의',
    category: '배송',
    priority: 'high',
    createdAt: '2026-03-08 22:10',
    elapsedHours: 36,
  },
  {
    id: 'CS-2026-0342',
    customer: '최*아',
    subject: '상품 불량 신고',
    category: '품질',
    priority: 'medium',
    createdAt: '2026-03-09 09:30',
    elapsedHours: 15,
  },
  {
    id: 'CS-2026-0343',
    customer: '정*현',
    subject: '적립금 사용 문의',
    category: '주문/결제',
    priority: 'low',
    createdAt: '2026-03-09 10:05',
    elapsedHours: 14,
  },
  {
    id: 'CS-2026-0344',
    customer: '한*수',
    subject: '배송지 변경 요청',
    category: '배송',
    priority: 'medium',
    createdAt: '2026-03-09 11:20',
    elapsedHours: 13,
  },
  {
    id: 'CS-2026-0345',
    customer: '윤*미',
    subject: '쿠폰 적용 오류',
    category: '주문/결제',
    priority: 'low',
    createdAt: '2026-03-09 12:45',
    elapsedHours: 11,
  },
  {
    id: 'CS-2026-0346',
    customer: '송*준',
    subject: '재입고 알림 요청',
    category: '상품문의',
    priority: 'low',
    createdAt: '2026-03-09 13:10',
    elapsedHours: 11,
  },
]

// ── 최근 주문 ──
export const recentOrders = [
  { id: 'ORD-20260309-001', customer: '김*진', items: '트렌치코트 외 1건', total: 248_000, status: '배송준비', date: '2026-03-09 14:22' },
  { id: 'ORD-20260309-002', customer: '이*수', items: '니트 가디건', total: 89_000, status: '결제완료', date: '2026-03-09 13:55' },
  { id: 'ORD-20260309-003', customer: '박*은', items: '와이드팬츠 외 2건', total: 167_000, status: '배송중', date: '2026-03-09 12:30' },
  { id: 'ORD-20260309-004', customer: '최*호', items: '플로럴 원피스', total: 128_000, status: '배송완료', date: '2026-03-09 11:05' },
  { id: 'ORD-20260309-005', customer: '정*아', items: '레더 토트백', total: 198_000, status: '배송중', date: '2026-03-09 10:40' },
]
