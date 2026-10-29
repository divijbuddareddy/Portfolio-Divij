/**
 * BUDDAREDDY DIVIJ - AI & MACHINE LEARNING PORTFOLIO
 * Main Application Script: Interactivity, Micro-animations, & UX
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all subsystems
  initThemeSwitcher();
  initCustomCursor();
  initNavbar();
  initTypewriter();
  initScrollReveal();
  initAnimatedCounters();
  initSkillsFilter();
  initCard3DTilt();
  initProjectModals();
  initContactForm();
  initClipboardButtons();
  initProfilePhotoHandler();
});

/* ===================================================================
   1. THEME SWITCHER
   =================================================================== */
function initThemeSwitcher() {
  const themeDots = document.querySelectorAll('.theme-dot');
  const savedTheme = localStorage.getItem('divij-portfolio-theme') || 'cyan';

  document.documentElement.setAttribute('data-theme', savedTheme);

  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.getAttribute('data-theme');
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('divij-portfolio-theme', theme);
        showToast(`Theme switched to ${theme.toUpperCase()}`);
      }
    });
  });
}

/* ===================================================================
   2. CUSTOM CURSOR & FOLLOWER
   =================================================================== */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  // Smooth trailing for follower
  function updateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(updateFollower);
  }
  updateFollower();

  // Hover states on interactive elements
  const hoverables = document.querySelectorAll('a, button, .project-card, .skill-card, .term-btn, .theme-dot, .terminal-chip');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      follower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      follower.classList.remove('active');
    });
  });
}

/* ===================================================================
   3. NAVBAR & SCROLL SPY
   =================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll glass blur effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile drawer toggle
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close on navigation click
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }
}

/* ===================================================================
   4. DYNAMIC HERO TYPEWRITER
   =================================================================== */
function initTypewriter() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const phrases = [
    "AI & Machine Learning Engineer",
    "Autonomous Multi-Agent Architect",
    "Deep Learning & RAG Specialist",
    "Full-Stack AI Developer"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 75;
  const deleteSpeed = 35;
  const holdDelay = 1800;

  function tick() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      target.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === current.length) {
      delay = holdDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  tick();
}

/* ===================================================================
   5. SCROLL REVEAL (INTERSECTION OBSERVER)
   =================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-init');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ===================================================================
   6. ANIMATED COUNTERS
   =================================================================== */
function initAnimatedCounters() {
  const counterItems = document.querySelectorAll('.metric-number');
  if (!counterItems.length) return;

  let triggered = false;
  const section = document.querySelector('.metrics-section');
  if (!section) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        counterItems.forEach(item => {
          const target = parseFloat(item.getAttribute('data-target'));
          const isDecimal = item.getAttribute('data-decimal') === 'true';
          const duration = 1600;
          const startTime = performance.now();

          function updateNumber(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease-out expo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = ease * target;

            item.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            } else {
              item.textContent = isDecimal ? target.toFixed(1) : target;
            }
          }

          requestAnimationFrame(updateNumber);
        });
      }
    });
  }, { threshold: 0.3 });

  observer.observe(section);
}

/* ===================================================================
   7. SKILLS MATRIX FILTER
   =================================================================== */
function initSkillsFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.skill-category-card, .skill-card');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ===================================================================
   8. 3D CARD TILT ON MOUSE HOVER
   =================================================================== */
