export default function App() {
  return (
    <main class="page">
      <header class="masthead" aria-label="Project header">
        <div class="brand">
          <span class="brand-symbol" aria-hidden="true">T<span>G</span></span>
          <span>TEXTBOOK GAMING</span>
        </div>
        <span class="version">PROTOTYPE / 001</span>
      </header>

      <section class="canvas" aria-labelledby="page-title">
        <div class="corner corner-top" aria-hidden="true">+</div>
        <div class="corner corner-bottom" aria-hidden="true">+</div>
        <div class="content">
          <p class="eyebrow"><span class="dot" /> THE STARTING POINT</p>
          <div class="symbol" aria-hidden="true">
            <div class="symbol-page left" />
            <div class="symbol-page right" />
            <span class="symbol-plus">+</span>
          </div>
          <h1 id="page-title">Textbook<br /><em>Gaming.</em></h1>
          <div class="hairline" />
          <p class="description">A blank page for the next idea.</p>
          <p class="secondary">This prototype is intentionally empty.<br />The experience will take shape here.</p>
          <div class="status"><span class="status-icon" aria-hidden="true">◌</span> PLACEHOLDER READY</div>
        </div>
      </section>

      <footer class="footer">
        <span>IDEAS START SOMEWHERE.</span>
        <span>01 — OPEN CANVAS</span>
      </footer>
    </main>
  );
}
