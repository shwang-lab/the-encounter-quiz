// ============================================================
// The Encounter — Listening Quiz — student app logic
// ============================================================

const state = {
  studentName: null,
  answers: {},        // { questionNum: selectedIndex }
  playCounts: {},      // { audioSrc: number of plays used }
  submitted: false
};

// ---------- DOM refs ----------
const screenLogin = document.getElementById("screen-login");
const screenQuiz = document.getElementById("screen-quiz");
const screenDone = document.getElementById("screen-done");

const studentSelect = document.getElementById("student-select");
const classCodeInput = document.getElementById("class-code");
const loginError = document.getElementById("login-error");
const btnLogin = document.getElementById("btn-login");

const quizBlocksEl = document.getElementById("quiz-blocks");
const studentNameDisplay = document.getElementById("student-name-display");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

const btnPdf = document.getElementById("btn-pdf");
const btnSubmit = document.getElementById("btn-submit");
const submitWarning = document.getElementById("submit-warning");

const scoreDisplay = document.getElementById("score-display");
const doneName = document.getElementById("done-name");

// ---------- Populate student dropdown ----------
STUDENTS.slice().sort((a, b) => a.localeCompare(b, "ko")).forEach(name => {
  const opt = document.createElement("option");
  opt.value = name;
  opt.textContent = name;
  studentSelect.appendChild(opt);
});

// ---------- Login ----------
btnLogin.addEventListener("click", async () => {
  const name = studentSelect.value;
  const code = classCodeInput.value.trim();

  if (!name) {
    showLoginError("Please select your name.");
    return;
  }
  if (!code) {
    showLoginError("Please enter today's class code.");
    return;
  }

  btnLogin.disabled = true;
  btnLogin.textContent = "Checking...";

  try {
    const validCode = await fetchTodayCode();
    if (validCode === null) {
      // Backend not reachable / not configured — warn but don't hard-block
      // so a misconfigured Apps Script URL doesn't lock everyone out during setup.
      showLoginError("Unable to verify the code. Please ask your teacher. (Admin: check APPS_SCRIPT_URL in config.js)");
      btnLogin.disabled = false;
      btnLogin.textContent = "Start Quiz";
      return;
    }
    if (code !== validCode) {
      showLoginError("That class code is not correct.");
      btnLogin.disabled = false;
      btnLogin.textContent = "Start Quiz";
      return;
    }
    state.studentName = name;
    startQuiz();
  } catch (err) {
    showLoginError("A network error occurred. Please try again.");
    btnLogin.disabled = false;
    btnLogin.textContent = "Start Quiz";
  }
});

function showLoginError(msg) {
  loginError.textContent = msg;
  loginError.hidden = false;
}

async function fetchTodayCode() {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PASTE_YOUR")) return null;
  const res = await fetch(`${APPS_SCRIPT_URL}?action=getCode`);
  const data = await res.json();
  return (data.code || "").toString().trim();
}

// ---------- Build quiz screen ----------
function startQuiz() {
  screenLogin.hidden = true;
  screenQuiz.hidden = false;
  studentNameDisplay.textContent = state.studentName;
  renderQuizBlocks();
  updateProgress();
}

function renderQuizBlocks() {
  quizBlocksEl.innerHTML = "";

  QUIZ_BLOCKS.forEach(block => {
    const blockEl = document.createElement("div");
    blockEl.className = "block";

    // Audio player
    const nums = block.questions.map(q => q.num);
    const label = nums.length > 1
      ? `Audio for Questions ${nums[0]}–${nums[nums.length - 1]}`
      : `Audio for Question ${nums[0]}`;

    const playerEl = document.createElement("div");
    playerEl.className = "audio-player";
    playerEl.innerHTML = `
      <button class="play-btn" data-audio="${block.audio}">▶ Play (2/2 available)</button>
      <span class="label">${label}</span>
      <audio preload="none" src="${block.audio}"></audio>
    `;
    blockEl.appendChild(playerEl);

    const audioEl = playerEl.querySelector("audio");
    const playBtn = playerEl.querySelector(".play-btn");
    state.playCounts[block.audio] = 0;

    playBtn.addEventListener("click", () => {
      if (state.playCounts[block.audio] >= MAX_PLAYS_PER_AUDIO) return;
      audioEl.currentTime = 0;
      audioEl.play();
      state.playCounts[block.audio]++;
      playBtn.disabled = true;
      playBtn.classList.add("playing");
      playBtn.textContent = "Playing...";
    });

    audioEl.addEventListener("ended", () => {
      const used = state.playCounts[block.audio];
      const left = MAX_PLAYS_PER_AUDIO - used;
      playBtn.classList.remove("playing");
      if (left > 0) {
        playBtn.disabled = false;
        playBtn.textContent = `▶ Play again (${left}/${MAX_PLAYS_PER_AUDIO} available)`;
      } else {
        playBtn.disabled = true;
        playBtn.textContent = `Done playing (${MAX_PLAYS_PER_AUDIO}/${MAX_PLAYS_PER_AUDIO})`;
      }
    });

    // Questions in this block
    block.questions.forEach(q => {
      const qEl = document.createElement("div");
      qEl.className = "question";
      qEl.innerHTML = `
        <p class="q-prompt"><span class="q-num">${q.num}.</span>${escapeHtml(q.prompt)}</p>
        <div class="options"></div>
      `;
      const optionsEl = qEl.querySelector(".options");

      q.options.forEach((opt, idx) => {
        const letter = "ABCD"[idx];
        const optEl = document.createElement("label");
        optEl.className = "option";
        optEl.innerHTML = `
          <input type="radio" name="q${q.num}" value="${idx}">
          <span><strong>${letter}.</strong> ${escapeHtml(opt)}</span>
        `;
        const radio = optEl.querySelector("input");
        radio.addEventListener("change", () => {
          state.answers[q.num] = idx;
          optionsEl.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
          optEl.classList.add("selected");
          updateProgress();
        });
        optionsEl.appendChild(optEl);
      });

      blockEl.appendChild(qEl);
    });

    quizBlocksEl.appendChild(blockEl);
  });
}

