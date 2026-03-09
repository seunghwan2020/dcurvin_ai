// D.CURVIN CEO RPG — Mock Data

// ── Characters ──
export const characters = {
  yujin: { id: 'yujin', name: '김유진 과장', team: '경영지원팀', color: '#3b5998', questId: 'q1', title: '과장', fullName: '김유진' },
  taehyun: { id: 'taehyun', name: '이태현 대리', team: '물류팀', color: '#e67e22', questId: 'q3', title: '대리', fullName: '이태현' },
  seoyeon: { id: 'seoyeon', name: '박서연 사원', team: 'CS팀', color: '#e84393', questId: 'q2', title: '사원', fullName: '박서연' },
  minjun: { id: 'minjun', name: '최민준 주임', team: '고객데이터분석팀', color: '#6c5ce7', questId: null, title: '주임', fullName: '최민준' },
  haeun: { id: 'haeun', name: '정하은 대리', team: '비서팀', color: '#C4A661', questId: 'q5', title: '대리', fullName: '정하은' },
  hanwei: { id: 'hanwei', name: '한웨이 매니저', team: '글로벌물류', color: '#2d8a4e', questId: null, title: '매니저', fullName: '한웨이' },
}

// ── 환율 데이터 ──
export const exchangeRateData = {
  current: 9.12,
  previous: 9.05,
  change: 0.77,
  direction: 'up',
  weekly: [
    { date: '3/3', rate: 8.98 },
    { date: '3/4', rate: 9.02 },
    { date: '3/5', rate: 8.95 },
    { date: '3/6', rate: 9.08 },
    { date: '3/7', rate: 9.05 },
    { date: '3/8', rate: 9.10 },
    { date: '3/9', rate: 9.12 },
  ],
}

// ── 최근 14일 매출 (미니차트용) ──
export const recentDailySales = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(2026, 2, i - 4)
  const base = 3_800_000 + Math.sin(i / 3) * 800_000
  const isToday = i === 13
  return { date: `${d.getMonth()+1}/${d.getDate()}`, sales: Math.round(base + (Math.random()-0.3)*400_000), isToday }
})

// ── 재고 현황 게이지 ──
export const inventoryGauge = {
  totalSKU: 48,
  depletionRate: 67.5,
  dangerItems: 3,
  dangerList: [
    { name: 'Edge V2 네이비 M', daysLeft: 2.4 },
    { name: 'Eddy V2 베이지 FREE', daysLeft: 2.0 },
    { name: 'Eddy V2 아이보리 FREE', daysLeft: 4.0 },
  ],
  alertText: '3개 품목 5일 내 소진 예상',
}

