import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  AirplaneTilt, ArrowLeft, ArrowRight, Bell, Buildings, CalendarBlank, CaretRight,
  ChartDonut, Check, CheckCircle, Clock, Coins, Copy, ForkKnife, Gavel, Hourglass, Info,
  Link, LockKey, MagicWand, MapPin, Pause, Play, Plus, Receipt, ShareNetwork,
  ShieldCheck, SpinnerGap, SuitcaseRolling, Ticket, TrendDown, TrendUp, UsersThree,
  Warning, X,
} from '@phosphor-icons/react'
import {
  budget, destinationPacks, itineraryDays, meetingRounds, osakaPreferences, preferenceSliders,
  replayMessages, reservations, roomMembers, type DestinationPack,
} from './data'

type Stage = 'landing' | 'destinations' | 'create' | 'invite' | 'lobby' | 'hard' | 'sliders' | 'cards' | 'free' | 'persona-loading' | 'persona' | 'submitted' | 'running' | 'complete' | 'result' | 'replay'
type ResultTab = 'summary' | 'itinerary' | 'booking' | 'fairness' | 'backup'

const demoStages: Stage[] = ['landing','destinations','create','invite','lobby','hard','sliders','cards','free','persona-loading','persona','submitted','running','complete','result','replay']
const resultTabs: ResultTab[] = ['summary','itinerary','booking','fairness','backup']

function initialStage(): Stage {
  const queryStage = new URLSearchParams(window.location.search).get('stage') as Stage | null
  if (queryStage && demoStages.includes(queryStage)) return queryStage
  const savedStage = localStorage.getItem('moa-stage') as Stage | null
  return savedStage && demoStages.includes(savedStage) ? savedStage : 'landing'
}

function initialResultTab(): ResultTab {
  const queryTab = new URLSearchParams(window.location.search).get('tab') as ResultTab | null
  return queryTab && resultTabs.includes(queryTab) ? queryTab : 'summary'
}

const stageNav: Record<Stage, string> = {
  landing: '홈', destinations: '여행지', create: '방 만들기', invite: '친구 초대', lobby: '여행 방', hard: '설문', sliders: '설문', cards: '설문', free: '설문',
  'persona-loading': '내 대리인', persona: '내 대리인', submitted: '준비 상태', running: '대리인 회의', complete: '합의 완료', result: '우리 여행', replay: '회의 구경하기',
}

function App() {
  const [stage, setStage] = useState<Stage>(initialStage)
  const [selected, setSelected] = useState<DestinationPack>(destinationPacks.find((d) => d.id === 'osaka')!)
  const [cardIndex, setCardIndex] = useState(0)
  const [scores, setScores] = useState(() => osakaPreferences.map((p) => p.defaultScore))
  const [tab, setTab] = useState<ResultTab>(initialResultTab)
  const [reason, setReason] = useState<string | null>(null)
  const [rerun, setRerun] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => localStorage.setItem('moa-stage', stage), [stage])
  useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(''), 2200); return () => window.clearTimeout(t) }, [toast])
  const go = (next: Stage) => { setStage(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return <div className="moa-app">
    {stage !== 'landing' && <Header stage={stage} home={() => go('landing')} room={() => go('lobby')} />}
    <AnimatePresence mode="wait">
      <motion.main key={stage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .25 }}>
        {stage === 'landing' && <Landing create={() => go('destinations')} join={() => go('lobby')} />}
        {stage === 'destinations' && <DestinationPicker selected={selected} select={setSelected} next={() => go('create')} />}
        {stage === 'create' && <CreateRoom destination={selected} back={() => go('destinations')} next={() => go('invite')} />}
        {stage === 'invite' && <InviteSuccess next={() => go('lobby')} copy={() => setToast('초대 링크를 복사했어요')} share={() => setToast('카카오톡 공유 화면을 열었어요')} />}
        {stage === 'lobby' && <Lobby start={() => go('hard')} copy={() => setToast('초대 링크를 복사했어요')} />}
        {stage === 'hard' && <HardSurvey next={() => go('sliders')} />}
        {stage === 'sliders' && <SliderSurvey next={() => go('cards')} />}
        {stage === 'cards' && <CardSurvey index={cardIndex} scores={scores} setScore={(score) => { setScores((old) => old.map((v, i) => i === cardIndex ? score : v)); if (cardIndex < 19) setCardIndex((i) => i + 1) }} back={() => setCardIndex((i) => Math.max(0, i - 1))} next={() => go('free')} />}
        {stage === 'free' && <FreeSurvey next={() => go('persona-loading')} />}
        {stage === 'persona-loading' && <PersonaLoading next={() => go('persona')} />}
        {stage === 'persona' && <Persona confirm={() => go('submitted')} edit={() => go('hard')} />}
        {stage === 'submitted' && <Submitted next={() => go('running')} room={() => go('lobby')} />}
        {stage === 'running' && <MeetingRunning next={() => go('complete')} />}
        {stage === 'complete' && <MeetingComplete result={() => go('result')} replay={() => go('replay')} />}
        {stage === 'result' && <FinalResult tab={tab} setTab={setTab} openReason={setReason} replay={() => go('replay')} rerun={setRerun} />}
        {stage === 'replay' && <MeetingReplay back={() => go('result')} />}
      </motion.main>
    </AnimatePresence>
    <AnimatePresence>{reason && <DecisionDrawer kind={reason} close={() => setReason(null)} />}</AnimatePresence>
    <AnimatePresence>{rerun && <RerunModal category={rerun} close={() => setRerun(null)} submit={() => { setRerun(null); setToast(`${rerun}, 다시 얘기해볼게요`) }} />}</AnimatePresence>
    <AnimatePresence>{toast && <motion.div className="moa-toast" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><CheckCircle weight="fill" />{toast}</motion.div>}</AnimatePresence>
  </div>
}

function Logo() { return <div className="moa-logo"><img src="/assets/moa-wordmark.png" alt="MOA" /></div> }

function Header({ stage, home, room }: { stage: Stage; home: () => void; room: () => void }) {
  return <header className="moa-header"><button onClick={home} aria-label="모아 홈"><Logo /></button><div className="moa-breadcrumb"><span>오사카 3박 4일</span><CaretRight /><strong>{stageNav[stage]}</strong></div><div className="moa-header-actions"><button onClick={room}><UsersThree /> 여행 방</button><span className="moa-avatar">민</span></div></header>
}

