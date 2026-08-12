import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Backpack,
  Buildings,
  CalendarBlank,
  CaretDown,
  Check,
  CheckCircle,
  Clock,
  Coffee,
  Compass,
  CurrencyKrw,
  DotsThree,
  Footprints,
  ForkKnife,
  Heart,
  Info,
  Leaf,
  Lock,
  LockOpen,
  MagicWand,
  MapPin,
  Mountains,
  Path,
  PencilSimple,
  Plus,
  ShareNetwork,
  Sparkle,
  Star,
  Storefront,
  SuitcaseRolling,
  Trash,
  TrendDown,
  TrendUp,
  UsersThree,
  X,
} from '@phosphor-icons/react'
import { destinations, initialStops, routePoints, travelers, type Destination, type Stop } from './data'

type Stage = 'landing' | 'create' | 'lobby' | 'swipe' | 'dna' | 'compatibility' | 'conflict' | 'planning' | 'itinerary'
type SwipeAction = 'nope' | 'like' | 'must' | 'been'

const stageOrder: Stage[] = ['landing', 'create', 'lobby', 'swipe', 'dna', 'compatibility', 'conflict', 'planning', 'itinerary']

const imageFallback = (event: React.SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.src = '/assets/moa-mascot.png'
  event.currentTarget.classList.add('image-fallback')
}

function App() {
  const [stage, setStage] = useState<Stage>(() => (localStorage.getItem('moa-stage') as Stage) || 'landing')
  const [joinMode, setJoinMode] = useState(false)
  const [swipeIndex, setSwipeIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState(0)
  const [scores, setScores] = useState({ nature: 76, food: 72, culture: 62, adventure: 58, shopping: 42 })
  const [stops, setStops] = useState<Stop[]>(initialStops)
  const [reason, setReason] = useState<Stop | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [budget, setBudget] = useState(80000)
  const [walking, setWalking] = useState<'여유롭게' | '적당히'>('적당히')
  const [toast, setToast] = useState('')

  useEffect(() => localStorage.setItem('moa-stage', stage), [stage])
  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 2400)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const go = (next: Stage) => {
    setStage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const swipe = (action: SwipeAction) => {
    if (swipeIndex >= destinations.length) return
    const destination = destinations[swipeIndex]
    const positive = action === 'like' || action === 'must'
    setSwipeDirection(action === 'nope' ? -1 : 1)
    if (positive) {
      setScores((old) => ({
        ...old,
        nature: Math.min(96, old.nature + (destination.tags.includes('NATURE') ? 4 : 1)),
        food: Math.min(94, old.food + (destination.tags.includes('FOOD') ? 5 : 1)),
        culture: Math.min(90, old.culture + (destination.tags.includes('CULTURE') ? 5 : 1)),
        adventure: Math.min(88, old.adventure + (destination.tags.includes('하이킹') ? 6 : 1)),
      }))
    }
    window.setTimeout(() => {
      setSwipeIndex((old) => old + 1)
      setSwipeDirection(0)
    }, 180)
  }

  const replaceStop = (id: number) => {
    setStops((items) => items.map((stop) => stop.id === id ? { ...stop, title: '성수 도예 공방', meta: '체험 · 1시간 15분', cost: '₩16,000', match: 88, color: '#D99B3D' } : stop))
    setReason(null)
    setToast('장소를 바꾸고 점수를 다시 계산했어요')
  }

  return (
    <div className="app-shell">
      {stage !== 'landing' && stage !== 'create' && <Header stage={stage} go={go} />}
      <AnimatePresence mode="wait">
        <motion.main
          key={stage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          {stage === 'landing' && <Landing onCreate={() => go('create')} onJoin={() => { setJoinMode(true); go('create') }} />}
          {stage === 'create' && <CreateTrip joinMode={joinMode} setJoinMode={setJoinMode} back={() => go('landing')} submit={() => go('lobby')} />}
          {stage === 'lobby' && <Lobby next={() => go('swipe')} />}
          {stage === 'swipe' && <SwipeScreen index={swipeIndex} direction={swipeDirection} scores={scores} swipe={swipe} next={() => go('dna')} reset={() => setSwipeIndex(0)} />}
          {stage === 'dna' && <TravelDNA scores={scores} next={() => go('compatibility')} />}
          {stage === 'compatibility' && <Compatibility next={() => go('conflict')} />}
          {stage === 'conflict' && <Conflict next={() => go('planning')} />}
          {stage === 'planning' && <Planning next={() => go('itinerary')} />}
          {stage === 'itinerary' && (
            <Itinerary
              stops={stops}
              budget={budget}
              walking={walking}
              openReason={setReason}
              toggleLock={(id) => setStops((items) => items.map((s) => s.id === id ? { ...s, locked: !s.locked } : s))}
              remove={(id) => { setStops((items) => items.filter((s) => s.id !== id)); setToast('장소를 빼고 동선을 다시 짰어요') }}
              openEditor={() => setEditorOpen(true)}
            />
          )}
        </motion.main>
      </AnimatePresence>

      <AnimatePresence>{reason && <ReasonModal stop={reason} close={() => setReason(null)} replace={() => replaceStop(reason.id)} />}</AnimatePresence>
      <AnimatePresence>{editorOpen && <PlanEditor budget={budget} setBudget={setBudget} walking={walking} setWalking={setWalking} close={() => setEditorOpen(false)} apply={() => { setEditorOpen(false); setToast('취향을 반영해 일정을 다시 맞췄어요') }} />}</AnimatePresence>
      <AnimatePresence>{toast && <motion.div className="toast" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}><CheckCircle weight="fill" />{toast}</motion.div>}</AnimatePresence>
    </div>
  )
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`logo ${compact ? 'compact' : ''}`}>
      <span className="logo-mark"><img src="/assets/moa-mascot.png" alt="모아 탐험가 캐릭터" /></span>
      <span>모아</span>
    </div>
  )
}

