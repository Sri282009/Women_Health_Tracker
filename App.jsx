import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, CalendarDays, ChevronLeft, ChevronRight, CircleHelp, Droplets,
  Heart, Home, LogOut, Moon, Plus, Settings, ShieldCheck, Sparkles,
  Stethoscope, Sun, UserRound, Waves, X
} from 'lucide-react';

const todayISO = () => new Date().toISOString().slice(0, 10);
const datePlus = (date, days) => {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const daysBetween = (a, b) => Math.round((new Date(`${b}T12:00:00`) - new Date(`${a}T12:00:00`)) / 86400000);
const defaultProfile = { name: 'there', email: '', cycleLength: 28, periodLength: 5, lastPeriod: todayISO() };

const educationalCards = [
  { q: 'What is a menstrual cycle?', a: 'A menstrual cycle is the monthly pattern of hormonal changes that prepares the body for a possible pregnancy. Day 1 is the first day of menstrual bleeding. Cycle length can vary, especially during the teen years.' },
  { q: 'What is ovulation?', a: 'Ovulation is when an ovary releases an egg. Calendar estimates are only approximations and cannot confirm ovulation. The timing can shift from cycle to cycle.' },
  { q: 'Is it normal for periods to vary?', a: 'Some variation is common. Stress, illness, travel, changes in routine and normal development can affect timing. Tracking can help you notice your own pattern.' },
  { q: 'When should I talk to a healthcare professional?', a: 'Ask a trusted adult or healthcare professional if pain disrupts daily activities, bleeding feels unusually heavy, periods stop for several months after being established, or you are worried about a change. Seek urgent help for severe or sudden symptoms.' },
  { q: 'Can an app predict my next period exactly?', a: 'No. Predictions are estimates based on the information entered. They are less reliable when cycles are irregular or still changing. Flo is not a diagnostic tool.' }
];

const navItems = [
  ['Overview', Home], ['Cycle calendar', CalendarDays], ['Log symptoms', Activity],
  ['Wellbeing', Heart], ['Learn', CircleHelp]
];

function Modal({ title, onClose, children }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18}/></button></div>
      {children}
    </section>
  </div>;
}

function Auth({ onLogin }) {
  const [mode, setMode] = useState('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  function submit(e) {
    e.preventDefault();
    if (!email.includes('@') || password.length < 6) return setError('Enter a valid email and a password with at least 6 characters.');
    if (mode === 'signup' && !consent) return setError('Please confirm that you understand this is a private demo stored on this device.');
    const profile = { ...defaultProfile, name: name.trim() || 'there', email };
    localStorage.setItem('flo-demo-profile', JSON.stringify(profile));
    onLogin(profile);
  }
  return <main className="auth-wrap">
    <div className="auth-art"><div className="brand"><span className="brand-mark">f</span> flo</div><div className="orb orb-one"/><div className="orb orb-two"/>
      <div className="auth-message"><span className="eyebrow">YOUR BODY, YOUR RHYTHM</span><h1>A little more in tune with you.</h1><p>Understand your cycle, notice patterns, and make space for everyday wellbeing.</p><div className="auth-note"><ShieldCheck size={18}/> Your demo data stays in this browser.</div></div>
      <div className="flower">✿</div>
    </div>
    <div className="auth-panel"><div className="auth-mobile-brand"><span className="brand-mark">f</span> flo</div>
      <span className="eyebrow">{mode === 'signup' ? 'WELCOME TO FLO' : 'WELCOME BACK'}</span>
      <h2>{mode === 'signup' ? 'Create your space' : 'Sign in to Flo'}</h2>
      <p className="muted">A calm place to keep track of how you feel.</p>
      <form onSubmit={submit} className="stack">
        {mode === 'signup' && <label>Your name<input value={name} onChange={e=>setName(e.target.value)} placeholder="First name" autoComplete="name"/></label>}
        <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete={mode==='signup'?'new-password':'current-password'} required minLength={6}/></label>
        {mode === 'signup' && <label className="checkline"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> I understand this is a demo and data is stored locally on this device.</label>}
        {error && <p className="error">{error}</p>}
        <button className="primary full" type="submit">{mode === 'signup' ? 'Create account' : 'Sign in'} <ChevronRight size={17}/></button>
      </form>
      <p className="switch-auth">{mode==='signup'?'Already have an account?':'New to Flo?'} <button onClick={()=>{setMode(mode==='signup'?'login':'signup');setError('')}}>{mode==='signup'?'Sign in':'Create account'}</button></p>
      <p className="tiny muted">Prototype only: authentication is not connected to a secure server. Do not use a real or reused password.</p>
    </div>
  </main>;
}