function LandingMeetingDemo() {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState(reduceMotion ? 6 : 0)

  useEffect(() => {
    if (reduceMotion) { setPhase(6); return }
    const durations = [650, 900, 900, 900, 1000, 1250, 2200, 400]
    const timer = window.setTimeout(() => setPhase((current) => current >= 7 ? 0 : current + 1), durations[phase])
    return () => window.clearTimeout(timer)
  }, [phase, reduceMotion])

  const messageMotion = (visibleAt: number, side: 'left' | 'right') => ({
    opacity: phase >= visibleAt && phase < 7 ? phase === 6 ? .66 : 1 : 0,
    x: phase === 4 ? (side === 'left' ? -14 : 14) : phase >= 5 ? (side === 'left' ? 3 : -3) : 0,
    y: phase >= visibleAt ? 0 : 9,
    scale: phase >= visibleAt && phase < 7 ? 1 : .98,
  })

  const stateKey = phase === 4 ? 'conflict' : phase === 5 ? 'fact' : phase === 6 ? 'agreement' : 'working'

  return <div className="moa-phone-stage" aria-label="모아 대리인 회의 예시">
    <motion.div className="moa-phone" initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: phase === 7 ? .94 : 1, y: phase === 0 ? 8 : 0 }} transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>
      <div className="moa-phone-bezel">
        <div className="moa-phone-island" />
        <div className="moa-phone-screen">
          <header className="moa-phone-header"><button aria-label="뒤로 가기"><ArrowLeft /></button><div><strong>오사카 3박 4일</strong><span>대리인 회의</span></div><button aria-label="회의 정보"><Info /></button></header>
          <div className="moa-phone-round"><div><span>ROUND 02</span><strong>숙소 라운드</strong></div><span className="moa-phone-live"><i /> 진행 중</span></div>
          <div className="moa-phone-members"><div><span>민</span><p><strong>민지</strong><small>맛집 우선</small></p></div><div><span>서</span><p><strong>서연</strong><small>위치 우선</small></p></div><div><span>지</span><p><strong>지훈</strong><small>위치 우선</small></p></div></div>
          <div className="moa-phone-thread"><p><span>민지의 대리인</span>숙소보다 맛집에 더 쓰고 싶어요.</p><p><span>서연의 대리인</span>근데 숙소가 너무 멀잖아요.</p><p><span>지훈의 대리인</span>저도 위치는 포기 못 해요.</p></div>
          <div className="moa-phone-state">
            <AnimatePresence mode="wait" initial={false}>
              {stateKey === 'working' && <motion.div key="working" className="moa-phone-working" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SpinnerGap /><span>조건을 비교하고 있어요</span></motion.div>}
              {stateKey === 'conflict' && <motion.div key="conflict" className="moa-phone-conflict" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .35 }}><span>의견이 갈렸어요</span><strong>2 <i>:</i> 1</strong><small>위치 우선 · 맛집 우선</small></motion.div>}
              {stateKey === 'fact' && <motion.div key="fact" className="moa-phone-fact" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .45, ease: 'easeOut' }}><header><Gavel /><div><small>MOA</small><strong>잠깐, 조건을 확인할게요.</strong><span>실제 조건을 비교했어요.</span></div></header><dl><div><dt>H-03 선택 시</dt><dd>₩28,000 / 인</dd></div><div><dt>이동시간</dt><dd>64분</dd></div></dl></motion.div>}
              {stateKey === 'agreement' && <motion.div key="agreement" className="moa-phone-agreement" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, ease: 'easeOut' }}><CheckCircle weight="fill" /><span><strong>합의 완료</strong><small>모두의 조건을 만족하는 안으로 정리했어요.</small></span></motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
    <motion.article className="moa-float-message minji" initial={false} animate={messageMotion(1, 'left')} transition={{ duration: .4, ease: 'easeOut' }}><header><span>민</span><strong>민지의 대리인</strong></header><p>“숙소보다 맛집에 더 쓰고 싶어요.”</p></motion.article>
    <motion.article className="moa-float-message seoyeon" initial={false} animate={messageMotion(2, 'right')} transition={{ duration: .4, ease: 'easeOut' }}><header><span>서</span><strong>서연의 대리인</strong></header><p>“근데 숙소가 너무 멀잖아요.”</p></motion.article>
    <motion.article className="moa-float-message jihoon" initial={false} animate={messageMotion(3, 'right')} transition={{ duration: .4, ease: 'easeOut' }}><header><span>지</span><strong>지훈의 대리인</strong></header><p>“저도 위치는 포기 못 해요.”</p></motion.article>
  </div>
}

function Landing({ create, join }: { create: () => void; join: () => void }) {
  const steps = ['취향 입력', '대리인 회의', '결정 근거 확인', '여행 일정 완성']
  return <section className="moa-landing"><nav><Logo /><div className="moa-landing-menu"><button onClick={create}>서비스 소개</button><button onClick={create}>사용 방법</button><button onClick={join}>여행 방 참여</button></div><div><button className="moa-link" onClick={join}>로그인</button><button className="moa-button mini" onClick={create}>여행 방 만들기 <ArrowRight /></button></div></nav><div className="moa-hero"><div className="moa-hero-copy"><span className="moa-hero-eyebrow">AI 여행 대리인과 함께</span><h1>싸울 건 싸우고,<br /><em>여행은 같이.</em></h1><p>서로 다른 취향은 그대로.<br />대리인들이 대신 조율해드려요.</p><div className="moa-actions"><button className="moa-button big" onClick={create}>여행 방 만들기 <ArrowRight /></button></div><div className="moa-social-proof"><div>{roomMembers.slice(0,5).map((m) => <i key={m.name} style={{ background: m.color }}>{m.initial}</i>)}</div><p><strong>먼저 여행을 만든 팀 2,400+</strong><span>취향은 달라도, 여행은 같이.</span></p></div></div><LandingMeetingDemo /></div><div className="moa-process" aria-label="모아 이용 과정">{steps.map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong>{index < steps.length - 1 && <ArrowRight />}</div>)}</div></section>
}

