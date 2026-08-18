// Ruta autocontenida: sirve la presentación ClearPath (design challenge).
// HTML+CSS+JS inline, sin dependencias. Servido tal cual para fidelidad total.
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>ClearPath · Presentation · David Herrera Ramírez</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{
  --midnight:#0A102F; --ink:#101A44; --peri:#5867B5; --lav:#E8ECF9;
  --ice:#F2F4FB; --white:#fff; --muted:#5A628A; --line:#E3E6F0;
  --ok:#1E7B54; --ok-bg:#E4F3EC; --warn:#9A5B2B; --warn-bg:#F7EEE4;
}
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%}
body{font-family:'Poppins',sans-serif;background:#080C22;overflow:hidden}
#viewport{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}
#stage{position:relative;width:1280px;height:720px;transform-origin:center center}
.sl{position:absolute;inset:0;opacity:0;transform:translateY(18px) scale(.985);transition:opacity .45s cubic-bezier(.22,1,.36,1),transform .45s cubic-bezier(.22,1,.36,1);pointer-events:none}
.sl.active{opacity:1;transform:none;pointer-events:auto}
.sl.prev{transform:translateY(-14px) scale(.985)}
.sl .slide{width:1280px;height:720px;box-shadow:none;border-radius:24px}
/* clearpath-slide-cover.html */
.s0 .slide{width:1280px;height:720px;background:var(--midnight);border-radius:24px;box-shadow:0 10px 40px rgba(16,26,68,.25);padding:84px 96px;display:flex;flex-direction:column;overflow:hidden;position:relative}
.s0 .eyebrow{font-size:13px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#8E9AD6}
.s0 h1{font-size:56px;font-weight:700;letter-spacing:-.025em;line-height:1.1;color:#fff;margin-top:26px;max-width:17ch}
.s0 h1 span{color:#8E9AD6}
.s0 .who{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;border-top:1px solid rgba(169,178,217,.18);padding-top:28px}
.s0 .me b{font-size:16px;color:#fff;display:block;letter-spacing:-.01em}
.s0 .me small{font-size:12.5px;color:#A9B2D9;display:block;margin-top:4px}
.s0 .right{font-size:12.5px;color:#A9B2D9;text-align:right}
.s0 .right b{color:#fff;font-weight:600}
/* clearpath-slide-research-findings.html */
.s1 .slide{width:1280px;height:720px;background:var(--ice);border-radius:24px;box-shadow:0 10px 40px rgba(16,26,68,.16);padding:52px 60px;display:flex;flex-direction:column;overflow:hidden;position:relative}
.s1 .eyebrow{font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--peri)}
.s1 h1{font-size:33px;font-weight:700;letter-spacing:-.018em;line-height:1.15;margin-top:8px}
.s1 h1 span{color:var(--peri)}
.s1 .sub{font-size:13.5px;color:var(--muted);margin-top:6px}
.s1 .grid{display:grid;grid-template-columns:1.06fr 1fr;gap:26px;margin-top:26px;flex:1;min-height:0}
.s1 .map{background:var(--white);border-radius:20px;padding:22px 24px;box-shadow:0 2px 14px rgba(16,26,68,.07);display:flex;flex-direction:column}
.s1 .map h3{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--muted)}
.s1 .acts{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:14px}
.s1 .act{background:#F8FAFE;border:1px solid #E6EAF6;border-radius:14px;padding:13px 13px 11px}
.s1 .act .q{font-size:12.5px;font-weight:600;line-height:1.3;min-height:34px}
.s1 .act .who{margin-top:9px;display:flex;flex-wrap:wrap;gap:5px}
.s1 .tag{font-size:9.5px;font-weight:500;background:var(--lav);color:var(--ink);border-radius:999px;padding:3px 9px}
.s1 .act .lbl{font-size:9.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--peri);margin-bottom:5px}
.s1 .seam{position:relative;margin-top:14px;background:var(--midnight);border-radius:14px;padding:14px 16px;color:#fff}
.s1 .seam b{font-size:13.5px;display:block}
.s1 .seam p{font-size:11.5px;color:#A9B2D9;margin-top:3px;line-height:1.5}
.s1 .gapnote{display:flex;gap:14px;justify-content:space-around;margin-top:2px}
.s1 .gapnote span{font-size:10px;font-weight:600;color:var(--warn)}
.s1 .arrowrow{display:flex;justify-content:space-around;padding:0 40px;margin-top:6px}
.s1 .arrowrow svg{color:var(--warn)}
.s1 .findings{display:flex;flex-direction:column;gap:12px;min-height:0}
.s1 .f{background:var(--white);border-radius:16px;padding:14px 16px;box-shadow:0 2px 14px rgba(16,26,68,.06);display:flex;gap:12px;align-items:flex-start}
.s1 .f .n{flex:none;width:26px;height:26px;border-radius:9px;background:var(--peri);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:1px}
.s1 .f b{font-size:13.5px;display:block;letter-spacing:-.01em}
.s1 .f p{font-size:11.5px;color:var(--muted);line-height:1.5;margin-top:2px}
.s1 .f .ev{font-size:10px;color:var(--peri);font-weight:600;margin-top:4px;display:block}
.s1 .bottom{margin-top:18px;background:var(--white);border:1.5px solid var(--peri);border-radius:16px;padding:14px 20px;display:flex;align-items:center;gap:16px;box-shadow:0 4px 16px rgba(88,103,181,.12)}
.s1 .bottom .k{flex:none;font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--peri)}
.s1 .bottom p{font-size:14px;font-weight:600;letter-spacing:-.01em;line-height:1.4}
.s1 .foot{position:absolute;bottom:16px;left:60px;right:60px;display:flex;justify-content:space-between;font-size:10px;color:#8A93B8}
/* clearpath-slide-jenny-persona.html */
.s2 .slide{width:1280px;height:720px;background:var(--ice);border-radius:24px;box-shadow:0 10px 40px rgba(16,26,68,.16);padding:52px 60px;display:flex;flex-direction:column;overflow:hidden;position:relative}
.s2 .eyebrow{font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--peri)}
.s2 h1{font-size:33px;font-weight:700;letter-spacing:-.018em;line-height:1.15;margin-top:8px}
.s2 h1 span{color:var(--peri)}
.s2 .grid{display:grid;grid-template-columns:.92fr 1.35fr;gap:26px;margin-top:24px;flex:1;min-height:0}
.s2 .id{background:var(--white);border-radius:20px;padding:24px;box-shadow:0 2px 14px rgba(16,26,68,.07);display:flex;flex-direction:column}
.s2 .head{display:flex;gap:16px;align-items:center}
.s2 .pfp{flex:none;width:72px;height:72px;border-radius:22px;background:var(--midnight);color:#fff;font-size:24px;font-weight:600;display:flex;align-items:center;justify-content:center}
.s2 .head b{font-size:21px;display:block;letter-spacing:-.01em}
.s2 .head small{font-size:12px;color:var(--muted);display:block;margin-top:2px;line-height:1.45}
.s2 .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}
.s2 .chip{font-size:10.5px;font-weight:500;background:var(--lav);color:var(--ink);border-radius:999px;padding:5px 12px}
.s2 .chip.w{background:var(--warn-bg);color:var(--warn);font-weight:600}
.s2 .state{margin-top:16px;background:var(--midnight);border-radius:14px;padding:14px 16px;color:#fff}
.s2 .state .lbl{font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8E9AD6}
.s2 .state p{font-size:12px;color:#DDE2F4;line-height:1.55;margin-top:5px}
.s2 .state b{color:#fff}
.s2 .quote{margin-top:auto;border-left:3px solid var(--peri);padding:4px 0 4px 14px}
.s2 .quote p{font-size:14.5px;font-weight:600;font-style:italic;letter-spacing:-.01em;line-height:1.45}
.s2 .quote small{font-size:10px;color:var(--muted);font-style:normal;display:block;margin-top:4px}
.s2 .right{display:flex;flex-direction:column;gap:12px;min-height:0}
.s2 .job{background:var(--white);border:1.5px solid var(--peri);border-radius:16px;padding:13px 18px;box-shadow:0 4px 16px rgba(88,103,181,.12)}
.s2 .job .k{font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--peri)}
.s2 .job p{font-size:14.5px;font-weight:600;letter-spacing:-.01em;margin-top:3px;line-height:1.4}
.s2 .rows{display:flex;flex-direction:column;gap:10px;flex:1;min-height:0}
.s2 .row{background:var(--white);border-radius:14px;padding:11px 16px;box-shadow:0 2px 12px rgba(16,26,68,.05);display:grid;grid-template-columns:1.05fr 24px 1fr;gap:12px;align-items:center}
.s2 .row .fact b{font-size:12.5px;display:block;letter-spacing:-.01em}
.s2 .row .fact p{font-size:10.5px;color:var(--muted);line-height:1.45;margin-top:1px}
.s2 .row .arr{color:var(--peri)}
.s2 .row .so{font-size:11px;color:var(--ink);line-height:1.45}
.s2 .row .so em{font-style:normal;font-weight:600;color:var(--peri)}
.s2 .hdr{display:grid;grid-template-columns:1.05fr 24px 1fr;gap:12px;padding:0 16px}
.s2 .hdr span{font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
.s2 .foot{position:absolute;bottom:16px;left:60px;right:60px;display:flex;justify-content:space-between;font-size:10px;color:#8A93B8}
/* clearpath-slide-prototype-qr.html */
.s3 .slide{width:1280px;height:720px;background:var(--midnight);border-radius:24px;box-shadow:0 10px 40px rgba(16,26,68,.25);padding:56px 72px;display:flex;align-items:center;gap:64px;overflow:hidden;position:relative}
.s3 .left{flex:1;color:#fff}
.s3 .eyebrow{font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#8E9AD6}
.s3 h1{font-size:44px;font-weight:700;letter-spacing:-.02em;line-height:1.12;margin-top:14px}
.s3 .sub{font-size:16px;color:#A9B2D9;margin-top:16px;line-height:1.6;max-width:38ch}
.s3 .url{display:inline-flex;align-items:center;gap:12px;margin-top:34px;background:rgba(232,236,249,.08);border:1px solid rgba(169,178,217,.25);border-radius:16px;padding:16px 24px}
.s3 .url svg{color:#8E9AD6;flex:none}
.s3 .url b{font-size:24px;font-weight:600;letter-spacing:-.01em;color:#fff}
.s3 .url b span{color:#8E9AD6}
.s3 .qrwrap{flex:none;background:var(--white);border-radius:28px;padding:34px;box-shadow:0 8px 32px rgba(0,0,0,.28)}
.s3 .qrwrap svg{display:block;width:340px;height:340px}
.s3 .qrcap{text-align:center;font-size:12.5px;font-weight:500;color:var(--muted);margin-top:16px}
.s3 .foot{position:absolute;bottom:18px;left:72px;right:72px;display:flex;justify-content:space-between;font-size:10px;color:#5A628A}
.nav{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:16px;z-index:20;background:rgba(255,255,255,.06);border:1px solid rgba(169,178,217,.22);border-radius:999px;padding:8px 14px;backdrop-filter:blur(12px)}
.nav button{width:38px;height:38px;border-radius:50%;border:none;background:rgba(232,236,249,.1);color:#DDE2F4;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
.nav button:hover{background:var(--peri)}
.nav button:disabled{opacity:.3;cursor:default}
#count{font-size:12.5px;color:#A9B2D9;font-variant-numeric:tabular-nums;min-width:34px;text-align:center}
.dots{display:flex;gap:6px}
.dots i{width:7px;height:7px;border-radius:50%;background:rgba(169,178,217,.3);transition:background .2s,transform .2s}
.dots i.on{background:var(--peri);transform:scale(1.25)}
.hint{position:fixed;bottom:30px;right:30px;font-size:10.5px;color:#5A628A;z-index:20}
</style>
</head>
<body>
<div id="viewport"><div id="stage">
<section class="sl s0">
<div class="slide">
  <div class="eyebrow">ClearPath · Design challenge</div>
  <h1>From "I don't know what I need" to a <span>decision she believes</span></h1>

  <div class="who">
    <div class="me">
      <b>David Herrera Ramírez</b>
      <small>Senior Product Designer</small>
    </div>
    <div class="right">
      Prototype live at <b>davhera.com/handl</b>
    </div>
  </div>
</div>
</section>
<section class="sl s1">
<div class="slide">
  <div class="eyebrow">Research · 15 products, 6 categories</div>
  <h1>Everyone owns one act of the journey.<br><span>Nobody owns the journey.</span></h1>

  <div class="grid">
    <!-- left: market map -->
    <div class="map">
      <h3>The market, mapped in three acts</h3>
      <div class="acts">
        <div class="act">
          <div class="lbl">Triage</div>
          <div class="q">"What do I even need?"</div>
          <div class="who"><span class="tag">Ada</span><span class="tag">Buoy</span></div>
        </div>
        <div class="act">
          <div class="lbl">Provider choice</div>
          <div class="q">"Who should I see?"</div>
          <div class="who"><span class="tag">Garner</span><span class="tag">Amino</span></div>
        </div>
        <div class="act">
          <div class="lbl">Cost &amp; coverage</div>
          <div class="q">"What will it cost me?"</div>
          <div class="who"><span class="tag">Carriers</span><span class="tag">Healthee</span></div>
        </div>
      </div>
      <div class="arrowrow">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 4v13M6 11l6 6 6-6"/></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 4v13M6 11l6 6 6-6"/></svg>
      </div>
      <div class="gapnote"><span>handoff · context lost</span><span>handoff · trust lost</span></div>
      <div class="seam" style="margin-top:10px">
        <b>The seam is unowned</b>
        <p>No product carries one anxious person across all three. She quits in the gaps and calls her insurer anyway.</p>
      </div>
    </div>

    <!-- right: findings -->
    <div class="findings">
      <div class="f">
        <span class="n">1</span>
        <div>
          <b>"Not a chatbot" is market-validated</b>
          <p>Winning triage uses bounded questions. Open chat under anxiety stalls.</p>
          <span class="ev">Structured flows complete at 90%+</span>
        </div>
      </div>
      <div class="f">
        <span class="n">2</span>
        <div>
          <b>Price alone backfires</b>
          <p>Cheap reads as bad. Every comparison needs a quality signal.</p>
          <span class="ev">Amino rebuilt around 200+ quality measures after price-only failed</span>
        </div>
      </div>
      <div class="f">
        <span class="n">3</span>
        <div>
          <b>Uncertainty gets disclaimers, not design</b>
          <p>Exact numbers wrapped in fine print. Nobody designs confidence itself.</p>
          <span class="ev">The emptiest high-value space I found</span>
        </div>
      </div>
    </div>
  </div>

  <div class="bottom">
    <span class="k">So I designed</span>
    <p>The seam: one continuous flow from confusion to a decision she believes.</p>
  </div>

  <div class="foot"><span>ClearPath · Design challenge · Competitive research</span><span>davhera.com</span></div>
</div>
</section>
<section class="sl s2">
<div class="slide">
  <div class="eyebrow">The user</div>
  <h1>Jenny arrives anxious, twice a year.<br><span>Every session is a first session.</span></h1>

  <div class="grid">
    <!-- left: identity -->
    <div class="id">
      <div class="head">
        <span class="pfp">JM</span>
        <div>
          <b>Jenny Morales</b>
          <small>41 · logistics operator · member of a self-funded employer plan</small>
        </div>
      </div>
      <div class="chips">
        <span class="chip">2 to 3 uses a year</span>
        <span class="chip">Low insurance literacy</span>
        <span class="chip w">Remembers a $4,000 surprise bill</span>
      </div>
      <div class="state">
        <span class="lbl">Emotional state at the moment of use</span>
        <p><b>Anxiety shrinks working memory.</b> Jargon, long sentences and open questions all become friction. She wants this to be over, correctly.</p>
      </div>
      <div class="quote">
        <p>"I would rather see an honest range than a pretty number that turns out to be a lie."</p>
        <small>Composite persona from benchmark and utilization research</small>
      </div>
    </div>

    <!-- right: facts → design implications -->
    <div class="right">
      <div class="job">
        <span class="k">Her job to be done</span>
        <p>Decide well without being an expert, and leave calmer than she arrived</p>
      </div>
      <div class="hdr"><span>What is true about her</span><span></span><span>So the design</span></div>
      <div class="rows">
        <div class="row">
          <div class="fact"><b>Two or three sessions a year</b><p>She forgets the product between uses.</p></div>
          <span class="arr"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>
          <div class="so"><em>Zero-memory design.</em> Every screen explains itself.</div>
        </div>
        <div class="row">
          <div class="fact"><b>She speaks human, not CPT</b><p>"My doctor says I need my knee operated."</p></div>
          <span class="arr"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>
          <div class="so"><em>The system translates.</em> Photo of the order as the hero path.</div>
        </div>
        <div class="row">
          <div class="fact"><b>Sixteen options is paralysis</b><p>And cheap reads as bad.</p></div>
          <span class="arr"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>
          <div class="so"><em>One opinion with reasons.</em> The full list one tap away.</div>
        </div>
        <div class="row">
          <div class="fact"><b>Her trust is pre-broken</b><p>The $4,000 story shadows every exact number.</p></div>
          <span class="arr"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>
          <div class="so"><em>Honest ranges, shown work.</em> The math one tap away, the final bill reconciled.</div>
        </div>
      </div>
    </div>
  </div>

  <div class="foot"><span>ClearPath · Design challenge · The user</span><span>davhera.com</span></div>
</div>
</section>
<section class="sl s3">
<div class="slide">
  <div class="left">
    <div class="eyebrow">The prototype · live in production</div>
    <h1>Open it on your phone.<br>Use it while we talk.</h1>
    <p class="sub">The full flow, built in code and deployed. Try any of the four doors. Break it if you can.</p>
    <div class="url">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3.5 12h17M12 3.5c2.6 2.3 4 5.2 4 8.5s-1.4 6.2-4 8.5c-2.6-2.3-4-5.2-4-8.5s1.4-6.2 4-8.5z"/></svg>
      <b>davhera.com<span>/handl</span></b>
    </div>
  </div>
  <div>
    <div class="qrwrap">
      <svg viewBox="0 0 25 25" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h7v1h-7zM8 0h1v1h-1zM11 0h2v1h-2zM14 0h1v1h-1zM18 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM8 1h1v1h-1zM10 1h1v1h-1zM16 1h1v1h-1zM18 1h1v1h-1zM24 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM8 2h7v1h-7zM16 2h1v1h-1zM18 2h1v1h-1zM20 2h3v1h-3zM24 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM9 3h3v1h-3zM13 3h1v1h-1zM16 3h1v1h-1zM18 3h1v1h-1zM20 3h3v1h-3zM24 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM8 4h1v1h-1zM10 4h1v1h-1zM13 4h2v1h-2zM16 4h1v1h-1zM18 4h1v1h-1zM20 4h3v1h-3zM24 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM9 5h1v1h-1zM12 5h1v1h-1zM14 5h1v1h-1zM16 5h1v1h-1zM18 5h1v1h-1zM24 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h7v1h-7zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h2v1h-2zM0 8h1v1h-1zM3 8h6v1h-6zM12 8h1v1h-1zM16 8h2v1h-2zM20 8h1v1h-1zM22 8h3v1h-3zM1 9h5v1h-5zM9 9h1v1h-1zM12 9h5v1h-5zM19 9h5v1h-5zM2 10h1v1h-1zM4 10h4v1h-4zM9 10h2v1h-2zM12 10h2v1h-2zM15 10h4v1h-4zM20 10h2v1h-2zM24 10h1v1h-1zM0 11h3v1h-3zM5 11h1v1h-1zM7 11h1v1h-1zM12 11h1v1h-1zM14 11h1v1h-1zM16 11h1v1h-1zM18 11h2v1h-2zM21 11h4v1h-4zM0 12h1v1h-1zM4 12h1v1h-1zM6 12h1v1h-1zM8 12h2v1h-2zM11 12h2v1h-2zM15 12h2v1h-2zM18 12h2v1h-2zM24 12h1v1h-1zM0 13h1v1h-1zM2 13h2v1h-2zM8 13h2v1h-2zM14 13h4v1h-4zM20 13h1v1h-1zM23 13h1v1h-1zM0 14h3v1h-3zM4 14h3v1h-3zM8 14h1v1h-1zM11 14h3v1h-3zM15 14h4v1h-4zM20 14h5v1h-5zM0 15h1v1h-1zM2 15h1v1h-1zM5 15h1v1h-1zM7 15h2v1h-2zM10 15h2v1h-2zM14 15h3v1h-3zM19 15h1v1h-1zM21 15h2v1h-2zM24 15h1v1h-1zM0 16h1v1h-1zM5 16h6v1h-6zM12 16h2v1h-2zM15 16h6v1h-6zM22 16h2v1h-2zM8 17h5v1h-5zM15 17h2v1h-2zM20 17h1v1h-1zM22 17h2v1h-2zM0 18h7v1h-7zM8 18h1v1h-1zM10 18h5v1h-5zM16 18h1v1h-1zM18 18h1v1h-1zM20 18h1v1h-1zM24 18h1v1h-1zM0 19h1v1h-1zM6 19h1v1h-1zM8 19h1v1h-1zM13 19h1v1h-1zM15 19h2v1h-2zM20 19h1v1h-1zM23 19h2v1h-2zM0 20h1v1h-1zM2 20h3v1h-3zM6 20h1v1h-1zM8 20h2v1h-2zM11 20h2v1h-2zM14 20h7v1h-7zM0 21h1v1h-1zM2 21h3v1h-3zM6 21h1v1h-1zM8 21h2v1h-2zM11 21h1v1h-1zM13 21h6v1h-6zM23 21h2v1h-2zM0 22h1v1h-1zM2 22h3v1h-3zM6 22h1v1h-1zM11 22h3v1h-3zM17 22h1v1h-1zM20 22h5v1h-5zM0 23h1v1h-1zM6 23h1v1h-1zM10 23h2v1h-2zM17 23h1v1h-1zM19 23h2v1h-2zM22 23h3v1h-3zM0 24h7v1h-7zM8 24h1v1h-1zM11 24h2v1h-2zM16 24h3v1h-3zM21 24h1v1h-1zM24 24h1v1h-1z" fill="#101A44"/></svg>
    </div>
    <p class="qrcap">Scan to open the prototype</p>
  </div>
  <div class="foot"><span>ClearPath · Design challenge · David Herrera Ramírez</span><span>Built with the process I will show you next</span></div>
</div>
</section>
</div></div>
<div class="nav">
  <button id="prev" aria-label="Previous slide"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 6l-6 6 6 6"/></svg></button>
  <span class="dots" id="dots"></span>
  <span id="count">1 / 4</span>
  <button id="next" aria-label="Next slide"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg></button>
</div>
<div class="hint">← → to navigate</div>
<script>
  const slides=[...document.querySelectorAll('.sl')];
  const dotsEl=document.getElementById('dots');
  slides.forEach(()=>dotsEl.appendChild(document.createElement('i')));
  const dots=[...dotsEl.children];
  let idx=0;
  function show(n){
    idx=Math.max(0,Math.min(n,slides.length-1));
    slides.forEach((s,i)=>{s.classList.toggle('active',i===idx);s.classList.toggle('prev',i<idx);});
    dots.forEach((d,i)=>d.classList.toggle('on',i===idx));
    document.getElementById('count').textContent=(idx+1)+' / '+slides.length;
    document.getElementById('prev').disabled=idx===0;
    document.getElementById('next').disabled=idx===slides.length-1;
  }
  document.getElementById('prev').onclick=()=>show(idx-1);
  document.getElementById('next').onclick=()=>show(idx+1);
  addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' ')show(idx+1);
    if(e.key==='ArrowLeft'||e.key==='ArrowUp')show(idx-1);
    if(e.key==='Home')show(0);
    if(e.key==='End')show(slides.length-1);
  });
  let tx=null;
  addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});
  addEventListener('touchend',e=>{
    if(tx===null)return;
    const dx=e.changedTouches[0].clientX-tx;
    if(Math.abs(dx)>50)show(idx+(dx<0?1:-1));
    tx=null;
  },{passive:true});
  function fit(){
    const pad=40;
    const s=Math.min((innerWidth-pad)/1280,(innerHeight-pad-70)/720,1.4);
    document.getElementById('stage').style.transform=\`scale(\${s})\`;
  }
  addEventListener('resize',fit);
  fit();show(0);
</script>
</body>
</html>`;

export function GET() {
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
