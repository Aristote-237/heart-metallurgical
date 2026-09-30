import { useState, useEffect, createContext, useContext } from 'react'
import { Routes, Route, Link, NavLink, useParams, useLocation, Navigate } from 'react-router-dom'
import { T, activities, formations, heroSlides, wa, PHONE1, PHONE2, EMAIL, TIKTOK, FACEBOOK } from './data.js'

const Ctx = createContext()
const useApp = () => useContext(Ctx)
const ls = (k, d) => { try { return localStorage.getItem(k) || d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, v) } catch {} }
const routes = ['/', '/a-propos', '/activites', '/realisations', '/hma', '/contact']

const Ico = { tiktok: 'M16 3c.3 2.4 1.8 4 4 4.2v3a7 7 0 0 1-4-1.3V15a6 6 0 1 1-6-6v3.1A3 3 0 1 0 13 15V3z', fb: 'M14 8V6c0-1 .3-1.5 1.6-1.5H17V1h-2.6C11.400 1 10 2.700 10 5.500V8H7.500v3.500H10V23h4V11.500h2.800L17.300 8z' }
const Svg = ({ d, s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={d} /></svg>

function Wa({ msg, children, cls = 'btn wa' }) {
  return <a className={cls} href={wa(msg)} target="_blank" rel="noopener noreferrer">{children || 'WhatsApp'}</a>
}

function Header() {
  const { lang, setLang, theme, setTheme, t, install } = useApp()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  return (
    <header className="hdr">
      <Link to="/" className="brand" aria-label="HMC SARL"><img src="/assets/logo-hmc.png" alt="" width="44" height="40" /><span>HMC <small>SARL</small></span></Link>
      <nav className={'nav' + (open ? ' open' : '')} aria-label="Navigation">
        {routes.map((r, i) => <NavLink key={r} to={r} end={r === '/'} className={r === '/hma' ? 'hma-link' : ''}>{t.nav[i]}</NavLink>)}
        {install && <button className="btn ghost" onClick={install}>{t.install}</button>}
      </nav>
      <div className="tools">
        <button className="round" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Theme">{theme === 'dark' ? '☀' : '☾'}</button>
        <div className="lang" role="group" aria-label="Langue">
          {['fr', 'en'].map(l => <button key={l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}
        </div>
        <button className="burger" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={t.menu}><i /><i /><i /></button>
      </div>
    </header>
  )
}

function Hero() {
  const { t } = useApp()
  const [i, setI] = useState(0)
  useEffect(() => { const id = setInterval(() => setI(n => (n + 1) % heroSlides.length), 6000); return () => clearInterval(id) }, [])
  return (
    <section className="hero">
      {heroSlides.map((s, k) => <img key={s} src={s} alt="" className={'slide' + (k === i ? ' on' : '')} loading={k ? 'lazy' : 'eager'} />)}
      <div className="veil" />
      <div className="wrap hero-in">
        <p className="tag">{t.tag}</p>
        <h1>Heart Metallurgical Construction <span>HMC SARL</span></h1>
        <p className="lead">{t.heroP}</p>
        <div className="row">
          <Link className="btn" to="/activites">{t.c1}</Link>
          <Link className="btn ghost" to="/realisations">{t.c2}</Link>
          <Link className="btn ghost" to="/contact">{t.c3}</Link>
          <Wa msg={t.waGen} />
        </div>
        <Link to="/hma" className="hma-pill"><img src="/assets/logo-hma.png" alt="" width="34" height="34" />{t.hma}</Link>
      </div>
    </section>
  )
}

function Cards() {
  const { lang, t } = useApp()
  return (
    <div className="grid cards">
      {activities.map(a => (
        <Link key={a.slug} to={`/activites/${a.slug}`} className="card">
          {a.img ? <img src={a.img} alt={a[lang].title} loading="lazy" /> : <div className="ph" aria-hidden="true" />}
          <div className="cap"><h3>{a[lang].title}</h3><p>{a[lang].desc}</p></div>
        </Link>
      ))}
    </div>
  )
}

function Gallery({ items }) {
  const { t } = useApp()
  const [sel, setSel] = useState(null)
  useEffect(() => { const f = e => e.key === 'Escape' && setSel(null); addEventListener('keydown', f); return () => removeEventListener('keydown', f) }, [])
  return (<>
    <div className="masonry">{items.map(s => <button key={s} onClick={() => setSel(s)} aria-label={t.view}><img src={s} alt="HMC" loading="lazy" /></button>)}</div>
    {sel && <div className="lb" onClick={() => setSel(null)} role="dialog" aria-modal="true"><button aria-label={t.close}>✕</button><img src={sel} alt="HMC" /></div>}
  </>)
}
const allPhotos = [...new Set([...activities.map(a => a.gallery[0]), ...activities.flatMap(a => a.gallery)].filter(Boolean))]

function Home() {
  const { t, lang } = useApp()
  return (<>
    <Hero />
    <section className="wrap sec"><h2>{t.aboutT}</h2><p className="lead">{t.aboutP}</p></section>
    <TeamPreview />
    <section className="wrap sec"><h2>{t.actT}</h2><p className="sub">{t.actS}</p><Cards /></section>
    <section className="wrap sec"><h2>{t.realT}</h2><Gallery items={allPhotos.slice(0, 6)} /><Link className="btn ghost" to="/realisations">{t.c2}</Link></section>
    <HmaBand />
  </>)
}

function HmaBand() {
  const { t } = useApp()
  return (<section className="band"><div className="wrap hma-band">
    <img src="/assets/logo-hma.png" alt="HMC Academy" width="150" height="150" />
    <div><h2>{t.hmaT}</h2><p>{t.hmaP}</p><Link className="btn" to="/hma">{t.hma}</Link></div>
  </div></section>)
}

function TeamPreview() {
  const { t } = useApp()
  return <section className="wrap sec team-preview">
    <div><h2>{t.teamT}</h2><p className="lead">{t.teamP}</p><Link className="btn ghost" to="/a-propos">{t.teamLink}</Link></div>
    <img src="/assets/IMG-20260930-WA0077.jpg" alt={t.teamAltGroup} loading="lazy" />
  </section>
}

function TeamGallery() {
  const { t } = useApp()
  const photos = [
    { src: '/assets/IMG-20260930-WA0077.jpg', alt: t.teamAltGroup },
    { src: '/assets/IMG-20260930-WA0076.jpg', alt: t.teamAltSite },
    { src: '/assets/IMG-20260930-WA0075.jpg', alt: t.teamAltMember }
  ]
  return <section className="team-gallery" aria-labelledby="team-heading">
    <h2 id="team-heading">{t.teamT}</h2>
    <p className="sub">{t.teamP}</p>
    <div className="team-grid">{photos.map(photo => <figure className="team-photo" key={photo.src}>
      <img src={photo.src} alt={photo.alt} loading="lazy" />
    </figure>)}</div>
  </section>
}

function Activity() {
  const { slug } = useParams(); const { lang, t } = useApp()
  const a = activities.find(x => x.slug === slug)
  if (!a) return <Navigate to="/activites" />
  const c = a[lang]
  return (<>
    <section className="phero">{a.img && <img src={a.img} alt="" />}<div className="veil" /><div className="wrap"><h1>{c.title}</h1><p className="lead">{c.desc}</p>
      <div className="row"><Wa msg={t.waHMC(c.title)} /><Link className="btn ghost" to="/contact">{t.c3}</Link></div></div></section>
    <section className="wrap sec">
      {c.services.length > 0 && <><h2>{t.services}</h2><ul className="list">{c.services.map(s => <li key={s}>{s}</li>)}</ul></>}
      {a.gallery.length > 0 ? <><h2>{t.gal}</h2><Gallery items={a.gallery} /></> : <p className="sub">{t.soon}</p>}
      <h2>{t.other}</h2>
      <div className="chips">{activities.filter(x => x.slug !== slug).map(x => <Link key={x.slug} to={`/activites/${x.slug}`}>{x[lang].title}</Link>)}</div>
    </section></>)
}

function Page({ title, sub, children }) {
  return <section className="wrap sec page"><h1>{title}</h1>{sub && <p className="sub">{sub}</p>}{children}</section>
}

function Hma() {
  const { t, lang } = useApp()
  return (<>
    <section className="phero hma"><div className="veil" /><div className="wrap"><img src="/assets/logo-hma.png" alt="HMC Academy" width="180" height="180" /><h1>{t.hmaT}</h1><p className="lead">{t.hmaP}</p><Wa msg={t.waHMA(t.hmaF)}>{t.hmaCta}</Wa></div></section>
    <section className="wrap sec"><h2>{t.hmaHow}</h2><ul className="list">{t.hmaL.map(x => <li key={x}>{x}</li>)}</ul>
      <h2>{t.hmaF}</h2>
      <div className="grid cards">{formations.map(f => <div key={f.slug} className="card"><img src={f.img} alt={f[lang]} loading="lazy" /><div className="cap"><h3>{f[lang]}</h3><Wa msg={t.waHMA(f[lang])} cls="btn small wa">WhatsApp</Wa></div></div>)}</div>
      <p className="sub">{t.hmaInfo}</p></section></>)
}

function Contact() {
  const { t } = useApp()
  return <Page title={t.contactT} sub={t.contactP}>
    <div className="row big">
      <a className="btn" href="tel:+237681232399">{t.call} · {PHONE1}</a>
      <a className="btn" href="tel:+237659483426">{t.call} · {PHONE2}</a>
      <Wa msg={t.waGen} />
      <a className="btn ghost" href={`mailto:${EMAIL}`}>{t.mail} · {EMAIL}</a>
    </div><p className="sub">{t.loc}</p></Page>
}

function Footer() {
  const { t, lang } = useApp()
  return (<footer className="ftr"><div className="wrap fgrid">
    <div><img src="/assets/logo-hmc.png" alt="HMC SARL" width="90" height="80" /><p>Heart Metallurgical Construction — HMC SARL</p><p className="dim">{t.loc}</p></div>
    <div><h4>{t.actT}</h4>{activities.slice(0, 6).map(a => <Link key={a.slug} to={`/activites/${a.slug}`}>{a[lang].title}</Link>)}<Link to="/hma">{t.hma}</Link></div>
    <div><h4>{t.contactT}</h4><a href="tel:+237681232399">{PHONE1}</a><a href="tel:+237659483426">{PHONE2}</a><a href={wa(t.waGen)}>WhatsApp</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      <div className="soc"><a href={TIKTOK} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><Svg d={Ico.tiktok} /></a><a href={FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Svg d={Ico.fb} /></a></div></div>
  </div><p className="copy">© {new Date().getFullYear()} HMC SARL</p></footer>)
}

export default function App() {
  const [lang, setL] = useState(ls('hmc-lang', 'fr'))
  const [theme, setT] = useState(ls('hmc-theme', 'dark'))
  const [evt, setEvt] = useState(null)
  const { pathname } = useLocation()
  useEffect(() => { document.documentElement.dataset.theme = theme; document.documentElement.lang = lang }, [theme, lang])
  useEffect(() => window.scrollTo(0, 0), [pathname])
  useEffect(() => { const f = e => { e.preventDefault(); setEvt(e) }; addEventListener('beforeinstallprompt', f); addEventListener('appinstalled', () => setEvt(null)); return () => removeEventListener('beforeinstallprompt', f) }, [])
  const v = { lang, theme, t: T[lang], setLang: l => { setL(l); save('hmc-lang', l) }, setTheme: x => { setT(x); save('hmc-theme', x) },
    install: evt && (() => { evt.prompt(); setEvt(null) }) }
  const t = v.t
  return (<Ctx.Provider value={v}><Header /><main>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/a-propos" element={<Page title={t.aboutT}><p className="lead">{t.aboutP}</p><TeamGallery /></Page>} />
      <Route path="/activites" element={<Page title={t.actT} sub={t.actS}><Cards /></Page>} />
      <Route path="/activites/:slug" element={<Activity />} />
      <Route path="/realisations" element={<Page title={t.realT} sub={t.realS}><Gallery items={allPhotos} /></Page>} />
      <Route path="/hma" element={<Hma />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes></main><Footer />
    <a className="fab" href={wa(t.waGen)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">WhatsApp</a></Ctx.Provider>)
}