function Header({ stage, go }: { stage: Stage; go: (stage: Stage) => void }) {
  const nav = [
    { label: '여행', icon: SuitcaseRolling, target: 'lobby' as Stage, active: ['lobby'] },
    { label: '취향 찾기', icon: Compass, target: 'swipe' as Stage, active: ['swipe', 'dna'] },
    { label: '우리 그룹', icon: UsersThree, target: 'compatibility' as Stage, active: ['compatibility', 'conflict'] },
    { label: '일정', icon: Path, target: 'itinerary' as Stage, active: ['planning', 'itinerary'] },
  ]
  return (
    <header className="topbar">
      <button className="brand-button" onClick={() => go('landing')} aria-label="모아 홈"><Logo compact /></button>
      <nav className="main-nav" aria-label="주요 메뉴">
        {nav.map((item) => <button key={item.label} className={item.active.includes(stage) ? 'active' : ''} onClick={() => go(item.target)}><item.icon size={19} weight={item.active.includes(stage) ? 'fill' : 'regular'} /><span>{item.label}</span></button>)}
      </nav>
      <div className="trip-mini">
        <div><strong>서울 주말여행</strong><span>5월 16–18일</span></div>
        <AvatarStack />
      </div>
    </header>
  )
}

function AvatarStack() {
  return <div className="avatar-stack" aria-label="여행자 4명">{travelers.map((t) => <span key={t.name} style={{ background: t.color }} title={t.name}>{t.initials.slice(0, 1)}</span>)}</div>
}

function Landing({ onCreate, onJoin }: { onCreate: () => void; onJoin: () => void }) {
  return (
    <section className="landing">
      <div className="landing-nav"><Logo /><div><button className="text-button" onClick={onJoin}>초대코드 입력</button><button className="button small" onClick={onCreate}>여행 시작하기 <ArrowUpRight /></button></div></div>
      <div className="hero-grid container">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkle weight="fill" /> 모두의 마음을 모아, MOA</div>
          <h1>우리 같이<br /><em>여행할까요?</em></h1>
          <p>좋아하는 곳을 슥슥 넘겨보세요. 모아가 서로 다른 취향을 배우고, 모두가 즐거운 여행을 만들어드려요.</p>
          <div className="hero-actions"><button className="button large" onClick={onCreate}>여행 만들기 <ArrowRight /></button><button className="button secondary large" onClick={onJoin}>초대코드로 참여</button></div>
          <div className="social-proof"><AvatarStack /><span><strong>취향은 달라도,</strong><br />추억은 우리 모두의 것!</span></div>
        </div>
        <div className="hero-visual">
          <div className="sun-disc" />
          <div className="hero-card card-one"><span className="mini-icon coral"><Heart weight="fill" /></span><div><small>펠리시아 PICK</small><strong>풍경 좋은 자연</strong></div></div>
          <div className="hero-card card-two"><span className="mini-icon sage"><Check weight="bold" /></span><div><small>GROUP MATCH</small><strong>우리 궁합 91%</strong></div></div>
          <img className="hero-mascot" src="/assets/moa-mascot.png" alt="즐거운 여행을 도와주는 모아 캐릭터" />
          <div className="location-pill"><MapPin weight="fill" /><span><strong>서울숲</strong><small>우리에게 딱 맞는 곳</small></span></div>
        </div>
      </div>
      <div className="landing-footer container"><span>결정 못 하는 여행 단톡방을 위해</span><div><span><Compass /> DISCOVER</span><span><Heart /> TOGETHER</span><span><Path /> LET’S GO</span></div></div>
    </section>
  )
}