// ── 경영지원팀 (유진) ──
export const dailySalesData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 1, 8 + i)
  const base = 3_500_000 + Math.sin(i / 3) * 1_200_000
  const wknd = (d.getDay() === 0 || d.getDay() === 6) ? 800_000 : 0
  return { date: `${d.getMonth()+1}/${d.getDate()}`, sales: Math.round(base + wknd + (Math.random()-0.3)*600_000), orders: Math.round(35 + Math.random()*30), profit: Math.round((base+wknd)*0.35) }
})
export const weeklySalesData = [
  { week: '1주차', sales: 24_800_000, orders: 285, growth: 0 },
  { week: '2주차', sales: 27_200_000, orders: 312, growth: 9.7 },
  { week: '3주차', sales: 31_500_000, orders: 358, growth: 15.8 },
  { week: '4주차', sales: 28_900_000, orders: 330, growth: -8.3 },
]
export const monthlySalesData = [
  { month: '2025.10', sales: 98_000_000, profit: 34_300_000 },
  { month: '2025.11', sales: 112_000_000, profit: 39_200_000 },
  { month: '2025.12', sales: 145_000_000, profit: 50_750_000 },
  { month: '2026.01', sales: 88_000_000, profit: 30_800_000 },
  { month: '2026.02', sales: 105_000_000, profit: 36_750_000 },
  { month: '2026.03', sales: 118_400_000, profit: 41_440_000 },
]
export const productSalesShare = [
  { name: 'Edge V2', value: 35, amount: 41_440_000, color: '#C4A661' },
  { name: 'Eddy V2', value: 25, amount: 29_600_000, color: '#6366f1' },
  { name: 'Guardian', value: 22, amount: 26_048_000, color: '#14b8a6' },
  { name: 'ConnectBag', value: 18, amount: 21_312_000, color: '#f59e0b' },
]
export const colorTrendData = [
  { month: '10월', bright: 42, dark: 58 }, { month: '11월', bright: 45, dark: 55 },
  { month: '12월', bright: 38, dark: 62 }, { month: '1월', bright: 40, dark: 60 },
  { month: '2월', bright: 52, dark: 48 }, { month: '3월', bright: 58, dark: 42 },
]
export const colorDetailData = [
  { name: '아이보리', pct: 22, hex: '#FFFDD0' }, { name: '블랙', pct: 18, hex: '#2D3748' },
  { name: '네이비', pct: 16, hex: '#1e3a5f' }, { name: '베이지', pct: 14, hex: '#D4A574' },
  { name: '그레이', pct: 12, hex: '#A0AEC0' }, { name: '카키', pct: 8, hex: '#6B8E23' },
  { name: '화이트', pct: 7, hex: '#F0F0F0' }, { name: '와인', pct: 3, hex: '#722F37' },
]
export const salesForecastData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 2, 10 + i)
  const base = 4_000_000 + Math.sin(i/5)*800_000 + i*30_000
  return { date: `${d.getMonth()+1}/${d.getDate()}`, predicted: Math.round(base), upper: Math.round(base*1.15), lower: Math.round(base*0.85) }
})
export const competitorData = [
  { name: 'D.CURVIN', sales: 118, share: 8.2, rank: 4, color: '#C4A661', highlight: true },
  { name: 'A사', sales: 320, share: 22.1, rank: 1, color: '#94a3b8' },
  { name: 'B사', sales: 185, share: 12.8, rank: 2, color: '#94a3b8' },
  { name: 'C사', sales: 142, share: 9.8, rank: 3, color: '#94a3b8' },
  { name: 'D사', sales: 95, share: 6.6, rank: 5, color: '#94a3b8' },
]
export const managementDecisions = [
  { id: 'mgmt_1', question: '봄 시즌 마케팅 예산을 어떻게 배분할까요?', context: '밝은 컬러 매출 급상승 중, 전체 매출 상승세',
    choices: [
      { id: 'a', text: '밝은 컬러 라인 집중 투자', exp: 50, effect: '밝은 컬러 매출 +25% 예상',
        actions: [
          { text: '마케팅팀에 밝은 컬러 광고 소재 제작 요청', team: '경영지원팀', priority: 'high', due: '오늘' },
          { text: 'SNS 광고 예산 밝은 컬러 70% 배분 설정', team: '경영지원팀', priority: 'high', due: '내일' },
          { text: '아이보리/베이지 재고 확보 물류팀 전달', team: '물류팀', priority: 'medium', due: '내일' },
        ] },
      { id: 'b', text: '전 라인 균등 배분', exp: 30, effect: '전체 매출 안정적 성장',
        actions: [
          { text: '전 라인 마케팅 예산 균등 배분표 작성', team: '경영지원팀', priority: 'medium', due: '내일' },
          { text: '각 제품별 광고 소재 업데이트 요청', team: '경영지원팀', priority: 'medium', due: '3일 내' },
        ] },
      { id: 'c', text: '추가 데이터 분석 요청', exp: 20, effect: '다음 보고 시 상세 분석',
        reminder: { text: '마케팅 예산 배분 — 추가 분석 결과 확인', team: '경영지원팀', due: '3일 후' },
        navigateTo: 'data' },
    ] },
  { id: 'mgmt_2', question: '경쟁사 대비 가격 전략은?', context: '시장 점유율 4위, 성장률 업계 1위',
    choices: [
      { id: 'a', text: '프리미엄 가격 유지', exp: 40, effect: '마진율 유지, 브랜드 강화',
        actions: [
          { text: '프리미엄 브랜딩 강화 캠페인 기획', team: '경영지원팀', priority: 'medium', due: '이번 주' },
          { text: '고급 패키징 디자인 검토', team: '경영지원팀', priority: 'low', due: '3/20' },
        ] },
      { id: 'b', text: '멤버십 혜택 강화', exp: 45, effect: '재구매율 +20%',
        actions: [
          { text: '멤버십 등급별 할인율 재설계', team: '경영지원팀', priority: 'high', due: '이번 주' },
          { text: '멤버십 리뉴얼 안내 메일 발송 준비', team: '경영지원팀', priority: 'medium', due: '3/15' },
        ] },
      { id: 'c', text: '공격적 할인 (점유율 확대)', exp: 35, effect: '주문 +40%, 마진 -15%',
        actions: [
          { text: '할인 캠페인 상세 기획안 작성', team: '경영지원팀', priority: 'high', due: '오늘' },
          { text: '할인 적용 상품 리스트 확정', team: '경영지원팀', priority: 'high', due: '내일' },
        ] },
    ] },
]

