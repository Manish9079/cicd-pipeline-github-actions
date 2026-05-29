import { useState, useEffect, useRef } from "react";

/* ─── useWindowSize hook ─────────────────────────────────────────────────── */
function useWindowSize() {
  const [size, setSize] = useState({ w: typeof window !== "undefined" ? window.innerWidth : 800 });
  useEffect(() => {
    const fn = () => setSize({ w: window.innerWidth });
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return size;
}

/* ─── useVisible (intersection observer) ────────────────────────────────── */
function useVisible(thresh = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: thresh });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [thresh]);
  return [ref, vis];
}

/* ─── Global CSS ─────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#050810; --bg2:#080d1a;
  --surf:rgba(10,18,40,0.75);
  --bdr:rgba(56,139,253,0.18);
  --blue:#388bfd; --cyan:#00d9f5;
  --purple:#a371f7; --green:#3fb950; --yellow:#e3b341;
  --text:#e6edf3; --muted:#7d8590;
  --fh:'Syne',sans-serif; --fm:'JetBrains Mono',monospace;
}
html{scroll-behavior:smooth;}
body{background:var(--bg);color:var(--text);font-family:var(--fm);overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:var(--blue);border-radius:2px;}

/* glass card */
.g{background:var(--surf);backdrop-filter:blur(14px);border:1px solid var(--bdr);border-radius:14px;}

/* animations */
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-14px);}}
@keyframes glow{0%,100%{box-shadow:0 0 18px rgba(56,139,253,.3);}50%{box-shadow:0 0 36px rgba(56,139,253,.7),0 0 60px rgba(0,217,245,.2);}}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
@keyframes orb{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(24px,-16px) scale(1.04);}66%{transform:translate(-16px,12px) scale(.97);}}
@keyframes up{from{opacity:0;transform:translateY(36px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}

.anim-glow{animation:glow 3s ease-in-out infinite;}
.reveal{opacity:0;transform:translateY(28px);transition:opacity .65s ease,transform .65s ease;}
.reveal.on{opacity:1;transform:translateY(0);}

/* buttons */
.btn-p{
  display:inline-flex;align-items:center;gap:7px;
  padding:11px 20px;
  background:linear-gradient(135deg,var(--blue),var(--cyan));
  color:#000;font-weight:700;font-size:12px;letter-spacing:.05em;
  border:none;border-radius:8px;cursor:pointer;text-decoration:none;
  font-family:var(--fm);transition:transform .2s,box-shadow .2s;
  white-space:nowrap;
}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 26px rgba(56,139,253,.45);}
.btn-g{
  display:inline-flex;align-items:center;gap:7px;
  padding:11px 20px;
  background:transparent;color:var(--text);
  font-weight:600;font-size:12px;letter-spacing:.05em;
  border:1px solid var(--bdr);border-radius:8px;cursor:pointer;
  text-decoration:none;font-family:var(--fm);
  transition:background .2s,border-color .2s,transform .2s;
  white-space:nowrap;
}
.btn-g:hover{background:rgba(56,139,253,.1);border-color:var(--blue);transform:translateY(-2px);}

/* nav */
.nav-a{color:var(--muted);text-decoration:none;font-size:12px;letter-spacing:.05em;background:none;border:none;cursor:pointer;transition:color .2s;}
.nav-a:hover,.nav-a.on{color:var(--cyan);}

/* tags */
.tag{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:600;letter-spacing:.05em;font-family:var(--fm);}
.tl{background:rgba(56,139,253,.15);color:var(--blue);border:1px solid rgba(56,139,253,.3);}
.tp{background:rgba(0,217,245,.15);color:var(--cyan);border:1px solid rgba(0,217,245,.3);}
.tu{background:rgba(163,113,247,.15);color:var(--purple);border:1px solid rgba(163,113,247,.3);}
.ti{background:rgba(63,185,80,.15);color:var(--green);border:1px solid rgba(63,185,80,.3);}
.tplan{background:rgba(227,179,65,.15);color:var(--yellow);border:1px solid rgba(227,179,65,.3);}
.tong{background:rgba(56,139,253,.15);color:var(--blue);border:1px solid rgba(56,139,253,.3);}

/* project card hover */
.pcard{position:relative;overflow:hidden;padding:24px;transition:transform .3s,box-shadow .3s;}
.pcard::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--blue),var(--cyan),transparent);opacity:0;transition:opacity .3s;}
.pcard:hover{transform:translateY(-5px);box-shadow:0 18px 50px rgba(56,139,253,.18);}
.pcard:hover::before{opacity:1;}

/* input */
.inp{
  width:100%;padding:11px 14px;
  background:rgba(10,18,40,.85);border:1px solid var(--bdr);
  border-radius:8px;color:var(--text);font-family:var(--fm);font-size:13px;
  outline:none;resize:none;transition:border-color .2s,box-shadow .2s;
}
.inp:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(56,139,253,.15);}
.inp::placeholder{color:var(--muted);}