function DestinationPicker({ selected, select, next }: { selected: DestinationPack; select: (d: DestinationPack) => void; next: () => void }) {
  return <Page><div className="moa-page-head"><span className="moa-kicker">DESTINATION FIRST</span><h1>어디로 갈까요?</h1><p>여행지를 고르면 그곳에 맞는 질문을 준비할게요.</p></div>{(['국내', '일본'] as const).map((country) => <section className="moa-destination-group" key={country}><div><h2>{country}</h2><span>{country === '국내' ? '가볍게 떠나기 좋은 곳' : '가깝지만 분위기는 확실히 다른 곳'}</span></div><div className="moa-destination-grid">{destinationPacks.filter((d) => d.country === country).map((d) => <button key={d.id} className={`moa-destination-card ${selected.id === d.id ? 'selected' : ''}`} onClick={() => select(d)}><img src={d.image} alt={d.name} /><span className="moa-photo-shade" /><div><strong>{d.name}</strong><p>{d.tags.join(' · ')}</p></div>{selected.id === d.id && <i><Check weight="bold" /></i>}</button>)}</div></section>)}<div className="moa-request"><div><MapPin /><p><strong>찾는 곳이 없나요?</strong><span>원하는 여행지를 알려주세요.</span></p></div><button>여행지 요청하기 <ArrowRight /></button></div><StickyAction note={`${selected.name}로 떠나볼까요?`} button="다음" onClick={next} /></Page>
}

function CreateRoom({ destination, back, next }: { destination: DestinationPack; back: () => void; next: () => void }) {
  return <Page narrow><button className="moa-back" onClick={back}><ArrowLeft /> 여행지 다시 고르기</button><div className="moa-create-grid"><div className="moa-create-visual"><img src={destination.image} alt={destination.name} /><span className="moa-photo-shade" /><div><small>선택한 여행지</small><h2>{destination.name}</h2><p>{destination.tags.join(' · ')}</p></div></div><div className="moa-form-card"><span className="moa-kicker">TRIP ROOM</span><h1>{destination.name} 여행 만들기</h1><p>여행지를 정했으면, 이제 기본 정보만 알려주세요.</p><label>여행 이름<input defaultValue="오사카 3박 4일" /></label><div className="moa-form-row"><label>시작일<div><CalendarBlank /><input defaultValue="2026.10.15" /></div></label><label>종료일<div><CalendarBlank /><input defaultValue="2026.10.18" /></div></label></div><div className="moa-form-row"><label>인원<div><UsersThree /><input defaultValue="6명" /></div></label><label>1인 예산 범위<div><Coins /><input defaultValue="70–90만원" /></div></label></div><label>취향 입력 마감일<div><Clock /><input defaultValue="2026.09.20 23:59" /></div></label><button className="moa-button full big" onClick={next}>여행 방 만들기 <ArrowRight /></button></div></div></Page>
}

function InviteSuccess({ next, copy, share }: { next: () => void; copy: () => void; share: () => void }) {
  return <Page narrow><section className="moa-room-created"><div className="moa-status-mark success"><Check weight="bold" /></div><span className="moa-kicker">ROOM IS READY</span><h1>여행 방 열었어요</h1><p>친구들에게 링크를 보내고, 각자 취향만 받으면 돼요.</p><div className="moa-created-link"><span>초대 링크</span><strong>moa.travel/join/OSK-2410</strong><button onClick={copy} aria-label="초대 링크 복사"><Copy /></button></div><div className="moa-created-actions"><button className="moa-button ghost big" onClick={copy}><Copy /> 링크 복사</button><button className="moa-kakao big" onClick={share}><ShareNetwork /> 카카오톡으로 공유</button></div><button className="moa-link" onClick={next}>여행 방 보기 <ArrowRight /></button></section></Page>
}

function Lobby({ start, copy }: { start: () => void; copy: () => void }) {
  const statusClass = (s: string) => s === '완료' ? 'done' : s === '작성 중' ? 'doing' : s === '확인 필요' ? 'confirm' : 'idle'
  return <Page><RoomHeading status="취향 받는 중" /><div className="moa-room-banner"><div><span className="moa-kicker light">INVITE YOUR CREW</span><h2>각자 편할 때 취향을 알려주세요</h2><p>서로 답은 안 보여요. 모두 준비되면 대리인들이 알아서 시작해요.</p><button onClick={copy}><Link /> 초대 링크 복사</button></div><div className="moa-deadline"><Clock /><p><small>취향 입력 마감</small><strong>9월 20일 23:59</strong></p></div></div><div className="moa-room-section-head"><div><h2>누가 준비됐나요?</h2><p>같이 접속할 필요 없이 각자 시간 날 때 하면 돼요.</p></div><strong>3 / 6명 준비 완료</strong></div><div className="moa-member-grid">{roomMembers.map((m, index) => <article key={m.name}><span className="moa-member-avatar" style={{ color: m.color, background: m.pale }}>{m.initial}</span><div><strong>{m.name}{index === 0 && <i>나</i>}</strong><small>{m.status === '완료' ? '대리인 준비 완료' : m.status === '작성 중' ? '취향 입력 중 · 65%' : m.status === '확인 필요' ? '대리인 확인 필요' : '아직 시작 전'}</small></div><em className={statusClass(m.status)}>{m.status}</em></article>)}</div><div className="moa-callout"><span><UsersThree weight="fill" /></span><div><strong>민지님의 대리인도 만들어볼까요?</strong><p>약 7분이면 끝나요. 제출하고 나면 앱을 닫아도 돼요.</p></div><button className="moa-button" onClick={start}>내 취향 입력하기 <ArrowRight /></button></div></Page>
}

function SurveyShell({ step, time, title, copy, children, next, nextLabel = '다음' }: { step: number; time: string; title: string; copy: string; children: React.ReactNode; next: () => void; nextLabel?: string }) {
  return <Page narrow><SurveyProgress step={step} time={time} /><div className="moa-survey-title"><span className="moa-kicker">PART {step} OF 4</span><h1>{title}</h1><p>{copy}</p></div>{children}<StickyAction note={step < 4 ? `약 ${time} 남았어요` : '이제 내 편을 만들 차례예요'} button={nextLabel} onClick={next} /></Page>
}

function SurveyProgress({ step, time }: { step: number; time: string }) { return <div className="moa-survey-progress"><div>{[1,2,3,4].map((n) => <span className={n <= step ? 'active' : ''} key={n} />)}</div><p><strong>{step} / 4</strong><small>약 {time} 남았어요</small></p></div> }