// ── 물류팀 (태현) ──
export const nDeliveryStock = [
  { sku: 'EDGE-V2-BK-M', name: 'Edge V2 블랙 M', stock: 45, daily: 8, daysLeft: 5.6, status: '주의' },
  { sku: 'EDGE-V2-BK-L', name: 'Edge V2 블랙 L', stock: 32, daily: 6, daysLeft: 5.3, status: '주의' },
  { sku: 'EDGE-V2-NV-M', name: 'Edge V2 네이비 M', stock: 12, daily: 5, daysLeft: 2.4, status: '긴급' },
  { sku: 'EDDY-V2-BG-F', name: 'Eddy V2 베이지 FREE', stock: 8, daily: 4, daysLeft: 2.0, status: '긴급' },
  { sku: 'EDDY-V2-IV-F', name: 'Eddy V2 아이보리 FREE', stock: 28, daily: 7, daysLeft: 4.0, status: '주의' },
  { sku: 'GUARD-KH-L', name: 'Guardian 카키 L', stock: 65, daily: 3, daysLeft: 21.7, status: '정상' },
  { sku: 'GUARD-BK-M', name: 'Guardian 블랙 M', stock: 52, daily: 4, daysLeft: 13.0, status: '정상' },
  { sku: 'CBAG-GY-ONE', name: 'ConnectBag 그레이', stock: 85, daily: 2, daysLeft: 42.5, status: '과잉' },
]
export const easyAdminStock = [
  { sku: 'EDGE-V2-BK-M', stock: 120 }, { sku: 'EDGE-V2-BK-L', stock: 85 },
  { sku: 'EDGE-V2-NV-M', stock: 200 }, { sku: 'EDDY-V2-BG-F', stock: 150 },
  { sku: 'EDDY-V2-IV-F', stock: 95 }, { sku: 'GUARD-KH-L', stock: 180 },
  { sku: 'GUARD-BK-M', stock: 160 }, { sku: 'CBAG-GY-ONE', stock: 250 },
]
export const restockAlerts = [
  { sku: 'EDGE-V2-NV-M', name: 'Edge V2 네이비 M', daysLeft: 2.4, needed: 50, urgency: '긴급' },
  { sku: 'EDDY-V2-BG-F', name: 'Eddy V2 베이지 FREE', daysLeft: 2.0, needed: 40, urgency: '긴급' },
  { sku: 'EDDY-V2-IV-F', name: 'Eddy V2 아이보리 FREE', daysLeft: 4.0, needed: 35, urgency: '주의' },
  { sku: 'EDGE-V2-BK-M', name: 'Edge V2 블랙 M', daysLeft: 5.6, needed: 40, urgency: '주의' },
]
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
export const oemRecommendation = [
  { product: 'Edge V2 블랙 M', qty: 500, reason: '주력 상품, 월 240개' },
  { product: 'Edge V2 네이비 M', qty: 300, reason: '빠른 소진' },
  { product: 'Eddy V2 베이지 FREE', qty: 400, reason: '봄 시즌 수요 급증' },
  { product: 'Eddy V2 아이보리 FREE', qty: 350, reason: '밝은 컬러 트렌드' },
  { product: 'Guardian 블랙 M', qty: 200, reason: '안정적 수요' },
]
export const containerData = {
  type: '40ft HQ', totalCBM: 76.3, usedCBM: 68.2, fillRate: 89.4,
  items: [
    { product: 'Edge V2', qty: 500, cbm: 22.5, boxes: 50 },
    { product: 'Eddy V2', qty: 750, cbm: 26.3, boxes: 75 },
    { product: 'Guardian', qty: 200, cbm: 12.0, boxes: 20 },
    { product: 'ConnectBag', qty: 300, cbm: 7.4, boxes: 30 },
  ],
}
export const logisticsDecisions = [
  { id: 'log_1', question: '긴급 재고 2건! 입고 승인하시겠습니까?', context: 'Edge V2 네이비(2.4일), Eddy V2 베이지(2.0일) 소진 임박',
    choices: [
      { id: 'a', text: '긴급 입고 승인 (당일 출고)', exp: 50, effect: 'N배송 재고 보충, 품절 방지',
        actions: [
          { text: '쿠팡에서 N배송 입고 신청하기 (Edge V2 네이비 M 50개)', team: '물류팀', priority: 'high', due: '오늘' },
          { text: '쿠팡에서 N배송 입고 신청하기 (Eddy V2 베이지 F 40개)', team: '물류팀', priority: 'high', due: '오늘' },
          { text: '이지어드민에서 출고 처리 확인', team: '물류팀', priority: 'high', due: '오늘' },
        ] },
      { id: 'b', text: '내일 일괄 입고', exp: 30, effect: '물류비 절감, 품절 리스크 존재',
        actions: [
          { text: '내일 오전 N배송 일괄 입고 스케줄 등록', team: '물류팀', priority: 'medium', due: '오늘' },
          { text: '긴급 품목 품절 알림 설정', team: '물류팀', priority: 'medium', due: '오늘' },
        ] },
      { id: 'c', text: '보류', exp: 15, effect: '품절 가능성 높음',
        reminder: { text: '긴급 재고 입고 건 — 재검토 필요', team: '물류팀', due: '내일' } },
    ] },
  { id: 'log_2', question: 'OEM 발주를 진행할까요?', context: '40ft HQ 적재율 89.4%, 예상 비용 $12,500',
    choices: [
      { id: 'a', text: 'OEM 발주 승인', exp: 45, effect: '2주 후 입고, 3개월 치 확보',
        actions: [
          { text: 'OEM 공장에 발주서 전송 ($12,500)', team: '물류팀', priority: 'high', due: '오늘' },
          { text: '발주 확인서 수령 후 입금 처리', team: '경영지원팀', priority: 'high', due: '내일' },
          { text: '수입 일정표 업데이트 (2주 후 입고)', team: '물류팀', priority: 'medium', due: '내일' },
        ] },
      { id: 'b', text: '물량 10% 추가 (적재율 97%)', exp: 55, effect: '효율 극대화, +$1,200',
        actions: [
          { text: 'OEM 공장에 10% 추가 발주서 전송 ($13,700)', team: '물류팀', priority: 'high', due: '오늘' },
          { text: '추가 물량 적재 계획 수정', team: '물류팀', priority: 'medium', due: '오늘' },
          { text: '발주 확인서 수령 후 입금 처리', team: '경영지원팀', priority: 'high', due: '내일' },
        ] },
      { id: 'c', text: '발주 보류', exp: 20, effect: '현금 유동성 확보',
        reminder: { text: 'OEM 발주 건 — 재검토 (현금 흐름 확인 후)', team: '물류팀', due: '이번 주' } },
    ] },
]

