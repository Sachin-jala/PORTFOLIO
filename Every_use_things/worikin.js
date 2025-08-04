
    // Typing effect
    const phrases = ["|", "building cool things.", "writing clean code.", "sharing my journey."];
    let idx = 0, charIdx = 0;
    const target = document.getElementById("typed-text");

    function type() {
      const current = phrases[idx];
      if (charIdx <= current.length) {
        target.textContent = current.slice(0, charIdx);
        charIdx++;
        setTimeout(type, 100);
      } else {
        setTimeout(erase, 1200);
      }
    }
    function erase() {
      const current = phrases[idx];
      if (charIdx >= 0) {
        target.textContent = current.slice(0, charIdx);
        charIdx--;
        setTimeout(erase, 50);
      } else {
        idx = (idx + 1) % phrases.length;
        setTimeout(type, 300);
      }
    }
    type();

    // Fade-up on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

    function scrollToSection(id) {
      document.getElementById(id).scrollIntoView({behavior:"smooth"});
    }
  
