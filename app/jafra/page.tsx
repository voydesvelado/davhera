export default function JafraBiolab() {
  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg: #f0ece6;
          --bg-card: #ffffff;
          --text-primary: #1a1a1a;
          --text-secondary: #6b6560;
          --accent: #e8713a;
          --accent-light: #fdf0e8;
          --pill-bg: #3a3632;
          --pill-text: #ffffff;
          --radius-hero: 18px;
          --radius-card: 14px;
          --radius-pill: 100px;
          --font-serif: 'DM Serif Display', Georgia, serif;
          --font-sans: var(--font-inter), 'DM Sans', -apple-system, sans-serif;
        }

        .jafra-body {
          font-family: var(--font-sans);
          background: #ffffff;
          color: var(--text-primary);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .logo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1;
        }

        .logo-brand {
          font-family: var(--font-sans);
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .logo-name {
          font-family: var(--font-serif);
          font-size: 26px;
          letter-spacing: -0.5px;
          color: var(--text-primary);
          margin-top: 1px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link {
          font-size: 14px;
          font-weight: 400;
          color: var(--text-primary);
          text-decoration: none;
          padding: 10px 20px;
          border-radius: var(--radius-pill);
          border: 1px solid transparent;
          transition: all 0.25s ease;
          letter-spacing: 0.01em;
        }

        .nav-link:hover {
          border-color: #d0cbc4;
          background: rgba(255,255,255,0.5);
        }

        .nav-link--cta {
          background: var(--pill-bg);
          color: var(--pill-text);
          border-color: var(--pill-bg);
          font-weight: 500;
        }

        .nav-link--cta:hover {
          background: #2a2622;
          border-color: #2a2622;
        }

        .hero-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px 40px;
        }

        .hero {
          position: relative;
          width: 100%;
          min-height: 640px;
          height: 75vh;
          max-height: 780px;
          border-radius: var(--radius-hero);
          overflow: hidden;
          background: var(--bg);
        }

        .hero__image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          animation: fadeIn 1s ease 0s both;
        }

  
        .hero__content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          padding: 48px 44px 36px;
        }

        .headline {
          max-width: 460px;
          animation: fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
        }

        .headline h1 {
          font-family: var(--font-serif);
          font-size: clamp(32px, 4vw, 46px);
          font-weight: 400;
          line-height: 1.15;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }

        .hero__bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }

        .testimonial {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: var(--radius-card);
          padding: 16px 20px;
          max-width: 380px;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 2px 20px rgba(0,0,0,0.04);
          animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both;
        }

        .testimonial__avatar {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
          background: #d8d3cc;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
        //   background: linear-gradient(135deg, #d4cfc7 0%, #c2bbb2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .testimonial__text { flex: 1; min-width: 0; }

        .testimonial__quote {
          font-size: 12.5px;
          font-weight: 500;
          line-height: 1.45;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .testimonial__body {
          font-size: 11.5px;
          font-weight: 300;
          line-height: 1.5;
          color: var(--text-secondary);
        }

        .product-card {
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: var(--radius-card);
          padding: 16px 18px 18px;
          width: 260px;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 2px 20px rgba(0,0,0,0.04);
          animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both;
        }

        .product-card__pills {
          display: flex;
          gap: 6px;
          margin-bottom: 14px;
        }

        .pill {
          font-size: 11px;
          font-weight: 400;
          padding: 5px 14px;
          border-radius: var(--radius-pill);
          background: rgba(58, 54, 50, 0.08);
          color: var(--text-secondary);
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .product-card__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .product-card__meta { flex: 1; }

        .product-card__tag {
          font-size: 10.5px;
          font-weight: 400;
          color: var(--text-secondary);
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }

        .product-card__name {
          font-family: var(--font-serif);
          font-size: 20px;
          line-height: 1.2;
          color: var(--text-primary);
          letter-spacing: -0.2px;
        }

        .product-card__arrow {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid #d0cbc4;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .product-card__arrow:hover {
          background: var(--pill-bg);
          border-color: var(--pill-bg);
        }

        .product-card__arrow:hover svg {
          stroke: white;
        }

        .product-card__arrow svg {
          width: 14px;
          height: 14px;
          stroke: var(--text-primary);
          stroke-width: 2;
          fill: none;
        }

        .product-card__image-row {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f7f5f2;
          border-radius: 10px;
          padding: 12px;
          min-height: 100px;
        }

        .product-card__image-row img {
          height: 90px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.08));
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .mission {
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 40px;
          display: flex;
          align-items: flex-start;
          gap: 40px;
        }

        .mission__label {
          font-size: 12px;
          font-weight: 400;
          color: var(--text-secondary);
          letter-spacing: 0.02em;
          white-space: nowrap;
          padding-top: 6px;
          flex: 0 0 200px;
        }

        .mission__right {
          flex: 1;
        }

        .mission__text {
          font-size: 22px;
          font-weight: 400;
          line-height: 1.55;
          color: var(--text-primary);
          letter-spacing: -0.2px;
          margin-bottom: 32px;
          max-width: 580px;
        }

        .mission__btn {
          display: inline-block;
          font-size: 13px;
          font-weight: 400;
          color: var(--text-primary);
          text-decoration: none;
          padding: 10px 22px;
          border-radius: var(--radius-pill);
          border: 1px solid #c8c4be;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }

        .mission__btn:hover {
          background: var(--text-primary);
          color: #fff;
          border-color: var(--text-primary);
        }

        .categories {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px 80px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .cat-card {
          background: #f5f4f2;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 0;
          min-height: 320px;
          position: relative;
          overflow: hidden;
        }

        .cat-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .cat-card__label {
          font-size: 13px;
          font-weight: 400;
          color: var(--text-secondary);
          letter-spacing: 0.01em;
        }

        .cat-card__arrow {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid #d8d4cf;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .cat-card__arrow:hover {
          background: var(--text-primary);
          border-color: var(--text-primary);
        }

        .cat-card__arrow:hover svg {
          stroke: white;
        }

        .cat-card__arrow svg {
          width: 12px;
          height: 12px;
          stroke: var(--text-primary);
          stroke-width: 2;
          fill: none;
        }

        .cat-card__image {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border-radius: 10px;
          padding: 16px;
        }

        .cat-card__image img {
          width: 100%;
          height: 220px;
          object-fit: contain;
          filter: drop-shadow(0 4px 16px rgba(0,0,0,0.07));
        }

        @media (max-width: 900px) {
          .categories { grid-template-columns: repeat(2, 1fr); padding: 0 16px 60px; }
        }

        @media (max-width: 600px) {
          .categories { grid-template-columns: 1fr 1fr; gap: 8px; }
          .cat-card { min-height: 220px; }
          .cat-card__image img { height: 140px; }
        }

        @media (max-width: 900px) {
          .navbar { padding: 14px 20px; }
          .hero-wrapper { padding: 0 16px 24px; }
          .hero { min-height: 520px; height: 70vh; }
          .hero__content { padding: 32px 28px 28px; }
          .hero__overlay {
            background: linear-gradient(
              180deg,
              rgba(240, 236, 230, 0.92) 0%,
              rgba(240, 236, 230, 0.6) 45%,
              transparent 70%
            );
          }
          .hero__bottom { flex-direction: column; align-items: flex-start; }
          .product-card { width: 100%; max-width: 300px; }
          .testimonial { max-width: 100%; }
        }

        @media (max-width: 600px) {
          .nav-link:not(.nav-link--cta) { display: none; }
          .headline h1 { font-size: 28px; }
          .hero { min-height: 480px; }
        }
      `}</style>

      <div className="jafra-body">
        <nav className="navbar">
          <div className="logo">
            <span className="logo-brand">jafra</span>
            <span className="logo-name">Biolab</span>
          </div>
          <div className="nav-links">
            <a href="#" className="nav-link">Catalog</a>
            <a href="#" className="nav-link">About Us</a>
            <a href="#" className="nav-link">Reviews</a>
            <a href="#" className="nav-link nav-link--cta">Contact Us</a>
          </div>
        </nav>

        <div className="hero-wrapper">
          <section className="hero">
            <img
              className="hero__image"
              src="https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/hero.png"
              alt="Hero"
            />
            <div className="hero__overlay" />
            <div className="hero__content">
              <div className="headline">
                <h1>Skincare for the whole body. <strong>For every body.</strong></h1>
              </div>

              <div className="hero__bottom">
                <div className="testimonial">
                  <div className="testimonial__avatar">
                    <div className="avatar-placeholder">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#8a8480" strokeWidth="1.5" width="24" height="24">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21c0-4.418 3.582-7 8-7s8 2.582 8 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="testimonial__text">
                    <div className="testimonial__quote">We were inspired by you and wanted to turn everyday care into a special ritual.</div>
                    <div className="testimonial__body">In the moment of realizing our value, the moment where we are in the first place</div>
                  </div>
                </div>

                <div className="product-card">
                  <div className="product-card__pills">
                    <span className="pill">Aesthetics</span>
                    <span className="pill">Comfort</span>
                    <span className="pill">Care</span>
                  </div>
                  <div className="product-card__header">
                    <div className="product-card__meta">
                      <div className="product-card__tag">[ save -15% ]</div>
                      <div className="product-card__name">SPF 50+<br />Facial Fluid</div>
                    </div>
                    <button className="product-card__arrow">
                      <svg viewBox="0 0 14 14">
                        <path d="M1 13L13 1M13 1H3M13 1V11" />
                      </svg>
                    </button>
                  </div>
                  <div className="product-card__image-row">
                    <img src="/product.png" alt="JAFRA BIOLAB SPF 50+ Facial Fluid" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mission">
          <span className="mission__label">Brand Mission</span>
          <div className="mission__right">
            <p className="mission__text">
              The brand&apos;s goal is to give a feeling of luxury spa care without being over the top. We want to focus on the skincare experience and packaging should not be distracting.
            </p>
            <a href="#" className="mission__btn">Learn more</a>
          </div>
        </div>

        <div className="categories">
          {["body", "face", "hair", "other"].map((cat) => (
            <div className="cat-card" key={cat}>
              <div className="cat-card__header">
                <span className="cat-card__label">( {cat} )</span>
                <button className="cat-card__arrow" aria-label={`Go to ${cat}`}>
                  <svg viewBox="0 0 12 12">
                    <path d="M1 11L11 1M11 1H3M11 1V9" />
                  </svg>
                </button>
              </div>
              <div className="cat-card__image">
                <img
                  src="https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/67653_Jafra_Royal_Jelly_Crema_Hidratante_para_el_Contorno_de_Ojos_15ml.webp"
                  alt={`${cat} product`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
