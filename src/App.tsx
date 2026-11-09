import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Check, ChevronDown, CircleAlert, Crown, Menu, X } from "lucide-react";
import initialContent from "./initialContent.json";
import { supabase, supabaseReady } from "./supabase";

type ImageCrop = { x: number; y: number; zoom: number };
type Content = Omit<typeof initialContent, "promos"> & {
  promos: Array<(typeof initialContent.promos)[number] & { imagePosition?: string; imageCrop?: ImageCrop }>;
};
type BonusPeriod = "mondayWednesday" | "thursdayFriday" | "saturday";
const adminPath = "/TyCBabiecaAdmin";
const weekdays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;
const defaultImageCrop: ImageCrop = { x: 50, y: 50, zoom: 1 };

function getImageCrop(promo: Content["promos"][number]): ImageCrop {
  if (promo.imageCrop) return { ...defaultImageCrop, ...promo.imageCrop };
  const legacyPosition = promo.imagePosition || "center";
  return {
    x: legacyPosition.startsWith("left") ? 0 : legacyPosition.startsWith("right") ? 100 : 50,
    y: legacyPosition.endsWith("top") ? 0 : legacyPosition.endsWith("bottom") ? 100 : 50,
    zoom: 1,
  };
}

function imageCropStyle(promo: Content["promos"][number]) {
  const crop = getImageCrop(promo);
  const focalPoint = `${crop.x}% ${crop.y}%`;
  return { objectPosition: focalPoint, transform: `scale(${crop.zoom})`, transformOrigin: focalPoint };
}