// ── CS팀 (서연) ──
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
export const claimData = [
  { month: '10월', claims: 12, returns: 28, refunds: 8 }, { month: '11월', claims: 15, returns: 32, refunds: 10 },
  { month: '12월', claims: 22, returns: 45, refunds: 18 }, { month: '1월', claims: 18, returns: 35, refunds: 12 },
  { month: '2월', claims: 10, returns: 25, refunds: 7 }, { month: '3월', claims: 8, returns: 20, refunds: 5 },
]
export const satisfactionData = [
  { month: '10월', score: 4.1 }, { month: '11월', score: 4.0 }, { month: '12월', score: 3.8 },
  { month: '1월', score: 4.2 }, { month: '2월', score: 4.4 }, { month: '3월', score: 4.5 },
]
export const csDecisions = [
  { id: 'cs_1', question: '24시간 초과 미답변 3건! 어떻게 할까요?', context: '주문 취소, 사이즈 교환, 배송 지연 문의',
    choices: [
      { id: 'a', text: '즉시 전원 투입', exp: 50, effect: '만족도 회복, CS팀 야근',
        actions: [
          { text: 'CS-0341 김*진 주문 취소 처리 (카페24)', team: 'CS팀', priority: 'high', due: '오늘' },
          { text: 'CS-0339 이*영 사이즈 교환 접수 처리', team: 'CS팀', priority: 'high', due: '오늘' },
          { text: 'CS-0338 박*호 배송 지연 사과 + 추적번호 전달', team: 'CS팀', priority: 'high', due: '오늘' },
        ] },
      { id: 'b', text: '보상 쿠폰과 함께 답변', exp: 45, effect: '만족도 +0.3, 마케팅 비용',
        actions: [
          { text: '24시간 초과 고객 3명에게 5,000원 쿠폰 발급', team: 'CS팀', priority: 'high', due: '오늘' },
          { text: '쿠폰 포함 사과 답변 템플릿 작성', team: 'CS팀', priority: 'high', due: '오늘' },
          { text: '3건 순차 답변 완료 후 만족도 체크', team: 'CS팀', priority: 'medium', due: '내일' },
        ] },
      { id: 'c', text: '우선순위별 순차 처리', exp: 35, effect: '효율적, 일부 추가 대기',
        actions: [
          { text: 'CS-0338 배송 지연 (36h) 최우선 처리', team: 'CS팀', priority: 'high', due: '오늘' },
          { text: 'CS-0339 사이즈 교환 (28h) 2순위 처리', team: 'CS팀', priority: 'medium', due: '오늘' },
          { text: 'CS-0341 주문 취소 (26h) 3순위 처리', team: 'CS팀', priority: 'medium', due: '오늘' },
        ] },
    ] },
]