function CreateTrip({ joinMode, setJoinMode, back, submit }: { joinMode: boolean; setJoinMode: (value: boolean) => void; back: () => void; submit: () => void }) {
  return (
    <section className="form-page">
      <div className="form-top"><button className="icon-button" onClick={back}><ArrowLeft /></button><Logo /><span /></div>
      <div className="form-layout container narrow">
        <div className="form-intro"><div className="step-badge">1</div><p className="kicker">LET’S GO SOMEWHERE</p><h2>{joinMode ? '친구들이 기다리고 있어요.' : '어떤 여행을 꿈꾸나요?'}</h2><p>{joinMode ? '단톡방에서 받은 초대코드를 입력해 주세요.' : '우선 꼭 필요한 것만 알려주세요. 각자의 취향은 다음 단계에서 천천히 알아볼게요.'}</p></div>
        <div className="form-card">
          <div className="segmented"><button className={!joinMode ? 'active' : ''} onClick={() => setJoinMode(false)}>여행 만들기</button><button className={joinMode ? 'active' : ''} onClick={() => setJoinMode(true)}>여행 참여하기</button></div>
          {joinMode ? (
            <><label>초대코드<input defaultValue="SEOUL-24" /></label><div className="invite-preview"><span className="mini-icon sage"><MapPin weight="fill" /></span><div><strong>서울 주말여행</strong><small>5월 16–18일 · 친구 3명이 기다리는 중</small></div><AvatarStack /></div></>
          ) : (
            <>
              <label>어디로 떠나나요?<div className="input-with-icon"><MapPin /><input defaultValue="서울, 대한민국" /></div></label>
              <div className="form-row"><label>여행 날짜<div className="input-with-icon"><CalendarBlank /><input defaultValue="5월 16일 – 18일" /></div></label><label>함께 가는 사람<div className="input-with-icon"><UsersThree /><input defaultValue="4명" /></div></label></div>
              <label>1인 하루 예상 예산<div className="input-with-icon"><CurrencyKrw /><input defaultValue="₩80,000" /></div></label>
              <label>어떤 여행을 원하나요?<div className="chip-select"><button className="selected">골고루 즐기기</button><button>맛집 중심</button><button>느긋하게</button><button>모험 가득</button></div></label>
            </>
          )}
          <button className="button full large" onClick={submit}>{joinMode ? '서울 주말여행 참여하기' : '우리 여행 만들기'} <ArrowRight /></button>
        </div>
      </div>
    </section>
  )
}

function Lobby({ next }: { next: () => void }) {
  return (
    <section className="page container lobby-page">
      <div className="page-heading split"><div><p className="kicker">OUR TRIP</p><h2>서울 주말여행</h2><p><CalendarBlank /> 5월 16–18일 <span>·</span> <UsersThree /> 여행자 4명</p></div><button className="button secondary"><ShareNetwork /> 친구 초대</button></div>
      <div className="code-banner"><div><small>GROUP CODE</small><strong>SEOUL-24</strong><button aria-label="초대코드 복사"><Check /> 복사했어요</button></div><img src="/assets/moa-mascot.png" alt="모아 캐릭터" /></div>
      <div className="section-title"><div><h3>이제 거의 다 모였어요!</h3><p>취향 카드는 각자 넘겨주세요. 몰래보기 금지!</p></div><span className="status-pill"><span /> 4명 중 3명 완료</span></div>
      <div className="traveler-grid">
        {travelers.map((t, index) => <div className="traveler-card" key={t.name}><div className="traveler-avatar" style={{ background: t.pale, color: t.color }}>{t.initials}</div><div className="traveler-name"><strong>{t.name}{index === 0 && <span>나</span>}</strong><small>{t.progress === 20 ? '취향 찾기 완료' : `장소 ${t.progress}/20`}</small></div>{t.progress === 20 ? <CheckCircle className="complete" weight="fill" /> : <div className="ring-progress">70%</div>}<div className="progress-track"><span style={{ width: `${t.progress / 20 * 100}%`, background: t.color }} /></div></div>)}
      </div>
      <div className="ready-panel"><div className="ready-copy"><span className="mini-icon coral"><Sparkle weight="fill" /></span><div><strong>내 취향 찾기는 끝났어요</strong><p>알렉스가 마저 고르는 동안, 우리 그룹의 결과를 먼저 만나볼까요?</p></div></div><button className="button large" onClick={next}>취향 여행 시작 <ArrowRight /></button></div>
    </section>
  )
}