export default function App() {
  const [content, setContent] = useState<Content>(initialContent);
  const [connection, setConnection] = useState<"loading" | "ok" | "offline">(supabaseReady ? "loading" : "offline");
  const [isAdmin, setIsAdmin] = useState(location.pathname.replace(/\/$/, "") === adminPath);
  const [termsOpen, setTermsOpen] = useState(false);

  const refresh = useCallback(async () => {
    if (!supabase) { setConnection("offline"); return; }
    const { data, error } = await supabase.from("site_content").select("content").eq("id", "main").maybeSingle();
    if (error) { setConnection("offline"); return; }
    if (data?.content) setContent(data.content as Content);
    setConnection("ok");
  }, []);

  useEffect(() => {
    void refresh();
    if (!supabase) return;
    const channel = supabase.channel("public-content").on("postgres_changes", { event: "*", schema: "public", table: "site_content", filter: "id=eq.main" }, (payload) => {
      if (payload.new && "content" in payload.new) setContent(payload.new.content as Content);
    }).subscribe();
    const pop = () => setIsAdmin(location.pathname.replace(/\/$/, "") === adminPath);
    window.addEventListener("popstate", pop);
    return () => { window.removeEventListener("popstate", pop); void supabase?.removeChannel(channel); };
  }, [refresh]);

  const navigate = (admin: boolean) => {
    history.pushState({}, "", admin ? adminPath : "/");
    setIsAdmin(admin);
    setTermsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isAdmin) return <Admin content={content} onSaved={(next) => setContent(next)} onPublic={() => navigate(false)} />;
  if (termsOpen) return <Terms content={content} onBack={() => setTermsOpen(false)} />;

  const today = (new Date().getDay() + 6) % 7;
  const promo = content.promos.find((item) => item.day.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "") === weekdays[today].toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ?? content.promos[today] ?? content.promos[0];

  return <main className="site-shell">
    <header className="topbar"><a className="wordmark" href="#home"><img src="/horse-mark.png" alt="" /><span>HÍPICAS <b>BABIECA</b></span></a><nav><a href="#promos">Promociones</a><a href="#bonos">Bonos</a><button className="nav-terms" onClick={() => setTermsOpen(true)}>Términos</button><a className="button button-gold nav-cta" href={content.links[0]?.url || "https://hipicasbabieca.io"} target="_blank" rel="noreferrer">Regístrate <ArrowUpRight size={15} /></a></nav></header>
    {connection === "offline" && supabaseReady && <div className="connection-note"><CircleAlert size={15} /> Mostramos la última versión disponible del contenido.</div>}
    <section id="home" className="hero">
      <div className="hero-photo" /><div className="hero-shade" />
      <div className="hero-content"><div className="eyebrow"><span className="live-dot" />{content.hero.eyebrow}</div><p className="overline">{content.brand} <span>·</span> La emoción de cada carrera</p><h1>{content.hero.title.split(" emoción")[0]} <em>emoción</em>{content.hero.title.includes("emoción") ? content.hero.title.split("emoción")[1] : ""}</h1><p className="hero-copy">{content.hero.description}</p><div className="hero-actions"><a className="button button-gold" href={content.links[0]?.url || "https://hipicasbabieca.io"} target="_blank" rel="noreferrer">Vive la experiencia <ArrowUpRight size={17} /></a><a className="text-link" href="#promos">Explorar promociones <ArrowDown size={15} /></a></div><p className="responsible">{content.hero.notice}</p></div>
      <div className="hero-caption"><span>01 / 07</span><span>El pulso de la pista</span></div>
    </section>
    <section className="today-section section-wrap" id="promos"><div className="section-kicker"><span>EN PISTA HOY</span><i /></div><div className="today-card"><div className="today-image">{promo?.image && <img src={promo.image} alt="" style={imageCropStyle(promo)} />}</div><div className="today-content"><div className="pill">{promo?.day} <span>·</span> Válido 24 h</div><h2>{promo?.name}</h2><p>{promo?.description}</p><a href="#week" className="text-link">Ver semana completa <ArrowRight size={15} /></a></div><div className="today-index">{String(today + 1).padStart(2, "0")} <span>/ 07</span></div></div></section>
    <section className="week-section section-wrap" id="week"><div className="section-heading"><div><div className="section-kicker"><span>SIETE DÍAS · SIETE OPORTUNIDADES</span><i /></div><h2>La semana <em>en movimiento.</em></h2></div><p>Elige tu día. Descubre qué te espera en la pista.</p></div><div className="promo-grid">{content.promos.map((p, i) => <article className={`promo-tile ${i === today ? "is-today" : ""}`} key={`${p.day}-${i}`}><div className="tile-photo"><img src={p.image} alt="" style={imageCropStyle(p)} /></div><div className="tile-content"><span className="tile-day">{p.day}{i === today && <b> HOY</b>}</span><h3>{p.name}</h3><p>{p.description}</p></div><span className="tile-number">0{i + 1}</span></article>)}</div></section>
    <section className="numbers-band"><div><span>01</span><p>Un destino<br /><b>para cada día</b></p></div><div><span>02</span><p>Bonos por país<br /><b>con detalle</b></p></div><div><span>03</span><p>Juego informado<br /><b>y responsable</b></p></div></section>
    <section className="bonus-section section-wrap" id="bonos"><div className="section-heading"><div><div className="section-kicker"><span>POR PAÍS Y MONEDA</span><i /></div><h2>Tu bono, <em>con claridad.</em></h2></div><p>Consulta los rangos, rollover y límites para cada país.</p></div><CountryTables countries={content.countries} /><div className="notice-list">{content.notices.map((notice, i) => <p className="fine-note" key={`${notice.title}-${i}`}><b>{notice.title}.</b> {notice.text}</p>)}</div></section>
    <section className="steps-section"><div className="section-wrap"><div className="section-kicker"><span>EMPIEZA EN CUATRO PASOS</span><i /></div><div className="steps-grid">{content.steps.map((s, i) => <div className="step" key={i}><span>0{i + 1}</span><h3>{s.title}</h3><p>{s.description}</p></div>)}</div></div></section>
    <section className="faq-section section-wrap"><div className="section-heading"><div><div className="section-kicker"><span>ANTES DE LA CARRERA</span><i /></div><h2>Preguntas <em>frecuentes.</em></h2></div><p>Información útil para jugar con confianza.</p></div><div className="faq-list">{content.faqs.map((faq, i) => <details key={i}><summary><span>{faq.q}</span><ChevronDown size={18} /></summary><p>{faq.a}</p></details>)}</div></section>
    <footer className="footer"><div className="footer-main"><a className="wordmark" href="#home"><img src="/horse-mark.png" alt="" /><span>HÍPICAS <b>BABIECA</b></span></a><div><p>La pasión también se juega con responsabilidad.</p><span>Mayores de 18 años</span></div><button className="footer-terms" onClick={() => setTermsOpen(true)}>Términos y condiciones <ArrowUpRight size={15} /></button></div><div className="footer-bottom"><span>{content.footerText}</span><span>Juego responsable · +18</span></div></footer>
  </main>;
}

