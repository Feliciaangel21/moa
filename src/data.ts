export type Traveler = {
  name: string
  initials: string
  color: string
  pale: string
  progress: number
}

export type Destination = {
  id: number
  name: string
  area: string
  tags: string[]
  duration: string
  cost: string
  distance: string
  image: string
}

export type Stop = {
  id: number
  time: string
  title: string
  meta: string
  cost: string
  match: number
  color: string
  locked?: boolean
}

export const travelers: Traveler[] = [
  { name: '펠리시아', initials: '펠', color: '#F2714B', pale: '#FCE0D5', progress: 20 },
  { name: '민지', initials: '민', color: '#6C9E79', pale: '#DCEBDD', progress: 20 },
  { name: '알렉스', initials: '알', color: '#8B78B8', pale: '#E8E0F2', progress: 14 },
  { name: '준호', initials: '준', color: '#D99B3D', pale: '#F8E9C8', progress: 20 },
]

export const destinations: Destination[] = [
  { id: 1, name: '북한산 국립공원', area: '은평', tags: ['NATURE', '하이킹'], duration: '3–4시간', cost: '₩', distance: '8.4km', image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=88' },
  { id: 2, name: '서울숲', area: '성수', tags: ['NATURE', '피크닉'], duration: '1–2시간', cost: '무료', distance: '3.2km', image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1200&q=88' },
  { id: 3, name: '익선동 한옥마을', area: '종로', tags: ['CULTURE', '카페'], duration: '2시간', cost: '₩₩', distance: '2.1km', image: 'https://images.unsplash.com/photo-1538485399081-7c897b3f0c29?auto=format&fit=crop&w=1200&q=88' },
  { id: 4, name: '광장시장', area: '종로', tags: ['FOOD', '로컬'], duration: '1–2시간', cost: '₩', distance: '1.6km', image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=1200&q=88' },
  { id: 5, name: '리움미술관', area: '한남', tags: ['CULTURE', '디자인'], duration: '2시간', cost: '₩₩', distance: '4.8km', image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=88' },
]

export const initialStops: Stop[] = [
  { id: 1, time: '10:00', title: '서울숲', meta: '자연 · 1시간 30분', cost: '무료', match: 91, color: '#6C9E79' },
  { id: 2, time: '12:00', title: '할머니의 비빔밥', meta: '로컬 맛집 · 1시간', cost: '₩18,000', match: 94, color: '#F2714B' },
  { id: 3, time: '14:00', title: '대림창고 카페', meta: '카페 · 1시간', cost: '₩8,000', match: 86, color: '#D99B3D' },
  { id: 4, time: '15:30', title: '그라운드시소 성수', meta: '전시 · 1시간 30분', cost: '₩12,000', match: 84, color: '#8B78B8' },
  { id: 5, time: '18:30', title: '성수 국수바', meta: '저녁 · 1시간 30분', cost: '₩22,000', match: 90, color: '#F2714B' },
]

export const routePoints = [
  { x: 27, y: 24, label: '서울숲' },
  { x: 49, y: 38, label: '점심' },
  { x: 59, y: 55, label: '카페' },
  { x: 39, y: 70, label: '전시' },
  { x: 69, y: 80, label: '저녁' },
]