function HardSurvey({ next }: { next: () => void }) {
  const [diet, setDiet] = useState('없음'); const [nope, setNope] = useState(['새벽 비행', '도미토리']); const togg = (v: string) => setNope((old) => old.includes(v) ? old.filter((x) => x !== v) : [...old, v])
  return <SurveyShell step={1} time="6분" title="이건 진짜 안 돼요." copy="여기서 고른 건 대리인이 절대 양보하지 않아요." next={next}><div className="moa-hard-grid"><SurveyCard icon={Coins} title="예산"><label className="moa-field">1인 총예산 상한<div className="moa-money"><b>₩</b><input defaultValue="900,000" /><span>원</span></div></label><label className="moa-switch"><input type="checkbox" defaultChecked /><span /> 항공 포함</label></SurveyCard><SurveyCard icon={ForkKnife} title="먹는 것"><ChipGroup items={['없음','비건','베지테리언','할랄','코셔','알레르기']} selected={[diet]} select={(v) => setDiet(v)} /></SurveyCard><SurveyCard icon={ShieldCheck} title="생활 · 신념"><ChipGroup items={['기도 시간 필요','음주 일정 제외','동물 체험 제외']} selected={[]} select={() => {}} plus /></SurveyCard><SurveyCard icon={SuitcaseRolling} title="체력 · 이동"><label className="moa-field">하루에 얼마나 걸을 수 있나요?<input type="range" min="1" max="15" defaultValue="6" /><div className="moa-range-label"><span>1km</span><strong>6km</strong><span>15km</span></div></label><ChipGroup items={['계단·경사 어려움','휠체어','유아차']} selected={[]} select={() => {}} /></SurveyCard></div><SurveyCard icon={LockKey} title="절대 안 돼요" full><ChipGroup items={['새벽 비행','도미토리','남녀 혼숙','날것','놀이기구','장시간 버스','흡연실']} selected={nope} select={togg} plus /></SurveyCard><div className="moa-warning"><Warning weight="fill" /><p><strong>빠진 조건은 없나요?</strong><span>여기에 적지 않으면 대리인이 모를 수도 있어요.</span></p></div></SurveyShell>
}

function SliderSurvey({ next }: { next: () => void }) {
  const [values, setValues] = useState<number[]>(preferenceSliders.map((p) => p[3]))
  return <SurveyShell step={2} time="4분" title="그래서, 어떤 여행을 좋아해요?" copy="눈치 보지 말고 본인 취향대로 골라주세요." next={next}><div className="moa-slider-grid">{preferenceSliders.map(([title,left,right], i) => <article className="moa-slider" key={title}><div><strong>{title}</strong><span>{values[i]} / 7</span></div><input type="range" min="1" max="7" value={values[i]} onChange={(e) => setValues((old) => old.map((v,n) => n === i ? Number(e.target.value) : v))} /><footer><span>{left}</span><span>{right}</span></footer></article>)}</div><div className="moa-tip"><Info weight="fill" /><p><strong>MOA 안내</strong><span>딱 반반이면 가운데도 괜찮아요. 애매한 취향도 그대로 전할게요.</span></p></div></SurveyShell>
}

function CardSurvey({ index, scores, setScore, back, next }: { index: number; scores: number[]; setScore: (n: number) => void; back: () => void; next: () => void }) {
  const item = osakaPreferences[index]
  const label = (n: number) => n >= 9 ? '꼭 하고 싶어요' : n >= 7 ? '좋아요' : n >= 5 ? '있어도 좋아요' : n >= 3 ? '별로 관심 없어요' : '피하고 싶어요'
  return <SurveyShell step={3} time="2분" title="이거 얼마나 끌려요?" copy="오사카에서 해볼 것들을 1점부터 10점까지 골라주세요." next={next} nextLabel={index === 19 ? '다음' : '확인'}><div className="moa-card-counter"><strong>{index + 1}</strong> / 20<div><i style={{ width: `${(index + 1) * 5}%` }} /></div></div><motion.article key={index} className="moa-score-card" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}><img src={item.image} alt={item.name} /><span className="moa-photo-shade" /><div><span>OSAKA PICK {String(index + 1).padStart(2,'0')}</span><h2>{item.name}</h2><p>{item.context}</p></div></motion.article><div className="moa-score-selector"><div><span>안 끌려요</span><strong><b>{scores[index]}</b> — {label(scores[index])}</strong><span>꼭 할래요</span></div><div>{[1,2,3,4,5,6,7,8,9,10].map((n) => <button className={scores[index] === n ? 'active' : ''} key={n} onClick={() => setScore(n)}>{n}</button>)}</div></div><div className="moa-card-nav"><button onClick={back} disabled={index === 0}><ArrowLeft /> 이전 카드</button><p>숫자를 고르면 다음 카드로 넘어가요</p></div></SurveyShell>
}

function FreeSurvey({ next }: { next: () => void }) { return <SurveyShell step={4} time="1분" title="마지막으로, 이것만 알려주세요" copy="대리인이 꼭 기억해야 할 말이 있다면 남겨주세요." next={next} nextLabel="내 대리인 만들기"><div className="moa-free-grid"><label><span><TrendUp />이번 여행에서 이것만은 꼭 하고 싶어요.</span><textarea maxLength={100} defaultValue="여행 중 하루는 온천에서 느긋하게 쉬고, 로컬 이자카야도 꼭 가고 싶어요." /><small>46 / 100</small></label><label><span><TrendDown />이것만은 정말 피하고 싶어요.</span><textarea maxLength={100} defaultValue="새벽 비행과 너무 빡빡한 일정은 피하고 싶어요. 숙소는 한 곳에서 지내고 싶습니다." /><small>45 / 100</small></label></div></SurveyShell> }

function PersonaLoading({ next }: { next: () => void }) { useEffect(() => { const t = window.setTimeout(next, 2600); return () => clearTimeout(t) }, [next]); return <section className="moa-loading"><div className="moa-status-mark loading"><SpinnerGap /></div><span className="moa-kicker">BUILDING MY AGENT</span><h1>내 편 만드는 중이에요</h1><p>답변을 하나씩 정리해서, 나를 잘 아는 대리인을 만들고 있어요.</p><div>{['절대 조건 챙기기','좋아하는 것 정리하기','말하는 방식 맞추기'].map((x,i) => <span style={{ animationDelay: `${i*.35}s` }} key={x}><SpinnerGap />{x}</span>)}</div></section> }