function CountryTables({ countries }: { countries: Content["countries"] }) {
  const [selected, setSelected] = useState(0); const [period, setPeriod] = useState<"mondayWednesday" | "thursdayFriday" | "saturday">("mondayWednesday");
  const c = countries[Math.min(selected, countries.length - 1)]; if (!c) return null;
  return <div className="country-panel"><div className="country-switch"><button aria-label="País anterior" onClick={() => setSelected((selected + countries.length - 1) % countries.length)}><ArrowLeft /></button><div className="country-name"><span>{c.flag}</span><div><b>{c.country}</b><small>{c.currency}</small></div><select aria-label="Seleccionar país" value={selected} onChange={e => setSelected(Number(e.target.value))}>{countries.map((x, i) => <option value={i} key={x.country}>{x.country}</option>)}</select></div><button aria-label="País siguiente" onClick={() => setSelected((selected + 1) % countries.length)}><ArrowRight /></button></div><div className="period-tabs">{([{ key: "mondayWednesday", label: "Lunes–miércoles" }, { key: "thursdayFriday", label: "Jueves–viernes" }, { key: "saturday", label: "Sábado" }] as const).map(t => <button className={period === t.key ? "active" : ""} onClick={() => setPeriod(t.key)} key={t.key}>{t.label}</button>)}</div><div className="table-scroll"><table><thead><tr><th>Bono</th><th>Rollover</th><th>Rango de recarga</th><th>Bono máximo</th><th>Ganancia máxima</th></tr></thead><tbody>{c[period].map((r, i) => <tr key={i}><td className="gold-cell">{r.bono}</td><td>{r.rollover}</td><td>{r.rango}</td><td>{r.bonoMaximo}</td><td>{r.gananciaMaxima}</td></tr>)}</tbody></table></div><p className="table-note">En ningún caso el bono otorgado podrá superar el bono máximo indicado para el período correspondiente.</p></div>;
}

function Terms({ content, onBack }: { content: Content; onBack: () => void }) {
  return <main className="terms-page"><header className="topbar terms-top"><button className="back-button" onClick={onBack}><ArrowLeft size={16} /> Volver a la página</button><a className="wordmark" href="/"><img src="/horse-mark.png" alt="" /><span>HÍPICAS <b>BABIECA</b></span></a></header><section className="terms-hero"><div className="section-kicker"><span>INFORMACIÓN LEGAL</span><i /></div><h1>Términos y<br /><em>condiciones.</em></h1><p>{content.terms.subtitle}</p></section><div className="terms-content">{content.terms.sections.map(section => <section className="terms-block" key={section.number}><span>{section.number}</span><div><h2>{section.title}</h2>{section.items.filter(item => !(section.number === "02" && item.startsWith("Para recargas de")) && !(section.number === "08" && item.startsWith("© 2024")) && !(section.number === "07" && (item.startsWith("Si el usuario apuesta") || item.startsWith("$10.000 ×")))).map((item, i) => <Fragment key={i}>{section.number === "07" && i === 1 && <h3 className="cashback-condition-title">Condiciones Generales del Cashback</h3>}<p>{item}</p></Fragment>)}{section.number === "02" && <div className="terms-country-list">{content.countries.map(c => <details key={c.country}><summary>{c.flag} {c.country} · {c.currency}<ChevronDown size={16} /></summary><p>Para recargas desde {c.mondayWednesday[2]?.rango.replace(/^Desde\s*/, "")}, el bono será del 80% hasta alcanzar el bono máximo indicado. Una recarga superior no incrementará el bono por encima de este límite.</p>{content.terms.bonusTables.map(table => <div key={table.key}><h3>{table.title}</h3><div className="table-scroll"><table><thead><tr><th>Bono</th><th>Rollover</th><th>Rango</th><th>Bono máximo</th><th>Ganancia máxima</th></tr></thead><tbody>{c[table.key as BonusPeriod].map((r, i) => <tr key={i}><td>{r.bono}</td><td>{r.rollover}</td><td>{r.rango}</td><td>{r.bonoMaximo}</td><td>{r.gananciaMaxima}</td></tr>)}</tbody></table></div><p>En ningún caso el bono otorgado podrá superar el bono máximo indicado para {table.title.toLowerCase()}, independientemente del valor de la recarga.</p></div>)}</details>)}</div>}{section.number === "07" && <CashbackTable data={content.terms.cashback} />}</div></section>)}<div className="legal-notice">♞<p>{content.terms.finalNotice}</p></div></div><footer className="footer-bottom terms-footer"><span>{content.footerText}</span><span>Juego responsable · +18</span></footer></main>;
}

function CashbackTable({ data }: { data: Content["terms"]["cashback"] }) { return <div className="cashback-tables"><h3>Tipos de Apuesta y Cashback</h3><div className="table-scroll"><table><thead><tr><th>Tipo de apuesta</th><th>Descripción</th><th>Cashback</th></tr></thead><tbody>{data.types.map(x => <tr key={x.type}><td>{x.type}</td><td>{x.description}</td><td>{x.cashback}</td></tr>)}</tbody></table></div><h3>Tabla de Cashback por Clase de Hipódromo</h3><div className="table-scroll"><table><thead><tr><th>Clase de Hipódromo</th><th>PWPS</th><th>PEXO</th></tr></thead><tbody>{data.classes.map(x => <tr key={x.class}><td>{x.class}</td><td>{x.pwps}</td><td>{x.pexo}</td></tr>)}</tbody></table></div><p>{data.example}</p></div> }