/* section title */
.st{font-family:var(--fh);font-size:clamp(26px,5vw,40px);font-weight:800;letter-spacing:-.02em;line-height:1.1;}
.sl{font-size:11px;font-weight:600;letter-spacing:.14em;color:var(--cyan);text-transform:uppercase;}

/* ── RESPONSIVE GRID HELPERS ── */
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
.grid-2-sm{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.grid-auto{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;}

@media(max-width:700px){
  .grid-2{grid-template-columns:1fr!important;gap:20px;}
  .grid-2-sm{grid-template-columns:1fr 1fr;}
  .grid-auto{grid-template-columns:1fr!important;}
  .hide-mob{display:none!important;}
  .show-mob{display:flex!important;}
  .hero-btns{flex-direction:column;align-items:stretch;}
  .hero-btns a,.hero-btns button{justify-content:center;}
  .hero-stats{gap:20px!important;}
  .sec-pad{padding:70px 16px!important;}
  .hero-sec{padding:90px 16px 50px!important;}
  .menu-btn{display:flex!important;}
  .desk-nav{display:none!important;}
  .github-grid{grid-template-columns:1fr!important;}
  .span2{grid-column:span 1!important;}
  .contact-grid{grid-template-columns:1fr!important;}
}

@media(min-width:701px){
  .show-mob{display:none!important;}
  .menu-btn{display:none!important;}
}

/* timeline */
.tl-line{position:absolute;left:6px;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,var(--cyan),var(--purple),rgba(56,139,253,.1));}
.tl-dot{width:14px;height:14px;border-radius:50%;border:2px solid var(--blue);background:var(--bg);position:absolute;left:0;top:6px;z-index:2;flex-shrink:0;}
.tl-dot.done{background:var(--cyan);box-shadow:0 0 12px rgba(0,217,245,.6);border-color:var(--cyan);}
.tl-dot.cur{background:var(--blue);box-shadow:0 0 10px rgba(56,139,253,.6);}
`;

/* ─── SVG Icons ──────────────────────────────────────────────────────────── */
const Ico = {
  Github:(p)=><svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>,
  Li:(p)=><svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  Mail:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Pin:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Phone:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.43h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Ext:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>,
  Term:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>,
  Cloud:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>,
  Server:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>,
  Git:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>,
  Code:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Cpu:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2"/></svg>,
  Check:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Book:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  Send:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>,
  Menu:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  X:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Star:(p)=><svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

/* ─── Typewriter terminal ────────────────────────────────────────────────── */
function Typewriter({ lines }) {
  const [done, setDone] = useState([]);
  const [li, setLi] = useState(0);
  const [ci, setCi] = useState(0);
  useEffect(() => {
    if (li >= lines.length) return;
    if (ci < lines[li].length) {
      const t = setTimeout(() => setCi(c => c+1), 38);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setDone(d=>[...d,lines[li]]); setLi(l=>l+1); setCi(0); }, 480);
    return () => clearTimeout(t);
  }, [li, ci, lines]);
  return (
    <div style={{fontFamily:"var(--fm)",fontSize:12,lineHeight:1.9,color:"var(--text)"}}>
      {done.map((l,i)=>(
        <div key={i}><span style={{color:"var(--green)"}}>$ </span><span>{l}</span></div>
      ))}
      {li < lines.length && (
        <div>
          <span style={{color:"var(--green)"}}>$ </span>
          <span>{lines[li].slice(0,ci)}</span>
          <span style={{animation:"blink 1s step-end infinite",borderLeft:"2px solid var(--cyan)"}}>&nbsp;</span>
        </div>
      )}
    </div>
  );
}

/* ─── Floating BG dots ───────────────────────────────────────────────────── */
function BgDots() {
  const cvs = useRef(null);
  useEffect(()=>{
    const c = cvs.current; const ctx = c.getContext("2d");
    let W=c.width=window.innerWidth, H=c.height=window.innerHeight;
    const onR=()=>{W=c.width=window.innerWidth;H=c.height=window.innerHeight;};
    window.addEventListener("resize",onR);
    const pts = Array.from({length:55},()=>({
      x:Math.random()*W,y:Math.random()*H,
      vx:(Math.random()-.5)*.25,vy:-Math.random()*.4-.08,
      r:Math.random()*1.4+.4,a:Math.random()*.4+.1,
      col:Math.random()>.5?"56,139,253":"0,217,245"
    }));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.y<-5){p.y=H+5;p.x=Math.random()*W;}
        if(p.x<-5)p.x=W+5; if(p.x>W+5)p.x=-5;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${p.col},${p.a})`; ctx.fill();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",onR);};
  },[]);
  return <canvas ref={cvs} style={{position:"fixed",top:0,left:0,pointerEvents:"none",zIndex:0,opacity:.55}}/>;
}

