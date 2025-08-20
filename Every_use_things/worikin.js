  // External scripts are loaded in HTML, not here.
  // Typing effect
  const phrases = ["building cool things.", "writing clean code.", "sharing my journey."];
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

    // Fade-up animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

    function scrollToSection(id) {
      document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    }

    // Skill hover effect
    const skills = document.querySelectorAll(".skill");

    skills.forEach(skill => {
      skill.addEventListener("click", () => {
        // Reset all skills
        skills.forEach(s => s.classList.remove("active"));
        // Activate clicked one
        skill.classList.add("active");
      });
    });

    // Chatbot logic
    const chatBox = document.getElementById("chat-box");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");

    function appendMessage(content, sender) {
      const msg = document.createElement("div");
      msg.classList.add("message", sender);
      msg.textContent = content;
      chatBox.appendChild(msg);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function botReply(userMsg) {
      const reply = `You said: "${userMsg}". I'm still learning to chat like a pro! 🤖`;
      appendMessage(reply, "bot");
    }

    sendBtn.addEventListener("click", () => {
      const userMsg = chatInput.value.trim();
      if (userMsg) {
        appendMessage(userMsg, "user");
        chatInput.value = "";
        setTimeout(() => botReply(userMsg), 500);
      }
    });

    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendBtn.click();
    });
    // Initialize EmailJS
    (function () {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    })();
    document.getElementById("contact-form").addEventListener("submit", function (event) {
      event.preventDefault();

      emailjs.sendForm(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        this
      ).then(() => {
        document.getElementById("form-status").innerText = "✅ Message sent successfully!";
        this.reset();
      }, (error) => {
        console.error("Error:", error);
        document.getElementById("form-status").innerText = "❌ Failed to send message.";
      });
    });
  