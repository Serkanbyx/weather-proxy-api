/**
 * Builds the HTML landing page served at the root route.
 * Kept isolated from the app wiring so the markup stays readable and reusable.
 *
 * @param {string} version - Application version shown in the UI.
 * @returns {string} Full HTML document.
 */
const renderWelcomePage = (version) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Weather Proxy API</title>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: linear-gradient(170deg, #0b1628 0%, #1a2a4a 30%, #2e5a88 55%, #e8913a 80%, #f4c76b 100%);
      color: #f0f4fa;
      overflow: hidden;
      position: relative;
    }

    /* animated cloud layers */
    body::before, body::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      opacity: 0.08;
      background: #fff;
      animation: drift linear infinite;
    }
    body::before {
      width: 320px; height: 120px;
      top: 12%; left: -10%;
      box-shadow: 60px -30px 0 40px #fff, 130px -15px 0 50px #fff, 200px 0 0 30px #fff;
      animation-duration: 38s;
    }
    body::after {
      width: 260px; height: 90px;
      top: 28%; right: -8%;
      box-shadow: 50px -25px 0 30px #fff, 110px -10px 0 40px #fff;
      animation-duration: 52s;
      animation-direction: reverse;
    }
    @keyframes drift {
      from { transform: translateX(-120%); }
      to   { transform: translateX(120vw); }
    }

    /* sun glow */
    .sun {
      position: absolute;
      bottom: 18%; right: 12%;
      width: 140px; height: 140px;
      border-radius: 50%;
      background: radial-gradient(circle, #fcd34d 0%, #f59e0b 40%, transparent 70%);
      box-shadow: 0 0 80px 30px rgba(251, 191, 36, 0.25), 0 0 160px 60px rgba(251, 191, 36, 0.1);
      animation: pulse 4s ease-in-out infinite alternate;
    }
    @keyframes pulse {
      from { transform: scale(1); opacity: 0.9; }
      to   { transform: scale(1.08); opacity: 1; }
    }

    /* rain drops */
    .rain { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; }
    .drop {
      position: absolute;
      width: 2px;
      background: linear-gradient(to bottom, transparent, rgba(174, 213, 255, 0.35));
      animation: fall linear infinite;
    }
    @keyframes fall {
      from { transform: translateY(-10vh); }
      to   { transform: translateY(110vh); }
    }

    .container {
      position: relative;
      z-index: 2;
      text-align: center;
      padding: 3rem 2.5rem;
      max-width: 480px;
      width: 90%;
      background: rgba(15, 25, 50, 0.55);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
    }

    /* weather icon decoration */
    .container::before {
      content: '\\2601';
      position: absolute;
      top: -38px; left: 50%;
      transform: translateX(-50%);
      font-size: 3.6rem;
      opacity: 0.85;
      text-shadow: 0 4px 18px rgba(0,0,0,0.3);
      animation: bob 3s ease-in-out infinite alternate;
    }
    @keyframes bob {
      from { transform: translateX(-50%) translateY(0); }
      to   { transform: translateX(-50%) translateY(-8px); }
    }

    h1 {
      font-size: 1.85rem;
      font-weight: 700;
      letter-spacing: 1px;
      background: linear-gradient(135deg, #93c5fd, #fbbf24);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.3rem;
    }

    .version {
      font-size: 0.85rem;
      color: rgba(240, 244, 250, 0.5);
      letter-spacing: 2px;
      margin-bottom: 2rem;
    }

    .links {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2.2rem;
    }

    .links a {
      display: block;
      padding: 0.8rem 1.6rem;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .links a:hover { transform: translateY(-2px); }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: #fff;
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.35);
    }
    .btn-primary:hover { box-shadow: 0 8px 28px rgba(59, 130, 246, 0.5); }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.14);
      box-shadow: 0 4px 16px rgba(255, 255, 255, 0.06);
    }

    footer.sign {
      font-size: 0.8rem;
      color: rgba(240, 244, 250, 0.4);
    }
    footer.sign a {
      color: rgba(251, 191, 36, 0.7);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    footer.sign a:hover { color: #fbbf24; }

    @media (max-width: 480px) {
      .container { padding: 2rem 1.5rem; }
      h1 { font-size: 1.5rem; }
      .sun { width: 100px; height: 100px; bottom: 10%; right: 5%; }
    }
  </style>
</head>
<body>
  <div class="sun"></div>
  <div class="rain">
    <div class="drop" style="left:8%;height:18px;animation-duration:1.1s;animation-delay:0s;"></div>
    <div class="drop" style="left:16%;height:22px;animation-duration:1.4s;animation-delay:0.3s;"></div>
    <div class="drop" style="left:28%;height:16px;animation-duration:1.0s;animation-delay:0.7s;"></div>
    <div class="drop" style="left:42%;height:20px;animation-duration:1.3s;animation-delay:0.2s;"></div>
    <div class="drop" style="left:55%;height:14px;animation-duration:0.9s;animation-delay:0.5s;"></div>
    <div class="drop" style="left:67%;height:24px;animation-duration:1.5s;animation-delay:0.1s;"></div>
    <div class="drop" style="left:78%;height:17px;animation-duration:1.2s;animation-delay:0.8s;"></div>
    <div class="drop" style="left:90%;height:21px;animation-duration:1.3s;animation-delay:0.4s;"></div>
  </div>

  <div class="container">
    <h1>Weather Proxy API</h1>
    <p class="version">v${version}</p>

    <div class="links">
      <a href="/api-docs" class="btn-primary">API Documentation</a>
      <a href="/api/weather/current?city=Istanbul" class="btn-secondary">Try Weather Endpoint</a>
      <a href="/api/cache/stats" class="btn-secondary">Cache Stats</a>
    </div>

    <footer class="sign">
      Created by
      <a href="https://serkanbayraktar.com/" target="_blank" rel="noopener noreferrer">Serkanby</a>
      |
      <a href="https://github.com/Serkanbyx" target="_blank" rel="noopener noreferrer">Github</a>
    </footer>
  </div>
</body>
</html>`;

module.exports = renderWelcomePage;