type AnyRecord = Record<string, any>;
function Admin({ content, onSaved, onPublic }: { content: Content; onSaved: (v: Content) => void; onPublic: () => void }) {
  const [session, setSession] = useState<any>(null); const [username, setUsername] = useState("babieca"); const [password, setPassword] = useState(""); const [draft, setDraft] = useState<Content>(content); const [tab, setTab] = useState("promos"); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  useEffect(() => { setDraft(content) }, [content]);
  useEffect(() => { if (!supabase) return; supabase.auth.getSession().then(({ data }) => setSession(data.session)); const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s)); return () => subscription.unsubscribe() }, []);
  const updatePath = (path: (string | number)[], value: any) => setDraft(prev => { const copy = structuredClone(prev) as any; let at = copy; for (const key of path.slice(0, -1)) at = at[key]; at[path[path.length - 1]] = value; return copy });
  const addAt = (path: (string | number)[], item: any) => { const copy = structuredClone(draft) as any; let at = copy; for (const key of path) at = at[key]; at.push(item); setDraft(copy) };
  const deleteAt = (path: (string | number)[], index: number) => { if (!confirm("¿Eliminar este elemento? Esta acción se aplicará al guardar.")) return; const copy = structuredClone(draft) as any; let at = copy; for (const key of path) at = at[key]; at.splice(index, 1); setDraft(copy) };
  const moveAt = (path: (string | number)[], index: number, delta: number) => { const copy = structuredClone(draft) as any; let at = copy; for (const key of path) at = at[key]; const target = index + delta; if (target < 0 || target >= at.length) return;[at[index], at[target]] = [at[target], at[index]]; setDraft(copy) };
  const save = async () => { setBusy(true); setError(""); setMessage(""); if (!supabase) { setError("Falta configurar la conexión con Supabase. Revisa las variables de entorno."); setBusy(false); return } const promoDays = draft.promos.map(p => p.day.trim().toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "")); const validPromoSchedule = draft.promos.length === 7 && weekdays.every(day => promoDays.filter(value => value === day.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "")).length === 1); const validUrl = (value: string) => { try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" } catch { return false } }; const missing = !validPromoSchedule || draft.promos.some(p => !p.name.trim() || !p.description.trim() || !validUrl(p.image)) || draft.countries.some(c => !c.country.trim() || !c.currency.trim() || [...c.mondayWednesday, ...c.thursdayFriday, ...c.saturday].some(r => ![r.bono, r.rollover, r.rango, r.bonoMaximo, r.gananciaMaxima].every(v => String(v || "").trim()))) || draft.faqs.some(f => !f.q.trim() || !f.a.trim()) || draft.terms.sections.some(s => !s.title.trim()) || draft.links.some(l => !l.label.trim() || !validUrl(l.url)); if (missing) { setError("Revisa los campos obligatorios: debe haber exactamente una promoción por cada día, con imagen válida; completa también las filas de las tablas, países, preguntas y enlaces web."); setBusy(false); return } const previousImages = content.promos.map(p => p.image); const { error } = await supabase.from("site_content").upsert({ id: "main", content: draft, updated_at: new Date().toISOString() }); setBusy(false); if (error) { setError(`No se guardó el cambio: ${error.message}`); return } let saveMessage = "Cambios guardados. La página pública ya está actualizada."; const removed = previousImages.filter(url => url && !draft.promos.some(p => p.image === url) && url.includes("/storage/v1/object/public/landing-images/")); if (removed.length) { const paths = removed.map(url => url.split("/storage/v1/object/public/landing-images/")[1]).filter(Boolean); if (paths.length) { const { error: removeError } = await supabase.storage.from("landing-images").remove(paths); if (removeError) saveMessage = "El contenido se guardó, pero no se pudo borrar una imagen antigua del almacenamiento." } } onSaved(draft); setMessage(saveMessage); };
  const login = async (e: FormEvent) => { e.preventDefault(); setBusy(true); setError(""); if (!supabase) { setError("Supabase aún no está configurado en esta instalación."); setBusy(false); return } try { const response = await fetch("/api/admin-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) }); const raw = await response.text(); let result: { access_token?: string; refresh_token?: string; error?: string } = {}; try { result = JSON.parse(raw); } catch { /* Give a useful endpoint/deployment hint below. */ } if (!response.ok || !result.access_token || !result.refresh_token) { const message = result.error || (response.status === 404 ? "Vercel no encontró /api/admin-login. Publica el último commit y confirma que la función esté en la raíz del proyecto." : `El servicio de acceso respondió con un error (HTTP ${response.status}). Revisa los registros de Functions en Vercel.`); setError(message); setBusy(false); return } const { data, error: sessionError } = await supabase.auth.setSession({ access_token: result.access_token, refresh_token: result.refresh_token }); setBusy(false); if (sessionError) { setError("La sesión no se pudo iniciar. Inténtalo de nuevo."); return } setSession(data.session) } catch { setBusy(false); setError("No se pudo contactar /api/admin-login. Confirma el dominio de Vercel e inténtalo de nuevo."); } };
  const logout = async () => { await supabase?.auth.signOut(); setSession(null) };
  if (!supabaseReady) return <div className="admin-page"><header className="admin-top"><span className="wordmark">HÍPICAS <b>BABIECA</b></span><button onClick={onPublic}>Ver landing</button></header><section className="login-card"><div className="section-kicker"><span>ADMINISTRACIÓN</span><i /></div><h1>Conecta Supabase</h1><p>La página pública funciona con el contenido inicial. Configura las variables indicadas en <code>.env.example</code> para habilitar inicio de sesión y guardado seguro.</p></section></div>;
  if (!session) return <div className="admin-page"><header className="admin-top"><span className="wordmark">HÍPICAS <b>BABIECA</b></span><button onClick={onPublic}>Ver landing</button></header><form className="login-card" onSubmit={login}><div className="section-kicker"><span>ACCESO DEL EQUIPO</span><i /></div><h1>Panel de control</h1><p>Ingresa con las credenciales compartidas del equipo.</p><label>Usuario<input type="text" required value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" /></label><label>Contraseña<input type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" /></label>{error && <p className="form-error">{error}</p>}<button className="button button-gold full-button" disabled={busy}>{busy ? "Ingresando…" : "Ingresar al panel"}</button></form></div>;
  const tabs = ["promos", "países", "preguntas", "términos", "textos y enlaces", "avisos"];
  return <div className="admin-page"><header className="admin-top"><span className="wordmark">HÍPICAS <b>BABIECA</b><small> · ADMIN</small></span><div><button onClick={onPublic}>Ver landing</button><button onClick={() => void logout()}>Cerrar sesión</button></div></header><div className="admin-layout"><aside className="admin-sidebar"><p>CONTENIDO</p>{tabs.map((x, i) => <button key={x} className={tab === x ? "selected" : ""} onClick={() => setTab(x)}><span>0{i + 1}</span>{x}</button>)}<div className="sidebar-foot">Sesión compartida activa</div></aside><section className="editor"><div className="editor-heading"><div><div className="section-kicker"><span>EDICIÓN DE CONTENIDO</span><i /></div><h1>{tab}</h1></div><button className="button button-gold save-button" disabled={busy} onClick={() => void save()}>{busy ? "Guardando…" : <><Check size={16} /> Guardar cambios</>}</button></div>{message && <div className="success-note"><Check size={16} />{message}</div>}{error && <div className="error-note"><CircleAlert size={16} />{error}</div>}
    {tab === "promos" && <div className="editor-list">{draft.promos.map((p, i) => <EditorCard key={i} title={`${String(i + 1).padStart(2, "0")} · ${p.day}`} index={i} length={draft.promos.length} onMove={d => moveAt(["promos"], i, d)} onDelete={() => deleteAt(["promos"], i)}><label className="field">Día de la semana<select required value={p.day} onChange={e => updatePath(["promos", i, "day"], e.target.value)}>{weekdays.map(day => <option key={day}>{day}</option>)}</select></label><Field label="Nombre" value={p.name} onChange={v => updatePath(["promos", i, "name"], v)} /><Field label="Descripción" value={p.description} area onChange={v => updatePath(["promos", i, "description"], v)} /><ImageField value={p.image} crop={getImageCrop(p)} onChange={v => updatePath(["promos", i, "image"], v)} onCropChange={v => updatePath(["promos", i, "imageCrop"], v)} /></EditorCard>)}<button className="add-item" onClick={() => addAt(["promos"], { day: weekdays.find(day => !draft.promos.some(p => p.day === day)) || weekdays[0], name: "Nueva promoción", description: "", image: "", imageCrop: { ...defaultImageCrop } })}>＋ Agregar promoción</button></div>}
    {tab === "países" && <div className="editor-list">{draft.countries.map((c, i) => <EditorCard key={i} title={`${c.flag} ${c.country}`} index={i} length={draft.countries.length} onMove={d => moveAt(["countries"], i, d)} onDelete={() => deleteAt(["countries"], i)}><div className="field-grid"><Field label="País" value={c.country} onChange={v => updatePath(["countries", i, "country"], v)} /><Field label="Moneda" value={c.currency} onChange={v => updatePath(["countries", i, "currency"], v)} /><Field label="Bandera" value={c.flag} onChange={v => updatePath(["countries", i, "flag"], v)} /></div>{([{ key: "mondayWednesday", name: "Lunes, martes y miércoles" }, { key: "thursdayFriday", name: "Jueves y viernes" }, { key: "saturday", name: "Sábado" }] as const).map(period => <NestedTable key={period.key} title={period.name} rows={c[period.key]} onChange={rows => updatePath(["countries", i, period.key], rows)} />)}</EditorCard>)}<button className="add-item" onClick={() => addAt(["countries"], { flag: "🌎", country: "Nuevo país", currency: "", mondayWednesday: [], thursdayFriday: [], saturday: [] })}>＋ Agregar país</button></div>}
    {tab === "preguntas" && <div className="editor-list">{draft.faqs.map((f, i) => <EditorCard key={i} title={f.q || `Pregunta ${i + 1}`} index={i} length={draft.faqs.length} onMove={d => moveAt(["faqs"], i, d)} onDelete={() => deleteAt(["faqs"], i)}><Field label="Pregunta" required value={f.q} onChange={v => updatePath(["faqs", i, "q"], v)} /><Field label="Respuesta" required area value={f.a} onChange={v => updatePath(["faqs", i, "a"], v)} /></EditorCard>)}<button className="add-item" onClick={() => addAt(["faqs"], { q: "", a: "" })}>＋ Agregar pregunta</button></div>}
    {tab === "términos" && <div className="editor-list"><EditorCard title="Encabezado y cierre"><Field label="Subtítulo" value={draft.terms.subtitle} onChange={v => updatePath(["terms", "subtitle"], v)} /><Field label="Aviso final" value={draft.terms.finalNotice} onChange={v => updatePath(["terms", "finalNotice"], v)} /></EditorCard>{draft.terms.sections.map((s, i) => <EditorCard key={s.number} title={`${s.number} · ${s.title}`} index={i} length={draft.terms.sections.length} onMove={d => moveAt(["terms", "sections"], i, d)} onDelete={() => deleteAt(["terms", "sections"], i)}><Field label="Título" value={s.title} onChange={v => updatePath(["terms", "sections", i, "title"], v)} /><Field label="Contenido (un párrafo o viñeta por línea)" area value={s.items.join("\n")} onChange={v => updatePath(["terms", "sections", i, "items"], v.split("\n").filter(x => x.trim()))} /></EditorCard>)}<button className="add-item" onClick={() => addAt(["terms", "sections"], { number: String(draft.terms.sections.length + 1).padStart(2, "0"), title: "Nueva sección", items: [] })}>＋ Agregar sección</button><ListEditor title="Tipos de apuesta y cashback" list={draft.terms.cashback.types} fields={["type", "description", "cashback"]} labels={{ type: "Tipo", description: "Descripción", cashback: "Cashback" }} onChange={v => updatePath(["terms", "cashback", "types"], v)} onDelete={i => deleteAt(["terms", "cashback", "types"], i)} onMove={(i, d) => moveAt(["terms", "cashback", "types"], i, d)} onAdd={() => addAt(["terms", "cashback", "types"], { type: "", description: "", cashback: "" })} /><ListEditor title="Cashback por clase de hipódromo" list={draft.terms.cashback.classes} fields={["class", "pwps", "pexo"]} labels={{ class: "Clase", pwps: "PWPS", pexo: "PEXO" }} onChange={v => updatePath(["terms", "cashback", "classes"], v)} onDelete={i => deleteAt(["terms", "cashback", "classes"], i)} onMove={(i, d) => moveAt(["terms", "cashback", "classes"], i, d)} onAdd={() => addAt(["terms", "cashback", "classes"], { class: "", pwps: "", pexo: "" })} /><EditorCard title="Ejemplo de cálculo"><Field label="Ejemplo" area value={draft.terms.cashback.example} onChange={v => updatePath(["terms", "cashback", "example"], v)} /></EditorCard></div>}
    {tab === "textos y enlaces" && <div className="editor-list"><EditorCard title="Portada y marca"><Field label="Nombre de marca" value={draft.brand} onChange={v => updatePath(["brand"], v)} /><Field label="Texto destacado" value={draft.hero.eyebrow} onChange={v => updatePath(["hero", "eyebrow"], v)} /><Field label="Título" value={draft.hero.title} onChange={v => updatePath(["hero", "title"], v)} /><Field label="Descripción" area value={draft.hero.description} onChange={v => updatePath(["hero", "description"], v)} /><Field label="Aviso de juego responsable" value={draft.hero.notice} onChange={v => updatePath(["hero", "notice"], v)} /><Field label="Texto de pie de página" value={draft.footerText} onChange={v => updatePath(["footerText"], v)} /></EditorCard><ListEditor title="Enlaces" list={draft.links} fields={["label", "url"]} labels={{ label: "Texto", url: "Dirección web" }} onChange={v => updatePath(["links"], v)} onDelete={i => deleteAt(["links"], i)} onMove={(i, d) => moveAt(["links"], i, d)} onAdd={() => addAt(["links"], { label: "Nuevo enlace", url: "https://" })} /><ListEditor title="Pasos" list={draft.steps} fields={["title", "description"]} labels={{ title: "Título", description: "Descripción" }} onChange={v => updatePath(["steps"], v)} onDelete={i => deleteAt(["steps"], i)} onMove={(i, d) => moveAt(["steps"], i, d)} onAdd={() => addAt(["steps"], { title: "Nuevo paso", description: "" })} /></div>}
    {tab === "avisos" && <ListEditor title="Avisos de la landing" list={draft.notices} fields={["title", "text"]} labels={{ title: "Título", text: "Aviso" }} onChange={v => updatePath(["notices"], v)} onDelete={i => deleteAt(["notices"], i)} onMove={(i, d) => moveAt(["notices"], i, d)} onAdd={() => addAt(["notices"], { title: "Nuevo aviso", text: "" })} />}
    <div className="editor-foot"><span>Los cambios se reflejan en la landing después de guardar.</span><button className="button button-gold" disabled={busy} onClick={() => void save()}>{busy ? "Guardando…" : "Guardar cambios"}</button></div></section></div></div>;
}

function Field({ label, value, onChange, area = false, required = false }: { label: string; value: string; onChange: (s: string) => void; area?: boolean; required?: boolean }) { return <label className="field">{label}{area ? <textarea required={required} value={value || ""} onChange={e => onChange(e.target.value)} /> : <input required={required} value={value || ""} onChange={e => onChange(e.target.value)} />}</label> }
function EditorCard({ title, children, index, length, onMove, onDelete }: { title: string; children: ReactNode; index?: number; length?: number; onMove?: (d: number) => void; onDelete?: () => void }) { return <article className="edit-card"><div className="edit-card-head"><h3>{title}</h3><div>{onMove && <><button aria-label="Mover arriba" disabled={index === 0} onClick={() => onMove(-1)}><ArrowUp size={15} /></button><button aria-label="Mover abajo" disabled={index === length! - 1} onClick={() => onMove(1)}><ArrowDown size={15} /></button></>}{onDelete && <button className="delete-button" onClick={onDelete}>Eliminar</button>}</div></div><div className="edit-card-body">{children}</div></article> }
function ImageField({ value, crop, onChange, onCropChange }: { value: string; crop: ImageCrop; onChange: (v: string) => void; onCropChange: (v: ImageCrop) => void }) {
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [url, setUrl] = useState(value || "");
  const dragOrigin = useRef<{ pointerX: number; pointerY: number; x: number; y: number } | null>(null);
  const imageSource = preview || value;
  const focalPoint = crop.x + "% " + crop.y + "%";
  const previewImageStyle = { objectFit: "cover" as const, objectPosition: focalPoint, transform: "scale(" + crop.zoom + ")", transformOrigin: focalPoint };

  useEffect(() => { setUrl(value || ""); }, [value]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(selected.type)) {
      setFile(null); setPreview(""); setError("Formatos admitidos: JPG, PNG, WEBP o GIF."); e.target.value = ""; return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setFile(null); setPreview(""); setError("La imagen debe pesar menos de 10 MB."); e.target.value = ""; return;
    }
    setError("");
    onCropChange({ ...defaultImageCrop });
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const beginCrop = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragOrigin.current = { pointerX: e.clientX, pointerY: e.clientY, x: crop.x, y: crop.y };
  };

  const moveCrop = (e: ReactPointerEvent<HTMLDivElement>) => {
    const origin = dragOrigin.current;
    if (!origin) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, origin.x - ((e.clientX - origin.pointerX) / bounds.width) * 100));
    const y = Math.max(0, Math.min(100, origin.y - ((e.clientY - origin.pointerY) / bounds.height) * 100));
    onCropChange({ ...crop, x, y });
  };

  const removeImage = () => {
    if (!confirm("¿Quitar esta imagen de la promoción?")) return;
    onChange(""); setUrl(""); setPreview(""); setFile(null); onCropChange({ ...defaultImageCrop });
  };

  const upload = async () => {
    if (!file || !supabase) return;
    const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "img";
    const path = "promos/" + crypto.randomUUID() + "." + ext;
    const { error: uploadError } = await supabase.storage.from("landing-images").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) { setError("No se pudo subir la imagen: " + uploadError.message); return; }
    const { data } = supabase.storage.from("landing-images").getPublicUrl(path);
    onChange(data.publicUrl); setUrl(data.publicUrl); setFile(null); setPreview(""); setError("Imagen subida. Guarda los cambios para publicarla.");
  };

  return <div className="image-field">
    <label className="field">Imagen de la promoción
      <input type="url" value={url} placeholder="URL de imagen o sube un archivo" onChange={e => { setUrl(e.target.value); onChange(e.target.value); setFile(null); setPreview(""); setError(""); onCropChange({ ...defaultImageCrop }); }} />
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handle} />
      <small className="image-help">JPG, PNG, WEBP o GIF · hasta 10 MB. Las tarjetas públicas usan formato 4:3.</small>
    </label>
    {imageSource && <>
      <div className="image-preview-grid">
        <div className="image-preview-block">
          <span>Imagen original completa</span>
          <div className="image-source-frame"><img src={imageSource} alt="Vista completa de la imagen seleccionada" /></div>
        </div>
        <div className="image-preview-block">
          <span>Recorte 4:3 · arrastra para mover</span>
          <div className="image-card-frame" onPointerDown={beginCrop} onPointerMove={moveCrop} onPointerUp={() => { dragOrigin.current = null; }} onPointerCancel={() => { dragOrigin.current = null; }}>
            <img src={imageSource} alt="Vista del recorte 4:3" style={previewImageStyle} draggable={false} />
          </div>
        </div>
      </div>
      <label className="field image-zoom-field">Acercamiento: {crop.zoom.toFixed(2)}×
        <input type="range" min="1" max="3" step="0.05" value={crop.zoom} onChange={e => onCropChange({ ...crop, zoom: Number(e.target.value) })} />
      </label>
      <button type="button" className="upload-save image-reset" onClick={() => onCropChange({ ...defaultImageCrop })}>Restablecer recorte</button>
      <button type="button" className="upload-save image-remove" onClick={removeImage}>Quitar imagen</button>
    </>}
    {error && <span className="form-error">{error}</span>}
    <button type="button" className="upload-save" disabled={!file} onClick={() => void upload()}>Subir imagen y usarla</button>
  </div>;
}