// ── 데이터팀 (민준) ──
export const productSalesData = [
  { product: 'Edge V2', total: 1250, thisMonth: 185, growth: 12.5, avgPrice: 189_000 },
  { product: 'Eddy V2', total: 980, thisMonth: 142, growth: 18.2, avgPrice: 129_000 },
  { product: 'Guardian', total: 720, thisMonth: 98, growth: -5.3, avgPrice: 159_000 },
  { product: 'ConnectBag', total: 540, thisMonth: 78, growth: 22.8, avgPrice: 89_000 },
]
export const sizeHeatmap = {
  products: ['Edge V2', 'Eddy V2', 'Guardian', 'ConnectBag'],
  sizes: ['S', 'M', 'L', 'XL', 'FREE'],
  data: [[15,42,38,12,0],[0,0,0,0,85],[8,35,32,18,0],[0,0,0,0,78]],
}
export const colorHeatmap = {
  products: ['Edge V2', 'Eddy V2', 'Guardian', 'ConnectBag'],
  colors: ['블랙', '네이비', '베이지', '아이보리', '카키', '그레이'],
  hex: ['#1a1a2e', '#1e3a5f', '#D4A574', '#FFFDD0', '#6B8E23', '#9ca3af'],
  data: [[52,28,18,12,0,8],[15,10,35,42,0,12],[30,22,0,0,28,15],[20,12,8,5,0,33]],
}
export const purchasePatterns = {
  repeatRate: 34.2, avgInterval: 45, avgItems: 1.8,
  combos: [
    { items: 'Edge V2 + ConnectBag', count: 85, rate: 12.3 },
    { items: 'Eddy V2 + Edge V2', count: 62, rate: 9.0 },
    { items: 'Guardian + ConnectBag', count: 45, rate: 6.5 },
  ],
  timeDist: [
    { hour: '09-12', orders: 18 }, { hour: '12-15', orders: 28 }, { hour: '15-18', orders: 22 },
    { hour: '18-21', orders: 35 }, { hour: '21-24', orders: 25 }, { hour: '00-09', orders: 8 },
  ],
}
export const reviewSentiment = {
  positive: 72, neutral: 18, negative: 10, total: 856, avg: 4.3,
  posKeywords: ['튼튼해요', '디자인 예뻐요', '수납 좋아요', '가벼워요', '색감 좋아요'],
  negKeywords: ['지퍼 뻑뻑해요', '배송 느려요', '사이즈 작아요', '가격이 좀...', '냄새가 나요'],
  byProduct: [
    { product: 'Edge V2', pos: 78, neu: 15, neg: 7, avg: 4.5 },
    { product: 'Eddy V2', pos: 75, neu: 17, neg: 8, avg: 4.4 },
    { product: 'Guardian', pos: 68, neu: 20, neg: 12, avg: 4.1 },
    { product: 'ConnectBag', pos: 65, neu: 22, neg: 13, avg: 4.0 },
  ],
}
export const dataDecisions = [
  { id: 'data_1', question: 'Edge V2 + ConnectBag 번들 상품을 만들까요?', context: '조합 구매 12.3%, 번들 시 258,000원 제안',
    choices: [
      { id: 'a', text: '번들 상품 출시', exp: 50, effect: '주문 단가 +15%, 마진 -3%',
        actions: [
          { text: '카페24에 번들 상품 등록 (258,000원)', team: '고객데이터분석팀', priority: 'high', due: '이번 주' },
          { text: '번들 상품 상세페이지 디자인 요청', team: '고객데이터분석팀', priority: 'medium', due: '3일 내' },
          { text: '번들 재고 100세트 선확보 (물류팀 전달)', team: '물류팀', priority: 'medium', due: '이번 주' },
        ] },
      { id: 'b', text: '한정판 패키지 출시', exp: 55, effect: '프리미엄 이미지, 500세트 한정',
        actions: [
          { text: '한정판 패키지 디자인 컨셉 기획', team: '고객데이터분석팀', priority: 'high', due: '이번 주' },
          { text: '500세트 한정 재고 확보 (물류팀 조율)', team: '물류팀', priority: 'high', due: '이번 주' },
          { text: '한정판 출시 SNS 티저 콘텐츠 제작', team: '경영지원팀', priority: 'medium', due: '3/15' },
        ] },
      { id: 'c', text: '추가 데이터 수집 후 결정', exp: 25, effect: '2주 후 재보고',
        reminder: { text: '번들 상품 — 추가 데이터 분석 결과 확인', team: '고객데이터분석팀', due: '2주 후' } },
    ] },
]

