/**
 * Interactive Cyber Terminal Simulator
 * Demonstrates Divij's systems & AI software engineering skills
 */

(function () {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const chipButtons = document.querySelectorAll('.terminal-chip');
  if (!terminalBody || !terminalInput) return;

  const data = {
    bio: [
      "B.Tech Graduate in Artificial Intelligence and Machine Learning.",
      "Software & Machine Learning Developer at AI Automation Labs.",
      "Specialized in Autonomous Multi-Agent Systems, RAG Pipelines, and Deep Learning."
    ],
    skills: {
      "Programming Languages": "Python (OOP), SQL",
      "Frameworks & Databases": "FastAPI, PostgreSQL, REST APIs",
      "AI & Machine Learning": "Large Language Models (LLM), Retrieval-Augmented Generation (RAG), LLM Fine-tuning, Reinforcement Learning, Supervised Learning, Unsupervised Learning, Deep Learning, Natural Language Processing (NLP), Computer Vision, Machine Learning",
      "Libraries": "PyTorch, Scikit-learn, NumPy, Pandas, Matplotlib, Seaborn",
      "Development Practices": "Data Analysis, Data Preprocessing, Feature Engineering, Model Evaluation, Prompt Engineering, Model Deployment, Testing, Debugging",
      "Tools & Platforms": "Git, GitHub, VS Code, Jupyter Notebook, Hugging Face"
    },
    projects: [
      "1. AI-Powered Robotic Arm [Python, C++, Computer Vision] -> Real-time RGB pick-and-place automation",
      "2. NeuroMap AI System [TypeScript, React, Python, Three.js, Gemini] -> MRI/dMRI connectome analysis & 3D Grad-CAM",
      "3. StartupOps AI [FastAPI, Next.js, LangGraph, PostgreSQL] -> Autonomous multi-agent coordination platform",
      "4. MotherCare Platform [JavaScript, HTML/CSS, RAG, Gemini] -> Multilingual clinical triage & maternity AI"
    ],
    experience: [
      "Role: Software and Application Developer @ AI Automation Labs (May 2026 - Present)",
      "Focus: Feature engineering, model development, data preprocessing, testing, validation & production deployment."
    ],
    education: [
      "Kalasalingam Academy of Research and Education, Tamil Nadu (2022 - 2026)",
      "Degree: Bachelor of Technology in Artificial Intelligence & Machine Learning",
      "CGPA: 7.8 / 10.0"
    ],
    contact: [
      "Email: divijbuddareddy@gmail.com",
      "Phone: +91-7013037779",
      "Location: Rayadurg, Andhra Pradesh, India",
      "GitHub: https://github.com/ | LinkedIn: Connected"
    ]
  };

  function appendOutput(content, type = '') {
    const div = document.createElement('div');
    div.className = `term-output ${type}`;
    if (Array.isArray(content)) {
      div.innerHTML = content.map(line => `<div>${line}</div>`).join('');
    } else if (typeof content === 'object') {
      let html = '';
      for (const [key, val] of Object.entries(content)) {
        html += `<div><span style="color:var(--primary-accent);font-weight:600;">[${key}]</span>: ${val}</div>`;
      }
      div.innerHTML = html;
    } else {
      div.innerHTML = content;
    }
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function appendCommandLine(cmd) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="term-prompt">visitor@divij-ai:~$</span> <span class="term-command">${escapeHtml(cmd)}</span>`;
    terminalBody.appendChild(line);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function handleCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    appendCommandLine(rawCmd);

    switch (cmd) {
      case 'help':
        appendOutput([
          "Available Commands:",
          "  • <strong style='color:#ffffff;'>divij.skills</strong>     - Inspect technical skills & tools matrix",
          "  • <strong style='color:#ffffff;'>divij.projects</strong>   - List flagship AI & ML engineering projects",
          "  • <strong style='color:#ffffff;'>divij.experience</strong> - View current role & engineering history",
          "  • <strong style='color:#ffffff;'>divij.education</strong>  - Academic degree & CGPA details",
          "  • <strong style='color:#ffffff;'>divij.contact()</strong>  - Display direct communication channels",
          "  • <strong style='color:#ffffff;'>clear</strong>            - Clear terminal display buffer"
        ], 'highlight');
        break;

      case 'divij.skills':
      case 'skills':
        appendOutput(data.skills);
        break;

      case 'divij.projects':
      case 'projects':
        appendOutput(data.projects, 'highlight');
        break;

      case 'divij.experience':
      case 'experience':
        appendOutput(data.experience, 'success');
        break;

      case 'divij.education':
      case 'education':
        appendOutput(data.education);
        break;

      case 'divij.contact()':
      case 'divij.contact':
      case 'contact':
        appendOutput(data.contact, 'success');
        break;

      case 'clear':
        terminalBody.innerHTML = '';
        break;

      default:
        appendOutput(`Command not recognized: "${escapeHtml(rawCmd)}". Type <strong style='color:var(--primary-accent);'>help</strong> for available options.`, '');
        break;
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      handleCommand(val);
    }
  });

  chipButtons.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        handleCommand(cmd);
      }
    });
  });
})();