function Persona({ confirm, edit }: { confirm: () => void; edit: () => void }) {
  return <Page narrow><div className="moa-persona-head"><span className="moa-kicker">MY AGENT</span><h1>내 편 등장.</h1><p>이 대리인이 여행 회의에서 나 대신 말해줘요.</p></div><div className="moa-persona-card"><div className="moa-persona-side"><div className="moa-agent-avatar"><span>민</span><i><ShieldCheck weight="fill" /></i></div><small>민지의 대리인</small><h2>“맛집은 포기 못하는<br />느긋한 탐험가”</h2><p>숙소보다 음식과 경험에 투자하고, 모두가 지치지 않는 선을 찾아요.</p><span className="moa-agent-style">협상 스타일 · 조정형</span></div><div className="moa-persona-details"><PersonaBlock icon={Coins} title="예산"><strong>₩900,000</strong><span>항공 포함 · 상한은 꼭 지켜요</span></PersonaBlock><PersonaBlock icon={Clock} title="여행 스타일"><strong>느긋한 편</strong><span>하루 2–3곳 정도</span></PersonaBlock><PersonaBlock icon={LockKey} title="이건 진짜 안 돼요"><div className="moa-mini-chips"><i>새벽 비행 불가</i><i>도미토리 불가</i><i>갑각류 알레르기</i></div></PersonaBlock><PersonaBlock icon={TrendUp} title="가장 기대돼요"><div className="moa-rank-list"><span>스파월드 <b>9</b></span><span>도톤보리 <b>9</b></span><span>구로몬 시장 <b>8</b></span></div></PersonaBlock><PersonaBlock icon={TrendDown} title="별로 안 끌려요"><div className="moa-rank-list low"><span>신사이바시 <b>2</b></span><span>아쿠아리움 <b>1</b></span></div></PersonaBlock><PersonaBlock icon={Gavel} title="의견 맞추는 방식"><strong>조정형</strong><span>취향이 부딪히면 서로 납득할 선을 찾아요.</span></PersonaBlock></div></div><div className="moa-confirm-gate"><ShieldCheck weight="duotone" /><div><strong>얘, 나 좀 잘 아는 것 같은데?</strong><span>이대로 보내면 이제 대리인이 나 대신 회의해요.</span></div></div><div className="moa-persona-actions"><button className="moa-button ghost big" onClick={edit}>조금 수정할게요</button><button className="moa-button big" onClick={confirm}>이대로 보낼게요 <ArrowRight /></button></div></Page>
}

function Submitted({ next, room }: { next: () => void; room: () => void }) { return <section className="moa-submitted"><div className="moa-status-mark success"><Check weight="bold" /></div><span className="moa-kicker">AGENT SUBMITTED</span><h1>이제 맡겨두세요.</h1><p>다들 준비되면 대리인들이 알아서 회의를 시작해요.</p><div className="moa-readiness"><div><strong>4 / 6명</strong><span>준비 완료</span></div><div>{roomMembers.map((m,i) => <span key={m.name} style={{ background: i < 4 ? m.color : '#d8d2ca' }}>{i < 4 ? <Check /> : m.initial}</span>)}</div></div><div className="moa-leave-note"><Bell weight="duotone" /><p><strong>지금 앱을 닫아도 괜찮아요.</strong><span>계획이 완성되면 알려드릴게요.</span></p></div><div className="moa-actions"><button className="moa-button ghost" onClick={room}>준비 상태 보기</button><button className="moa-button" onClick={next}>회의 상태 보기 <ArrowRight /></button></div></section> }

function MeetingRunning({ next }: { next: () => void }) {
  return <Page narrow><div className="moa-running-head"><div><span className="moa-kicker">BACKGROUND MEETING</span><h1>지금 대신 싸우는 중이에요.</h1><p>숙소부터 식사까지, 하나씩 합의해가고 있어요.</p></div><div className="moa-running-moa"><span><SpinnerGap />MOA · 의견 맞추는 중</span></div></div><div className="moa-rounds">{meetingRounds.map((r,i) => <article className={r.state === '논의 중' ? 'active' : ''} key={r.code}><span>{r.code}</span><div><strong>{r.name}</strong><small>{i === 0 ? '여행 페이스 · 우선순위' : i === 1 ? '공항 · 패스 · 택시' : i === 2 ? '난바 후보 4곳 확인 중' : '앞선 결론을 보고 얘기할 예정'}</small></div><em className={r.state === '완료' ? 'done' : r.state === '논의 중' ? 'doing' : ''}>{r.state === '완료' ? <CheckCircle weight="fill" /> : r.state === '논의 중' ? <SpinnerGap /> : <Clock />}{r.state}</em></article>)}</div><div className="moa-async-note"><Hourglass weight="duotone" /><div><strong>5–20분 정도 걸릴 수 있어요.</strong><p>기다리지 않아도 돼요. 끝나면 바로 알려드릴게요.</p></div><label><input type="checkbox" defaultChecked /><span /> 끝나면 알림 받기</label></div><div className="moa-actions center"><button className="moa-button ghost">나중에 보기</button><button className="moa-button" onClick={next}>완료 화면 보기 <ArrowRight /></button></div></Page>
}

function MeetingComplete({ result, replay }: { result: () => void; replay: () => void }) { return <section className="moa-complete"><div className="moa-status-mark verdict"><Gavel weight="fill" /></div><span className="moa-kicker">MEETING COMPLETE</span><h1>오케이, 합의 봤습니다.</h1><p>누가 어디서 양보했는지도 같이 확인해보세요.</p><div className="moa-complete-stats"><span><strong>7</strong>논의 라운드</span><span><strong>42</strong>살펴본 후보</span><span><strong>7.7</strong>평균 만족도</span></div><div className="moa-actions"><button className="moa-button ghost big" onClick={replay}>어떻게 싸웠는지 구경하기</button><button className="moa-button big" onClick={result}>결과 보기 <ArrowRight /></button></div></section> }

function FinalResult({ tab, setTab, openReason, replay, rerun }: { tab: ResultTab; setTab: (t: ResultTab) => void; openReason: (s: string) => void; replay: () => void; rerun: (s: string) => void }) {
  const tabs: [ResultTab,string][] = [['summary','한눈에 보기'],['itinerary','상세 일정'],['booking','예약 · 예산'],['fairness','누가 양보했나요?'],['backup','계획대로 안 된다면?']]
  return <Page><RoomHeading status="합의 완료" completed /><div className="moa-result-meta"><span><CheckCircle weight="fill" /> 합의 완료</span><p>7라운드 · 재심 1회 · 후보 42개 확인</p><button onClick={replay}><Play weight="fill" /> 어떻게 싸웠는지 구경하기</button></div><nav className="moa-result-tabs">{tabs.map(([key,label]) => <button className={tab === key ? 'active' : ''} onClick={() => setTab(key)} key={key}>{label}</button>)}</nav>{tab === 'summary' && <SummaryTab openReason={openReason} setTab={setTab} />}{tab === 'itinerary' && <ItineraryTab openReason={openReason} />}{tab === 'booking' && <BookingTab />}{tab === 'fairness' && <FairnessTab />}{tab === 'backup' && <BackupTab />}<RerunSection open={rerun} /></Page>
}