// ── 비서팀 (하은) ──
export const mailSummary = [
  { id: 1, from: 'OEM 공장 (중국)', subject: '3월 발주건 생산 완료 통보', time: '09:15', important: true, read: false },
  { id: 2, from: '네이버 담당자', subject: 'N배송 수수료 변경 안내 (4월~)', time: '08:40', important: true, read: false },
  { id: 3, from: '디자인팀', subject: '2026 S/S 신상 디자인 시안 3차', time: '어제', important: false, read: true },
  { id: 4, from: '회계법인', subject: '2025 결산 보고서 초안', time: '어제', important: true, read: true },
  { id: 5, from: '물류 파트너사', subject: '택배 단가 협상 결과', time: '2일 전', important: false, read: true },
  { id: 6, from: '마케팅 에이전시', subject: '3월 SNS 광고 성과 보고', time: '2일 전', important: false, read: true },
]
// execution checklists per team
export const executionChecklists = {
  management: [
    { text: '이지어드민에서 오늘 매출 확인하기', link: 'easyadmin' },
    { text: '카페24 관리자에서 주문 현황 체크', link: 'cafe24' },
    { text: '네이버 스마트스토어 매출 확인', link: 'naver' },
    { text: '쿠팡 윙 매출 데이터 조회', link: 'coupang' },
  ],
  logistics: [
    { text: '쿠팡에서 N배송 입고 신청하기', link: 'coupang' },
    { text: '이지어드민에서 재고 확인하기', link: 'easyadmin' },
    { text: '중국 OEM 공장 생산 현황 확인', link: 'factory' },
    { text: '택배사 수거 요청 확인', link: 'delivery' },
  ],
  cs: [
    { text: '카페24 CS 게시판 미답변 확인', link: 'cafe24' },
    { text: '네이버 톡톡 미확인 메시지 처리', link: 'naver' },
    { text: '쿠팡 고객 문의 답변 처리', link: 'coupang' },
    { text: '교환/반품 접수 현황 처리', link: 'returns' },
  ],
  data: [
    { text: '구글 애널리틱스 트래픽 확인', link: 'ga' },
    { text: '카페24 상품별 판매 데이터 다운로드', link: 'cafe24' },
    { text: '리뷰 모니터링 (네이버/쿠팡)', link: 'review' },
    { text: '고객 세그먼트 업데이트', link: 'crm' },
  ],
  secretary: [
    { text: '대표님 메일함 미확인 메일 정리', link: 'mail' },
    { text: '오늘의 회의 스케줄 최종 확인', link: 'calendar' },
    { text: '각 팀 To-Do 진행 상황 점검', link: 'todo' },
    { text: '주요 의사결정 현황 보고 준비', link: 'report' },
  ],
}
export const scheduleData = [
  { time: '09:00', event: '모닝 브리핑', team: '전체', icon: '🤝' },
  { time: '10:30', event: 'OEM 발주 미팅', team: '물류팀', icon: '📦' },
  { time: '12:00', event: '점심 (거래처 대표)', team: '외부', icon: '🍽️' },
  { time: '14:00', event: 'S/S 디자인 리뷰', team: '디자인팀', icon: '🎨' },
  { time: '15:30', event: '마케팅 전략 회의', team: '마케팅팀', icon: '📣' },
  { time: '17:00', event: '일일 결산 보고', team: '경영지원팀', icon: '📋' },
]
export const keyDecisions = [
  { id: 1, title: 'OEM 3차 발주 승인', urgency: 'high', deadline: '오늘 18시', status: '미결정' },
  { id: 2, title: 'N배송 수수료 변경 대응', urgency: 'high', deadline: '3/15', status: '검토중' },
  { id: 3, title: 'S/S 컬렉션 출시일 확정', urgency: 'medium', deadline: '3/20', status: '미결정' },
  { id: 4, title: '멤버십 리뉴얼 방안', urgency: 'low', deadline: '3/31', status: '기획중' },
]
export const secretaryDecisions = [
  { id: 'sec_1', question: '오늘 핵심 의사결정 2건 — 어떤 것부터?', context: 'OEM 발주(오늘 18시 마감) vs N배송 수수료(3/15 마감)',
    choices: [
      { id: 'a', text: 'OEM 발주부터 (마감 임박)', exp: 40, effect: '물류팀에 승인 전달',
        actions: [
          { text: '물류팀에 OEM 발주 승인 전달', team: '비서팀', priority: 'high', due: '오늘 12시' },
          { text: 'N배송 수수료 검토 일정 잡기', team: '비서팀', priority: 'medium', due: '오늘 오후' },
        ] },
      { id: 'b', text: 'N배송 수수료부터 (전략적)', exp: 45, effect: '협상 여지 확보',
        actions: [
          { text: '네이버 담당자에게 수수료 협상 회신', team: '비서팀', priority: 'high', due: '오늘 오전' },
          { text: 'OEM 발주 건 오후 긴급 처리 스케줄링', team: '비서팀', priority: 'high', due: '오늘 오후' },
        ] },
      { id: 'c', text: '두 건 모두 팀장 소집', exp: 50, effect: '빠른 의사결정, 30분 소요',
        actions: [
          { text: '물류팀장 + 경영지원팀장 긴급 회의 소집', team: '비서팀', priority: 'high', due: '오늘 10시' },
          { text: '회의실 예약 및 안건 정리', team: '비서팀', priority: 'high', due: '지금 즉시' },
          { text: '회의 결과 정리 후 각 팀 전달', team: '비서팀', priority: 'medium', due: '오늘 11시' },
        ] },
    ] },
]

