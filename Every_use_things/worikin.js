
    // Typewriter
    const words = ["AI/ML Engineer", "Building GenAI apps", "Vision • NLP • MLOps"];
    const typeEl = document.getElementById('type');
    let wi = 0, pos = 0, del = false;
    function typeLoop() {
      const w = words[wi % words.length];
      typeEl.textContent = del ? w.slice(0, pos--) : w.slice(0, pos++);
      if (!del && pos === w.length + 1) { del = true; setTimeout(typeLoop, 900); return; }
      if (del && pos === 0) { del = false; wi++; }
      setTimeout(typeLoop, del ? 35 : 65);
    }
    typeLoop();

    // Scroll reveal
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } });
    }, { threshold: .15 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // Animate skill bars on view
    const barIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.bar > span').forEach(b => {
            const fill = +b.getAttribute('data-fill') || 0;
            b.animate([{ width: '0%' }, { width: fill + '%' }], { duration: 900, fill: 'forwards', easing: 'ease-out' });
          });
          barIO.unobserve(e.target);
        }
      })
    }, { threshold: .4 });
    document.querySelectorAll('#skills .card').forEach(el => barIO.observe(el));

    // Theme toggle with persistence
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)');
    const storedTheme = localStorage.getItem('theme');
    const toggle = document.getElementById('themeToggle');
    function applyTheme(t) { document.body.classList.toggle('light', t === 'light'); localStorage.setItem('theme', t); }
    applyTheme(storedTheme || (prefersLight.matches ? 'light' : 'dark'));
    toggle.addEventListener('click', () => applyTheme(document.body.classList.contains('light') ? 'dark' : 'light'));

    // Fake send (demo only)
    function sendMsg(e) {
      e.preventDefault();
      const n = document.getElementById('name').value.trim();
      document.getElementById('formNote').textContent = `Thanks, ${n}! I will get back to you soon.`;
      e.target.reset();
    }

    // Resume download (placeholder PDF generated on the fly)
    document.getElementById('resumeBtn').addEventListener('click', () => {
      const blob = new Blob([`Sachin Jala — Resume\nAI/ML Engineer\nEmail: jalasachin93@gmail.com\nGitHub: https://github.com/Sachin-jala`], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Sachin_Jala_Resume.txt';
      a.click();
      URL.revokeObjectURL(a.href);
    });

    // Footer meta
    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('updated').textContent = new Date().toLocaleDateString();
  