function updateProgress() {
  const answered = Object.keys(state.answers).length;
  progressText.textContent = `${answered} / ${TOTAL_QUESTIONS} answered`;
  progressFill.style.width = `${(answered / TOTAL_QUESTIONS) * 100}%`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- PDF export ----------
btnPdf.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  let y = 56;
  const lineHeight = 15;
  const pageHeight = doc.internal.pageSize.getHeight();

  function ensureSpace(lines = 1) {
    if (y + lines * lineHeight > pageHeight - 40) {
      doc.addPage();
      y = 56;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("English Through Films — The Encounter", marginX, y);
  y += 20;
  doc.setFontSize(12);
  doc.text("Listening Comprehension Quiz — My Answers", marginX, y);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Name: ${state.studentName}`, marginX, y);
  y += lineHeight;
  doc.text(`Date: ${new Date().toLocaleString()}`, marginX, y);
  y += lineHeight * 1.5;

  QUIZ_QUESTIONS.forEach(q => {
    const selected = state.answers[q.num];
    ensureSpace(3);

    doc.setFont("helvetica", "bold");
    const promptLines = doc.splitTextToSize(`${q.num}. ${q.prompt}`, 500);
    doc.text(promptLines, marginX, y);
    y += promptLines.length * lineHeight;

    doc.setFont("helvetica", "normal");
    q.options.forEach((opt, idx) => {
      ensureSpace(1);
      const letter = "ABCD"[idx];
      const marked = selected === idx ? "[X]" : "[ ]";
      const optLines = doc.splitTextToSize(`   ${marked} ${letter}. ${opt}`, 480);
      doc.text(optLines, marginX, y);
      y += optLines.length * lineHeight;
    });

    if (selected === undefined) {
      doc.setTextColor(180, 40, 30);
      doc.text("   (not answered)", marginX, y);
      doc.setTextColor(0, 0, 0);
      y += lineHeight;
    }

    y += lineHeight * 0.6;
  });

  const safeName = state.studentName.replace(/[^\w가-힣]+/g, "_");
  doc.save(`Encounter_Quiz_${safeName}.pdf`);
});

// ---------- Submit ----------
btnSubmit.addEventListener("click", async () => {
  const answered = Object.keys(state.answers).length;
  if (answered < TOTAL_QUESTIONS) {
    submitWarning.textContent = `You still have ${TOTAL_QUESTIONS - answered} unanswered question(s). Submit anyway? Click Submit again to confirm.`;
    submitWarning.hidden = false;
    if (!btnSubmit.dataset.confirmArmed) {
      btnSubmit.dataset.confirmArmed = "1";
      return;
    }
  }

  btnSubmit.disabled = true;
  btnPdf.disabled = true;
  btnSubmit.textContent = "Submitting...";

  let score = 0;
  QUIZ_QUESTIONS.forEach(q => {
    if (state.answers[q.num] === q.correct) score++;
  });

  const payload = {
    action: "submit",
    name: state.studentName,
    score,
    total: TOTAL_QUESTIONS,
    answers: state.answers
  };

  try {
    if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.includes("PASTE_YOUR")) {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids CORS preflight
        body: JSON.stringify(payload)
      });
    }
  } catch (err) {
    // Even if the network call fails, still show the student their result
    // and let the PDF be their record. The instructor can request a re-send.
    console.error("Submit failed:", err);
  }

  showDoneScreen(score);
});

function showDoneScreen(score) {
  screenQuiz.hidden = true;
  screenDone.hidden = false;
  scoreDisplay.textContent = `${score} / ${TOTAL_QUESTIONS}`;
  doneName.textContent = state.studentName;
}