function SummaryTab({ openReason, setTab }: { openReason: (s: string) => void; setTab: (t: ResultTab) => void }) {
  const snapshot = [{ value: '3박 4일', label: '여행 기간', Icon: CalendarBlank }, { value: '₩780,000', label: '1인 예상', Icon: Coins }, { value: '난바', label: '핵심 지역', Icon: MapPin }, { value: '4건', label: '예약 필요', Icon: Ticket }, { value: '7.7', label: '평균 만족도', Icon: ChartDonut }]
  return <div className="moa-result-content"><section className="moa-satisfaction"><div className="moa-summary-title"><div><span className="moa-kicker">SATISFACTION FIRST</span><h2>그래서, 다들 괜찮대요?</h2></div><div className="moa-main-score"><strong>7.7</strong><span>/ 10 평균 만족도</span><em><Check /> 모두 6점 이상</em></div></div><div className="moa-member-scores">{roomMembers.map((m,i) => <article key={m.name}><div><span style={{ background: m.color }}>{m.initial}</span><strong>{m.name}</strong>{i === 0 && <i>나</i>}</div><b>{m.score.toFixed(1)}</b><div><span style={{ width: `${m.score*10}%`, background: m.color }} /></div><small>{i === 0 ? '숙소에서 조금 양보' : i === 5 ? '액티비티에서 양보' : '취향이 고르게 반영됐어요'}</small></article>)}</div><div className="moa-min-score"><ShieldCheck weight="duotone" /><p><strong>가장 낮은 점수도 7.2 / 10</strong><span>평균만 높이고 누군가 크게 손해 보는 일은 없게 맞췄어요.</span></p></div></section><section className="moa-trip-snapshot"><span className="moa-kicker">TRIP AT A GLANCE</span><h2>우리 여행, 이렇게 정리됐어요.</h2><div>{snapshot.map(({value,label,Icon}) => <article key={label}><Icon weight="duotone" /><strong>{value}</strong><span>{label}</span></article>)}</div></section><section className="moa-decision-highlight"><div><span className="moa-kicker">KEY DECISION</span><h2>숙소는 난바 H-03에서<br />3박 내내 지내요.</h2><p>이동은 편하고, 수아가 싫어한 숙소 이동도 없앴어요.</p><button onClick={() => openReason('숙소')}><Info weight="fill" /> 근데 왜 여기로 정했어요?</button></div><div className="moa-hotel-card"><Buildings weight="duotone" /><small>SELECTED</small><strong>난바 호텔 H-03</strong><span>역 도보 7분 · 6인 투숙 · 1인 ₩210,000</span></div></section><button className="moa-next-section" onClick={() => setTab('itinerary')}>상세 일정 보기 <ArrowRight /></button></div>
}

function ItineraryTab({ openReason }: { openReason: (s: string) => void }) { const [day,setDay]=useState(0); const d=itineraryDays[day]; return <div className="moa-result-content"><div className="moa-itinerary-layout"><aside><span className="moa-kicker">FINAL PLAN</span><h2>우리 여행, 이렇게 정리됐어요.</h2><p>무리한 이동은 줄이고, 매일 숨 돌릴 시간은 남겼어요.</p><div>{itineraryDays.map((x,i) => <button className={day===i?'active':''} onClick={() => setDay(i)} key={x.day}><span>{x.day}</span><strong>{x.title}</strong><CaretRight /></button>)}</div></aside><section className="moa-day-plan"><header><div><span>{d.day}</span><h2>{d.title}</h2></div><p><span>총 도보 <b>{d.walk}</b></span><span>총 이동 <b>{d.travel}</b></span></p></header><div>{d.items.map(([time,title,meta],i) => <article key={title}><time>{time}</time><span className="moa-time-dot"><i />{i<d.items.length-1&&<b />}</span><div><strong>{title}</strong><p>{meta}</p>{meta.includes('예약') && <em>예약 필요</em>}</div></article>)}</div><button className="moa-why" onClick={() => openReason('동선')}><Info weight="fill" /> 근데 왜 이 동선이에요? <ArrowRight /></button></section><RouteMap day={day} /></div></div> }

function RouteMap({ day }: { day: number }) {
  const pins = [[18,72],[37,50],[56,63],[70,38],[84,57]]
  return <section className="moa-route-map"><header><div><span className="moa-kicker">ROUTE MAP</span><h2>{itineraryDays[day].day} 이동 경로</h2></div><span>오늘 동선을 한눈에 볼 수 있어요</span></header><div className="moa-map-canvas"><span className="moa-river river-a"/><span className="moa-river river-b"/><span className="moa-map-line"/>{pins.map(([left,top],i)=><motion.i key={`${day}-${i}`} style={{left:`${left}%`,top:`${top}%`}} initial={{scale:0}} animate={{scale:1}} transition={{delay:i*.06}}><b>{i+1}</b></motion.i>)}<strong className="moa-map-label a">난바</strong><strong className="moa-map-label b">도톤보리</strong><strong className="moa-map-label c">우메다</strong></div><footer><span><i/>선택 일정</span><b>오늘 갈 곳만 순서대로 보여줘요.</b></footer></section>
}

function BookingTab() { return <div className="moa-result-content"><div className="moa-section-heading"><span className="moa-kicker">TO BOOK</span><h2>미리 예약해야 해요</h2><p>급한 것부터 하나씩 챙겨볼까요?</p></div><div className="moa-reservations">{reservations.map(([type,name,price,status],i) => { const Icon=[AirplaneTilt,Buildings,ForkKnife,Ticket][i]; return <article key={type}><span><Icon weight="duotone" /></span><div><small>{type} · 10월 {i===0?'15일':'1일까지'}</small><strong>{name}</strong><p>{price} / 인</p></div><em className={status==='예약 완료'?'done':''}>{status}</em><button>{status==='예약 완료'?'예약 정보 보기':'예약 페이지 열기'} <ArrowRight /></button></article>})}</div><div className="moa-budget"><div><span className="moa-kicker">BUDGET</span><h2>예상 비용</h2><p>모두가 정한 최대 예산 안에 들어왔어요.</p><div className="moa-budget-total"><span>1인 예상 합계</span><strong>₩780,000</strong><em><Check /> 전원 예산 충족</em></div></div><div>{budget.map(([label,value],i) => <p key={label}><span>{label}</span><i><b style={{ width: `${Number(value)/3100}%`, background: ['#F2714B','#6C9E79','#D99B3D','#8B78B8','#4D8CA8'][i] }} /></i><strong>₩{Number(value).toLocaleString()}</strong></p>)}<div className="moa-common-money"><Receipt /><span><strong>그룹 공동경비 ₩1,200,000</strong><small>여행 후 1/N로 정산해요.</small></span></div></div></div></div> }