/* ─── NAVBAR ─────────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled,setScrolled]=useState(false);
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState("home");
  const links=["home","about","skills","journey","projects","github","contact"];

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>20);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  const go=(id)=>{
    document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
    setActive(id); setOpen(false);
  };

  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:999,
      background:scrolled?"rgba(5,8,16,0.92)":"transparent",
      backdropFilter:scrolled?"blur(18px)":"none",
      borderBottom:scrolled?"1px solid var(--bdr)":"none",
      transition:"all .3s",
    }}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
        {/* Logo */}
        <div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:17,letterSpacing:"-.03em",flexShrink:0}}>
          <span style={{color:"var(--cyan)"}}>MK</span>
          <span style={{color:"var(--muted)",fontSize:11,marginLeft:7,fontFamily:"var(--fm)",fontWeight:400}}>@devops</span>
        </div>
        {/* Desktop nav */}
        <div className="desk-nav" style={{display:"flex",gap:24,alignItems:"center"}}>
          {links.map(l=>(
            <button key={l} className={`nav-a${active===l?" on":""}`} onClick={()=>go(l)}>{l}</button>
          ))}
        </div>
        {/* Mobile hamburger */}
        <button className="menu-btn" onClick={()=>setOpen(!open)}
          style={{background:"none",border:"none",color:"var(--text)",cursor:"pointer",padding:4}}>
          {open?<Ico.X width={22} height={22}/>:<Ico.Menu width={22} height={22}/>}
        </button>
      </div>
      {/* Mobile drawer */}
      {open && (
        <div className="g" style={{margin:"0 12px 12px",padding:"16px 20px",display:"flex",flexDirection:"column",gap:4}}>
          {links.map(l=>(
            <button key={l} onClick={()=>go(l)}
              style={{background:"none",border:"none",color:active===l?"var(--cyan)":"var(--text)",
                fontFamily:"var(--fm)",fontSize:14,textAlign:"left",cursor:"pointer",padding:"10px 0",
                borderBottom:"1px solid rgba(255,255,255,.04)"}}>
              <span style={{color:"var(--green)",marginRight:8}}>$</span>{l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ─── HERO ───────────────────────────────────────────────────────────────── */
function Hero() {
  const {w} = useWindowSize();
  const mob = w <= 700;
  const termLines=[
    "whoami","Manish Kumawat — BCA Student",
    "cat goals.txt","Become a Cloud & DevOps Engineer",
    "ls skills/","linux  git  aws  docker  nginx",
    "echo 'Journey starts now...'"
  ];
  return (
    <section id="home" className="hero-sec"
      style={{minHeight:"100vh",display:"flex",alignItems:"center",
        padding:mob?"90px 16px 50px":"90px 24px 60px",position:"relative",overflow:"hidden"}}>
      {/* bg orbs */}
      <div style={{position:"absolute",top:"10%",right:"2%",width:mob?240:380,height:mob?240:380,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(56,139,253,.1) 0%,transparent 70%)",
        animation:"orb 12s ease-in-out infinite",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"8%",left:"2%",width:mob?180:280,height:mob?180:280,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(163,113,247,.08) 0%,transparent 70%)",
        animation:"orb 16s ease-in-out infinite reverse",pointerEvents:"none"}}/>

      <div style={{maxWidth:1100,margin:"0 auto",width:"100%",
        display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:mob?36:56,alignItems:"center"}}>

        {/* LEFT TEXT */}
        <div style={{animation:"up .8s ease both"}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:18}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:"var(--green)",
              boxShadow:"0 0 10px var(--green)",display:"inline-block",animation:"glow 2s infinite"}}/>
            <span style={{fontSize:11,color:"var(--green)",fontFamily:"var(--fm)",letterSpacing:".1em"}}>
              OPEN TO OPPORTUNITIES
            </span>
          </div>

          <h1 style={{fontFamily:"var(--fh)",fontSize:mob?"clamp(28px,8vw,38px)":"clamp(32px,4vw,52px)",
            fontWeight:800,lineHeight:1.1,letterSpacing:"-.03em",marginBottom:16}}>
            Building My Journey<br/>
            <span style={{background:"linear-gradient(135deg,var(--blue),var(--cyan))",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              Into Cloud &amp; DevOps
            </span>
          </h1>

          <p style={{color:"var(--cyan)",fontSize:13,marginBottom:10,fontWeight:500}}>
            Aspiring Cloud & DevOps Engineer · Linux Enthusiast · BCA Student
          </p>
          <p style={{color:"var(--muted)",fontSize:13,lineHeight:1.8,marginBottom:28}}>
            Learning Cloud Computing, DevOps, Linux, AWS & Docker while
            building real projects and documenting the journey.
          </p>

          <div className="hero-btns" style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:32}}>
            <a href="https://github.com/Manish9079" target="_blank" rel="noreferrer" className="btn-p">
              <Ico.Github width={14} height={14}/> GitHub
            </a>
            <a href="https://www.linkedin.com/in/manish-kmt-264541369/" target="_blank" rel="noreferrer" className="btn-g">
              <Ico.Li width={14} height={14}/> LinkedIn
            </a>
            <a href="mailto:mkm165597@gmail.com" className="btn-g">
              <Ico.Mail width={14} height={14}/> Contact
            </a>
          </div>

          <div className="hero-stats" style={{display:"flex",gap:28,flexWrap:"wrap"}}>
            {[["BCA","5th Sem"],["Cloud","Learner"],["Linux","Enthusiast"]].map(([t,s])=>(
              <div key={t}>
                <div style={{fontSize:16,fontWeight:700,color:"var(--cyan)",fontFamily:"var(--fh)"}}>{t}</div>
                <div style={{fontSize:10,color:"var(--muted)",letterSpacing:".07em"}}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT TERMINAL */}
        <div style={{animation:"up .8s .18s ease both",animationFillMode:"both"}}>
          <div className="g anim-glow" style={{borderRadius:12,overflow:"hidden"}}>
            {/* terminal bar */}
            <div style={{background:"rgba(0,0,0,.4)",padding:"11px 14px",display:"flex",
              alignItems:"center",gap:7,borderBottom:"1px solid var(--bdr)"}}>
              {["#ff5f57","#febc2e","#28c840"].map((c,i)=>(
                <span key={i} style={{width:11,height:11,borderRadius:"50%",background:c,display:"inline-block"}}/>
              ))}
              <span style={{marginLeft:8,fontSize:11,color:"var(--muted)"}}>manish@cloud-devops ~ </span>
            </div>
            <div style={{padding:"18px 18px 22px",minHeight:mob?160:200}}>
              <Typewriter lines={termLines}/>
            </div>
          </div>

          {/* floating icons row */}
          <div style={{display:"flex",justifyContent:"center",gap:14,marginTop:18,flexWrap:"wrap"}}>
            {[Ico.Cloud,Ico.Server,Ico.Git,Ico.Term,Ico.Cpu].map((Ic,i)=>(
              <div key={i} className="g" style={{
                width:44,height:44,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",
                animation:`float ${4+i*.35}s ease-in-out ${i*.25}s infinite`,
                color:i%2===0?"var(--blue)":"var(--cyan)",
              }}>
                <Ic width={18} height={18}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── ABOUT ──────────────────────────────────────────────────────────────── */
function About() {
  const [ref,vis]=useVisible();
  const facts=[
    {I:Ico.Book,l:"Studying",v:"BCA @ Pratap ITS"},
    {I:Ico.Pin,l:"Based in",v:"Sikar, Rajasthan"},
    {I:Ico.Term,l:"Passion",v:"Linux & Automation"},
    {I:Ico.Cloud,l:"Goal",v:"Cloud/DevOps Engineer"},
  ];
  return (
    <section id="about" className="sec-pad" style={{padding:"80px 24px",position:"relative"}}>
      <div ref={ref} className={`reveal${vis?" on":""}`} style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{marginBottom:48}}>
          <div className="sl" style={{marginBottom:10}}>// ABOUT ME</div>
          <h2 className="st">Who Am I?</h2>
        </div>
        <div className="grid-2" style={{alignItems:"start"}}>
          {/* text col */}
          <div>
            <p style={{color:"var(--muted)",lineHeight:1.9,fontSize:13,marginBottom:16}}>
              Hey! I'm <span style={{color:"var(--text)"}}>Manish Kumawat</span>, a BCA 5th semester
              student at Pratap Institute of Technology and Science in Sikar, Rajasthan.
              I'm actively learning the skills required to become a professional Cloud & DevOps Engineer.
            </p>
            <p style={{color:"var(--muted)",lineHeight:1.9,fontSize:13,marginBottom:16}}>
              My curiosity about how large-scale apps are deployed led me to
              <span style={{color:"var(--cyan)"}}> Linux system administration</span>,{" "}
              <span style={{color:"var(--cyan)"}}>Git & GitHub</span>,{" "}
              <span style={{color:"var(--cyan)"}}>AWS cloud fundamentals</span>, and{" "}
              <span style={{color:"var(--cyan)"}}>Docker containerization</span>.
            </p>
            <p style={{color:"var(--muted)",lineHeight:1.9,fontSize:13,marginBottom:28}}>
              I learn by doing — building real projects, making mistakes and growing from them.
              I document my progress on GitHub and LinkedIn to stay accountable and connect with the tech community.
            </p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <a href="https://github.com/Manish9079" target="_blank" rel="noreferrer" className="btn-p" style={{fontSize:12,padding:"9px 16px"}}>
                <Ico.Github width={13} height={13}/> GitHub
              </a>
              <a href="mailto:mkm165597@gmail.com" className="btn-g" style={{fontSize:12,padding:"9px 16px"}}>
                <Ico.Mail width={13} height={13}/> mkm165597@gmail.com
              </a>
            </div>
          </div>
          {/* cards col */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {facts.map(({I,l,v},i)=>(
              <div key={i} className="g" style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:40,height:40,borderRadius:9,background:"rgba(56,139,253,.1)",
                  border:"1px solid rgba(56,139,253,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <I width={17} height={17} style={{color:"var(--blue)"}}/>
                </div>
                <div>
                  <div style={{fontSize:10,color:"var(--muted)",letterSpacing:".07em",marginBottom:2}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:600}}>{v}</div>
                </div>
              </div>
            ))}
            <div className="g" style={{padding:"16px 20px"}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:8}}>Contact Info</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <span style={{fontSize:12,color:"var(--text)",display:"flex",alignItems:"center",gap:6}}>
                  <Ico.Phone width={12} height={12} style={{flexShrink:0}}/>+91 9352134523
                </span>
                <span style={{fontSize:12,color:"var(--text)",display:"flex",alignItems:"center",gap:6}}>
                  <Ico.Pin width={12} height={12} style={{flexShrink:0}}/>Sikar, Rajasthan, India
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SKILLS ─────────────────────────────────────────────────────────────── */
const SKILLS = [
  {title:"Currently Learning",I:Ico.Term,col:"var(--blue)",bg:"rgba(56,139,253,.08)",items:[
    {n:"Linux",t:"tl",s:"Learning"},{n:"Git",t:"tp",s:"Practicing"},{n:"GitHub",t:"tp",s:"Practicing"},
    {n:"Cloud Computing",t:"tl",s:"Learning"},{n:"AWS EC2",t:"ti",s:"In Progress"},
    {n:"Networking",t:"tl",s:"Learning"},{n:"Nginx",t:"tl",s:"Learning"},
  ]},
  {title:"Learning Next",I:Ico.Cloud,col:"var(--purple)",bg:"rgba(163,113,247,.08)",items:[
    {n:"Docker",t:"tu",s:"Upcoming"},{n:"CI/CD",t:"tu",s:"Upcoming"},
    {n:"GitHub Actions",t:"tu",s:"Upcoming"},{n:"Monitoring",t:"tu",s:"Upcoming"},{n:"Kubernetes",t:"tu",s:"Upcoming"},
  ]},
  {title:"Frontend Knowledge",I:Ico.Code,col:"var(--cyan)",bg:"rgba(0,217,245,.08)",items:[
    {n:"HTML",t:"tp",s:"Practicing"},{n:"CSS",t:"tp",s:"Practicing"},
    {n:"JavaScript",t:"tl",s:"Learning"},{n:"React Basics",t:"ti",s:"In Progress"},
  ]},
];

function Skills() {
  const [ref,vis]=useVisible();
  return (
    <section id="skills" className="sec-pad" style={{padding:"80px 24px",background:"rgba(8,13,26,.5)"}}>
      <div ref={ref} className={`reveal${vis?" on":""}`} style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{marginBottom:48}}>
          <div className="sl" style={{marginBottom:10}}>// SKILLS & STACK</div>
          <h2 className="st">My Tech Toolbox</h2>
          <p style={{color:"var(--muted)",fontSize:13,marginTop:10}}>Honest status badges — no fake percentages.</p>
        </div>
        <div className="grid-auto">
          {SKILLS.map((g,i)=>(
            <div key={i} className="g" style={{padding:"24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                <div style={{width:38,height:38,borderRadius:9,background:g.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <g.I width={17} height={17} style={{color:g.col}}/>
                </div>
                <span style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14,color:g.col}}>{g.title}</span>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {g.items.map((s,j)=>(
                  <div key={j} className="g" style={{display:"flex",alignItems:"center",gap:7,padding:"7px 12px",borderRadius:8,transition:"transform .2s"}}>
                    <span style={{fontSize:12,color:"var(--text)"}}>{s.n}</span>
                    <span className={`tag ${s.t}`}>{s.s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── JOURNEY ────────────────────────────────────────────────────────────── */
const STEPS=[
  {t:"Linux Fundamentals",d:"Commands, file system, permissions, scripting",st:"done"},
  {t:"Git & GitHub",d:"Version control, branching, pull requests",st:"done"},
  {t:"AWS EC2",d:"Launch instances, security groups, SSH access",st:"cur"},
  {t:"Nginx",d:"Web server config, reverse proxy basics",st:"cur"},
  {t:"Docker",d:"Containers, Dockerfiles, docker-compose",st:"up"},
  {t:"CI/CD Pipelines",d:"GitHub Actions, automation workflows",st:"up"},
  {t:"Monitoring",d:"Logs, metrics, alerting dashboards",st:"up"},
  {t:"Kubernetes",d:"Orchestration, deployments, scaling",st:"up"},
  {t:"Advanced DevOps",d:"IaC, cloud architecture, best practices",st:"up"},
];
const statusMap={done:{label:"✓ Done",c:"var(--cyan)"},cur:{label:"⚡ Current",c:"var(--blue)"},up:{label:"⏳ Planned",c:"var(--muted)"}};

function Journey() {
  const [ref,vis]=useVisible();
  return (
    <section id="journey" className="sec-pad" style={{padding:"80px 24px"}}>
      <div ref={ref} className={`reveal${vis?" on":""}`} style={{maxWidth:660,margin:"0 auto"}}>
        <div style={{marginBottom:48}}>
          <div className="sl" style={{marginBottom:10}}>// ROADMAP</div>
          <h2 className="st">Learning Journey</h2>
          <p style={{color:"var(--muted)",fontSize:13,marginTop:10}}>Step-by-step path from beginner to Cloud & DevOps Engineer.</p>
        </div>
        <div style={{position:"relative",paddingLeft:28}}>
          <div className="tl-line"/>
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {STEPS.map((s,i)=>(
              <div key={i} style={{position:"relative",marginBottom:10}}>
                <div className={`tl-dot${s.st==="done"?" done":s.st==="cur"?" cur":""}`}/>
                <div className="g" style={{padding:"14px 18px",
                  borderColor:s.st!=="up"?"rgba(0,217,245,.22)":"var(--bdr)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:s.st!=="up"?"var(--text)":"var(--muted)",marginBottom:3}}>{s.t}</div>
                      <div style={{fontSize:11,color:"var(--muted)"}}>{s.d}</div>
                    </div>
                    <span style={{fontSize:10,color:statusMap[s.st].c,whiteSpace:"nowrap",fontWeight:600,flexShrink:0}}>
                      {statusMap[s.st].label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PROJECTS ───────────────────────────────────────────────────────────── */
const PROJS=[
  {title:"Portfolio on AWS EC2",desc:"Deploying this portfolio on AWS EC2 — learning instance config, Nginx, and domain routing.",
    tags:["AWS EC2","Nginx","Linux","SSH"],status:"Ongoing",tc:"tong",I:Ico.Cloud,c:"var(--blue)"},
  {title:"Linux Automation Scripts",desc:"Shell scripts to automate system admin tasks — backups, log rotation, environment setup.",
    tags:["Bash","Linux","Automation","Shell"],status:"Planned",tc:"tplan",I:Ico.Term,c:"var(--cyan)"},
  {title:"Dockerized Web App",desc:"Containerizing a web app using Docker and docker-compose to learn container workflows.",
    tags:["Docker","docker-compose","Nginx","Node.js"],status:"Planned",tc:"tplan",I:Ico.Server,c:"var(--purple)"},
  {title:"CI/CD Pipeline",desc:"Automated CI/CD pipeline using GitHub Actions to test, build, and deploy code automatically.",
    tags:["GitHub Actions","CI/CD","Automation","DevOps"],status:"Planned",tc:"tplan",I:Ico.Git,c:"var(--green)"},
];

function Projects() {
  const [ref,vis]=useVisible();
  return (
    <section id="projects" className="sec-pad" style={{padding:"80px 24px",background:"rgba(8,13,26,.5)"}}>
      <div ref={ref} className={`reveal${vis?" on":""}`} style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{marginBottom:48}}>
          <div className="sl" style={{marginBottom:10}}>// PROJECTS</div>
          <h2 className="st">What I'm Building</h2>
          <p style={{color:"var(--muted)",fontSize:13,marginTop:10}}>Real projects in progress — my hands-on learning lab.</p>
        </div>
        <div className="grid-auto">
          {PROJS.map((p,i)=>(
            <div key={i} className={`g pcard`}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div style={{width:42,height:42,borderRadius:10,
                  background:`color-mix(in srgb,${p.c} 15%,transparent)`,
                  border:`1px solid color-mix(in srgb,${p.c} 28%,transparent)`,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <p.I width={18} height={18} style={{color:p.c}}/>
                </div>
                <span className={`tag ${p.tc}`}>{p.status}</span>
              </div>
              <h3 style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:15,marginBottom:8}}>{p.title}</h3>
              <p style={{color:"var(--muted)",fontSize:12,lineHeight:1.7,marginBottom:14}}>{p.desc}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {p.tags.map((tg,j)=>(
                  <span key={j} style={{fontSize:10,padding:"2px 7px",borderRadius:4,
                    background:"rgba(255,255,255,.05)",color:"var(--muted)",border:"1px solid rgba(255,255,255,.07)"}}>{tg}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── GITHUB ─────────────────────────────────────────────────────────────── */
function Github() {
  const [ref,vis]=useVisible();
  const statCards=[
    {l:"GitHub Username",v:"Manish9079",c:"var(--blue)"},
    {l:"Focus Area",v:"Cloud & DevOps",c:"var(--cyan)"},
    {l:"Primary Language",v:"Bash / Linux",c:"var(--purple)"},
    {l:"Learning Style",v:"Build & Document",c:"var(--green)"},
  ];
  return (
    <section id="github" className="sec-pad" style={{padding:"80px 24px"}}>
      <div ref={ref} className={`reveal${vis?" on":""}`} style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{marginBottom:48}}>
          <div className="sl" style={{marginBottom:10}}>// GITHUB</div>
          <h2 className="st">My GitHub Space</h2>
        </div>
        <div className="github-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28}}>
          {/* left */}
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div className="g" style={{padding:"28px"}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                <div style={{width:50,height:50,borderRadius:12,background:"rgba(56,139,253,.1)",
                  border:"1px solid var(--bdr)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Ico.Github width={24} height={24} style={{color:"var(--blue)"}}/>
                </div>
                <div>
                  <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:17}}>Manish Kumawat</div>
                  <div style={{color:"var(--muted)",fontSize:12}}>@Manish9079</div>
                </div>
              </div>
              <p style={{color:"var(--muted)",fontSize:12,lineHeight:1.8,marginBottom:20}}>
                I use GitHub to track my learning, share scripts, and document projects. Each repo is a step in my DevOps journey.
              </p>
              <a href="https://github.com/Manish9079" target="_blank" rel="noreferrer"
                className="btn-p" style={{width:"100%",justifyContent:"center"}}>
                <Ico.Ext width={13} height={13}/> Visit GitHub Profile
              </a>
            </div>
            {/* contribution graph */}
            <div className="g" style={{padding:"20px"}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:12,letterSpacing:".07em"}}>CONTRIBUTION GRAPH</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(26,1fr)",gap:3}}>
                {Array.from({length:182},(_,i)=>{
                  const l=[0,0,0,1,2,3][Math.floor(Math.random()*6)];
                  const cols=["rgba(255,255,255,.04)","rgba(56,139,253,.25)","rgba(56,139,253,.55)","var(--blue)"];
                  return <div key={i} style={{aspectRatio:"1",borderRadius:2,background:cols[l]}}/>;
                })}
              </div>
              <div style={{fontSize:10,color:"var(--muted)",marginTop:8,textAlign:"right"}}>Connect GitHub API for live data</div>
            </div>
          </div>
          {/* right */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div className="grid-2-sm">
              {statCards.map((s,i)=>(
                <div key={i} className="g" style={{padding:"18px",textAlign:"center"}}>
                  <div style={{fontSize:14,fontWeight:700,color:s.c,marginBottom:5,fontFamily:"var(--fh)"}}>{s.v}</div>
                  <div style={{fontSize:10,color:"var(--muted)",letterSpacing:".05em"}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div className="g" style={{padding:"20px",flex:1}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:12,letterSpacing:".06em"}}>PLANNED REPOSITORIES</div>
              {["linux-scripts","aws-ec2-notes","docker-experiments","devops-roadmap"].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 0",
                  borderBottom:i<3?"1px solid var(--bdr)":"none"}}>
                  <Ico.Git width={12} height={12} style={{color:"var(--muted)",flexShrink:0}}/>
                  <span style={{fontSize:12,color:"var(--text)"}}>{r}</span>
                  <span style={{marginLeft:"auto",fontSize:10,color:"var(--muted)"}}>Planned</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ────────────────────────────────────────────────────────────── */
function Contact() {
  const [ref,vis]=useVisible();
  const [form,setForm]=useState({name:"",email:"",msg:""});
  const [sent,setSent]=useState(false);
  const send=()=>{
    if(!form.name||!form.email||!form.msg)return;
    const sub=encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body=encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.msg}`);
    window.open(`mailto:mkm165597@gmail.com?subject=${sub}&body=${body}`);
    setSent(true); setTimeout(()=>setSent(false),3500);
  };
  const contacts=[
    {I:Ico.Mail,l:"Email",v:"mkm165597@gmail.com",href:"mailto:mkm165597@gmail.com",c:"var(--blue)"},
    {I:Ico.Github,l:"GitHub",v:"github.com/Manish9079",href:"https://github.com/Manish9079",c:"var(--purple)"},
    {I:Ico.Li,l:"LinkedIn",v:"manish-kmt-264541369",href:"https://www.linkedin.com/in/manish-kmt-264541369/",c:"var(--cyan)"},
    {I:Ico.Pin,l:"Location",v:"Sikar, Rajasthan, India",href:null,c:"var(--green)"},
  ];
  return (
    <section id="contact" className="sec-pad" style={{padding:"80px 24px",background:"rgba(8,13,26,.5)"}}>
      <div ref={ref} className={`reveal${vis?" on":""}`} style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{marginBottom:48,textAlign:"center"}}>
          <div className="sl" style={{marginBottom:10}}>// CONTACT</div>
          <h2 className="st">Let's Connect</h2>
          <p style={{color:"var(--muted)",fontSize:13,marginTop:10}}>Have an opportunity or just want to say hi? I'd love to hear from you.</p>
        </div>
        <div className="contact-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28}}>
          {/* form */}
          <div className="g" style={{padding:"28px"}}>
            <div style={{marginBottom:18}}>
              <label style={{fontSize:11,color:"var(--muted)",display:"block",marginBottom:7,letterSpacing:".07em"}}>NAME</label>
              <input className="inp" placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{fontSize:11,color:"var(--muted)",display:"block",marginBottom:7,letterSpacing:".07em"}}>EMAIL</label>
              <input className="inp" type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{fontSize:11,color:"var(--muted)",display:"block",marginBottom:7,letterSpacing:".07em"}}>MESSAGE</label>
              <textarea className="inp" rows={4} placeholder="What's on your mind?" value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})}/>
            </div>
            <button className="btn-p" style={{width:"100%",justifyContent:"center"}} onClick={send}>
              {sent?<><Ico.Check width={13} height={13}/> Sent!</>:<><Ico.Send width={13} height={13}/> Send Message</>}
            </button>
          </div>
          {/* contact cards */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {contacts.map((ct,i)=>(
              <div key={i} className="g" onClick={()=>ct.href&&window.open(ct.href,"_blank")}
                style={{padding:"16px 18px",display:"flex",alignItems:"center",gap:14,
                  cursor:ct.href?"pointer":"default",transition:"border-color .2s"}}>
                <div style={{width:40,height:40,borderRadius:9,
                  background:`color-mix(in srgb,${ct.c} 15%,transparent)`,
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <ct.I width={17} height={17} style={{color:ct.c}}/>
                </div>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:10,color:"var(--muted)",letterSpacing:".07em",marginBottom:2}}>{ct.l}</div>
                  <div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ct.v}</div>
                </div>
                {ct.href&&<Ico.Ext width={13} height={13} style={{color:"var(--muted)",marginLeft:"auto",flexShrink:0}}/>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{padding:"36px 24px",borderTop:"1px solid var(--bdr)",textAlign:"center"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:18,letterSpacing:"-.02em",marginBottom:6}}>
          <span style={{color:"var(--cyan)"}}>Manish</span> Kumawat
        </div>
        <p style={{color:"var(--muted)",fontSize:12,marginBottom:18}}>Learning Cloud &nbsp;•&nbsp; DevOps &nbsp;•&nbsp; Linux</p>
        <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:18,flexWrap:"wrap"}}>
          {[{I:Ico.Github,h:"https://github.com/Manish9079"},{I:Ico.Li,h:"https://www.linkedin.com/in/manish-kmt-264541369/"},{I:Ico.Mail,h:"mailto:mkm165597@gmail.com"}]
            .map(({I,h},i)=>(
              <a key={i} href={h} target="_blank" rel="noreferrer"
                style={{width:38,height:38,borderRadius:9,background:"var(--surf)",border:"1px solid var(--bdr)",
                  display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)",
                  transition:"color .2s,border-color .2s",textDecoration:"none"}}
                onMouseEnter={e=>{e.currentTarget.style.color="var(--cyan)";e.currentTarget.style.borderColor="var(--cyan)"}}
                onMouseLeave={e=>{e.currentTarget.style.color="var(--muted)";e.currentTarget.style.borderColor="var(--bdr)"}}>
                <I width={15} height={15}/>
              </a>
            ))}
        </div>
        <p style={{color:"var(--muted)",fontSize:11}}>© 2025 Manish Kumawat · Built with ❤️ · Sikar, Rajasthan</p>
      </div>
    </footer>
  );
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <style>{CSS}</style>
      <BgDots/>
      <div style={{position:"relative",zIndex:1}}>
        <Navbar/>
        <Hero/>
        <About/>
        <Skills/>
        <Journey/>
        <Projects/>
        <Github/>
        <Contact/>
        <Footer/>
      </div>
    </>
  );
}