// ── 글로벌 물류센터 (발주/수입) ──
export const ordersList = [
  { id: 'PO-2026-001', date: '2026-01-15', product: 'Edge V2', variants: '블랙M/L, 네이비M', qty: 1500, status: '완료', progress: 100, chinaQty: 0, importedQty: 1500, remainQty: 0, expectedDone: '2026-01-25' },
  { id: 'PO-2026-002', date: '2026-02-01', product: 'Eddy V2', variants: '베이지F, 아이보리F', qty: 1200, status: '부분수입', progress: 60, chinaQty: 720, importedQty: 480, remainQty: 0, expectedDone: '2026-02-10' },
  { id: 'PO-2026-003', date: '2026-02-20', product: 'Guardian', variants: '블랙M, 카키L', qty: 800, status: '제작완료', progress: 40, chinaQty: 800, importedQty: 0, remainQty: 0, expectedDone: '2026-03-01' },
  { id: 'PO-2026-004', date: '2026-03-01', product: 'ConnectBag', variants: '그레이, 블랙', qty: 600, status: '제작중', progress: 20, chinaQty: 0, importedQty: 0, remainQty: 600, expectedDone: '2026-03-20' },
  { id: 'PO-2026-005', date: '2026-03-05', product: 'Edge V2', variants: '블랙M/L, 베이지M', qty: 2000, status: '제작중', progress: 10, chinaQty: 0, importedQty: 0, remainQty: 2000, expectedDone: '2026-04-05' },
]
export const chinaWarehouse = [
  { id: 'CW-001', product: 'Eddy V2 베이지 FREE', qty: 480, fromOrder: 'PO-2026-002', importable: true, storedDate: '2026-02-10', cbmPerUnit: 0.035, monthsStored: 1.0 },
  { id: 'CW-002', product: 'Eddy V2 아이보리 FREE', qty: 240, fromOrder: 'PO-2026-002', importable: true, storedDate: '2026-02-10', cbmPerUnit: 0.035, monthsStored: 1.0 },
  { id: 'CW-003', product: 'Guardian 블랙 M', qty: 400, fromOrder: 'PO-2026-003', importable: true, storedDate: '2026-03-01', cbmPerUnit: 0.045, monthsStored: 0.3 },
  { id: 'CW-004', product: 'Guardian 카키 L', qty: 400, fromOrder: 'PO-2026-003', importable: true, storedDate: '2026-03-01', cbmPerUnit: 0.045, monthsStored: 0.3 },
]
export const importHistory = [
  { id: 'IMP-001', date: '2026-01-28', container: '40ft HQ', items: 'Edge V2 1500ea', cbm: 67.5, fillRate: 88.5, status: '입고완료', products: [{ name: 'Edge V2 블랙 M', qty: 500 }, { name: 'Edge V2 블랙 L', qty: 500 }, { name: 'Edge V2 네이비 M', qty: 500 }] },
  { id: 'IMP-002', date: '2026-02-15', container: '40ft HQ', items: 'Eddy V2 720ea', cbm: 48.2, fillRate: 63.2, status: '입고완료', products: [{ name: 'Eddy V2 베이지 FREE', qty: 480 }, { name: 'Eddy V2 아이보리 FREE', qty: 240 }] },
  { id: 'IMP-003', date: '2026-03-08', container: '40ft HQ', items: 'Mixed', cbm: 68.2, fillRate: 89.4, status: '운송중', products: [{ name: 'Edge V2', qty: 500 }, { name: 'Eddy V2', qty: 750 }, { name: 'Guardian', qty: 200 }, { name: 'ConnectBag', qty: 300 }] },
]
export const pipelineData = { order: 2600, production: 2800, china: 1520, import: 1750, domestic: 2400, sales: 3200 }
export const pipelineStages = [
  { id: 'order', label: '발주 등록', count: 2600, icon: '📝', color: '#6366f1' },
  { id: 'production', label: '제작 중', count: 2800, icon: '🏭', color: '#f59e0b' },
  { id: 'china', label: '중국창고', count: 1520, icon: '🏬', color: '#2d8a4e' },
  { id: 'import', label: '수입 준비', count: 1750, icon: '📋', color: '#8b5cf6' },
  { id: 'shipping', label: '운송 중', count: 1750, icon: '🚢', color: '#0ea5e9' },
  { id: 'domestic', label: '국내 입고', count: 2400, icon: '📦', color: '#14b8a6' },
  { id: 'sales', label: '판매', count: 3200, icon: '🛍️', color: '#C4A661' },
]
// 제품별 CBM 참고 데이터 (컨테이너 시뮬레이터용)
export const productCBM = {
  'Edge V2': { cbmPerUnit: 0.045, boxQty: 10, cbmPerBox: 0.45 },
  'Eddy V2': { cbmPerUnit: 0.035, boxQty: 10, cbmPerBox: 0.35 },
  'Guardian': { cbmPerUnit: 0.060, boxQty: 10, cbmPerBox: 0.60 },
  'ConnectBag': { cbmPerUnit: 0.025, boxQty: 10, cbmPerBox: 0.25 },
}
export const domesticInventory = [
  { sku: 'EDGE-V2-BK-M', name: 'Edge V2 블랙 M', nDelivery: 45, easyAdmin: 120, lastImport: 'IMP-001', matched: true },
  { sku: 'EDGE-V2-BK-L', name: 'Edge V2 블랙 L', nDelivery: 32, easyAdmin: 85, lastImport: 'IMP-001', matched: true },
  { sku: 'EDGE-V2-NV-M', name: 'Edge V2 네이비 M', nDelivery: 12, easyAdmin: 200, lastImport: 'IMP-001', matched: false },
  { sku: 'EDDY-V2-BG-F', name: 'Eddy V2 베이지 FREE', nDelivery: 8, easyAdmin: 150, lastImport: 'IMP-002', matched: true },
  { sku: 'EDDY-V2-IV-F', name: 'Eddy V2 아이보리 FREE', nDelivery: 28, easyAdmin: 95, lastImport: 'IMP-002', matched: true },
  { sku: 'GUARD-KH-L', name: 'Guardian 카키 L', nDelivery: 65, easyAdmin: 180, lastImport: null, matched: null },
  { sku: 'GUARD-BK-M', name: 'Guardian 블랙 M', nDelivery: 52, easyAdmin: 160, lastImport: null, matched: null },
  { sku: 'CBAG-GY-ONE', name: 'ConnectBag 그레이', nDelivery: 85, easyAdmin: 250, lastImport: null, matched: null },
]
