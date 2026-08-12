export type DestinationPack = {
  id: string
  country: '국내' | '일본'
  name: string
  tags: string[]
  image: string
}

export type RoomMember = {
  name: string
  initial: string
  color: string
  pale: string
  status: '완료' | '작성 중' | '확인 필요' | '시작 전'
  score: number
}

export type OsakaPreference = {
  name: string
  context: string
  image: string
  defaultScore: number
}

export const destinationPacks: DestinationPack[] = [
  { id: 'gangneung', country: '국내', name: '강릉', tags: ['바다', '카페', '서핑'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85' },
  { id: 'busan', country: '국내', name: '부산', tags: ['해운대', '미식', '야경'], image: 'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?auto=format&fit=crop&w=900&q=85' },
  { id: 'jeju', country: '국내', name: '제주', tags: ['오름', '드라이브', '바다'], image: 'https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?auto=format&fit=crop&w=900&q=85' },
  { id: 'seoul', country: '국내', name: '서울', tags: ['전시', '핫플', '미식'], image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=900&q=85' },
  { id: 'yeosu', country: '국내', name: '여수', tags: ['밤바다', '해산물', '케이블카'], image: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=900&q=85' },
  { id: 'osaka', country: '일본', name: '오사카', tags: ['미식', '도톤보리', '유니버설'], image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=900&q=85' },
  { id: 'tokyo', country: '일본', name: '도쿄', tags: ['트렌드', '쇼핑', '도시'], image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=85' },
  { id: 'kyoto', country: '일본', name: '교토', tags: ['사찰', '정원', '전통'], image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85' },
  { id: 'fukuoka', country: '일본', name: '후쿠오카', tags: ['라멘', '근교', '온천'], image: 'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=900&q=85' },
  { id: 'sapporo', country: '일본', name: '삿포로', tags: ['설경', '맥주', '해산물'], image: 'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=900&q=85' },
  { id: 'osaka-kyoto', country: '일본', name: '오사카 + 교토', tags: ['미식', '전통', '두 도시'], image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=85' },
]

export const roomMembers: RoomMember[] = [
  { name: '펠리시아', initial: '펠', color: '#F2714B', pale: '#FCE0D5', status: '완료', score: 8.1 },
  { name: '지훈', initial: '지', color: '#4D8CA8', pale: '#D9EAF1', status: '완료', score: 7.8 },
  { name: '서연', initial: '서', color: '#6C9E79', pale: '#DCEBDD', status: '작성 중', score: 7.6 },
  { name: '민재', initial: '민', color: '#8B78B8', pale: '#E8E0F2', status: '확인 필요', score: 8.1 },
  { name: '예린', initial: '예', color: '#D99B3D', pale: '#F8E9C8', status: '완료', score: 7.4 },
  { name: '수아', initial: '수', color: '#B66F84', pale: '#F2DEE4', status: '시작 전', score: 7.2 },
]

export const preferenceSliders = [
  ['여행 페이스', '느긋하게', '빡빡하게', 3],
  ['계획 스타일', '즉흥적으로', '미리 꼼꼼하게', 5],
  ['돈을 쓴다면', '숙소는 아끼기', '숙소에 투자하기', 2],
  ['여행 분위기', '자연 · 풍경', '도심 · 쇼핑', 4],
  ['장소 취향', '역사 · 박물관', '트렌디 · 핫플', 5],
  ['맛집 선택', '로컬 음식 도전', '검증된 맛집', 2],
  ['함께하는 정도', '항상 같이', '자유시간 필요', 3],
  ['생활 리듬', '새벽형', '늦잠형', 5],
  ['저녁 시간', '나이트라이프', '저녁 휴식', 3],
  ['이동 방식', '택시 편하게', '대중교통 절약', 6],
  ['여행 사진', '인생샷 중요', '사진 관심 없음', 3],
  ['활동 강도', '모험 · 액티비티', '안전 · 무난', 5],
] as const

const osakaImages = [
  'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1589452271712-64b8a66c7b71?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=85',
]

export const osakaPreferences: OsakaPreference[] = [
  ['도톤보리 야경', '네온사인 아래에서 오사카의 밤 즐기기', 8],
  ['유니버설 스튜디오', '하루를 온전히 테마파크에서 보내기', 5],
  ['구로몬 시장', '아침부터 길거리 음식과 해산물 맛보기', 8],
  ['오사카성', '천수각과 공원을 천천히 둘러보기', 4],
  ['신세카이', '레트로 골목에서 쿠시카츠 먹기', 7],
  ['우메다 스카이빌딩', '해 질 무렵 오사카 전경 감상하기', 6],
  ['로컬 이자카야', '작은 선술집에서 현지 메뉴 도전하기', 8],
  ['스시 오마카세', '한 끼는 제대로 된 미식에 투자하기', 6],
  ['덴덴타운', '게임과 애니메이션 숍 구경하기', 3],
  ['신사이바시 쇼핑', '브랜드와 편집숍을 넉넉하게 둘러보기', 2],
  ['스파월드 온천', '여행 중 하루쯤 온천에서 느긋하게 쉬기', 9],
  ['교토 당일치기', '기온과 사찰을 하루 동안 둘러보기', 7],
  ['가이유칸 수족관', '세계적인 규모의 수족관 관람하기', 1],
  ['아메무라 빈티지', '개성 있는 빈티지 숍 탐색하기', 3],
  ['나카노시마 미술관', '비 오는 날에도 여유롭게 전시 보기', 5],
  ['다코야키 투어', '유명 가게 세 곳을 비교하며 맛보기', 8],
  ['난바 카페 탐방', '일정 사이 감각적인 카페에서 쉬기', 6],
  ['도톤보리 크루즈', '강 위에서 야경과 네온사인 감상하기', 5],
  ['한큐 백화점', '식품관과 일본 브랜드 쇼핑하기', 3],
  ['오사카 야구 관람', '현지 팬들과 경기 분위기 즐기기', 4],
].map(([name, context, defaultScore], index) => ({ name: String(name), context: String(context), defaultScore: Number(defaultScore), image: osakaImages[index % osakaImages.length] }))

export const meetingRounds = [
  { code: 'R0', name: '여행 방향', state: '완료' },
  { code: 'R1', name: '교통', state: '완료' },
  { code: 'R2', name: '숙소', state: '논의 중' },
  { code: 'R3', name: '액티비티', state: '대기' },
  { code: 'R4', name: '식사', state: '대기' },
  { code: 'R5', name: '동선', state: '대기' },
  { code: 'R6', name: '예산', state: '대기' },
]

export const itineraryDays = [
  { day: 'DAY 1', title: '도착과 도톤보리', walk: '3.2km', travel: '78분', items: [['14:20', '간사이공항 도착', 'KE723'], ['16:00', '난바 이동', '라피트 특급 · ¥1,490'], ['17:00', '난바 호텔 체크인', 'H-03 · 3박'], ['19:00', '이자카야 B', '예약 필요 · 10/1까지'], ['21:00', '도톤보리 야경 산책', '자유롭게 1시간']] },
  { day: 'DAY 2', title: '시장과 온천의 하루', walk: '4.0km', travel: '42분', items: [['09:30', '구로몬 시장', '아침 겸 먹거리 투어'], ['12:30', '오사카성 공원', '천수각은 선택 관람'], ['15:30', '스파월드 온천', '지훈 최우선 취향 반영'], ['19:00', '신세카이 쿠시카츠', '웨이팅 약 20분']] },
  { day: 'DAY 3', title: '교토의 오래된 골목', walk: '5.1km', travel: '96분', items: [['08:30', '교토 이동', '한큐선 · ¥410'], ['10:00', '기요미즈데라', '오전 혼잡 피하기'], ['13:00', '니시키 시장', '점심 자유 선택'], ['15:30', '기온 산책', '짐은 호텔 보관'], ['19:30', '난바 복귀', '저녁 자유시간']] },
  { day: 'DAY 4', title: '카페와 아쉬운 작별', walk: '2.4km', travel: '64분', items: [['09:30', '난바 카페', '서연 선호 반영'], ['11:00', '체크아웃', '짐 보관 서비스'], ['12:00', '다코야키 투어', '후보 3곳 중 현장 선택'], ['15:00', '간사이공항 이동', '라피트 특급'], ['18:10', '서울행 출발', 'KE724']] },
]

export const replayMessages = [
  { round: 0, type: 'agent', speaker: '펠리시아의 대리인', text: '숙소보다 음식과 경험에 예산을 조금 더 쓰고 싶어요.' },
  { round: 0, type: 'agent', speaker: '수아의 대리인', text: '일정이 너무 빡빡하거나 숙소를 옮기는 계획은 피하고 싶어요.' },
  { round: 0, type: 'conflict', speaker: '의견이 갈렸어요', text: '펠리시아는 경험에 예산을, 서연은 숙소 위치와 품질에 예산을 우선하고 있어요.' },
  { round: 1, type: 'fact', speaker: '교통 심판', text: '6명 이동 기준, 라피트 패스가 택시 분산 이동보다 1인당 약 2만 원 저렴해요.' },
  { round: 1, type: 'verdict', speaker: '교통 판결', text: '공항 이동은 라피트 특급, 시내 이동은 대중교통을 이용해요.' },
  { round: 2, type: 'agent', speaker: '서연의 대리인', text: '난바역 도보 10분 안쪽이라면 숙소 가격을 조금 더 지불할 수 있어요.' },
  { round: 2, type: 'conflict', speaker: '의견이 갈렸어요', text: '서연은 좋은 위치를, 펠리시아는 숙소 비용 절약을 더 중요하게 생각해요.' },
  { round: 2, type: 'fact', speaker: '숙소 심판', text: 'H-03은 6인 투숙 가능, 난바역 도보 7분, 총 숙박비 126만 원이에요.' },
  { round: 2, type: 'verdict', speaker: '숙소 판결', text: '숙소 이동 없이 난바 H-03에서 3박하는 안을 채택해요.' },
  { round: 2, type: 'chief', speaker: 'Chief 재심', text: '수아의 숙소 이동 불가 조건과 전원 예산을 다시 확인했고, 판결을 유지해요.' },
  { round: 3, type: 'agent', speaker: '민재의 대리인', text: '여행 중 강한 액티비티가 하나는 꼭 필요해요. 유니버설도 고려해 주세요.' },
  { round: 3, type: 'fact', speaker: '액티비티 심판', text: '유니버설은 3명의 만족도를 높이지만 수아와 지훈의 페이스 조건을 크게 벗어나요.' },
  { round: 3, type: 'verdict', speaker: '액티비티 판결', text: '유니버설 대신 스파월드와 교토 당일치기를 일정에 넣어요.' },
  { round: 4, type: 'verdict', speaker: '식사 판결', text: '펠리시아와 예린의 미식 선호, 지훈의 이자카야 선호를 반영해 이자카야 B를 선택해요.' },
  { round: 5, type: 'chief', speaker: 'Chief 재심', text: '숙소를 옮기지 않는 방사형 동선으로 수정하고, 자유시간을 한 번 더 확보해요.' },
  { round: 6, type: 'fact', speaker: '예산 심판', text: '예상 총액은 1인 78만 원이며, 모든 멤버의 상한 예산 이내예요.' },
  { round: 6, type: 'verdict', speaker: '최종 판결', text: '평균 만족도 7.7, 최저 만족도 7.2로 최종 계획을 확정해요.' },
]

export const reservations = [
  ['항공', '대한항공 KE723 / KE724', '₩310,000', '예약 완료'],
  ['숙소', '난바 호텔 H-03', '₩210,000', '예약 필요'],
  ['식당', '이자카야 B', '약 ₩38,000', '10월 1일까지'],
  ['티켓', '스파월드 온천', '약 ₩18,000', '현장 구매 가능'],
]

export const budget = [
  ['항공', 310000], ['숙소', 210000], ['식비', 140000], ['교통', 60000], ['액티비티', 60000],
]
