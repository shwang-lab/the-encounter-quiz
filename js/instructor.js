// ============================================================
// The Encounter — Listening Quiz — instructor dashboard logic
// ============================================================

const screenGate = document.getElementById("screen-gate");
const screenDashboard = document.getElementById("screen-dashboard");
const pwInput = document.getElementById("pw-input");
const gateError = document.getElementById("gate-error");
const btnUnlock = document.getElementById("btn-unlock");

const codeInput = document.getElementById("code-input");
const btnSetCode = document.getElementById("btn-set-code");
const codeStatus = document.getElementById("code-status");

const statCount = document.getElementById("stat-count");
const statAvg = document.getElementById("stat-avg");
const statTotal = document.getElementById("stat-total");

const btnRefresh = document.getElementById("btn-refresh");
const btnExportCsv = document.getElementById("btn-export-csv");
const tableWrap = document.getElementById("table-wrap");

statTotal.textContent = STUDENTS.length;

let latestResults = [];

// ---------- Gate ----------
btnUnlock.addEventListener("click", unlock);
pwInput.addEventListener("keydown", e => { if (e.key === "Enter") unlock(); });

function unlock() {
  if (pwInput.value === INSTRUCTOR_PASSWORD) {
    screenGate.hidden = true;
    screenDashboard.hidden = false;
    loadCode();
    loadResults();
  } else {
    gateError.textContent = "비밀번호가 올바르지 않습니다.";
    gateError.hidden = false;
  }
}

// ---------- Class code ----------
async function loadCode() {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getCode`);
    const data = await res.json();
    codeInput.value = data.code || "";
    codeStatus.textContent = `현재 코드: ${data.code || "(설정 안됨)"}`;
  } catch (err) {
    codeStatus.textContent = "코드를 불러오지 못했습니다. APPS_SCRIPT_URL 설정을 확인하세요.";
  }
}

btnSetCode.addEventListener("click", async () => {
  const code = codeInput.value.trim();
  if (!code) return;
  btnSetCode.disabled = true;
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "setCode", code, password: INSTRUCTOR_PASSWORD })
    });
    codeStatus.textContent = `코드가 "${code}"로 설정되었습니다.`;
  } catch (err) {
    codeStatus.textContent = "코드 설정에 실패했습니다.";
  }
  btnSetCode.disabled = false;
});

// ---------- Results ----------
btnRefresh.addEventListener("click", loadResults);

async function loadResults() {
  tableWrap.innerHTML = `<p class="hint">불러오는 중...</p>`;
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getResults&password=${encodeURIComponent(INSTRUCTOR_PASSWORD)}`);
    const data = await res.json();
    if (data.error) {
      tableWrap.innerHTML = `<p class="error-msg">${data.error}</p>`;
      return;
    }
    latestResults = data.results || [];
    renderDashboard();
  } catch (err) {
    tableWrap.innerHTML = `<p class="error-msg">결과를 불러오지 못했습니다. APPS_SCRIPT_URL 설정을 확인하세요.</p>`;
  }
}

function renderDashboard() {
  // Stats
  statCount.textContent = latestResults.length;
  if (latestResults.length > 0) {
    const avg = latestResults.reduce((sum, r) => sum + Number(r.Score || 0), 0) / latestResults.length;
    statAvg.textContent = avg.toFixed(1);
  } else {
    statAvg.textContent = "–";
  }

  // Build lookup of submitted names
  const submittedByName = {};
  latestResults.forEach(r => { submittedByName[r.Name] = r; });

  // Table
  let html = `<table><thead><tr>
    <th>이름</th><th>점수</th><th>제출 시각</th><th></th>
  </tr></thead><tbody>`;

  STUDENTS.slice().sort((a, b) => a.localeCompare(b, "ko")).forEach((name, i) => {
    const r = submittedByName[name];
    const rowId = `detail-${i}`;
    if (r) {
      const ts = r.Timestamp ? new Date(r.Timestamp).toLocaleString() : "";
      html += `<tr>
        <td>${escapeHtml(name)}</td>
        <td class="score-cell">${r.Score} / ${r.Total}</td>
        <td>${ts}</td>
        <td><button class="detail-toggle" data-target="${rowId}">문항별 답 보기</button></td>
      </tr>
      <tr class="detail-row" id="${rowId}" hidden><td colspan="4">${renderAnswerDetail(r)}</td></tr>`;
    } else {
      html += `<tr class="missing">
        <td>${escapeHtml(name)}</td>
        <td>미제출</td>
        <td>–</td>
        <td></td>
      </tr>`;
    }
  });

  html += `</tbody></table>`;
  tableWrap.innerHTML = html;

  tableWrap.querySelectorAll(".detail-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const row = document.getElementById(btn.dataset.target);
      row.hidden = !row.hidden;
      btn.textContent = row.hidden ? "문항별 답 보기" : "문항별 답 숨기기";
    });
  });
}

function renderAnswerDetail(r) {
  let answers = {};
  try { answers = JSON.parse(r.AnswersJSON || "{}"); } catch (e) {}

  const items = QUIZ_QUESTIONS.map(q => {
    const selected = answers[q.num];
    const letter = selected !== undefined ? "ABCD"[selected] : "–";
    const isCorrect = selected === q.correct;
    const cls = selected === undefined ? "" : (isCorrect ? "right" : "wrong");
    return `<div class="${cls}">${q.num}. ${letter}${selected === undefined ? " (미답)" : (isCorrect ? "" : ` (정답 ${"ABCD"[q.correct]})`)}</div>`;
  }).join("");

  return `<div class="detail-grid">${items}</div>`;
}

// ---------- CSV export ----------
btnExportCsv.addEventListener("click", () => {
  if (latestResults.length === 0) return;
  const headers = ["Name", "Score", "Total", "Timestamp"];
  const rows = latestResults.map(r => [
    r.Name, r.Score, r.Total, r.Timestamp ? new Date(r.Timestamp).toISOString() : ""
  ]);
  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Encounter_Quiz_Results_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