function initCard3DTilt() {
  // Only apply tilt on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

/* ===================================================================
   9. PROJECT DETAIL MODALS
   =================================================================== */
const projectData = {
  roboticarm: {
    title: "AI-Powered Robotic Arm",
    badge: "Robotics & Computer Vision",
    image: "assets/images/project-robotic-arm.svg",
    tech: ["Python", "C++", "Computer Vision", "Inverse Kinematics"],
    problem: "Manual sorting and sorting automation in industrial environments requires sub-millisecond object detection, precise color segmentation, and coordinates mapping to robotic actuators.",
    solution: "Developed an AI-powered robotic arm application for real-time color-based object detection and automated pick-and-place operations. Implemented computer vision-based object detection and classification for red, green, and blue objects using live camera input.",
    keyMetrics: [
      "Live 60 FPS real-time color segmentation and contour classification",
      "Simultaneous detection and tracking of Red, Green, and Blue objects",
      "Python and C++ low-latency serial bridge to robotic arm servomotors",
      "Sub-millimeter automated pick-and-place precision"
    ]
  },
  neuromap: {
    title: "NeuroMap AI System",
    badge: "Neuroimaging Research AI",
    image: "assets/images/project-neuromap.svg",
    tech: ["TypeScript", "React", "Python", "Machine Learning", "Three.js", "Google Gemini"],
    problem: "Analyzing complex neuroimaging data (MRI/dMRI) requires combining voxel-level volumetric morphometry, structural connectomics, and transparent explainable machine learning for researchers.",
    solution: "Developed an end-to-end neuroimaging research platform for MRI/dMRI analysis, quantitative brain morphometry, structural connectome analysis, and machine learning-based research insights. Implemented multi-model ML benchmarking, SHAP-based feature attribution, 3D Grad-CAM visualization, interactive 3D brain connectivity maps, and Gemini-powered research report generation.",
    keyMetrics: [
      "Quantitative brain morphometry & connectome structural matrices",
      "Explainable AI: 3D Grad-CAM and SHAP attribution graphs",
      "Interactive 3D connectome visualization rendered in Three.js WebGL",
      "Automated clinical research paper generation via Google Gemini API"
    ]
  },
  startupops: {
    title: "StartupOps AI Platform",
    badge: "Autonomous Multi-Agent Architecture",
    image: "assets/images/project-startupops.svg",
    tech: ["Python", "FastAPI", "Next.js", "LangGraph", "PostgreSQL"],
    problem: "Rapidly growing startups face cross-system operational blindspots where tracking signals across logs, alerts, codebases, and databases is fragmented and slow.",
    solution: "Developed an AI-powered operations platform for startups that coordinates specialized agents to investigate cross-system issues, prioritize actions, and generate evidence-backed recommendations. Implemented a multi-agent architecture with supervisor, planner, research, investigation, signal, action, and verification agents, integrating persistent workspace state, approval workflows, and secure external-system access.",
    keyMetrics: [
      "7 specialized coordinated agents with automated supervisor routing",
      "LangGraph cyclical graph state execution with PostgreSQL persistence",
      "Human-in-the-loop approval workflows for critical infrastructure actions",
      "FastAPI asynchronous event broker with sub-second agent handoffs"
    ]
  },
  mothercare: {
    title: "MotherCare Platform",
    badge: "Healthcare AI & RAG",
    image: "assets/images/project-mothercare.svg",
    tech: ["JavaScript", "HTML", "CSS", "RAG", "Google Gemini", "Semantic Search"],
    problem: "Expectant and new mothers in diverse linguistic regions frequently encounter misleading or fragmented health advice without verified medical source provenance.",
    solution: "Developed a multilingual maternity and parenting AI platform using RAG and Google Gemini to provide evidence-grounded pregnancy, postpartum, and newborn-care information. Implemented emergency red-flag detection, stage-specific context selection, source provenance, and an admin dashboard for consultation analytics and content-gap identification.",
    keyMetrics: [
      "Emergency red-flag symptom detection and immediate clinical escalation",
      "Stage-specific context selection (trimester-wise & postpartum)",
      "Strict medical provenance linking back to verified clinical guidelines (WHO)",
      "Admin analytics dashboard to detect regional maternal health content gaps"
    ]
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const deepDiveBtns = document.querySelectorAll('.open-modal-btn');
  if (!modalOverlay) return;

  deepDiveBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      const item = projectData[projId];
      if (!item) return;

      const modalImg = document.getElementById('modal-img');
      if (modalImg) {
        modalImg.src = item.image;
        modalImg.alt = item.title;
      }
      document.getElementById('modal-badge').textContent = item.badge;
      document.getElementById('modal-title').textContent = item.title;
      document.getElementById('modal-problem').textContent = item.problem;
      document.getElementById('modal-solution').textContent = item.solution;

      const techContainer = document.getElementById('modal-tech');
      techContainer.innerHTML = item.tech.map(t => `<span class="pill-tag">${t}</span>`).join('');

      const metricsContainer = document.getElementById('modal-metrics');
      metricsContainer.innerHTML = item.keyMetrics.map(m => `<li>${m}</li>`).join('');

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ===================================================================
   10. CONTACT FORM & CELEBRATION EFFECT
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      showToast("Please fill in all required fields.");
      return;
    }

    // Trigger celebratory confetti effect
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#00f0ff', '#8b5cf6', '#ec4899', '#38bdf8']
      });
    }

    showToast("Message Prepared! Opening your email client...");

    // Construct mailto link
    const mailtoUrl = `mailto:divijbuddareddy@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(`Hi Divij,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
    
    setTimeout(() => {
      window.location.href = mailtoUrl;
      form.reset();
    }, 900);
  });
}

/* ===================================================================
   11. CLIPBOARD COPY UTILITIES
   =================================================================== */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('.copy-trigger');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied to clipboard: ${text}`);

        // Mini confetti burst
        if (window.confetti) {
          window.confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#00f0ff', '#38bdf8']
          });
        }
      }).catch(() => {
        showToast(`Selected: ${text}`);
      });
    });
  });
}

/* ===================================================================
   12. USER PROFILE PHOTO REPLACEMENT HELPER
   =================================================================== */
function initProfilePhotoHandler() {
  const uploadPill = document.getElementById('photo-switch-pill');
  const profileImg = document.getElementById('user-profile-img');

  if (uploadPill && profileImg) {
    uploadPill.addEventListener('click', () => {
      // Hidden file input to test instant local photo preview
      let fileInput = document.getElementById('hidden-photo-input');
      if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'hidden-photo-input';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              profileImg.src = event.target.result;
              showToast("Photo preview updated! To keep it permanent, save your image as 'assets/images/profile.jpg'");
            };
            reader.readAsDataURL(file);
          }
        });
      }
      fileInput.click();
    });
  }
}

/* ===================================================================
   TOAST NOTIFICATION HELPER
   =================================================================== */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--primary-accent);"></i> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

