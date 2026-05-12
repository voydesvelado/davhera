import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Plata Business Platform · A V1 design exercise by David",
  description:
    "A 2-week self-initiated design exercise for Plata's Business Platform Design role. Onboarding, daily operations, permissions, states, and edge cases.",
};

export default function PlataPage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      
      {/* TOP NAV */}
      <nav className="top-nav">
        <div className="top-nav-inner">
          <div className="author">David <span>·</span> Design Engineer</div>
          <div className="right">
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>
      
      {/* HERO */}
      <header className="hero">
        <div className="container-wide hero-inner">
          <span className="hero-tag">Self-initiated · For Plata's Business Platform Design role</span>
          <h1>Plata Business Platform. <span>A V1 design exercise.</span></h1>
          <p className="hero-sub">Onboarding, daily operations, permissions, states, edge cases. The operational layer of a Mexican B2B banking platform — designed end-to-end across mobile and web.</p>
          <div className="hero-meta">
            <div className="hero-meta-cell">
              <span className="label">Surfaces</span>
              iOS · Android · Web<br/>Owner app + accountant console
            </div>
            <div className="hero-meta-cell">
              <span className="label">Scope</span>
              Onboarding · operations<br/>permissions · states · edge
            </div>
            <div className="hero-meta-cell">
              <span className="label">Timeline</span>
              2 weeks · solo<br/>May 2026
            </div>
            <div className="hero-meta-cell">
              <span className="label">Premise</span>
              Hypothetical · public<br/>sources only
            </div>
          </div>
        </div>
      </header>
      
      {/* VISUAL HERO — MOCKUPS UP FRONT */}
      <section className="chapter surface-tertiary">
        <div className="container-wide">
          <div className="phone-block-label">The work · part 1 of 3</div>
          <div className="phone-block-title">A 10-minute mobile onboarding for a Mexican PFAE, with CLABE as the first delivered value and graceful recovery from every failure mode.</div>
      
          <div className="phone-row">
      
            <div className="phone-mock">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-status"><span>9:41</span><span>●●●</span></div>
                  <div className="phone-header"><span></span><span className="phone-progress">01/08</span></div>
                  <div className="phone-pbar"><div style={{ width: "12%" }}></div></div>
                  <div className="phone-body">
                    <h3>Tu cuenta para tu negocio. En 10 minutos.</h3>
                    <p>Cero comisiones. CLABE para cobrar. Tarjeta. Todo desde tu teléfono.</p>
                    <ul style={{ fontSize: "0.7rem", color: "var(--text-secondary)", listStyle: "none", padding: "0", margin: "var(--space-3) 0" }}>
                      <li style={{ padding: "var(--space-1) 0 var(--space-1) var(--space-4)", position: "relative", lineHeight: "var(--leading-relaxed)" }}><span style={{ position: "absolute", left: "0", color: "var(--color-success-500)", fontWeight: "var(--weight-bold)" }}>✓</span> Sin saldo mínimo</li>
                      <li style={{ padding: "var(--space-1) 0 var(--space-1) var(--space-4)", position: "relative", lineHeight: "var(--leading-relaxed)" }}><span style={{ position: "absolute", left: "0", color: "var(--color-success-500)", fontWeight: "var(--weight-bold)" }}>✓</span> Sin mantenimiento</li>
                      <li style={{ padding: "var(--space-1) 0 var(--space-1) var(--space-4)", position: "relative", lineHeight: "var(--leading-relaxed)" }}><span style={{ position: "absolute", left: "0", color: "var(--color-success-500)", fontWeight: "var(--weight-bold)" }}>✓</span> SPEI gratis ilimitado</li>
                    </ul>
                  </div>
                  <div className="phone-footer">
                    <button className="phone-btn brand">Empezar</button>
                    <a className="phone-link">Iniciar sesión</a>
                  </div>
                </div>
              </div>
              <div className="mock-caption"><strong>Welcome</strong>Promise before friction</div>
            </div>
      
            <div className="phone-mock">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-status"><span>9:41</span><span>●●●</span></div>
                  <div className="phone-header"><span className="phone-back">←</span><span className="phone-progress">03/08</span></div>
                  <div className="phone-pbar"><div style={{ width: "37%" }}></div></div>
                  <div className="phone-body">
                    <h3>¿Cómo está registrado tu negocio?</h3>
                    <p>Esto define cómo abrimos tu cuenta.</p>
                    <div className="phone-option selected">
                      <div>
                        <div className="phone-option-title">Está a mi nombre</div>
                        <div className="phone-option-sub">Persona Física con Actividad Empresarial</div>
                      </div>
                      <div className="phone-option-radio"></div>
                    </div>
                    <div className="phone-option disabled">
                      <div>
                        <div className="phone-option-title">Tengo una empresa registrada</div>
                        <div className="phone-option-sub">Persona Moral · Próximamente</div>
                      </div>
                      <div className="phone-option-radio"></div>
                    </div>
                    <div className="phone-option disabled">
                      <div>
                        <div className="phone-option-title">No estoy segura</div>
                        <div className="phone-option-sub">Te ayudamos</div>
                      </div>
                      <div className="phone-option-radio"></div>
                    </div>
                  </div>
                  <div className="phone-footer">
                    <button className="phone-btn">Continuar</button>
                  </div>
                </div>
              </div>
              <div className="mock-caption"><strong>Business type</strong>Honest about V1 scope</div>
            </div>
      
            <div className="phone-mock">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-status"><span>9:41</span><span>●●●</span></div>
                  <div className="phone-header"><span className="phone-back">←</span><span className="phone-progress">04/08</span></div>
                  <div className="phone-pbar"><div style={{ width: "50%" }}></div></div>
                  <div className="phone-body">
                    <h3>Toma una foto de tu INE</h3>
                    <p>Frente primero. Todas las esquinas dentro del recuadro.</p>
                    <div className="phone-capture"></div>
                    <p style={{ fontSize: "0.62rem", color: "var(--text-tertiary)" }}>Tus datos están encriptados.</p>
                  </div>
                  <div className="phone-footer">
                    <button className="phone-btn brand">Tomar foto</button>
                  </div>
                </div>
              </div>
              <div className="mock-caption"><strong>ID capture</strong>Photo, not form</div>
            </div>
      
            <div className="phone-mock">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-status"><span>9:41</span><span>●●●</span></div>
                  <div className="phone-header"><span className="phone-back">←</span><span className="phone-progress">04/08</span></div>
                  <div className="phone-pbar"><div style={{ width: "50%" }}></div></div>
                  <div className="phone-body">
                    <h3>Ahora una selfie</h3>
                    <p>Mira a la cámara y parpadea cuando te lo pidamos.</p>
                    <div className="phone-selfie"></div>
                    <p style={{ fontSize: "0.62rem", color: "var(--text-tertiary)", textAlign: "center" }}>Confirma que eres tú.</p>
                  </div>
                  <div className="phone-footer">
                    <button className="phone-btn brand">Empezar</button>
                  </div>
                </div>
              </div>
              <div className="mock-caption"><strong>Liveness</strong>Trust, not surveillance</div>
            </div>
      
            <div className="phone-mock">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-status"><span>9:51</span><span>●●●</span></div>
                  <div className="phone-header"><span></span><span className="phone-progress">08/08</span></div>
                  <div className="phone-pbar"><div style={{ width: "100%" }}></div></div>
                  <div className="phone-body" style={{ textAlign: "center" }}>
                    <div className="phone-success">✓</div>
                    <h3>Listo, Mariana.</h3>
                    <p>Te tardaste 9 min 47 seg.</p>
                    <div style={{ background: "var(--color-brand-50)", border: "1px solid var(--color-brand-200)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", margin: "var(--space-3) 0", textAlign: "left" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--color-brand-700)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-1)", fontWeight: "var(--weight-medium)" }}>Tu CLABE empresarial</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-primary)", letterSpacing: "0.04em", fontWeight: "var(--weight-medium)" }}>012 180 01234567890 1</div>
                    </div>
                  </div>
                  <div className="phone-footer">
                    <button className="phone-btn brand">Compartir por WhatsApp</button>
                    <a className="phone-link">Ver mi cuenta</a>
                  </div>
                </div>
              </div>
              <div className="mock-caption"><strong>Success</strong>CLABE as first value</div>
            </div>
      
            <div className="phone-mock">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-status"><span>9:52</span><span>●●●</span></div>
                  <div className="phone-header"><span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--weight-bold)", fontSize: "0.9rem", color: "var(--text-primary)" }}>Hola Mariana</span><span style={{ fontSize: "0.85rem" }}>⌃</span></div>
                  <div className="phone-card">
                    <div className="brand">Plata<span className="sub">Negocios</span></div>
                    <div className="chip"></div>
                    <div>
                      <div className="num">•••• 4729</div>
                      <div className="name">CAFÉ DEL MOLINO</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-1)", fontWeight: "var(--weight-medium)" }}>Saldo disponible</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: "var(--weight-extrabold)", color: "var(--text-primary)", marginBottom: "var(--space-4)", letterSpacing: "-0.02em" }}>$0.<span style={{ fontSize: "1rem", color: "var(--text-tertiary)" }}>00</span></div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--color-brand-700)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Empieza aquí</div>
                  <div style={{ fontSize: "0.7rem", borderTop: "1px solid var(--border-subtle)", padding: "var(--space-2) 0", fontWeight: "var(--weight-medium)" }}>→ Comparte tu CLABE</div>
                  <div style={{ fontSize: "0.7rem", borderTop: "1px solid var(--border-subtle)", padding: "var(--space-2) 0", fontWeight: "var(--weight-medium)" }}>→ Agrega a Apple Pay</div>
                  <div style={{ fontSize: "0.7rem", borderTop: "1px solid var(--border-subtle)", padding: "var(--space-2) 0", fontWeight: "var(--weight-medium)" }}>→ Invita a tu contador</div>
                </div>
              </div>
              <div className="mock-caption"><strong>Home</strong>3 actions, no empty dashboard</div>
            </div>
      
          </div>
        </div>
      </section>
      
      {/* CONTEXT */}
      <section className="chapter">
        <div className="container">
          <div className="section-title">Context</div>
          <h2 className="section-heading">Why a business platform, not a business app.</h2>
          <p className="section-desc">A business banking product isn't a feature set. It's an operational system that has to behave correctly across many client types, many states, and many edge cases — most of which the user only sees when something goes wrong. That's the design problem this exercise focuses on.</p>
      
          <p style={{ fontSize: "var(--text-base)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)", maxWidth: "680px" }}>Plata's banking license unlocks B2B. The market is 4.5 million Mexican SMBs, mostly underserved by incumbents and partially served by competitors that each own one slice — Konfío owns SMB credit, Clara owns expense management, Clip owns acceptance. <strong style={{ color: "var(--text-primary)" }}>Nobody owns the operational bank.</strong> The V1 designed here is the foundation that makes everything else possible.</p>
      
          <div className="stats">
            <div className="stat">
              <span className="num">4.5<span className="unit">M</span></span>
              <span className="label">Mexican SMBs</span>
            </div>
            <div className="stat">
              <span className="num">70<span className="unit">%</span></span>
              <span className="label">Are PFAE, not PM</span>
            </div>
            <div className="stat">
              <span className="num">9</span>
              <span className="label">Account states modeled</span>
            </div>
            <div className="stat">
              <span className="num">3</span>
              <span className="label">User roles with permissions</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* STRATEGIC BETS — hidden */}
      <section className="chapter" style={{ display: "none" }}>
        <div className="container">
          <div className="section-title">Five product bets</div>
          <h2 className="section-heading">The non-negotiables that ordered every decision.</h2>
      
          <div className="decisions">
            <div className="decision">
              <div className="num">01</div>
              <h4>PFAE only in V1</h4>
              <p>Persona Moral onboarding can't be 10 minutes — different KYC, different document set. 70% of Mexican SMBs are PFAE anyway. V2 introduces PM with a separate, longer flow.</p>
            </div>
            <div className="decision">
              <div className="num">02</div>
              <h4>Zero monthly fee</h4>
              <p>No maintenance, no minimum balance, no SPEI charges. The biggest competitive lever against BBVA, Banorte and Hey Banco — and the only message that wins a side-by-side comparison in three seconds.</p>
            </div>
            <div className="decision">
              <div className="num">03</div>
              <h4>Mobile + web, different jobs</h4>
              <p>Mobile is the owner's surface. Web is the accountant's. They're the same product with different permissions, not two ports of the same UI. Both ship in V1.</p>
            </div>
            <div className="decision">
              <div className="num">04</div>
              <h4>CLABE first, card second</h4>
              <p>The success screen surfaces the CLABE before the dashboard, before any upsell. The first promise is "you can get paid now". Everything else is secondary.</p>
            </div>
            <div className="decision">
              <div className="num">05</div>
              <h4>States, not happy paths</h4>
              <p>Every flow is designed for failure first, success second. KYC fails, network drops, OCR misreads, PLD flags — each one resolves into a state the user can act on, not a dead end.</p>
            </div>
          </div>
      
          <div className="insight">
            <span className="insight-label">Insight</span>
            <p>The fifth bet is the one this case study spends the most time on. A banking product is judged not by how it works when things go right, but by how it behaves when they don't.</p>
          </div>
        </div>
      </section>
      
      {/* STATES & PERMISSIONS */}
      <section className="chapter">
        <div className="container">
          <div className="section-title">States & permissions</div>
          <h2 className="section-heading">An account is a state machine. The UI follows.</h2>
          <p className="section-desc">A business account isn't always "active". It moves through nine states across its lifecycle, each with different permissions and different UI affordances. The state machine is the source of truth — every screen renders from it, not from a hardcoded happy path.</p>
      
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", marginBottom: "var(--space-3)", letterSpacing: "-0.01em" }}>Account state machine</h3>
      
          <div className="state-machine">
            <div className="sm-row">
              <span className="state-node start">draft</span>
              <span className="sm-arrow">→</span>
              <span className="state-node start">kyc_in_progress</span>
              <span className="sm-arrow">→</span>
              <span className="state-node start">kyc_submitted</span>
              <span className="sm-arrow">→</span>
              <span className="state-node active">active</span>
              <span className="sm-arrow">⇄</span>
              <span className="state-node risk">limited</span>
              <span className="sm-arrow">→</span>
              <span className="state-node error">frozen</span>
            </div>
            <div className="sm-row">
              <span style={{ opacity: "0", minWidth: "110px" }}>draft</span>
              <span style={{ opacity: "0" }}>→</span>
              <span style={{ opacity: "0", minWidth: "110px" }}>in_progress</span>
              <span className="sm-arrow" style={{ transform: "rotate(90deg)" }}>→</span>
              <span className="state-node risk">manual_review</span>
              <span className="sm-arrow">→</span>
              <span className="state-node end">kyc_rejected</span>
              <span style={{ flex: "1" }}></span>
              <span className="sm-arrow">→</span>
              <span className="state-node end">closed</span>
            </div>
            <div className="sm-legend">
              <div><span className="dot" style={{ background: "var(--color-brand-50)", border: "1px solid var(--color-brand-300)" }}></span>Pre-activation</div>
              <div><span className="dot" style={{ background: "var(--color-success-50)", border: "1px solid var(--color-success-500)" }}></span>Operational</div>
              <div><span className="dot" style={{ background: "var(--color-warning-50)", border: "1px solid var(--color-warning-500)" }}></span>At risk / restricted</div>
              <div><span className="dot" style={{ background: "var(--color-error-50)", border: "1px solid var(--color-error-500)" }}></span>Blocked</div>
              <div><span className="dot" style={{ background: "var(--surface-tertiary)", border: "1px dashed var(--text-tertiary)" }}></span>Terminal</div>
            </div>
          </div>
      
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", marginTop: "var(--space-10)", marginBottom: "var(--space-3)", letterSpacing: "-0.01em" }}>Roles and permissions matrix</h3>
      
          <table className="perm-table">
            <thead>
              <tr>
                <th>Action</th>
                <th className="col-role">Owner</th>
                <th className="col-role">Accountant</th>
                <th className="col-role">Employee · V2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="action">View balance & movements</td>
                <td className="role"><span className="yes">●</span></td>
                <td className="role"><span className="yes">●</span></td>
                <td className="role"><span className="scoped">own card only</span></td>
              </tr>
              <tr>
                <td className="action">Send SPEI</td>
                <td className="role"><span className="yes">●</span></td>
                <td className="role"><span className="no">—</span></td>
                <td className="role"><span className="scoped">≤ daily limit</span></td>
              </tr>
              <tr>
                <td className="action">Manage card (block / replace)</td>
                <td className="role"><span className="yes">●</span></td>
                <td className="role"><span className="no">—</span></td>
                <td className="role"><span className="scoped">own card</span></td>
              </tr>
              <tr>
                <td className="action">Export reports (CSV, Contpaq)</td>
                <td className="role"><span className="yes">●</span></td>
                <td className="role"><span className="yes">●</span></td>
                <td className="role"><span className="no">—</span></td>
              </tr>
              <tr>
                <td className="action">Categorize movements</td>
                <td className="role"><span className="yes">●</span></td>
                <td className="role"><span className="yes">●</span></td>
                <td className="role"><span className="no">—</span></td>
              </tr>
              <tr>
                <td className="action">Dispute card transaction</td>
                <td className="role"><span className="yes">●</span></td>
                <td className="role"><span className="no">—</span></td>
                <td className="role"><span className="scoped">own card</span></td>
              </tr>
              <tr>
                <td className="action">Invite / remove users</td>
                <td className="role"><span className="yes">●</span></td>
                <td className="role"><span className="no">—</span></td>
                <td className="role"><span className="no">—</span></td>
              </tr>
              <tr>
                <td className="action">Close account</td>
                <td className="role"><span className="yes">●</span></td>
                <td className="role"><span className="no">—</span></td>
                <td className="role"><span className="no">—</span></td>
              </tr>
            </tbody>
          </table>
      
          <div className="insight">
            <span className="insight-label">Insight</span>
            <p>The matrix doubles as the contract with engineering. Every screen has a permission requirement; every UI state checks it before render. A read-only accountant viewing the same balance screen as the owner sees the same data, with destructive actions hidden — not greyed out, hidden — because permission-by-removal is easier to reason about than permission-by-state.</p>
          </div>
        </div>
      </section>
      
      {/* EDGE CASES */}
      <section className="chapter surface-tertiary">
        <div className="container-wide">
          <div className="section-title">Edge cases</div>
          <h2 className="section-heading">Three failure modes. Three recovery flows.</h2>
          <p className="section-desc">A bank that only works on the happy path is not a bank. The screens below show how three common failure modes resolve into states the user can act on, without ever exposing an error code or a dead-end.</p>
      
          <div className="phone-row">
      
            <div className="phone-mock">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-status"><span>9:43</span><span>●●●</span></div>
                  <div className="phone-header"><span className="phone-back">←</span><span className="phone-progress">04/08</span></div>
                  <div className="phone-pbar"><div style={{ width: "50%", background: "var(--color-error-500)" }}></div></div>
                  <div className="phone-body">
                    <div className="phone-warn-icon">!</div>
                    <h3 style={{ textAlign: "center" }}>No pudimos leer tu INE</h3>
                    <p style={{ textAlign: "center" }}>Se ve borrosa o le falta una esquina. Inténtalo otra vez con buena luz.</p>
                    <div className="phone-capture error"></div>
                    <p style={{ fontSize: "0.62rem", color: "var(--text-tertiary)", textAlign: "center" }}>Tip: apoya la INE sobre una superficie oscura.</p>
                  </div>
                  <div className="phone-footer">
                    <button className="phone-btn brand">Tomar otra foto</button>
                    <a className="phone-link">Usar otra identificación</a>
                  </div>
                </div>
              </div>
              <div className="mock-caption"><strong>OCR failed</strong>Diagnose, suggest, allow retry</div>
            </div>
      
            <div className="phone-mock">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-status"><span>9:52</span><span>●●●</span></div>
                  <div className="phone-header"><span></span><span className="phone-progress" style={{ color: "var(--color-brand-600)" }}>REVIEW</span></div>
                  <div className="phone-body">
                    <div className="phone-info-icon">⏱</div>
                    <h3 style={{ textAlign: "center" }}>Estamos revisando</h3>
                    <p style={{ textAlign: "center" }}>Tu información está completa. Necesitamos un par de horas para confirmar todo.</p>
                    <div style={{ background: "var(--color-brand-50)", border: "1px solid var(--color-brand-200)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", margin: "var(--space-3) 0" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--color-brand-700)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Estado</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-primary)", display: "flex", justifyContent: "space-between", padding: "var(--space-1) 0" }}><span>Documentos recibidos</span><span style={{ color: "var(--color-success-700)", fontWeight: "var(--weight-bold)" }}>✓</span></div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-primary)", display: "flex", justifyContent: "space-between", padding: "var(--space-1) 0" }}><span>Identidad confirmada</span><span style={{ color: "var(--color-success-700)", fontWeight: "var(--weight-bold)" }}>✓</span></div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", display: "flex", justifyContent: "space-between", padding: "var(--space-1) 0" }}><span>Revisión final</span><span style={{ color: "var(--color-brand-700)", fontFamily: "var(--font-mono)", fontSize: "0.65rem" }}>en curso</span></div>
                    </div>
                    <p style={{ fontSize: "0.65rem", color: "var(--text-tertiary)" }}>Te avisamos por WhatsApp en cuanto esté lista.</p>
                  </div>
                  <div className="phone-footer">
                    <button className="phone-btn secondary">Cerrar app</button>
                  </div>
                </div>
              </div>
              <div className="mock-caption"><strong>Manual review</strong>Never "rejected" — always "in progress"</div>
            </div>
      
            <div className="phone-mock">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-status"><span>14:22</span><span>●●●</span></div>
                  <div className="phone-header"><span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--weight-bold)", fontSize: "0.9rem", color: "var(--text-primary)" }}>Tu tarjeta</span><span style={{ fontSize: "0.85rem" }}>⌃</span></div>
                  <div className="phone-card locked">
                    <span className="lockbadge">Bloqueada</span>
                    <div className="brand">Plata<span className="sub">Negocios</span></div>
                    <div className="chip"></div>
                    <div>
                      <div className="num">•••• 4729</div>
                      <div className="name">CAFÉ DEL MOLINO</div>
                    </div>
                  </div>
                  <div style={{ background: "var(--color-error-50)", border: "1px solid var(--color-error-500)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", margin: "var(--space-2) 0" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: "var(--weight-bold)", marginBottom: "var(--space-1)", color: "var(--color-error-700)", fontFamily: "var(--font-display)" }}>Bloqueamos tu tarjeta</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>Detectamos un cargo inusual de $4,800 MXN en Costco Aguascalientes. ¿Fuiste tú?</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-tertiary)", margin: "var(--space-2) 0", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "var(--weight-medium)" }}>Cargo en duda</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", padding: "var(--space-2) 0", borderBottom: "1px solid var(--border-subtle)" }}>
                    <span>Costco Aguascalientes</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: "var(--weight-medium)" }}>$4,800</span>
                  </div>
                  <div className="phone-footer">
                    <button className="phone-btn brand">Sí, fui yo · Desbloquear</button>
                    <a className="phone-link" style={{ color: "var(--color-error-700)", fontWeight: "var(--weight-medium)" }}>No fui yo · Reportar fraude</a>
                  </div>
                </div>
              </div>
              <div className="mock-caption"><strong>Card frozen</strong>Protect first, ask later</div>
            </div>
      
          </div>
      
          <div className="container" style={{ padding: "0", marginTop: "var(--space-10)" }}>
            <div className="insight">
              <span className="insight-label">Insight</span>
              <p>Each edge case follows the same three-beat structure: state the problem clearly, show what we already know, offer the single most useful next action. The OCR case offers retry plus an alternative document. The review case shows progress, not waiting. The card freeze case respects the user enough to ask whether the suspicious activity was theirs — and protects the money first.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* OPERATIONAL FLOWS */}
      <section className="chapter">
        <div className="container-wide">
          <div className="section-title">Operational flows</div>
          <h2 className="section-heading">The day after onboarding. What the product actually does.</h2>
          <p className="section-desc">Onboarding is one day. Operations are every day after that. Four flows account for roughly 90% of the daily sessions in a typical business account: receiving, sending, categorizing, and reconciling. Each one is designed to be a single tap from the home screen.</p>
      
          <div className="phone-row" style={{ marginTop: "var(--space-10)" }}>
      
            <div className="phone-mock">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-status"><span>10:14</span><span>●●●</span></div>
                  <div className="phone-header"><span className="phone-back">←</span><span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--weight-bold)", fontSize: "0.92rem" }}>Cobrar</span><span></span></div>
                  <div className="phone-body">
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--color-brand-700)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "var(--space-2) 0 var(--space-3)", fontWeight: "var(--weight-medium)" }}>3 formas de cobrar</div>
      
                    <div style={{ border: "1.5px solid var(--color-brand-500)", background: "var(--color-brand-50)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", marginBottom: "var(--space-2)" }}>
                      <div style={{ fontSize: "0.76rem", fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-1)", fontFamily: "var(--font-display)" }}>Por transferencia (SPEI)</div>
                      <div style={{ fontSize: "0.62rem", color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>Comparte tu CLABE. Llega en segundos.</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", background: "var(--color-neutral-0)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "var(--space-2)", letterSpacing: "0.03em", fontWeight: "var(--weight-medium)" }}>012 180 01234567890 1</div>
                    </div>
      
                    <div style={{ border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", marginBottom: "var(--space-2)" }}>
                      <div style={{ fontSize: "0.76rem", fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-1)", fontFamily: "var(--font-display)" }}>Link de pago</div>
                      <div style={{ fontSize: "0.62rem", color: "var(--text-tertiary)" }}>Para WhatsApp o Instagram.</div>
                    </div>
      
                    <div style={{ border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)" }}>
                      <div style={{ fontSize: "0.76rem", fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-1)", fontFamily: "var(--font-display)" }}>Tu código QR</div>
                      <div style={{ fontSize: "0.62rem", color: "var(--text-tertiary)" }}>El cliente escanea con su banco.</div>
                    </div>
                  </div>
                  <div className="phone-footer">
                    <button className="phone-btn brand">Compartir CLABE</button>
                  </div>
                </div>
              </div>
              <div className="mock-caption"><strong>Cobrar · Receive</strong>Three methods, one tap each</div>
            </div>
      
            <div className="phone-mock">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-status"><span>10:15</span><span>●●●</span></div>
                  <div className="phone-header"><span className="phone-back">←</span><span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--weight-bold)", fontSize: "0.92rem" }}>Pagar</span><span></span></div>
                  <div className="phone-body">
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "var(--space-2) 0 var(--space-3)", fontWeight: "var(--weight-medium)" }}>¿A quién le pagas?</div>
                    <div style={{ border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", marginBottom: "var(--space-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "var(--weight-semibold)", fontFamily: "var(--font-display)" }}>Café Olmedo SA</div>
                        <div style={{ fontSize: "0.6rem", color: "var(--text-tertiary)" }}>Banorte · Último: $8,200 · 3 días</div>
                      </div>
                      <span style={{ fontSize: "0.95rem", color: "var(--text-tertiary)" }}>→</span>
                    </div>
                    <div style={{ border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", marginBottom: "var(--space-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "var(--weight-semibold)", fontFamily: "var(--font-display)" }}>CFE Servicios</div>
                        <div style={{ fontSize: "0.6rem", color: "var(--text-tertiary)" }}>Último: $1,840 · 14 días</div>
                      </div>
                      <span style={{ fontSize: "0.95rem", color: "var(--text-tertiary)" }}>→</span>
                    </div>
                    <div style={{ border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", marginBottom: "var(--space-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "var(--weight-semibold)", fontFamily: "var(--font-display)" }}>Lupita (renta local)</div>
                        <div style={{ fontSize: "0.6rem", color: "var(--text-tertiary)" }}>BBVA · Programado · 1 nov</div>
                      </div>
                      <span style={{ display: "inline-block", padding: "2px 7px", background: "var(--color-brand-100)", color: "var(--color-brand-700)", fontFamily: "var(--font-mono)", fontSize: "0.55rem", borderRadius: "var(--radius-full)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "var(--weight-medium)" }}>prog.</span>
                    </div>
                    <a className="phone-link" style={{ marginTop: "var(--space-3)", color: "var(--color-brand-700)", fontWeight: "var(--weight-medium)" }}>+ Nuevo destinatario</a>
                  </div>
                  <div className="phone-footer">
                    <button className="phone-btn brand">Enviar SPEI</button>
                  </div>
                </div>
              </div>
              <div className="mock-caption"><strong>Pagar · Send</strong>Memory by frequency, not alphabet</div>
            </div>
      
            <div className="phone-mock">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-status"><span>10:18</span><span>●●●</span></div>
                  <div className="phone-header"><span className="phone-back">←</span><span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--weight-bold)", fontSize: "0.92rem" }}>Movimiento</span><span></span></div>
                  <div className="phone-body" style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-tertiary)", marginTop: "var(--space-2)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "var(--weight-medium)" }}>28 may · 17:32</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: "var(--weight-extrabold)", color: "var(--color-success-700)", margin: "var(--space-2) 0", letterSpacing: "-0.02em" }}>+$1,500<span style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}> MXN</span></div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-primary)", marginBottom: "2px", fontFamily: "var(--font-display)", fontWeight: "var(--weight-medium)" }}>de Juan Pérez Hernández</div>
                    <div style={{ fontSize: "0.62rem", color: "var(--text-tertiary)" }}>SPEI · BBVA · ref. 7240392</div>
      
                    <div style={{ marginTop: "var(--space-4)", textAlign: "left", background: "var(--color-brand-50)", border: "1px solid var(--color-brand-200)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--color-brand-700)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-1)", fontWeight: "var(--weight-medium)" }}>Categoría sugerida</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-primary)", fontWeight: "var(--weight-medium)" }}>Venta · Café</span>
                        <span style={{ fontSize: "0.62rem", color: "var(--color-brand-700)", fontWeight: "var(--weight-medium)" }}>Cambiar</span>
                      </div>
                    </div>
      
                    <div style={{ marginTop: "var(--space-2)", textAlign: "left", background: "var(--surface-secondary)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-primary)", fontWeight: "var(--weight-medium)" }}>Emitir CFDI</span>
                        <span style={{ display: "inline-block", padding: "2px 7px", background: "var(--color-brand-100)", color: "var(--color-brand-700)", fontFamily: "var(--font-mono)", fontSize: "0.55rem", borderRadius: "var(--radius-full)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "var(--weight-medium)" }}>V2</span>
                      </div>
                    </div>
                  </div>
                  <div className="phone-footer">
                    <button className="phone-btn secondary">Compartir recibo</button>
                  </div>
                </div>
              </div>
              <div className="mock-caption"><strong>Movement detail</strong>Categorize & receipt in one place</div>
            </div>
      
            <div className="phone-mock">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-status"><span>10:20</span><span>●●●</span></div>
                  <div className="phone-header"><span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--weight-bold)", fontSize: "0.92rem", color: "var(--text-primary)" }}>Movimientos</span><span style={{ fontSize: "0.85rem" }}>⌥</span></div>
                  <div className="phone-body" style={{ paddingTop: "var(--space-2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "var(--weight-medium)" }}>Mayo 2026</div>
                      <div style={{ fontSize: "0.62rem", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>142 movs</div>
                    </div>
      
                    <div style={{ background: "var(--color-brand-50)", border: "1px solid var(--color-brand-200)", borderRadius: "var(--radius-md)", padding: "var(--space-2) var(--space-3)", marginBottom: "var(--space-3)", display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: "0.55rem", color: "var(--color-brand-700)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "var(--weight-medium)" }}>Ingresos</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--color-success-700)", fontWeight: "var(--weight-extrabold)" }}>+$87,420</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.55rem", color: "var(--color-brand-700)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "var(--weight-medium)" }}>Egresos</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--text-primary)", fontWeight: "var(--weight-extrabold)" }}>−$54,180</div>
                      </div>
                    </div>
      
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "var(--space-2) 0 var(--space-1)", fontWeight: "var(--weight-medium)" }}>28 mayo</div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-2) 0", borderBottom: "1px solid var(--border-subtle)", fontSize: "0.7rem" }}>
                      <div><div style={{ fontWeight: "var(--weight-medium)" }}>SPEI · J. Pérez</div><div style={{ fontSize: "0.55rem", color: "var(--text-tertiary)" }}>Venta · Café</div></div>
                      <span style={{ color: "var(--color-success-700)", fontFamily: "var(--font-mono)", fontWeight: "var(--weight-medium)" }}>+$1,500</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-2) 0", borderBottom: "1px solid var(--border-subtle)", fontSize: "0.7rem" }}>
                      <div><div style={{ fontWeight: "var(--weight-medium)" }}>Café Olmedo SA</div><div style={{ fontSize: "0.55rem", color: "var(--color-brand-700)" }}>Sin categorizar</div></div>
                      <span style={{ fontFamily: "var(--font-mono)", fontWeight: "var(--weight-medium)" }}>−$8,200</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-2) 0", borderBottom: "1px solid var(--border-subtle)", fontSize: "0.7rem" }}>
                      <div><div style={{ fontWeight: "var(--weight-medium)" }}>SPEI · M. Hernández</div><div style={{ fontSize: "0.55rem", color: "var(--text-tertiary)" }}>Venta · Café</div></div>
                      <span style={{ color: "var(--color-success-700)", fontFamily: "var(--font-mono)", fontWeight: "var(--weight-medium)" }}>+$420</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mock-caption"><strong>Activity</strong>Smart category + manual override</div>
            </div>
      
          </div>
      
          <div className="container" style={{ padding: "0", marginTop: "var(--space-10)" }}>
            <div className="insight">
              <span className="insight-label">Insight</span>
              <p>Two compounding decisions in these flows. First, the Pagar list orders recipients by recent frequency, not alphabet — because Mariana pays the same five vendors every month, and an alphabetical list buries Café Olmedo in a flat directory. Second, categorization is auto-suggested but always editable — the system makes a guess, the owner corrects it once, and the system learns. Small operational details. Big effect on daily session friction.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* WEB COMPANION */}
      <section className="chapter surface-tertiary">
        <div className="container-wide">
          <div className="section-title">Web · accountant console</div>
          <h2 className="section-heading">A second surface, scoped by permission.</h2>
          <p className="section-desc">Mexican accountants work on desktop. They serve 20–50 small businesses each. The web console is built for them: a multi-client list, read-only access to each client's account, exportable to the formats their software actually uses. Same backend as the mobile app. Different permissions enforced server-side, different UI rendered client-side.</p>
      
          <div className="laptop">
            <div className="laptop-frame">
              <div className="laptop-controls"><span></span><span></span><span></span></div>
              <div className="laptop-screen">
                <div className="laptop-sidebar">
                  <div className="logo">Plata<span>·</span>Contador<span className="role-tag">Console</span></div>
                  <ul>
                    <li className="active">Resumen</li>
                    <li>Movimientos</li>
                    <li>Estados de cuenta</li>
                    <li>CFDIs</li>
                    <li>Exportar</li>
                  </ul>
                  <div className="role-badge">
                    <div className="label">Cliente activo</div>
                    <div className="name">Mariana Reyes</div>
                    <div className="sub">Café del Molino · PFAE</div>
                  </div>
                </div>
                <div className="laptop-main">
                  <h4>Resumen del periodo <span className="read-only-badge">Solo lectura</span></h4>
                  <div className="subline">1–31 mayo 2026 · acceso de Mariana Reyes · 23 clientes en cartera</div>
                  <div className="laptop-cards">
                    <div className="laptop-card">
                      <div className="l-label">Ingresos</div>
                      <div className="l-num">$87,420<span className="unit"> MXN</span></div>
                      <div className="l-delta">+12% vs abril</div>
                    </div>
                    <div className="laptop-card">
                      <div className="l-label">Egresos</div>
                      <div className="l-num">$54,180<span className="unit"> MXN</span></div>
                      <div className="l-delta" style={{ color: "var(--text-tertiary)" }}>−3%</div>
                    </div>
                    <div className="laptop-card">
                      <div className="l-label">Sin categorizar</div>
                      <div className="l-num">7<span className="unit"> movs</span></div>
                      <div className="l-delta" style={{ color: "var(--color-brand-700)" }}>Requieren atención</div>
                    </div>
                  </div>
                  <table className="laptop-table">
                    <thead><tr><th>Fecha</th><th>Concepto</th><th>Categoría</th><th style={{ textAlign: "right" }}>Monto</th></tr></thead>
                    <tbody>
                      <tr><td style={{ fontFamily: "var(--font-mono)" }}>28 may</td><td>SPEI · Juan Pérez</td><td>Venta</td><td style={{ textAlign: "right", color: "var(--color-success-700)", fontFamily: "var(--font-mono)", fontWeight: "var(--weight-medium)" }}>+$1,500</td></tr>
                      <tr><td style={{ fontFamily: "var(--font-mono)" }}>27 may</td><td>Café Olmedo SA</td><td style={{ color: "var(--color-brand-700)" }}>Sin categorizar</td><td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: "var(--weight-medium)" }}>−$8,200</td></tr>
                      <tr><td style={{ fontFamily: "var(--font-mono)" }}>26 may</td><td>SPEI · M. Hernández</td><td>Venta</td><td style={{ textAlign: "right", color: "var(--color-success-700)", fontFamily: "var(--font-mono)", fontWeight: "var(--weight-medium)" }}>+$420</td></tr>
                    </tbody>
                  </table>
                  <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-5)" }}>
                    <button className="laptop-btn brand">Exportar Contpaq</button>
                    <button className="laptop-btn outline">CSV</button>
                    <button className="laptop-btn outline">PDF</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      
          <div className="container" style={{ padding: "0", marginTop: "var(--space-10)" }}>
            <p style={{ fontSize: "var(--text-base)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)", maxWidth: "760px", marginBottom: "var(--space-6)" }}>The "Solo lectura" badge is visible at all times. Hidden, not greyed, are: sending money, managing cards, closing the account, inviting users. The accountant can categorize movements (which is useful for them), but they cannot dispute them — that's reserved for the owner, who has the legal authority.</p>
      
            <div className="insight">
              <span className="insight-label">Insight</span>
              <p>The mobile app and the web console share the same backend, the same state machine, and the same design tokens. They differ only in permissions and in the affordances that surface from those permissions. That's what makes the system maintainable when V2 introduces employees, V3 introduces auditors — each new role is a new column in the permissions matrix, not a new product.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* A/B TESTS */}
      <section className="chapter">
        <div className="container">
          <div className="section-title">Validation plan</div>
          <h2 className="section-heading">Six A/B tests, ranked by activation impact.</h2>
          <p className="section-desc">Hypotheses I'd ship in the first six months. Each one has a falsifiable prediction and a single metric that decides.</p>
      
          <div className="ab-tests">
      
            <div className="ab-test">
              <span className="ab-test-id">AB-01 · P0</span>
              <div className="ab-test-name">CLABE-first vs Card-first on success</div>
              <p className="ab-test-hyp">Leading with the CLABE drives faster activation than leading with the card, because the immediate need is "receive money", not "spend money".</p>
              <div className="ab-test-metric"><strong>Metric:</strong> % of accounts with first inbound SPEI in &lt;72h. <strong>MDE:</strong> +5pp.</div>
            </div>
      
            <div className="ab-test">
              <span className="ab-test-id">AB-02 · P0</span>
              <div className="ab-test-name">WhatsApp OTP vs SMS OTP</div>
              <p className="ab-test-hyp">WhatsApp delivery improves OTP completion vs. SMS, because that's where this user actually reads messages.</p>
              <div className="ab-test-metric"><strong>Metric:</strong> Finalization rate at OTP step. <strong>MDE:</strong> +3pp.</div>
            </div>
      
            <div className="ab-test">
              <span className="ab-test-id">AB-03 · P0</span>
              <div className="ab-test-name">CFS upload mini-guide vs raw upload</div>
              <p className="ab-test-hyp">The Constancia Fiscal is the biggest drop-off point. An inline guide showing how to download it from SAT cuts drop-off by half.</p>
              <div className="ab-test-metric"><strong>Metric:</strong> Drop-off at CFS step. <strong>MDE:</strong> −15pp.</div>
            </div>
      
            <div className="ab-test">
              <span className="ab-test-id">AB-04 · P1</span>
              <div className="ab-test-name">Recipients by frequency vs alphabet</div>
              <p className="ab-test-hyp">Ordering Pagar recipients by recent frequency reduces time-to-send vs. alphabetical, because vendor payments are recurring patterns, not lookups.</p>
              <div className="ab-test-metric"><strong>Metric:</strong> Median time from "Pagar" tap to send. <strong>MDE:</strong> −20%.</div>
            </div>
      
            <div className="ab-test">
              <span className="ab-test-id">AB-05 · P0</span>
              <div className="ab-test-name">Cross-sell from Plata Card consumer</div>
              <p className="ab-test-hyp">A "Do you own a business?" prompt inside the consumer app generates lower-CAC, higher-quality leads than paid acquisition.</p>
              <div className="ab-test-metric"><strong>Metric:</strong> CAC vs. paid channels. <strong>MDE:</strong> &lt;30% of paid CAC.</div>
            </div>
      
            <div className="ab-test">
              <span className="ab-test-id">AB-06 · P2</span>
              <div className="ab-test-name">Card freeze: confirm vs. ask</div>
              <p className="ab-test-hyp">A fraud-flagged card that auto-freezes and asks "was this you?" reduces fraud loss without hurting NPS, vs. a soft alert that lets the transaction through.</p>
              <div className="ab-test-metric"><strong>Metric:</strong> Fraud loss per 1k cards / NPS delta. <strong>MDE:</strong> −40% fraud loss.</div>
            </div>
      
          </div>
        </div>
      </section>
      
      {/* DESIGN SYSTEM */}
      <section className="chapter">
        <div className="container">
          <div className="section-title">Design system</div>
          <h2 className="section-heading">Built on Menura DS · my own system foundations.</h2>
          <p className="section-desc">This case isn't styled in a vacuum. Every token, type scale, and component comes from Menura DS — the design system I built for my own SaaS company. Bringing a mature system into a new product is faster than reinventing one each time, and it forces consistency across everything I ship.</p>
      
          <div className="ds-intro-card">
            <div className="ds-intro-card-inner">
              <span className="label">The system underneath</span>
              <h3>Menura <span>Design System</span></h3>
              <p>Plus Jakarta Sans + DM Sans + JetBrains Mono. Warm orange brand ramp + stone neutrals. 8px spacing grid. Generous radii. Subtle shadows. Motion tokens for ease-out / spring / smooth. Built for my own product. Applied here to a banking case study because a real DS travels.</p>
            </div>
          </div>
      
          <div className="ds-row">
            <div className="ds-section">
              <h4>Brand ramp · warm orange</h4>
              <div className="swatch-row">
                <div className="swatch-stack"><div className="swatch" style={{ background: "#FFF7ED" }}></div><span className="swatch-label">50</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#FFEDD5" }}></div><span className="swatch-label">100</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#FED7AA" }}></div><span className="swatch-label">200</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#FDBA74" }}></div><span className="swatch-label">300</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#FB923C" }}></div><span className="swatch-label">400</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#F97316" }}></div><span className="swatch-label">500</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#EA580C" }}></div><span className="swatch-label">600</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#C2410C" }}></div><span className="swatch-label">700</span></div>
              </div>
      
              <h4 style={{ marginTop: "var(--space-6)" }}>Stone neutrals</h4>
              <div className="swatch-row">
                <div className="swatch-stack"><div className="swatch" style={{ background: "#FAFAF9", border: "1px solid var(--border-default)" }}></div><span className="swatch-label">50</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#E7E5E4" }}></div><span className="swatch-label">200</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#A8A29E" }}></div><span className="swatch-label">400</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#57534E" }}></div><span className="swatch-label">600</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#1C1917" }}></div><span className="swatch-label">900</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#0C0A09" }}></div><span className="swatch-label">950</span></div>
              </div>
      
              <h4 style={{ marginTop: "var(--space-6)" }}>Semantic</h4>
              <div className="swatch-row">
                <div className="swatch-stack"><div className="swatch" style={{ background: "#22C55E" }}></div><span className="swatch-label">success</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#EAB308" }}></div><span className="swatch-label">warning</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#EF4444" }}></div><span className="swatch-label">error</span></div>
                <div className="swatch-stack"><div className="swatch" style={{ background: "#3B82F6" }}></div><span className="swatch-label">info</span></div>
              </div>
            </div>
      
            <div className="ds-section">
              <h4>Type system</h4>
              <div className="type-sample">
                <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: "var(--weight-extrabold)", lineHeight: "var(--leading-tight)", letterSpacing: "-0.02em" }}>Plus Jakarta Sans</div>
                <div className="type-meta">Display · 800 · headings, CTAs, hero</div>
              </div>
              <div className="type-sample">
                <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)" }}>DM Sans para body. Excelente legibilidad en pantallas pequeñas.</div>
                <div className="type-meta">Body · 400 · text, descriptions, UI</div>
              </div>
              <div className="type-sample">
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--color-brand-700)", fontWeight: "var(--weight-medium)" }}>012 180 01234567890 1</div>
                <div className="type-meta">Mono · 500 · CLABE, amounts, codes</div>
              </div>
      
              <h4 style={{ marginTop: "var(--space-6)" }}>Primitives · sample</h4>
              <div className="ds-comp">
                <div className="preview" style={{ textAlign: "center" }}>
                  <button style={{ background: "var(--color-brand-500)", color: "white", border: "none", padding: "var(--space-2) var(--space-5)", borderRadius: "var(--radius-lg)", fontFamily: "var(--font-display)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", cursor: "pointer" }}>Empezar</button>
                  <button style={{ marginLeft: "var(--space-2)", background: "var(--color-neutral-900)", color: "white", border: "none", padding: "var(--space-2) var(--space-5)", borderRadius: "var(--radius-lg)", fontFamily: "var(--font-display)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", cursor: "pointer" }}>Continuar</button>
                </div>
                <div className="ds-comp-meta">PrimaryButton · brand (CTA) / neutral (default) / outline · radius-lg 12px</div>
              </div>
              <div className="ds-comp">
                <div className="preview">
                  <div style={{ background: "var(--color-brand-50)", border: "1px solid var(--color-brand-200)", borderRadius: "var(--radius-md)", padding: "var(--space-2) var(--space-3)" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--color-brand-700)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px", fontWeight: "var(--weight-medium)" }}>Tu CLABE</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", letterSpacing: "0.04em", fontWeight: "var(--weight-medium)" }}>012 180 01234567890 1</div>
                  </div>
                </div>
                <div className="ds-comp-meta">AccountIdentifier · CLABE / RFC variants · long-press to copy</div>
              </div>
            </div>
          </div>
      
          <div className="insight" style={{ marginTop: "var(--space-10)" }}>
            <span className="insight-label">Why this matters</span>
            <p>Three composition layers: primitives ship once from engineering. Patterns compose primitives. Flows compose patterns. New products extend the primitives — never replace them. The same Button renders an active "Send SPEI", a disabled "Send SPEI" (when frozen), and a destructive "Confirm freeze" — by switching tokens, not components.</p>
          </div>
        </div>
      </section>
      
      {/* SKILLS — MATCHING KATE'S BULLETS */}
      <section className="chapter">
        <div className="container">
          <div className="section-title">What this work demonstrates</div>
          <h2 className="section-heading">Side by side with the hiring post.</h2>
      
          <div className="skill-grid">
            <div className="skill-cell">
              <span className="req">Complex B2B · fintech products</span>
              <h4>Banking platform from scratch · 5+ years in product · founded Menura, SaaS for Mexican SMBs.</h4>
            </div>
            <div className="skill-cell">
              <span className="req">Web + mobile, strong on both</span>
              <h4>12 mobile screens for the owner, full web console for the accountant — same backend, different permission scope.</h4>
            </div>
            <div className="skill-cell">
              <span className="req">Native patterns · iOS, Android, web</span>
              <h4>Sheet vs bottom-sheet, biometric prompts, system back, keyboard nav, responsive grid — all surface-appropriate.</h4>
            </div>
            <div className="skill-cell">
              <span className="req">Workflow & systems, not UI polish</span>
              <h4>State machine, permissions matrix, edge cases — this case spends more time on operations than on visuals.</h4>
            </div>
            <div className="skill-cell">
              <span className="req">Permissions · states · edge cases · ops flows</span>
              <h4>9-state account machine, 3-role matrix, 3 edge-case recovery flows, 4 operational flows — all documented.</h4>
            </div>
            <div className="skill-cell">
              <span className="req">Simplify complex financial processes</span>
              <h4>10-min PFAE onboarding, three-method receive, frequency-ordered send, auto-categorization with override.</h4>
            </div>
            <div className="skill-cell">
              <span className="req">Product logic · scalability ≥ visual</span>
              <h4>Menura DS underneath. Three composition layers. New roles are columns in a matrix, not new products.</h4>
            </div>
            <div className="skill-cell">
              <span className="req">Own ambiguous problems end-to-end</span>
              <h4>Research, strategy, IA, UX, UI, microcopy, validation plan, DS — solo, two weeks, blank page.</h4>
            </div>
          </div>
        </div>
      </section>
      
      {/* CONTACT */}
      <section id="contact" className="contact-cta">
        <div className="contact-cta-inner container">
          <h2>Open to <span>talk.</span></h2>
          <p>Full research and design documents available on request. Or DM me on LinkedIn — I'll send links to the research doc, the MVP design doc, and Menura.</p>
          <div className="contact-buttons">
            <a href="mailto:david@example.com" className="contact-btn">Email</a>
            <a href="https://menura.mx" target="_blank" className="contact-btn outline">See Menura</a>
            <a href="#" className="contact-btn outline">LinkedIn</a>
          </div>
        </div>
      </section>
      
      <footer>
        <div className="ft">
          <span>David · Design Engineer</span>
          <span>Plata Business Platform · 2-week exercise · May 2026</span>
          <span>Built on Menura DS</span>
        </div>
      </footer>
    </>
  );
}