function SwipeScreen({ index, direction, scores, swipe, next, reset }: { index: number; direction: number; scores: Record<string, number>; swipe: (action: SwipeAction) => void; next: () => void; reset: () => void }) {
  const destination = destinations[index]
  if (!destination) return (
    <section className="page container swipe-complete">
      <div className="complete-orbit"><span><Check weight="bold" /></span><img src="/assets/moa-mascot.png" alt="신나게 축하하는 모아 캐릭터" /></div>
      <p className="kicker">NICE TASTE!</p><h2>역시, 취향이 멋진데요?</h2><p>이제 모아가 나만의 여행 프로필을 만들 수 있어요.</p>
      <button className="button large" onClick={next}>내 Travel DNA 보기 <ArrowRight /></button><button className="text-button" onClick={reset}>다시 넘겨보기</button>
    </section>
  )
  return (
    <section className="page container swipe-page">
      <div className="swipe-header"><div><p className="kicker">DISCOVER</p><h2>여기, 함께 가볼까요?</h2></div><div className="count"><strong>{15 + index}</strong><span>/ 20</span><div><i style={{ width: `${(15 + index) / 20 * 100}%` }} /></div></div></div>
      <div className="swipe-layout">
        <div className="deck-wrap">
          {destinations[index + 1] && <div className="destination-card next-card"><img src={destinations[index + 1].image} alt="" onError={imageFallback} /></div>}
          <AnimatePresence>
            <motion.div
              key={destination.id}
              className="destination-card"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(_, info) => { if (info.offset.x > 90) swipe('like'); else if (info.offset.x < -90) swipe('nope') }}
              initial={{ scale: .97, opacity: 0 }}
              animate={direction ? { x: direction * 520, rotate: direction * 15, opacity: 0 } : { x: 0, rotate: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            >
              <img src={destination.image} alt={destination.name} onError={imageFallback} />
              <div className="photo-overlay" />
              <button className="card-menu" aria-label="더 알아보기"><DotsThree weight="bold" /></button>
              <div className="destination-copy"><div className="tag-row">{destination.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><p>{destination.area}</p><h3>{destination.name}</h3><div className="facts"><span><Clock /> {destination.duration}</span><span><CurrencyKrw /> {destination.cost}</span><span><MapPin /> {destination.distance}</span></div></div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="swipe-side">
          <div className="dna-mini"><div className="section-title"><div><p className="kicker">LIVE PROFILE</p><h3>나의 Travel DNA</h3></div><Sparkle weight="fill" /></div>{Object.entries(scores).slice(0, 4).map(([label, score], i) => <div className="dna-row" key={label}><span>{({ nature: '자연', food: '맛집', culture: '문화', adventure: '모험', shopping: '쇼핑' } as Record<string, string>)[label] || label}</span><div><i style={{ width: `${score}%`, background: ['#6C9E79', '#F2714B', '#8B78B8', '#D99B3D'][i] }} /></div>{i < 2 ? <TrendUp className="up" /> : <span className="steady">→</span>}</div>)}<p>카드를 넘길 때마다 업데이트 중</p></div>
          <div className="swipe-tip"><span><Path /></span><div><strong>첫 느낌대로 골라보세요</strong><p>정답은 없어요. 고민하지 않은 선택이 가장 정확해요.</p></div></div>
        </div>
      </div>
      <div className="swipe-controls"><button className="round-action been" onClick={() => swipe('been')}><ArrowLeft /><span>가봤어요</span></button><button className="round-action nope" onClick={() => swipe('nope')}><X weight="bold" /><span>아니에요</span></button><button className="round-action like" onClick={() => swipe('like')}><Heart weight="fill" /><span>좋아요</span></button><button className="round-action must" onClick={() => swipe('must')}><Star weight="fill" /><span>꼭 갈래요</span></button></div>
    </section>
  )
}

function TravelDNA({ scores, next }: { scores: Record<string, number>; next: () => void }) {
  const profile = [
    { label: '자연', value: Math.max(92, scores.nature), color: '#6C9E79', icon: Leaf },
    { label: '맛집', value: Math.max(84, scores.food), color: '#F2714B', icon: ForkKnife },
    { label: '모험', value: Math.max(71, scores.adventure), color: '#D99B3D', icon: Mountains },
    { label: '문화', value: Math.max(68, scores.culture), color: '#8B78B8', icon: Buildings },
    { label: '쇼핑', value: 35, color: '#B8AFA3', icon: Storefront },
  ]
  return (
    <section className="page container dna-page">
      <div className="center-heading"><div className="eyebrow"><Sparkle weight="fill" /> TRAVEL DNA 완성!</div><h2>나의 여행 취향을<br />이만큼 알게 됐어요.</h2><p>내가 고른 장소들이 이렇게 하나의 취향이 되었어요.</p></div>
      <div className="dna-dashboard">
        <div className="radar-card">
          <div className="radar-visual"><div className="radar-ring r1" /><div className="radar-ring r2" /><div className="radar-ring r3" /><div className="radar-shape" /><div className="radar-center"><span>펠</span></div><span className="radar-label top">자연</span><span className="radar-label right">맛집</span><span className="radar-label bottom-right">모험</span><span className="radar-label bottom-left">쇼핑</span><span className="radar-label left">문화</span></div>
        </div>
        <div className="profile-bars">{profile.map((item) => <div className="profile-bar" key={item.label}><span className="profile-icon" style={{ color: item.color, background: `${item.color}18` }}><item.icon weight="fill" /></span><div><div><strong>{item.label}</strong><b>{item.value}%</b></div><span><i style={{ width: `${item.value}%`, background: item.color }} /></span></div></div>)}</div>
      </div>
      <div className="profile-summary"><span className="mascot-bubble"><img src="/assets/moa-mascot.png" alt="모아 캐릭터" /></span><div><p>“새로운 <strong>야외 경험</strong>과 <strong>로컬 맛집</strong>을 좋아하고, 비싼 쇼핑 위주의 활동은 덜 중요하게 생각해요.”</p><div className="trait-row"><span>예산 민감도 <b>보통</b></span><span>걷기 체력 <b>높음</b></span><span>새로운 장소 <b>82%</b></span></div></div></div>
      <div className="page-actions"><button className="button secondary"><PencilSimple /> 취향 조정하기</button><button className="button large" onClick={next}>딱 맞아요 <Check /></button></div>
    </section>
  )
}

function Compatibility({ next }: { next: () => void }) {
  const agreements = [{ name: '로컬 맛집', value: 94, icon: ForkKnife }, { name: '감성 카페', value: 86, icon: Coffee }, { name: '풍경 좋은 곳', value: 81, icon: Mountains }]
  return (
    <section className="page container compatibility-page">
      <div className="compat-hero"><div><p className="kicker">GROUP PROFILE</p><h2>우리 그룹의<br /><em>여행 성격은?</em></h2><p>서로 달라도, 생각보다 통하는 게 많아요.</p></div><div className="compat-score"><svg viewBox="0 0 180 180"><circle cx="90" cy="90" r="73" /><circle className="score-line" cx="90" cy="90" r="73" /></svg><div><strong>87%</strong><span>찰떡궁합</span></div></div></div>
      <div className="compat-grid">
        <div className="agreement-card"><div className="section-title"><div><span className="mini-icon sage"><Check weight="bold" /></span><h3>우리 모두 좋아해요</h3></div></div>{agreements.map((a) => <div className="agreement" key={a.name}><span className="agreement-icon"><a.icon weight="fill" /></span><div><strong>{a.name}</strong><span><i style={{ width: `${a.value}%` }} /></span></div><b>{a.value}%</b></div>)}</div>
        <div className="group-vibe"><p className="kicker">OUR GROUP VIBE</p><div className="vibe-tags"><span>맛집 탐험대</span><span>느긋하게</span><span>사진은 필수</span><span>로컬 우선</span></div><div className="vibe-illustration"><img src="/assets/moa-mascot.png" alt="모아 캐릭터" /><div><strong>“맛있는 것, 예쁜 곳,<br />그리고 6시 기상은 NO!”</strong><small>— 모아의 한 줄 요약</small></div></div></div>
      </div>
      <div className="conflicts-block"><div className="section-title"><div><p className="kicker">NEEDS A LITTLE BALANCE</p><h3>취향 차이 2개 발견</h3></div><span>달라도 괜찮아요!</span></div><div className="conflict-grid"><ConflictPreview title="하이킹" icon={Mountains} note="펠리시아는 도전을 좋아하지만, 민지는 짧게 걷는 걸 선호해요." values={[96, 18, 70, 82]} /><ConflictPreview title="프리미엄 다이닝" icon={ForkKnife} note="알렉스는 한 끼쯤 플렉스, 준호는 하루 예산을 지키고 싶어 해요." values={[42, 66, 92, 28]} /></div></div>
      <div className="page-actions end"><button className="button large" onClick={next}>우리의 최적 타협점 찾기 <ArrowRight /></button></div>
    </section>
  )
}

function ConflictPreview({ title, icon: Icon, note, values }: { title: string; icon: typeof Mountains; note: string; values: number[] }) {
  return <div className="conflict-preview"><div className="conflict-head"><span><Icon weight="fill" /></span><div><h4>{title}</h4><p>{note}</p></div></div><div className="member-bars">{travelers.map((t, i) => <div key={t.name}><span>{t.name}</span><div><i style={{ width: `${values[i]}%`, background: t.color }} /></div><b>{values[i]}</b></div>)}</div></div>
}

function Conflict({ next }: { next: () => void }) {
  const [choice, setChoice] = useState('')
  return (
    <section className="page container question-page">
      <div className="question-progress"><span className="active" /><span /></div>
      <div className="question-layout">
        <div className="question-visual"><div className="trail-scene"><Mountains weight="fill" /><div className="trail-line" /><span className="person-dot felicia">펠</span><span className="person-dot minji">민</span></div><div className="versus-card"><div><span style={{ background: travelers[0].color }}>펠</span><p><strong>펠리시아</strong><small>길고 멋진 하이킹</small></p></div><em>MIDDLE GROUND</em><div><span style={{ background: travelers[1].color }}>민</span><p><strong>민지</strong><small>짧고 편한 산책</small></p></div></div></div>
        <div className="question-copy"><div className="eyebrow"><Sparkle weight="fill" /> 잠깐! 하나만 물어볼게요</div><h2><em>60분 이내</em>의 짧은 풍경길이라면 모두 괜찮을까요?</h2><p>서로 다른 취향을 발견했어요. 펠리시아의 자연 시간을 지키면서도 민지의 걷기 한계를 넘지 않도록 도와주세요.</p><div className="choice-list"><button className={choice === 'yes' ? 'selected' : ''} onClick={() => setChoice('yes')}><span><Check /></span><div><strong>좋아요!</strong><small>짧고 풍경 좋은 길을 일정에 넣어주세요</small></div></button><button className={choice === 'another' ? 'selected' : ''} onClick={() => setChoice('another')}><span><Compass /></span><div><strong>다른 활동이 좋아요</strong><small>걷지 않아도 즐길 수 있는 자연 장소를 찾아주세요</small></div></button><button className={choice === 'ai' ? 'selected' : ''} onClick={() => setChoice('ai')}><span><MagicWand /></span><div><strong>모아에게 맡길래요</strong><small>우리 취향에 가장 공평한 선택을 해주세요</small></div></button></div><button className="button full large" disabled={!choice} onClick={next}>일정 만들러 가기 <ArrowRight /></button></div>
      </div>
    </section>
  )
}

function Planning({ next }: { next: () => void }) {
  const [progress, setProgress] = useState(0)
  const steps = ['4명의 여행 취향 학습 완료', '공통 관심사 18개 발견', '취향 차이 2개 조율', '1일 ₩80,000 예산 맞추기', '불필요한 이동 줄이기', '모두에게 공평한지 확인']
  useEffect(() => {
    const timer = window.setInterval(() => setProgress((old) => Math.min(steps.length, old + 1)), 650)
    const finish = window.setTimeout(next, 5600)
    return () => { window.clearInterval(timer); window.clearTimeout(finish) }
  }, [])
  return (
    <section className="planning-page">
      <div className="planning-orbit"><div className="orbit o1" /><div className="orbit o2" /><div className="orbit o3" /><span className="orbit-dot d1" /><span className="orbit-dot d2" /><span className="orbit-dot d3" /><div className="planning-mascot"><img src="/assets/moa-mascot.png" alt="우리 일정을 만들고 있는 모아" /></div></div>
      <p className="kicker">MOA IS THINKING</p><h2>우리에게 딱 맞는 여행을<br />만들고 있어요…</h2><p>모두가 좋아하는 것과 현실적인 조건을 꼼꼼히 맞추는 중!</p>
      <div className="planning-steps">{steps.map((step, i) => <motion.div key={step} initial={{ opacity: .35 }} animate={i < progress ? { opacity: 1, x: 0 } : { opacity: .35 }}><span className={i < progress ? 'done' : ''}>{i < progress ? <Check weight="bold" /> : i + 1}</span>{step}{i === progress && <i />}</motion.div>)}</div>
      {progress >= steps.length && <motion.div className="score-reveal" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}><span><strong>89%</strong>그룹 만족도</span><span><strong>94%</strong>예산 적합도</span><span><strong>93%</strong>공평함</span></motion.div>}
    </section>
  )
}

function Itinerary({ stops, budget, walking, openReason, toggleLock, remove, openEditor }: { stops: Stop[]; budget: number; walking: string; openReason: (stop: Stop) => void; toggleLock: (id: number) => void; remove: (id: number) => void; openEditor: () => void }) {
  const satisfaction = stops.length < 5 ? 87 : 89
  return (
    <section className="itinerary-page">
      <div className="itinerary-top container"><div><p className="kicker">FAIR-TO-EVERYONE PLAN</p><h2>서울 주말여행</h2><p>5월 16–18일 · 여행자 4명 · <span>여행 준비 완료!</span></p></div><div className="itinerary-actions"><button className="button secondary" onClick={openEditor}><PencilSimple /> 일정 다듬기</button><button className="button"><ShareNetwork /> 여행 공유</button></div></div>
      <div className="score-strip container"><ScoreMini value={satisfaction} label="그룹 만족도" color="#F2714B" /><ScoreMini value={Math.min(98, 94 + (80000 - budget) / 5000)} label="예산 적합도" color="#6C9E79" /><ScoreMini value={walking === '여유롭게' ? 92 : 87} label="이동 효율" color="#D99B3D" /><ScoreMini value={93} label="공평함" color="#8B78B8" /></div>
      <div className="plan-layout">
        <MapPanel stops={stops} />
        <div className="timeline-panel">
          <div className="day-tabs"><button className="active">DAY 1 <span>성수</span></button><button>DAY 2 <span>종로</span></button><button>DAY 3 <span>한남</span></button></div>
          <div className="day-summary"><div><p className="kicker">5월 16일 금요일</p><h3>천천히 즐기는 성수의 하루</h3></div><div><span><Path /> 이동 38분</span><span><Footprints /> 도보 {walking === '여유롭게' ? '3.2' : '4.1'}km</span><span><CurrencyKrw /> ₩{Math.min(budget, 60000).toLocaleString()}</span></div></div>
          <div className="timeline">{stops.map((stop, i) => <div className="timeline-stop" key={stop.id}><div className="time-col"><strong>{stop.time}</strong>{i < stops.length - 1 && <span />}</div><div className="stop-dot" style={{ borderColor: stop.color }}><i style={{ background: stop.color }} /></div><div className="stop-card"><div className="stop-main"><div><span className="match-pill" style={{ color: stop.color, background: `${stop.color}15` }}>MATCH {stop.match}%</span><h4>{stop.title}</h4><p>{stop.meta} <span>·</span> {stop.cost}</p></div><div className="stop-menu"><button title={stop.locked ? '고정 해제' : '장소 고정'} onClick={() => toggleLock(stop.id)}>{stop.locked ? <Lock weight="fill" /> : <LockOpen />}</button><button title="일정에서 빼기" onClick={() => remove(stop.id)} disabled={stop.locked}><Trash /></button></div></div><button className="why-button" onClick={() => openReason(stop)}><Sparkle weight="fill" /> 왜 이곳인가요? <ArrowRight /></button></div></div>)}</div>
          <div className="fairness-section"><div className="fairness-head"><div><p className="kicker">FAIR BY DESIGN</p><h3>누구도 소외되지 않도록.</h3><p>모든 여행자의 예상 만족도가 80% 이상이에요.</p></div><div className="fair-ring"><strong>93%</strong><span>공평함</span></div></div><div className="satisfaction-list">{travelers.map((t, i) => <div key={t.name}><span className="small-avatar" style={{ background: t.color }}>{t.initials[0]}</span><strong>{t.name}</strong><div><i style={{ width: `${[91, 84, 88, 86][i]}%`, background: t.color }} /></div><b>{[91, 84, 88, 86][i]}%</b></div>)}</div></div>
          <Compromises />
        </div>
      </div>
    </section>
  )
}

function ScoreMini({ value, label, color }: { value: number; label: string; color: string }) {
  return <div className="score-mini"><span style={{ background: `${color}18`, color }}><TrendUp /></span><div><strong>{Math.round(value)}%</strong><small>{label}</small></div></div>
}

function MapPanel({ stops }: { stops: Stop[] }) {
  return (
    <div className="map-panel"><div className="fake-map"><div className="river" /><div className="road r-a" /><div className="road r-b" /><div className="road r-c" /><span className="district d-a">성수동</span><span className="district d-b">서울숲</span><svg className="route-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M27 24 C35 30 44 30 49 38 S58 49 59 55 S45 65 39 70 S60 76 69 80" /></svg>{routePoints.slice(0, stops.length).map((point, i) => <button className="map-pin" key={point.label} style={{ left: `${point.x}%`, top: `${point.y}%`, background: stops[i]?.color || '#F2714B' }}><span>{i + 1}</span><small>{stops[i]?.title || point.label}</small></button>)}<div className="map-controls"><button>+</button><button>−</button></div><div className="map-key"><MapPin weight="fill" /> 장소 5곳 · 이동 38분</div></div></div>
  )
}

function Compromises() {
  const items = [
    { name: '펠리시아', text: '첫 번째로 고른 산길은 민지의 걷기 한계를 넘어서, 더 짧고 풍경 좋은 길로 바꿨어요.', icon: Mountains },
    { name: '알렉스', text: '모두가 하루 예산을 지킬 수 있도록 프리미엄 식당 한 곳을 바꿨어요.', icon: ForkKnife },
    { name: '민지', text: '이동 시간을 늘리지 않으면서 가장 좋아하는 취향을 채워줄 서울숲 근처 카페를 넣었어요.', icon: Coffee },
  ]
  return <div className="compromise-section"><div className="section-title"><div><p className="kicker">THE MIDDLE GROUND</p><h3>우리의 중간 지점을 찾은 방법</h3></div><Info /></div><div className="compromise-list">{items.map((item, i) => <div key={item.name}><span style={{ color: travelers[i].color, background: travelers[i].pale }}><item.icon weight="fill" /></span><div><strong>{item.name}을 위해</strong><p>{item.text}</p></div></div>)}</div></div>
}

function ReasonModal({ stop, close, replace }: { stop: Stop; close: () => void; replace: () => void }) {
  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={close}><motion.div className="reason-modal" initial={{ opacity: 0, y: 25, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16 }} onMouseDown={(e) => e.stopPropagation()}><button className="modal-close" onClick={close}><X /></button><div className="reason-top"><span><Sparkle weight="fill" /></span><p className="kicker">WHY THIS PLACE?</p><h3>{stop.title}</h3><p><strong>펠리시아, 알렉스, 준호</strong>의 취향과 아주 잘 맞아요.</p></div><div className="reason-list"><div><Check weight="bold" /><span>여행자 <strong>4명 중 3명</strong>이 이런 활동을 좋아해요</span></div><div><Check weight="bold" /><span>하루 <strong>₩80,000 예산</strong>에 쏙 들어와요</span></div><div><Check weight="bold" /><span><strong>민지의 걷기 한계</strong>를 넘지 않아요</span></div><div><Check weight="bold" /><span>다음 장소까지 단 <strong>8분</strong>이에요</span></div></div><div className="reason-score"><div><strong>{stop.match}%</strong><span>GROUP MATCH</span></div><div className="faces"><AvatarStack /></div></div><div className="modal-actions"><button className="button secondary" onClick={replace}>다른 곳 보기</button><button className="button" onClick={close}>여기로 할게요 <Check /></button></div></motion.div></motion.div>
}

function PlanEditor({ budget, setBudget, walking, setWalking, close, apply }: { budget: number; setBudget: (n: number) => void; walking: string; setWalking: (v: '여유롭게' | '적당히') => void; close: () => void; apply: () => void }) {
  return <motion.div className="modal-backdrop align-right" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={close}><motion.aside className="plan-editor" initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} onMouseDown={(e) => e.stopPropagation()}><div className="editor-head"><div><p className="kicker">TUNE, DON’T RESTART</p><h3>일정을 살짝 다듬어볼까요?</h3></div><button className="modal-close static" onClick={close}><X /></button></div><div className="editor-section"><label>하루 예산 <strong>₩{budget.toLocaleString()}</strong></label><input type="range" min="60000" max="120000" step="5000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} /><div className="range-labels"><span>₩6만</span><span>₩12만</span></div></div><div className="editor-section"><label>걷기 취향</label><div className="toggle-cards"><button className={walking === '여유롭게' ? 'selected' : ''} onClick={() => setWalking('여유롭게')}><Leaf />여유롭게<small>하루 최대 3.5km</small></button><button className={walking === '적당히' ? 'selected' : ''} onClick={() => setWalking('적당히')}><Footprints />적당히<small>하루 최대 5km</small></button></div></div><div className="editor-section"><label>무엇을 더 즐길까요?</label><div className="chip-select"><button className="selected">맛집</button><button>자연</button><button>문화</button><button>카페</button></div></div><div className="live-impact"><p><Sparkle weight="fill" /> LIVE IMPACT</p><div><span>예산 적합도 <b>{budget <= 80000 ? '+2%' : '-3%'}</b></span><span>걷기 <b>{walking === '여유롭게' ? '−0.9km' : '4.1km'}</b></span><span>공평함 <b>93%</b></span></div></div><button className="button full large" onClick={apply}>변경사항 적용 <MagicWand /></button></motion.aside></motion.div>
}

export default App