export default function App() {
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('flo-demo-profile') || 'null'); } catch { return null; }
  });
  const [active, setActive] = useState('Overview');
  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('flo-demo-logs') || '[]'); } catch { return []; }
  });
  const [wellbeing, setWellbeing] = useState(() => {
    try { return JSON.parse(localStorage.getItem('flo-demo-wellbeing') || '{}'); } catch { return {}; }
  });
  const [modal, setModal] = useState('');
  const [periodStart, setPeriodStart] = useState(todayISO());
  const [flow, setFlow] = useState('Medium');
  const [symptoms, setSymptoms] = useState([]);
  const [note, setNote] = useState('');
  const [learnOpen, setLearnOpen] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(()=>{ localStorage.setItem('flo-demo-logs', JSON.stringify(logs)); },[logs]);
  useEffect(()=>{ localStorage.setItem('flo-demo-wellbeing', JSON.stringify(wellbeing)); },[wellbeing]);

  const cycleStart = profile?.lastPeriod || todayISO();
  const nextPeriod = datePlus(cycleStart, Number(profile?.cycleLength || 28));
  const ovulation = datePlus(nextPeriod, -14);
  const fertileStart = datePlus(ovulation, -5);
  const cycleDay = Math.max(1, daysBetween(cycleStart, todayISO()) + 1);
  const phase = cycleDay <= (profile?.periodLength || 5) ? 'Menstrual phase' : cycleDay < (profile?.cycleLength || 28)-14 ? 'Follicular phase' : cycleDay <= (profile?.cycleLength || 28)-12 ? 'Estimated ovulation window' : 'Luteal phase';

  function savePeriod(e) {
    e.preventDefault();
    setProfile(p => {
      const next = {...p, lastPeriod: periodStart};
      localStorage.setItem('flo-demo-profile', JSON.stringify(next));
      return next;
    });
    setLogs(l=>[{id:Date.now(), date:periodStart, kind:'Period', flow, symptoms:[], note:''}, ...l]);
    setModal('');
  }
  function saveSymptoms(e) {
    e.preventDefault();
    setLogs(l=>[{id:Date.now(),date:todayISO(),kind:'Symptoms',flow:'',symptoms,note},...l]);
    setSymptoms([]); setNote(''); setModal('');
  }
  function saveWellbeing(key,value) {
    setWellbeing(w=>({...w,[todayISO()]:{...(w[todayISO()]||{}),[key]:value}}));
  }
  function logout() { localStorage.removeItem('flo-demo-profile'); setProfile(null); }

  if (!profile) return <Auth onLogin={setProfile}/>;

  const displayDate = new Date();
  displayDate.setDate(1); displayDate.setMonth(displayDate.getMonth()+monthOffset);
  const monthName = displayDate.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  const daysInMonth = new Date(displayDate.getFullYear(),displayDate.getMonth()+1,0).getDate();
  const firstDay = new Date(displayDate.getFullYear(),displayDate.getMonth(),1).getDay();
  const today = todayISO();
  const isDate = (day) => `${displayDate.getFullYear()}-${String(displayDate.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const isPeriodDay = (day) => {
    const d=isDate(day), diff=daysBetween(cycleStart,d);
    return diff>=0 && diff<(profile.periodLength||5);
  };
  const isFertileDay = (day) => { const d=isDate(day); return d>=fertileStart && d<=ovulation; };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">f</span> flo</div>
      <div className="side-label">YOUR SPACE</div>
      <nav>{navItems.map(([label,Icon])=><button key={label} className={`nav-item ${active===label?'selected':''}`} onClick={()=>setActive(label)}><Icon size={18}/>{label}</button>)}</nav>
      <div className="side-bottom"><div className="privacy-mini"><ShieldCheck size={17}/><span><b>Your privacy matters</b><small>Demo data stays on this device.</small></span></div><button className="nav-item" onClick={()=>setModal('settings')}><Settings size={18}/>Settings</button><button className="nav-item" onClick={logout}><LogOut size={18}/>Log out</button></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="mobile-brand"><span className="brand-mark">f</span> flo</div><div className="top-greeting">Your wellbeing space</div><button className="profile-chip" onClick={()=>setModal('settings')}><span className="avatar">{(profile.name||'F')[0].toUpperCase()}</span><span>{profile.name}</span><ChevronRight size={15}/></button></header>
      {active==='Overview' && <section className="page">
        <div className="welcome-row"><div><span className="eyebrow">YOUR DAILY CHECK-IN</span><h1>Hello, {profile.name} <span className="wave">✿</span></h1><p className="muted">A moment to check in with yourself.</p></div><div className="date-pill"><Sun size={16}/>{new Date().toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'})}</div></div>
        <div className="hero-grid">
          <article className="cycle-card"><div className="card-top"><span className="eyebrow">YOUR CYCLE</span><span className="soft-tag"><Waves size={13}/>{phase}</span></div><div className="cycle-center"><div className="cycle-ring"><div><span>DAY</span><strong>{cycleDay}</strong><small>of {profile.cycleLength}</small></div></div><div className="cycle-copy"><h2>{cycleDay <= profile.periodLength ? 'Period days' : 'Your cycle, at a glance'}</h2><p>{cycleDay <= profile.periodLength ? 'Take it gently and give yourself what you need.' : 'Your cycle is personal. Use these estimates as a guide, not a rule.'}</p></div></div><div className="cycle-stats"><div><small>Next period estimate</small><b>{new Date(`${nextPeriod}T12:00:00`).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</b></div><div><small>Average cycle</small><b>{profile.cycleLength} days</b></div><div><small>Period length</small><b>{profile.periodLength} days</b></div></div><button className="text-action" onClick={()=>setModal('period')}>Update period dates <ChevronRight size={15}/></button></article>
          <article className="ovulation-card"><div className="ovulation-icon"><Sparkles size={19}/></div><span className="eyebrow">CYCLE INSIGHT</span><h2>Ovulation estimate</h2><div className="ov-date">{new Date(`${ovulation}T12:00:00`).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div><p>Possible fertile window: {new Date(`${fertileStart}T12:00:00`).toLocaleDateString('en-US',{month:'short',day:'numeric'})} – {new Date(`${ovulation}T12:00:00`).toLocaleDateString('en-US',{month:'short',day:'numeric'})}.</p><div className="estimate-note"><ShieldCheck size={15}/> Calendar estimates can be inaccurate and do not confirm ovulation or prevent pregnancy.</div></article>
        </div>
        <div className="section-heading"><div><span className="eyebrow">TAKE A BREATH</span><h2>How are you feeling today?</h2></div><button className="text-action" onClick={()=>setActive('Wellbeing')}>See wellbeing <ChevronRight size={15}/></button></div>
        <div className="quick-grid">
          <button className="quick-card" onClick={()=>setModal('symptoms')}><span className="quick-icon pink"><Activity/></span><b>Log symptoms</b><small>Note how you feel</small><Plus size={17}/></button>
          <button className="quick-card" onClick={()=>setActive('Wellbeing')}><span className="quick-icon peach"><Heart/></span><b>Daily wellbeing</b><small>Mood, sleep & more</small><Plus size={17}/></button>
          <button className="quick-card" onClick={()=>setActive('Cycle calendar')}><span className="quick-icon lilac"><CalendarDays/></span><b>Cycle calendar</b><small>See your month</small><Plus size={17}/></button>
        </div>
        <div className="bottom-grid"><article className="tip-card"><div className="tip-icon"><Sparkles size={18}/></div><div><span className="eyebrow">A GENTLE REMINDER</span><h3>Your patterns are yours.</h3><p>There is no one “perfect” cycle. Tracking is about noticing changes over time, not judging your body.</p></div></article><article className="recent-card"><div className="section-heading compact"><h3>Recent logs</h3><button className="text-action" onClick={()=>setActive('Log symptoms')}>View all</button></div>{logs.length===0?<p className="muted">Your entries will appear here when you add a log.</p>:logs.slice(0,3).map(log=><div className="log-row" key={log.id}><span className="log-dot"/><span><b>{log.kind}</b><small>{log.date} {log.symptoms?.length?`· ${log.symptoms.join(', ')}`:''}</small></span></div>)}</article></div>
      </section>}

      {active==='Cycle calendar' && <section className="page"><div className="page-title"><span className="eyebrow">YOUR CYCLE</span><h1>Cycle calendar</h1><p className="muted">A simple view of your cycle estimates.</p></div><article className="calendar-card"><div className="calendar-head"><button className="icon-btn" onClick={()=>setMonthOffset(v=>v-1)}><ChevronLeft/></button><h2>{monthName}</h2><button className="icon-btn" onClick={()=>setMonthOffset(v=>v+1)}><ChevronRight/></button></div><div className="calendar-grid">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><span className="weekday" key={d}>{d}</span>)}{Array.from({length:firstDay},(_,i)=><span key={`blank${i}`}/>)}{Array.from({length:daysInMonth},(_,i)=>{const day=i+1;return <div key={day} className={`calendar-day ${isPeriodDay(day)?'period-day':''} ${isFertileDay(day)?'fertile-day':''} ${isDate(day)===today?'today':''}`}><span>{day}</span>{isPeriodDay(day)&&<i/>}</div>})}</div><div className="legend"><span><i className="legend-period"/> Period estimate</span><span><i className="legend-fertile"/> Possible fertile window</span><span><i className="legend-today"/> Today</span></div></article><div className="calendar-actions"><button className="primary" onClick={()=>setModal('period')}><Plus size={17}/> Log period</button><button className="secondary" onClick={()=>setModal('symptoms')}><Plus size={17}/> Add symptoms</button></div><p className="tiny muted">Predictions are estimates based on your entered dates and cycle length. Calendar estimates are not a reliable way to determine fertility or prevent pregnancy.</p></section>}

      {active==='Log symptoms' && <section className="page"><div className="page-title"><span className="eyebrow">NOTICE YOUR PATTERNS</span><h1>Symptom journal</h1><p className="muted">Record what you notice without judgement.</p></div><button className="primary" onClick={()=>setModal('symptoms')}><Plus size={17}/> Add a symptom log</button><div className="log-list">{logs.filter(l=>l.kind==='Symptoms').length===0?<div className="empty-state"><Activity size={30}/><h3>No symptom logs yet</h3><p>When you add an entry, it will show up here.</p></div>:logs.filter(l=>l.kind==='Symptoms').map(l=><article className="log-entry" key={l.id}><div className="log-entry-head"><b>{l.date}</b><span className="soft-tag">Symptom check-in</span></div><p>{l.symptoms.join(' · ')||'No symptoms selected'}</p>{l.note&&<p className="muted">{l.note}</p>}</article>)}</div></section>}

      {active==='Wellbeing' && <section className="page"><div className="page-title"><span className="eyebrow">WHOLE-SELF CHECK-IN</span><h1>Everyday wellbeing</h1><p className="muted">Small check-ins can help you spot patterns over time.</p></div><div className="well-grid">
        <article className="well-card"><span className="well-icon mood"><Heart/></span><h3>Mood</h3><p>How has your mood been?</p><div className="choice-row">{['Low','Okay','Good','Great'].map(v=><button className={wellbeing[today]?.mood===v?'choice active':'choice'} key={v} onClick={()=>saveWellbeing('mood',v)}>{v}</button>)}</div></article>
        <article className="well-card"><span className="well-icon sleep"><Moon/></span><h3>Sleep</h3><p>How did you sleep?</p><div className="choice-row">{['Restless','Fair','Good','Restful'].map(v=><button className={wellbeing[today]?.sleep===v?'choice active':'choice'} key={v} onClick={()=>saveWellbeing('sleep',v)}>{v}</button>)}</div></article>
        <article className="well-card"><span className="well-icon water"><Droplets/></span><h3>Hydration</h3><p>Glasses of water today</p><div className="water-count"><button className="icon-btn" onClick={()=>saveWellbeing('water',Math.max(0,(wellbeing[today]?.water||0)-1))}>−</button><strong>{wellbeing[today]?.water||0}</strong><button className="icon-btn" onClick={()=>saveWellbeing('water',(wellbeing[today]?.water||0)+1)}>+</button></div></article>
        <article className="well-card"><span className="well-icon energy"><Sun/></span><h3>Energy</h3><p>How is your energy?</p><div className="choice-row">{['Low','Steady','High'].map(v=><button className={wellbeing[today]?.energy===v?'choice active':'choice'} key={v} onClick={()=>saveWellbeing('energy',v)}>{v}</button>)}</div></article>
      </div><p className="tiny muted">These check-ins are for personal reflection, not medical assessment. There is no target you need to reach.</p></section>}

      {active==='Learn' && <section className="page"><div className="page-title"><span className="eyebrow">GENTLE, EVIDENCE-AWARE GUIDANCE</span><h1>Learn about your health</h1><p className="muted">Clear answers to common questions.</p></div><div className="learn-layout"><div className="learn-intro"><div className="learn-illustration"><Heart size={38}/><Sparkles size={18}/></div><h2>Knowledge, without the overwhelm.</h2><p>Explore general information and bring questions to a trusted healthcare professional.</p><div className="doctor-note"><Stethoscope size={18}/><span>Flo does not diagnose conditions or replace professional care.</span></div></div><div className="faq-list">{educationalCards.map((item,i)=><article className={`faq ${learnOpen===i?'open':''}`} key={item.q}><button onClick={()=>setLearnOpen(learnOpen===i?-1:i)}><span>{item.q}</span>{learnOpen===i?'−':'+'}</button>{learnOpen===i&&<p>{item.a}</p>}</article>)}</div></div></section>}
      <footer className="footer">Flo is a wellbeing companion, not a medical device. <span>Made with care · Demo edition</span></footer>
    </main>

    {modal==='period'&&<Modal title="Log your period" onClose={()=>setModal('')}><form className="stack" onSubmit={savePeriod}><p className="muted">Choose the first day of your most recent period to update your estimates.</p><label>Period start date<input type="date" value={periodStart} max={todayISO()} onChange={e=>setPeriodStart(e.target.value)} required/></label><label>Flow<select value={flow} onChange={e=>setFlow(e.target.value)}><option>Light</option><option>Medium</option><option>Heavy</option><option>Spotting</option></select></label><button className="primary full">Save period</button></form></Modal>}
    {modal==='symptoms'&&<Modal title="How are you feeling?" onClose={()=>setModal('')}><form className="stack" onSubmit={saveSymptoms}><p className="muted">Select anything you have noticed today.</p><div className="symptom-options">{['Cramps','Headache','Bloating','Tenderness','Tiredness','Acne','Nausea','Backache','Mood changes','None today'].map(s=><button type="button" key={s} className={symptoms.includes(s)?'symptom selected':'symptom'} onClick={()=>setSymptoms(v=>v.includes(s)?v.filter(x=>x!==s):s==='None today'?[s]:[...v.filter(x=>x!=='None today'),s])}>{s}</button>)}</div><label>Notes (optional)<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Anything else you want to remember?" rows="3"/></label><button className="primary full">Save check-in</button></form></Modal>}
    {modal==='settings'&&<Modal title="Your account & cycle settings" onClose={()=>setModal('')}><form className="stack" onSubmit={e=>{e.preventDefault();localStorage.setItem('flo-demo-profile',JSON.stringify(profile));setModal('')}}><label>Name<input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})}/></label><label>Average cycle length (days)<input type="number" min="15" max="60" value={profile.cycleLength} onChange={e=>setProfile({...profile,cycleLength:Number(e.target.value)})}/></label><label>Typical period length (days)<input type="number" min="1" max="10" value={profile.periodLength} onChange={e=>setProfile({...profile,periodLength:Number(e.target.value)})}/></label><label>Last period start date<input type="date" value={profile.lastPeriod} max={todayISO()} onChange={e=>setProfile({...profile,lastPeriod:e.target.value})}/></label><button className="primary full">Save settings</button></form><div className="privacy-box"><ShieldCheck size={18}/><p><b>Privacy note</b><br/>This prototype stores entries in your browser's local storage. Anyone with access to this browser profile may be able to view them. Clear site data to remove demo entries.</p></div></Modal>}
  </div>;
}
