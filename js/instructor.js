// ============================================================
// The Encounter — Listening Quiz — instructor dashboard logic
// ============================================================

const screenGate = document.getElementById("screen-gate");
const screenDashboard = document.getElementById("screen-dashboard");
const pwInput = document.getElementById("pw-input");
const gateError = document.getElementById("gate-error");
const btnUnlock = document.getElementById("btn-unlock");

const statCount = document.getElementById("stat-count");
const statAvg = document.getElementById("stat-avg");

const btnRefresh = document.getElementById("btn-refresh");
const btnExportCsv = document.getElementById("btn-export-csv");
const tableWrap = document.getElementById("table-wrap");

let latestResults = [];

// ---------- Gate ----------
btnUnlock.addEventListener("click", unlock);
pwInput.addEventListener("keydown", e => { if (e.key === "Enter") unlock(); });

function unlock() {
  if (pwInput.value === INSTRUCTOR_PASSWORD) {
    screenGate.hidden = true;
    screenDashboard.hidden = false;
    loadResults();
  } else {
    gateError.textContent = "Incorrect password.";
    gateError.hidden = false;
  }
}

// ---------- Results ----------
btnRefresh.addEventListener("click", loadResults);

async function loadResults() {
  tableWrap.innerHTML = `<p class="hint">Loading...</p>`;
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
    tableWrap.innerHTML = `<p class="error-msg">Could not load results. Check the APPS_SCRIPT_URL setting.</p>`;
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

  // Table — only actual submissions, newest first. No fixed roster:
  // students type their own name freely, so there's nothing to compare against.
  let html = `<table><thead><tr>
    <th>Name</th><th>Score</th><th>Submitted At</th><th></th>
  </tr></thead><tbody>`;

  if (latestResults.length === 0) {
    html += `<tr><td colspan="4" class="hint">No submissions yet.</td></tr>`;
  } else {
    const sorted = latestResults.slice().sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
    sorted.forEach((r, i) => {
      const rowId = `detail-${i}`;
      const ts = r.Timestamp ? new Date(r.Timestamp).toLocaleString() : "";
      html += `<tr>
        <td>${escapeHtml(r.Name)}</td>
        <td class="score-cell">${r.Score} / ${r.Total}</td>
        <td>${ts}</td>
        <td><button class="detail-toggle" data-target="${rowId}">View Answers</button></td>
      </tr>
      <tr class="detail-row" id="${rowId}" hidden><td colspan="4">${renderAnswerDetail(r)}</td></tr>`;
    });
  }

  html += `</tbody></table>`;
  tableWrap.innerHTML = html;

  tableWrap.querySelectorAll(".detail-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const row = document.getElementById(btn.dataset.target);
      row.hidden = !row.hidden;
      btn.textContent = row.hidden ? "View Answers" : "Hide Answers";
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
    return `<div class="${cls}">${q.num}. ${letter}${selected === undefined ? " (no answer)" : (isCorrect ? "" : ` (correct: ${"ABCD"[q.correct]})`)}</div>`;
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