function FairnessTab() { return <div className="moa-result-content"><div className="moa-section-heading"><span className="moa-kicker">FAIRNESS, EXPLAINED</span><h2>이번엔 누가 양보했어요?</h2><p>한 번 양보했다면, 다른 결정에서는 그 사람 취향을 더 챙겼어요.</p></div><div className="moa-concessions">{roomMembers.map((m,i) => <article key={m.name}><header><span style={{background:m.color}}>{m.initial}</span><div><strong>{m.name}</strong><small>만족도 {m.score.toFixed(1)}</small></div></header><div><p><TrendDown />{i%2===0?'숙소 · 조금 양보':'액티비티 · 조금 양보'}</p><p><TrendUp />{i%2===0?'식사 · 더 반영':'동선 · 더 반영'}</p></div><footer>{i===0?'숙소에서는 조금 양보했지만, 식사와 액티비티 취향은 더 많이 챙겼어요.':'한 가지는 양보했지만, 진짜 안 된다고 한 조건은 모두 지켰어요.'}</footer></article>)}</div><section className="moa-dissent"><div className="moa-section-heading"><span className="moa-kicker">MINORITY OPINIONS</span><h2>선택되진 않았지만, 이 의견도 있었어요.</h2></div><article><span style={{background:roomMembers[5].color}}>수</span><div><strong>수아</strong><blockquote>“숙소를 옮기지 않는 일정이 더 좋았어요.”</blockquote><p><Check /> 그래서 3일차에도 난바 숙소를 유지하고 짐 보관 서비스를 넣었어요.</p></div></article><article><span style={{background:roomMembers[3].color}}>민</span><div><strong>민재</strong><blockquote>“교토보다 유니버설 스튜디오가 더 끌렸어요.”</blockquote><p><Check /> 최종 선택은 아니지만 DAY 2 저녁 자유시간을 넉넉히 남겼어요.</p></div></article></section></div> }

function BackupTab() { return <div className="moa-result-content"><div className="moa-section-heading"><span className="moa-kicker">PLAN B</span><h2>계획대로 안 된다면?</h2><p>비가 오거나 예약에 실패해도 바로 바꿀 수 있게 준비했어요.</p></div><div className="moa-planb-grid"><PlanB icon={Warning} title="비 오는 날" from="오사카성 야외 일정" to="나카노시마 미술관" note="이동 시간 +8분 · 비용 +₩12,000" /><PlanB icon={ForkKnife} title="식당 예약 실패" from="이자카야 B" to="후보 2위 이자카야 C" note="도보 4분 거리 · 예산 동일" /></div><div className="moa-section-heading issue"><span className="moa-kicker">STILL TO CHECK</span><h2>아직 확인할 게 있어요</h2></div><div className="moa-issues"><article><Warning weight="fill" /><div><strong>이자카야 B</strong><p>6인 예약이 되는지 직접 확인해야 해요.</p></div><em>확인 필요</em></article><article><Info weight="fill" /><div><strong>가격이 달라질 수 있어요</strong><p>항공과 숙소는 예약할 때 가격이 바뀔 수 있어요.</p></div><em>참고</em></article></div></div> }

function MeetingReplay({ back }: { back: () => void }) {
  const [round,setRound]=useState(2), [filter,setFilter]=useState('전체'), [expanded,setExpanded]=useState(false), [playing,setPlaying]=useState(true), [speed,setSpeed]=useState(1)
  const matches = (m: typeof replayMessages[number]) => filter==='전체'||filter==='내 대리인'&&m.speaker.includes('민지')||filter==='다른 대리인'&&m.type==='agent'&&!m.speaker.includes('민지')||filter==='심판'&&['fact','verdict'].includes(m.type)||filter==='Chief'&&m.type==='chief'
  const visible = replayMessages.filter((m) => (expanded || m.round===round) && matches(m))
  return <Page><button className="moa-back" onClick={back}><ArrowLeft /> 우리 여행으로 돌아가기</button><div className="moa-replay-head"><div><span className="moa-kicker">MEETING REPLAY</span><h1>어떻게 싸웠는지 구경하기</h1><p><CheckCircle weight="fill" /> 이미 끝난 회의를 다시 보고 있어요.</p></div><div className="moa-replay-summary"><Gavel weight="duotone" /><span><strong>7개 라운드 완료</strong><small>대리인 6명 · 분야별 심판 · Chief</small></span></div></div><div className="moa-round-nav">{meetingRounds.map((r,i) => <button className={round===i&&!expanded?'active':''} onClick={() => {setRound(i);setExpanded(false)}} key={r.code}><span>{r.code}</span>{r.name}</button>)}</div><div className="moa-replay-controls"><div>{['전체','내 대리인','다른 대리인','심판','Chief'].map((x) => <button className={filter===x?'active':''} onClick={() => setFilter(x)} key={x}>{x}</button>)}</div><div><button onClick={() => setExpanded(!expanded)}>{expanded?'현재 라운드':'전체 보기'}</button><button onClick={() => setSpeed(speed===1?2:1)}>{speed}x</button><button onClick={() => setPlaying(!playing)}>{playing?<Pause weight="fill"/>:<Play weight="fill"/>}{playing?'일시정지':'재생'}</button></div></div><div className="moa-replay-layout"><aside><small>현재 라운드</small><strong>{expanded?'전체 회의':`${meetingRounds[round].code} ${meetingRounds[round].name}`}</strong><p>{round===2?'6명이 함께 묵을 수 있는지, 가격과 위치는 괜찮은지 후보 4곳을 비교했어요.':'각자 중요하게 생각한 것과 진짜 안 되는 조건을 놓고 비교했어요.'}</p><div><span>진행 상태</span><b>결론 완료</b></div></aside><section className="moa-message-stream"><AnimatePresence>{visible.length ? visible.map((m,i) => <AgentMessage key={`${m.speaker}-${i}`} message={m} delay={playing ? i*.16/speed : 0} />) : <div className="moa-empty"><Info />이 필터에 맞는 기록은 없어요.</div>}</AnimatePresence></section></div></Page>
}