function NestedTable({ title, rows, onChange }: { title: string; rows: AnyRecord[]; onChange: (v: AnyRecord[]) => void }) { const fields = ["bono", "rollover", "rango", "bonoMaximo", "gananciaMaxima"]; return <div className="nested-table"><h4>{title}</h4>{rows.map((row, i) => <div className="row-fields" key={i}>{fields.map(f => <label key={f}>{({ bono: "Bono", rollover: "Rollover", rango: "Rango", bonoMaximo: "Bono máx.", gananciaMaxima: "Ganancia máx." } as any)[f]}<input value={row[f] || ""} onChange={e => onChange(rows.map((r, j) => j === i ? { ...r, [f]: e.target.value } : r))} /></label>)}<div className="row-actions"><button disabled={i === 0} aria-label="Mover fila arriba" onClick={() => { const next = [...rows];[next[i - 1], next[i]] = [next[i], next[i - 1]]; onChange(next) }}>↑</button><button disabled={i === rows.length - 1} aria-label="Mover fila abajo" onClick={() => { const next = [...rows];[next[i + 1], next[i]] = [next[i], next[i + 1]]; onChange(next) }}>↓</button><button className="mini-delete" onClick={() => { if (confirm("¿Eliminar esta fila?")) onChange(rows.filter((_, j) => j !== i)) }}>×</button></div></div>)}<button className="add-row" onClick={() => onChange([...rows, { bono: "", rollover: "", rango: "", bonoMaximo: "", gananciaMaxima: "" }])}>＋ Agregar fila</button></div> }
function ListEditor({ title, list, fields, labels, onChange, onDelete, onMove, onAdd }: { title: string; list: AnyRecord[]; fields: string[]; labels: Record<string, string>; onChange: (v: AnyRecord[]) => void; onDelete: (i: number) => void; onMove: (i: number, d: number) => void; onAdd: () => void }) { return <div className="editor-list"><div className="list-heading"><h2>{title}</h2><button onClick={onAdd}>＋ Agregar</button></div>{list.map((item, i) => <EditorCard key={i} title={item[fields[0]] || `${title} ${i + 1}`} index={i} length={list.length} onMove={d => onMove(i, d)} onDelete={() => onDelete(i)}><div className="field-grid">{fields.map(f => <Field key={f} label={labels[f]} value={item[f]} area={f === "text" || f === "description"} onChange={v => onChange(list.map((r, j) => j === i ? { ...r, [f]: v } : r))} />)}</div></EditorCard>)}</div> }
