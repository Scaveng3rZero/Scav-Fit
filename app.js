const WORKOUT_PLAN = {
  warmup: {
    title: "Daily Warmup",
    goal: "10–12 minutes every session.",
    items: [
      "Jump rope or jumping jacks — 2 minutes",
      "Arm circles — 20 each",
      "Hip circles — 20",
      "Walking lunges — 10 each leg",
      "Pushups — 15",
      "Dead hangs from pull-up bar — 30 seconds",
      "Deep squat hold — 45 seconds",
    ],
  },
  mobilityDaily: {
    title: "Daily Mobility Routine",
    goal: "10 minutes at night or in the morning.",
    items: [
      "Deep squat hold — 2 minutes",
      "Shoulder dislocates — 20",
      "Hip flexor stretch — 1 min each side",
      "Hamstring stretch — 1 min each",
      "Dead hang — 60 seconds",
    ],
  },
  days: {
    Monday: {
      title: "Upper Body Strength",
      goal: "Push + pull strength",
      exercises: [
        { name: "Pull-ups", target: "5 sets max reps" },
        { name: "Dumbbell Floor Press", target: "4 x 10" },
        { name: "One-arm Dumbbell Rows", target: "4 x 10 each side" },
        { name: "Pike Pushups", target: "4 x 12" },
        { name: "Dumbbell Lateral Raises", target: "3 x 15" },
        { name: "Hanging Knee Raises", target: "4 x 15", section: "Core" },
        { name: "Pushup Ladder", target: "1–2–3–4–5–6–7–8–9–10", section: "Finisher" },
      ],
    },
    Tuesday: {
      title: "Lower Body Strength",
      goal: "Leg strength and joint stability",
      mobility: ["Couch stretch", "Hip flexor stretch", "Hamstring stretch"],
      exercises: [
        { name: "Goblet Squats", target: "5 x 10" },
        { name: "Bulgarian Split Squats", target: "4 x 10 each leg" },
        { name: "Dumbbell Romanian Deadlifts", target: "4 x 12" },
        { name: "Step-ups", target: "4 x 12 each leg" },
        { name: "Standing Calf Raises", target: "4 x 20" },
        { name: "Plank", target: "4 x 60 seconds", section: "Core" },
      ],
    },
    Wednesday: {
      title: "Pull Strength + Grip",
      goal: "Military obstacle strength",
      exercises: [
        { name: "Pull-ups (variety)", target: "5 sets — wide / neutral / chin-ups" },
        { name: "Towel Pull-ups", target: "4 sets max" },
        { name: "Dumbbell Rows", target: "4 x 12" },
        { name: "Hammer Curls", target: "4 x 12" },
        { name: "Dead Hangs", target: "4 x 45 seconds", section: "Grip Work" },
        { name: "Farmer Carries", target: "4 x 1 minute walk", section: "Grip Work" },
        { name: "Russian Twists", target: "4 x 20", section: "Core" },
      ],
    },
    Thursday: {
      title: "Athletic Conditioning",
      goal: "Speed + endurance",
      circuit: [
        "20 pushups",
        "20 air squats",
        "10 pull-ups",
        "20 walking lunges",
        "30-second mountain climbers",
      ],
      agility: [
        "High knees — 1 minute",
        "Lateral shuffles — 1 minute",
        "Jump squats — 20",
      ],
      mobility: ["Downward dog", "Pigeon stretch", "Deep squat hold"],
      exercises: [
        { name: "Conditioning Circuit", target: "5 rounds" },
        { name: "Agility Block", target: "3 rounds" },
        { name: "Yoga Mobility", target: "15 minutes" },
      ],
    },
    Friday: {
      title: "Full Body Power",
      goal: "Explosiveness",
      exercises: [
        { name: "Dumbbell Thrusters", target: "5 x 10" },
        { name: "Jump Squats", target: "4 x 12" },
        { name: "Pull-ups", target: "5 sets" },
        { name: "Dumbbell Clean + Press", target: "4 x 8" },
        { name: "Pushups", target: "4 x 25" },
        { name: "Hanging Leg Raises", target: "4 x 12", section: "Core" },
      ],
    },
    Saturday: {
      title: "Military Style Conditioning",
      goal: "Earlier workout. Choose one option.",
      option1: [
        "2–4 mile ruck or run",
        "Every mile stop and do 20 pushups",
        "20 squats",
        "10 pull-ups",
      ],
      option2: [
        "AMRAP 40 minutes",
        "10 pull-ups",
        "20 pushups",
        "30 squats",
        "40 mountain climbers",
      ],
      exercises: [
        { name: "Outdoor Ruck or Run", target: "2–4 miles", section: "Option 1" },
        {
          name: "Mile Stop Calisthenics",
          target: "20 pushups / 20 squats / 10 pull-ups",
          section: "Option 1",
        },
        { name: "Home AMRAP", target: "40 minutes", section: "Option 2" },
      ],
    },
    Sunday: {
      title: "Rest Day",
      goal: "Recovery and mobility",
      exercises: [],
    },
  },
};