function AgentMessage({ message, delay }: { message: typeof replayMessages[number]; delay: number }) {
  if (message.type === 'conflict') return <motion.article className="moa-agent-message conflict" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{delay}}><span><Warning weight="fill" /></span><div><small>{message.speaker}</small><div className="moa-conflict-pair"><p><b>민지</b>경험에 예산 우선</p><em>VS</em><p><b>서연</b>숙소 위치와 품질 우선</p></div><footer>{message.text}</footer></div></motion.article>
  const icons={agent:UsersThree,fact:ShieldCheck,verdict:Gavel,chief:Gavel}; const Icon=icons[message.type as keyof typeof icons]
  return <motion.article className={`moa-agent-message ${message.type}`} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay}}><span><Icon weight={message.type==='verdict'||message.type==='chief'?'fill':'duotone'} /></span><div><small>{message.speaker}</small>{message.type==='fact'&&<em>심판이 확인했어요</em>}{message.type==='verdict'&&<em>그래서 결론은?</em>}{message.type==='chief'&&<em>Chief가 다시 봤어요</em>}<p>{message.type==='agent'?`“${message.text}”`:message.text}</p>{message.type==='fact'&&<div className="moa-evidence"><span><Check /> 실제 후보 확인</span><span><Check /> 진짜 안 되는 조건 확인</span><span><Check /> 예산 확인</span></div>}{message.type==='verdict'&&<strong className="moa-replay-outcome"><CheckCircle weight="fill" /> 이렇게 정했어요</strong>}</div></motion.article>
}

function DecisionDrawer({ kind, close }: { kind: string; close: () => void }) { return <motion.div className="moa-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={close}><motion.aside className="moa-drawer" initial={{x:480}} animate={{x:0}} exit={{x:480}} onMouseDown={(e)=>e.stopPropagation()}><header><div><span className="moa-kicker">DECISION REASON</span><h2>{kind} — 근데 왜 이렇게 정했어요?</h2></div><button onClick={close}><X /></button></header><div className="moa-verdict"><Gavel weight="duotone" /><div><small>그래서 결론은?</small><strong>{kind==='숙소'?'난바 호텔 H-03':kind==='동선'?'난바 중심 방사형 동선':'선택안'}</strong></div></div><section><h3>이유는 이래요</h3>{['6명 모두 이용할 수 있어요.','누구의 예산도 넘지 않아요.','주요 일정까지 가는 길이 가장 짧아요.','도미토리 불가와 숙소 이동 불가 조건을 모두 지켜요.'].map((x)=><p key={x}><Check />{x}</p>)}</section><section><h3>누구 의견이 들어갔나요?</h3><div className="moa-reflection">{roomMembers.slice(0,4).map((m,i)=><span key={m.name} style={{background:m.pale,color:m.color}}>{m.name} {i<3?'취향':'양보'}</span>)}</div></section><div className="moa-fact-source"><ShieldCheck /><p><strong>심판이 확인했어요</strong><span>6명이 묵을 수 있는지, 숙박비는 얼마인지 직접 확인했어요.</span></p></div><button className="moa-button full" onClick={close}>확인</button></motion.aside></motion.div> }

function RerunSection({ open }: { open: (s:string) => void }) { return <section className="moa-rerun"><div><span className="moa-kicker">ONE CATEGORY AT A TIME</span><h2>이건 다시 얘기해봐요.</h2><p>전체 여행은 건드리지 않고, 마음에 안 드는 부분만 다시 맞춰볼게요.</p><strong>무료로 2번 더 얘기할 수 있어요</strong></div><div>{['숙소','식사','액티비티','교통'].map((x)=><button key={x} onClick={()=>open(x)}>{x} 다시 얘기하기 <ArrowRight /></button>)}</div></section> }

function RerunModal({ category, close, submit }: { category:string; close:()=>void; submit:()=>void }) { return <motion.div className="moa-modal-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={close}><motion.div className="moa-rerun-modal" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} onMouseDown={(e)=>e.stopPropagation()}><button className="moa-modal-close" onClick={close}><X /></button><span className="moa-kicker">REOPEN {category.toUpperCase()}</span><h2>{category}, 뭐가 아쉬웠어요?</h2><p>남긴 말은 대리인들과 {category} 심판에게 전할게요.</p><textarea placeholder="예: 숙소가 역에서 조금 더 가까우면 좋겠어요." /><div className="moa-rerun-impact"><Info /><span><strong>다시 얘기할 범위</strong>{category}와 연결된 예산·동선만 바꿔요.</span></div><button className="moa-button full big" onClick={submit}>{category} 다시 얘기하기 <MagicWand /></button></motion.div></motion.div> }

function RoomHeading({ status, completed=false }: { status:string; completed?:boolean }) { return <div className="moa-room-heading"><div><span className="moa-kicker">OSAKA · TRIP ROOM</span><h1>오사카 3박 4일</h1><p><CalendarBlank /> 2026.10.15 – 10.18 <span>·</span><UsersThree /> 6명</p></div><em className={completed?'completed':''}>{completed?<CheckCircle weight="fill"/>:<span/>}{status}</em></div> }
function Page({ children, narrow=false }: { children:React.ReactNode; narrow?:boolean }) { return <div className={`moa-page ${narrow?'narrow':''}`}>{children}</div> }
function StickyAction({ note, button, onClick }: { note:string; button:string; onClick:()=>void }) { return <div className="moa-sticky"><p><CheckCircle weight="fill" />{note}</p><button className="moa-button" onClick={onClick}>{button}<ArrowRight /></button></div> }
function SurveyCard({ icon:Icon,title,children,full=false }: { icon:typeof Coins; title:string; children:React.ReactNode; full?:boolean }) { return <section className={`moa-survey-card ${full?'full':''}`}><header><span><Icon weight="duotone" /></span><h2>{title}</h2></header>{children}</section> }
function ChipGroup({ items,selected,select,plus=false }: { items:string[]; selected:string[]; select:(x:string)=>void; plus?:boolean }) { return <div className="moa-chip-group">{items.map((x)=><button className={selected.includes(x)?'active':''} onClick={()=>select(x)} key={x}>{selected.includes(x)&&<Check/>}{x}</button>)}{plus&&<button><Plus/>직접 입력</button>}</div> }
function PersonaBlock({ icon:Icon,title,children }: { icon:typeof Coins; title:string; children:React.ReactNode }) { return <section className="moa-persona-block"><header><Icon weight="duotone" /><span>{title}</span></header><div>{children}</div></section> }
function PlanB({ icon:Icon,title,from,to,note }: { icon:typeof Warning; title:string; from:string; to:string; note:string }) { return <article className="moa-planb"><header><span><Icon weight="duotone" /></span><div><small>IF · {title}</small><strong>{title}</strong></div></header><div><p><small>ORIGINAL</small><strong>{from}</strong></p><ArrowRight/><p><small>PLAN B</small><strong>{to}</strong></p></div><footer>{note}</footer></article> }

export default App