const STORAGE_KEY = "scav_training_log_v2";
const UI_KEY = "scav_training_ui_v2";

const state = {
  selectedDate: todayLocal(),
  logs: loadJson(STORAGE_KEY, {}),
  ui: loadJson(UI_KEY, { expanded: {} }),
};

function todayLocal() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveLogs() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.logs));
}

function saveUi() {
  localStorage.setItem(UI_KEY, JSON.stringify(state.ui));
}

function getDayName(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

function getPlan(dateString = state.selectedDate) {
  return WORKOUT_PLAN.days[getDayName(dateString)] || WORKOUT_PLAN.days.Monday;
}

function defaultExerciseLog(exercise) {
  return {
    name: exercise.name,
    target: exercise.target,
    completed: false,
    weight: "",
    reps: "",
    sets: "",
    time: "",
    distance: "",
    notes: "",
  };
}

function buildDefaultEntry(dateString) {
  const dayName = getDayName(dateString);
  const plan = getPlan(dateString);

  return {
    date: dateString,
    dayName,
    dayTitle: plan.title,
    warmupCompleted: false,
    mobilityCompleted: false,
    bodyWeight: "",
    workoutNotes: "",
    exercises: (plan.exercises || []).map(defaultExerciseLog),
  };
}

function syncEntry(dateString) {
  const plan = getPlan(dateString);
  const dayName = getDayName(dateString);

  if (!state.logs[dateString]) {
    state.logs[dateString] = buildDefaultEntry(dateString);
    saveLogs();
    return;
  }

  const existing = state.logs[dateString];
  const lookup = Object.fromEntries((existing.exercises || []).map((ex) => [ex.name, ex]));

  state.logs[dateString] = {
    ...existing,
    date: dateString,
    dayName,
    dayTitle: plan.title,
    exercises: (plan.exercises || []).map((ex) => ({
      ...defaultExerciseLog(ex),
      ...(lookup[ex.name] || {}),
    })),
  };

  saveLogs();
}

function getEntry(dateString = state.selectedDate) {
  syncEntry(dateString);
  return state.logs[dateString];
}

function isExpanded(key) {
  return Boolean(state.ui.expanded[key]);
}

function toggleExpanded(key) {
  state.ui.expanded[key] = !state.ui.expanded[key];
  saveUi();
  render();
}

function workoutCount(entry) {
  return entry.exercises.filter((ex) => ex.completed).length;
}

function completionPercent(entry) {
  if (!entry.exercises.length) {
    return entry.mobilityCompleted || entry.warmupCompleted ? 100 : 0;
  }
  return Math.round((workoutCount(entry) / entry.exercises.length) * 100);
}

function recentLogs() {
  return Object.values(state.logs).sort((a, b) => b.date.localeCompare(a.date));
}

function calculateStreak(logsArray) {
  const completed = new Set(
    logsArray
      .filter(
        (item) =>
          item.exercises.some((ex) => ex.completed) ||
          item.warmupCompleted ||
          item.mobilityCompleted
      )
      .map((item) => item.date)
  );

  let streak = 0;
  const cursor = new Date(`${todayLocal()}T12:00:00`);

  for (let i = 0; i < 365; i++) {
    const dateString = cursor.toISOString().slice(0, 10);
    if (completed.has(dateString)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function renderPlanExtras(plan) {
  let html = "";

  if (plan.circuit) {
    html += `<div class="section"><h3>Circuit</h3><ul>${plan.circuit
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("")}</ul><p class="muted">Rest 2 minutes between rounds.</p></div>`;
  }

  if (plan.agility) {
    html += `<div class="section"><h3>Agility</h3><ul>${plan.agility
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("")}</ul></div>`;
  }

  if (plan.mobility) {
    html += `<div class="section"><h3>Mobility</h3><ul>${plan.mobility
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("")}</ul></div>`;
  }

  if (plan.option1) {
    html += `<div class="section"><h3>Option 1</h3><ul>${plan.option1
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("")}</ul></div>`;
  }

  if (plan.option2) {
    html += `<div class="section"><h3>Option 2</h3><ul>${plan.option2
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("")}</ul></div>`;
  }

  return html;
}

function formatSummary(ex) {
  const parts = [];
  if (ex.completed) parts.push("completed");
  if (ex.weight) parts.push(`weight: ${escapeHtml(ex.weight)}`);
  if (ex.reps) parts.push(`reps: ${escapeHtml(ex.reps)}`);
  if (ex.sets) parts.push(`sets: ${escapeHtml(ex.sets)}`);
  if (ex.time) parts.push(`time: ${escapeHtml(ex.time)}`);
  if (ex.distance) parts.push(`distance: ${escapeHtml(ex.distance)}`);
  return parts.length ? parts.join(" · ") : "no details";
}

function render() {
  const plan = getPlan();
  const entry = getEntry();
  const logsArray = recentLogs();
  const completedDays = logsArray.filter(
    (item) =>
      item.exercises.some((ex) => ex.completed) ||
      item.warmupCompleted ||
      item.mobilityCompleted
  ).length;
  const streak = calculateStreak(logsArray);
  const completedExercises = logsArray.reduce(
    (sum, item) => sum + item.exercises.filter((ex) => ex.completed).length,
    0
  );
  const percent = completionPercent(entry);
  const count = workoutCount(entry);
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="shell">
      <main>
        <section class="card hero">
          <div class="eyebrow">⚡ Mobile-first training tracker</div>
          <h1>Scav Training Log</h1>
          <p class="sub">A more alive, energetic workout tracker with a phone-first layout, collapsible exercise cards, larger tap targets, sticky save controls, and a cleaner daily flow for logging your workouts on the move.</p>
          <div class="badge-row">
            <span class="badge">${escapeHtml(entry.dayName)}</span>
            <span class="badge">${escapeHtml(entry.dayTitle)}</span>
            <span class="badge">${percent}% complete today</span>
          </div>
        </section>

        <section class="card" style="margin-top:14px;">
          <div class="summary-grid">
            <div class="summary-card"><h4>Today</h4><div class="big">${count}/${entry.exercises.length || 0}</div></div>
            <div class="summary-card"><h4>Streak</h4><div class="big">${streak}</div></div>
            <div class="summary-card"><h4>Completed days</h4><div class="big">${completedDays}</div></div>
            <div class="summary-card"><h4>Exercises logged</h4><div class="big">${completedExercises}</div></div>
          </div>
        </section>

        <section class="card" style="margin-top:14px;">
          <div class="section">
            <div class="section-title">
              <div>
                <h2>Today’s Session</h2>
                <p class="muted">Your workout opens automatically based on today’s date. You can switch dates anytime.</p>
              </div>
            </div>

            <div class="form-grid">
  <div>
    <label for="dateInput">Workout date</label>
    <input id="dateInput" type="date" value="${state.selectedDate}" />
  </div>
  <div>
    <label for="bodyWeight">Bodyweight</label>
    <input id="bodyWeight" type="text" value="${escapeHtml(entry.bodyWeight)}" placeholder="198 lb" />
  </div>
</div>

<div class="checkline">
  <input id="warmupCheck" type="checkbox" ${entry.warmupCompleted ? "checked" : ""} />
  <div>
    <strong>${WORKOUT_PLAN.warmup.title}</strong>
    <div class="muted">${WORKOUT_PLAN.warmup.goal}</div>
  </div>
</div>
<ul>
  ${WORKOUT_PLAN.warmup.items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("")}
</ul>

<div class="section" style="padding:14px 0 0;">
  <h3>${escapeHtml(entry.dayName)} — ${escapeHtml(plan.title)}</h3>
  <p class="muted"><strong>Goal:</strong> ${escapeHtml(plan.goal)}</p>
  ${renderPlanExtras(plan)}
</div>
          </div>
        </section>

        <section class="card" style="margin-top:14px;">
          <div class="section">
            <div class="section-title">
              <div>
                <h2>Exercises</h2>
                <p class="muted">Tap complete for a quick log. Tap expand when you want details.</p>
              </div>
            </div>

            ${
              entry.exercises.length
                ? `
              <div class="exercise-list">
                ${entry.exercises
                  .map((exercise, index) => {
                    const key = `${state.selectedDate}__${exercise.name}`;
                    const expanded = isExpanded(key);

                    return `
                      <article class="exercise-card ${expanded ? "expanded" : ""}">
                        <div class="exercise-top">
                          <div class="exercise-main">
                            <input type="checkbox" data-action="toggle-complete" data-index="${index}" ${
                              exercise.completed ? "checked" : ""
                            } />
                            <div>
                              <div class="exercise-name">${escapeHtml(exercise.name)}</div>
                              <div class="target">${escapeHtml(exercise.target)}</div>
                              ${
                                plan.exercises[index]?.section
                                  ? `<span class="tag">${escapeHtml(plan.exercises[index].section)}</span>`
                                  : ""
                              }
                            </div>
                          </div>
                          <button class="expand-btn" data-action="toggle-expand" data-key="${escapeHtml(
                            key
                          )}">${expanded ? "Hide" : "Expand"}</button>
                        </div>

                        <div class="exercise-details">
                          <div class="field-grid">
                            <div>
                              <label>Weight</label>
                              <input type="text" data-field="weight" data-index="${index}" value="${escapeHtml(
                                exercise.weight
                              )}" placeholder="40 lb" />
                            </div>
                            <div>
                              <label>Sets</label>
                              <input type="text" data-field="sets" data-index="${index}" value="${escapeHtml(
                                exercise.sets
                              )}" placeholder="4" />
                              <div class="quick-row">
                                <button class="quick-btn" data-adjust="sets" data-amount="-1" data-index="${index}">-1</button>
                                <button class="quick-btn" data-adjust="sets" data-amount="1" data-index="${index}">+1</button>
                                <button class="quick-btn" data-fill="sets" data-value="${extractSuggestedSets(
                                  exercise.target
                                )}" data-index="${index}">Target</button>
                              </div>
                            </div>
                            <div>
                              <label>Reps</label>
                              <input type="text" data-field="reps" data-index="${index}" value="${escapeHtml(
                                exercise.reps
                              )}" placeholder="10 / 10 / 8 / 8" />
                              <div class="quick-row">
                                <button class="quick-btn" data-adjust="reps" data-amount="-1" data-index="${index}">-1</button>
                                <button class="quick-btn" data-adjust="reps" data-amount="1" data-index="${index}">+1</button>
                                <button class="quick-btn" data-fill="reps" data-value="${extractSuggestedReps(
                                  exercise.target
                                )}" data-index="${index}">Target</button>
                              </div>
                            </div>
                            <div>
                              <label>Time</label>
                              <input type="text" data-field="time" data-index="${index}" value="${escapeHtml(
                                exercise.time
                              )}" placeholder="60 sec / 40 min" />
                            </div>
                            <div>
                              <label>Distance</label>
                              <input type="text" data-field="distance" data-index="${index}" value="${escapeHtml(
                                exercise.distance
                              )}" placeholder="2 miles" />
                            </div>
                            <div>
                              <label>Notes</label>
                              <textarea data-field="notes" data-index="${index}" placeholder="PR, pace, soreness, ruck weight, grip, substitutions, form notes...">${escapeHtml(
                                exercise.notes
                              )}</textarea>
                            </div>
                          </div>
                        </div>
                      </article>
                    `;
                  })
                  .join("")}
              </div>
            `
                : `<p class="muted">Rest day. Use this space for recovery notes and mobility.</p>`
            }
          </div>
        </section>

        <section class="card" style="margin-top:14px;">
          <div class="section">
            <h2>Mobility + Notes</h2>
            <div class="checkline">
              <input id="mobilityCheck" type="checkbox" ${entry.mobilityCompleted ? "checked" : ""} />
              <div>
                <strong>${WORKOUT_PLAN.mobilityDaily.title}</strong>
                <div class="muted">${WORKOUT_PLAN.mobilityDaily.goal}</div>
              </div>
            </div>
            <ul>${WORKOUT_PLAN.mobilityDaily.items
              .map((item) => `<li>${escapeHtml(item)}</li>`)
              .join("")}</ul>
            <div style="margin-top:14px;">
              <label for="workoutNotes">Daily notes</label>
              <textarea id="workoutNotes" placeholder="Energy, soreness, sleep, weather, run pace, ruck weight, modifications, pain points, wins...">${escapeHtml(
                entry.workoutNotes
              )}</textarea>
            </div>
          </div>
        </section>
      </main>

      <aside>
        <section class="card">
          <div class="section">
            <div class="section-title">
              <div>
                <h2>Quick Actions</h2>
                <p class="muted">Simple backups so your progress stays safe.</p>
              </div>
            </div>
            <div class="button-row">
              <button class="btn-secondary" id="exportBtn">Export backup</button>
              <button class="btn-muted" id="importBtn">Import backup</button>
              <button class="btn-danger" id="clearDayBtn">Clear this day</button>
            </div>
            <input id="importFile" type="file" accept="application/json" hidden />
          </div>
        </section>

        <section class="card" style="margin-top:14px;">
          <div class="section">
            <div class="section-title">
              <div>
                <h2>Recent History</h2>
                <p class="muted">Your last saved workouts.</p>
              </div>
            </div>
            <div class="history-list">
              ${
                logsArray.length
                  ? logsArray
                      .slice(0, 10)
                      .map(
                        (item) => `
                    <article class="history-item">
                      <h4>${escapeHtml(item.date)} — ${escapeHtml(item.dayName)}</h4>
                      <div class="history-meta">${escapeHtml(item.dayTitle)} · ${completionPercent(
                          item
                        )}% complete · Bodyweight: ${escapeHtml(item.bodyWeight || "—")}</div>
                      <div class="history-lines">
                        ${
                          (item.exercises || [])
                            .filter(
                              (ex) =>
                                ex.completed ||
                                ex.weight ||
                                ex.reps ||
                                ex.sets ||
                                ex.time ||
                                ex.distance
                            )
                            .slice(0, 4)
                            .map(
                              (ex) =>
                                `<div><strong>${escapeHtml(ex.name)}:</strong> ${formatSummary(
                                  ex
                                )}</div>`
                            )
                            .join("") || `<div>No logged exercise details.</div>`
                        }
                      </div>
                    </article>
                  `
                      )
                      .join("")
                  : `<p class="muted">No saved history yet. Your first completed workout will show up here.</p>`
              }
            </div>
          </div>
        </section>
      </aside>
    </div>
  `;

  renderStickyBar(entry, percent);
  bindEvents();
}

function renderStickyBar(entry, percent) {
  document.getElementById("stickyBar").innerHTML = `
    <div class="sticky-inner">
      <div class="sticky-copy">
        <strong>${escapeHtml(entry.dayName)} · ${escapeHtml(entry.dayTitle)}</strong>
        <span>${percent}% complete · ${workoutCount(entry)} of ${
    entry.exercises.length || 0
  } exercises checked off</span>
      </div>
      <div class="sticky-actions">
        <button class="btn-muted" id="todayBtn">Today</button>
        <button class="btn-primary" id="saveBtn">Save workout</button>
      </div>
    </div>
  `;
}

function bindEvents() {
  document.getElementById("dateInput").addEventListener("change", (e) => {
    state.selectedDate = e.target.value;
    render();
  });

  document.getElementById("bodyWeight").addEventListener("input", (e) => {
    getEntry().bodyWeight = e.target.value;
  });

  document.getElementById("workoutNotes").addEventListener("input", (e) => {
    getEntry().workoutNotes = e.target.value;
  });

  document.getElementById("warmupCheck").addEventListener("change", (e) => {
    getEntry().warmupCompleted = e.target.checked;
    saveLogs();
  });

  document.getElementById("mobilityCheck").addEventListener("change", (e) => {
    getEntry().mobilityCompleted = e.target.checked;
    saveLogs();
  });

  document.querySelectorAll("[data-action='toggle-complete']").forEach((el) => {
    el.addEventListener("change", (e) => {
      const index = Number(e.target.dataset.index);
      getEntry().exercises[index].completed = e.target.checked;
      saveLogs();
      renderStickyBar(getEntry(), completionPercent(getEntry()));
      bindStickyOnly();
    });
  });

  document.querySelectorAll("[data-action='toggle-expand']").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      toggleExpanded(e.currentTarget.dataset.key);
    });
  });

  document.querySelectorAll("[data-field]").forEach((field) => {
    field.addEventListener("input", (e) => {
      const index = Number(e.target.dataset.index);
      const key = e.target.dataset.field;
      getEntry().exercises[index][key] = e.target.value;
    });
  });

  document.querySelectorAll("[data-adjust]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = Number(e.currentTarget.dataset.index);
      const key = e.currentTarget.dataset.adjust;
      const amount = Number(e.currentTarget.dataset.amount);
      const current = parseInt(getEntry().exercises[index][key], 10);
      const next = Number.isFinite(current)
        ? Math.max(0, current + amount)
        : Math.max(0, amount > 0 ? amount : 0);

      getEntry().exercises[index][key] = String(next);
      saveLogs();
      render();
    });
  });

  document.querySelectorAll("[data-fill]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = Number(e.currentTarget.dataset.index);
      const key = e.currentTarget.dataset.fill;
      const value = e.currentTarget.dataset.value;

      if (value) {
        getEntry().exercises[index][key] = value;
        saveLogs();
        render();
      }
    });
  });

  bindStickyOnly();

  document.getElementById("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state.logs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "scav-training-log-backup.json";
    link.click();
    URL.revokeObjectURL(url);
    showToast("Backup exported");
  });

  const importFile = document.getElementById("importFile");
  document.getElementById("importBtn").addEventListener("click", () => importFile.click());

  importFile.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Invalid backup");
      }

      state.logs = data;
      saveLogs();
      render();
      showToast("Backup imported");
    } catch {
      showToast("Import failed");
    } finally {
      e.target.value = "";
    }
  });

  document.getElementById("clearDayBtn").addEventListener("click", () => {
    const ok = confirm("Clear the saved workout for this date?");
    if (!ok) return;

    state.logs[state.selectedDate] = buildDefaultEntry(state.selectedDate);
    saveLogs();
    render();
    showToast("Day cleared");
  });
}

function bindStickyOnly() {
  document.getElementById("saveBtn").addEventListener("click", () => {
    saveLogs();
    render();
    showToast("Workout saved");
  });

  document.getElementById("todayBtn").addEventListener("click", () => {
    state.selectedDate = todayLocal();
    render();
  });
}

function extractSuggestedSets(target) {
  const match = String(target).match(/(\d+)\s*x/i);
  return match ? match[1] : "";
}

function extractSuggestedReps(target) {
  const match = String(target).match(/x\s*(\d+)/i);
  return match ? match[1] : "";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

render();
