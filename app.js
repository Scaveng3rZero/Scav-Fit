const WORKOUT_PLAN = {
  warmup: {
    title: "Daily Warmup",
    goal: "10–12 minutes before every session",
    items: [
      "Jumping jacks — 2 minutes",
      "Arm circles — 20 each direction",
      "Hip circles — 20",
      "Walking lunges — 10 each leg",
      "Push-ups — 15",
      "Dead hang — 30 seconds",
      "Deep squat hold — 45 seconds"
    ]
  },

  mobilityDaily: {
    title: "Daily Mobility",
    goal: "10 minutes morning or night",
    items: [
      "Deep squat hold — 2 minutes",
      "Hip flexor stretch — 1 minute each side",
      "Hamstring stretch — 1 minute each side",
      "World's Greatest Stretch — 5 reps each side",
      "Dead hang — 60 seconds"
    ]
  },

  progression: {
    title: "Progression Rules",
    goal: "Improve weekly without weights",
    items: [
      "Add 1 rep per set each week when possible",
      "Or add 1 set to a main movement",
      "Or add 5–10 seconds to holds and planks",
      "Focus on clean reps before adding volume",
      "If pull-ups are lagging, practice submax sets more often"
    ]
  },

  days: {
    Sunday: {
      title: "Lower Body Power + Sprints",
      goal: "Build explosive leg strength, sprint speed, and ACFT carryover",
      exercises: [
        { name: "Jump Squats", target: "5 sets of 5 reps" },
        { name: "Broad Jumps", target: "5 sets of 3 reps" },
        { name: "Walking Lunges", target: "4 sets of 20 steps" },
        { name: "Single-Leg Step-Back Squats", target: "3 sets of 10 each leg" }
      ],
      conditioning: [
        "Hill sprints or flat sprints — 8 rounds of 20–30 seconds",
        "Walk back or rest 60–90 seconds between rounds"
      ]
    },

    Monday: {
      title: "Push + Core",
      goal: "Improve push-up score, upper-body endurance, and trunk stability",
      exercises: [
        { name: "Hand-Release Push-Ups", target: "5 sets near max reps" },
        { name: "Decline Push-Ups", target: "4 sets of 12–15 reps" },
        { name: "Diamond Push-Ups", target: "3 sets of 10 reps" }
      ],
      core: [
        "Plank — 3 max-time sets",
        "Mountain climbers — 3 sets of 40 total",
        "Hollow hold — 3 sets of 20–30 seconds"
      ]
    },

    Tuesday: {
      title: "Pull + Grip",
      goal: "Build back strength, grip, hanging control, and pull-up performance",
      exercises: [
        { name: "Pull-Ups", target: "5 sets max quality reps" },
        { name: "Chin-Ups", target: "3 sets max reps" },
        { name: "Negative Pull-Ups", target: "3 sets of 5 with 5-second lowers" },
        { name: "Dead Hang", target: "4 sets max time" }
      ],
      core: [
        "Hanging knee raises — 3 sets of 12",
        "Plank — 3 sets of 45–60 seconds"
      ]
    },

    Wednesday: {
      title: "Conditioning + Run Focus",
      goal: "Improve work capacity, agility, and 2-mile run performance",
      exercises: [
        { name: "Shuttle Runs", target: "6 rounds of 25m down and back" },
        { name: "Burpees", target: "5 sets of 15 reps" },
        { name: "High Knees", target: "3 rounds of 45 seconds" },
        { name: "Steady Run", target: "1.5 to 2 miles" }
      ],
      mobility: [
        "Light hip mobility after run",
        "Hamstring stretch",
        "Calf stretch"
      ]
    },

    Thursday: {
      title: "Mobility + Core Recovery",
      goal: "Improve range of motion, recovery, posture, and core endurance",
      mobility: [
        "Deep squat hold — 3 minutes total",
        "Hip flexor stretch — 2 minutes each side",
        "World's Greatest Stretch — 2 rounds each side",
        "Dead hang — 3 rounds"
      ],
      core: [
        "Slow sit-ups — 3 sets of 15",
        "Hollow hold — 3 sets of 20–30 seconds",
        "Plank — 2 max-time sets"
      ]
    },

    Friday: {
      title: "Full Body Combat Circuit",
      goal: "Train full-body endurance and performance under fatigue",
      options: [
        {
          name: "Main Circuit",
          plan: [
            "5 rounds total",
            "10 pull-ups",
            "20 push-ups",
            "30 squats",
            "10 burpees",
            "30-second sprint",
            "Rest 1–2 minutes between rounds"
          ]
        }
      ]
    },

    Saturday: {
      title: "Long Run + Light Core",
      goal: "Build endurance base and support 2-mile performance",
      exercises: [
        { name: "Easy to Moderate Run", target: "2–4 miles" }
      ],
      core: [
        "Plank — 2 max-time sets",
        "Dead bug — 2 sets of 20 total"
      ],
      notes: [
        "Keep the pace controlled",
        "Finish with light stretching"
      ]
    }
  }
};

const STORAGE_KEYS = {
  progress: "scavTrainingProgress",
  streak: "scavTrainingStreak",
  lastCompleteDate: "scavTrainingLastCompleteDate",
  workoutMode: "scavTrainingWorkoutMode",
  notes: "scavTrainingNotes"
};

const app = document.getElementById("app");
const dayNames = Object.keys(WORKOUT_PLAN.days);
const todayName = dayNames[new Date().getDay()];
let timerInterval = null;
let noteSaveTimeout = null;

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getFriendlyToday() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  });
}

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.progress)) || {};
  } catch {
    return {};
  }
}

function setProgress(progress) {
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
}

function getDayProgress(dayName) {
  const progress = getProgress();
  return progress[dayName] || {};
}

function setDayItemChecked(dayName, itemId, checked) {
  const progress = getProgress();
  progress[dayName] = progress[dayName] || {};
  progress[dayName][itemId] = checked;
  setProgress(progress);
}

function clearDayProgress(dayName) {
  const progress = getProgress();
  delete progress[dayName];
  setProgress(progress);
}

function getWorkoutMode() {
  return localStorage.getItem(STORAGE_KEYS.workoutMode) === "true";
}

function setWorkoutMode(value) {
  localStorage.setItem(STORAGE_KEYS.workoutMode, String(value));
}

function getStreak() {
  return parseInt(localStorage.getItem(STORAGE_KEYS.streak) || "0", 10);
}

function setStreak(value) {
  localStorage.setItem(STORAGE_KEYS.streak, String(value));
}

function getLastCompleteDate() {
  return localStorage.getItem(STORAGE_KEYS.lastCompleteDate) || "";
}

function setLastCompleteDate(value) {
  localStorage.setItem(STORAGE_KEYS.lastCompleteDate, value);
}

function getNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.notes)) || {};
  } catch {
    return {};
  }
}

function setNotes(notes) {
  localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
}

function getDayNote(dayName) {
  const notes = getNotes();
  return notes[dayName] || "";
}

function setDayNote(dayName, value) {
  const notes = getNotes();
  notes[dayName] = value;
  setNotes(notes);
}

function clearDayNote(dayName) {
  const notes = getNotes();
  delete notes[dayName];
  setNotes(notes);
}

function updateHeaderStats() {
  const todayLabel = document.getElementById("todayLabel");
  const streakValue = document.getElementById("streakValue");

  if (todayLabel) {
    todayLabel.textContent = getFriendlyToday();
  }

  if (streakValue) {
    const streak = getStreak();
    streakValue.textContent = `${streak} day${streak === 1 ? "" : "s"}`;
  }
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function makeItemId(section, index) {
  return `${section}-${index}`;
}

function createList(items, dayName, sectionKey) {
  const dayProgress = getDayProgress(dayName);

  return `
    <ul class="clean-list">
      ${items.map((item, index) => {
        const itemId = makeItemId(sectionKey, index);
        const checked = Boolean(dayProgress[itemId]);
        return `
          <li class="list-item ${checked ? "completed" : ""}">
            <label class="check-row">
              <input
                class="list-checkbox"
                type="checkbox"
                data-day="${escapeHtml(dayName)}"
                data-item-id="${escapeHtml(itemId)}"
                ${checked ? "checked" : ""}
              />
              <div class="check-content">${escapeHtml(item)}</div>
            </label>
          </li>
        `;
      }).join("")}
    </ul>
  `;
}

function createExerciseList(exercises, dayName, sectionKey) {
  const dayProgress = getDayProgress(dayName);

  return `
    <ul class="clean-list">
      ${exercises.map((exercise, index) => {
        const itemId = makeItemId(sectionKey, index);
        const checked = Boolean(dayProgress[itemId]);
        return `
          <li class="exercise-item ${checked ? "completed" : ""}">
            <label class="exercise-row">
              <input
                class="exercise-checkbox"
                type="checkbox"
                data-day="${escapeHtml(dayName)}"
                data-item-id="${escapeHtml(itemId)}"
                ${checked ? "checked" : ""}
              />
              <div class="exercise-content">
                <div class="exercise-name">${escapeHtml(exercise.name)}</div>
                <div class="exercise-target">${escapeHtml(exercise.target)}</div>
              </div>
            </label>
          </li>
        `;
      }).join("")}
    </ul>
  `;
}

function createOptions(options, dayName, sectionKey) {
  return options.map((option, optionIndex) => `
    <div class="option-block">
      <h4>${escapeHtml(option.name)}</h4>
      ${createList(option.plan, dayName, `${sectionKey}-${optionIndex}`)}
    </div>
  `).join("");
}

function createSectionCard(title, content) {
  return `
    <section class="section-card">
      <h3 class="section-title">${escapeHtml(title)}</h3>
      ${content}
    </section>
  `;
}

function getDayItemCounts(dayName) {
  const day = WORKOUT_PLAN.days[dayName];
  const progress = getDayProgress(dayName);

  const sections = [
    ["warmup", WORKOUT_PLAN.warmup.items],
    ["mobilityDaily", WORKOUT_PLAN.mobilityDaily.items],
    ["progression", WORKOUT_PLAN.progression.items],
    ["exercises", day.exercises],
    ["conditioning", day.conditioning],
    ["core", day.core],
    ["mobility", day.mobility],
    ["notes", day.notes]
  ];

  let total = 0;
  let completed = 0;

  sections.forEach(([sectionName, items]) => {
    if (!items?.length) return;
    items.forEach((_, index) => {
      total += 1;
      if (progress[makeItemId(sectionName, index)]) {
        completed += 1;
      }
    });
  });

  if (day.options?.length) {
    day.options.forEach((option, optionIndex) => {
      option.plan.forEach((_, itemIndex) => {
        total += 1;
        if (progress[makeItemId(`options-${optionIndex}`, itemIndex)]) {
          completed += 1;
        }
      });
    });
  }

  return { total, completed };
}

function maybeUpdateStreak(dayName) {
  const { total, completed } = getDayItemCounts(dayName);
  if (!total || completed !== total) return;

  const today = getTodayISO();
  const lastDate = getLastCompleteDate();

  if (lastDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().slice(0, 10);

  if (lastDate === yesterdayISO) {
    setStreak(getStreak() + 1);
  } else {
    setStreak(1);
  }

  setLastCompleteDate(today);
  updateHeaderStats();
}

function createProgressMarkup(dayName) {
  const { total, completed } = getDayItemCounts(dayName);
  const percent = total ? Math.round((completed / total) * 100) : 0;

  let statusText = "Locked in";
  if (percent === 0) statusText = "Ready to train";
  else if (percent < 50) statusText = "In progress";
  else if (percent < 100) statusText = "Closing in";
  else statusText = "Complete";

  return `
    <div class="progress-wrap">
      <div class="progress-meta">
        <span>${statusText}</span>
        <span>${completed}/${total} complete</span>
      </div>
      <div class="progress-bar" aria-hidden="true">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>
    </div>
  `;
}

function createTimerCard() {
  return `
    <section class="card">
      <h2>Timer</h2>
      <p class="goal">Quick presets for planks, rests, sprints, and mobility holds</p>

      <div class="timer-grid">
        <div id="timerDisplay" class="timer-display">00:30</div>

        <div class="timer-presets">
          <button class="btn" type="button" data-timer="30">30 sec</button>
          <button class="btn" type="button" data-timer="45">45 sec</button>
          <button class="btn" type="button" data-timer="60">60 sec</button>
          <button class="btn" type="button" data-timer="90">90 sec</button>
          <button class="btn" type="button" data-timer="120">2 min</button>
        </div>

        <div class="button-row">
          <button class="btn btn-primary" type="button" id="startTimerBtn">Start</button>
          <button class="btn" type="button" id="pauseTimerBtn">Pause</button>
          <button class="btn btn-danger" type="button" id="resetTimerBtn">Reset</button>
        </div>

        <div id="timerStatus" class="timer-status">Ready</div>
      </div>
    </section>
  `;
}

function createNotesCard(dayName) {
  const noteValue = getDayNote(dayName);

  return `
    <section class="card">
      <h2>Training Notes</h2>
      <p class="goal">Log reps, run times, failures, soreness, or anything worth tracking for ${escapeHtml(dayName)}</p>

      <div class="control-group">
        <label for="dayNotes">Notes for ${escapeHtml(dayName)}</label>
        <textarea id="dayNotes" placeholder="Example: Pull-ups felt strong. Hit 5,4,4,3,3. 2-mile pace felt rough in the last half mile.">${escapeHtml(noteValue)}</textarea>
        <div class="notes-help">Saved automatically while you type.</div>
        <div id="notesStatus" class="notes-status">Ready</div>
      </div>
    </section>
  `;
}

function renderDay(dayName) {
  const day = WORKOUT_PLAN.days[dayName];
  const sectionCards = [];

  if (day.exercises?.length) {
    sectionCards.push(
      createSectionCard("Exercises", createExerciseList(day.exercises, dayName, "exercises"))
    );
  }

  if (day.conditioning?.length) {
    sectionCards.push(
      createSectionCard("Conditioning", createList(day.conditioning, dayName, "conditioning"))
    );
  }

  if (day.core?.length) {
    sectionCards.push(
      createSectionCard("Core", createList(day.core, dayName, "core"))
    );
  }

  if (day.mobility?.length) {
    sectionCards.push(
      createSectionCard("Mobility", createList(day.mobility, dayName, "mobility"))
    );
  }

  if (day.options?.length) {
    sectionCards.push(
      createSectionCard("Options", createOptions(day.options, dayName, "options"))
    );
  }

  if (day.notes?.length) {
    sectionCards.push(
      createSectionCard("Notes", createList(day.notes, dayName, "notes"))
    );
  }

  return `
    <section class="card">
      <h2>${escapeHtml(dayName)} — ${escapeHtml(day.title)}</h2>
      <p class="goal">${escapeHtml(day.goal)}</p>

      <div class="badge-row">
        <span class="badge">Bodyweight Only</span>
        <span class="badge">Pull-Up Bar Ready</span>
        <span class="badge">ACFT Focused</span>
      </div>

      ${createProgressMarkup(dayName)}
    </section>

    <div class="mini-grid">
      ${sectionCards.length ? sectionCards.join("") : `<p class="empty">No workout details found.</p>`}
    </div>
  `;
}

function renderApp(selectedDay = todayName) {
  const isWorkoutMode = getWorkoutMode();
  document.body.classList.toggle("workout-mode", isWorkoutMode);

  app.innerHTML = `
    <section class="controls">
      <div class="control-row">
        <div class="control-group">
          <label for="daySelect">Choose a training day</label>
          <select id="daySelect">
            ${dayNames.map(day => `
              <option value="${escapeHtml(day)}" ${day === selectedDay ? "selected" : ""}>${escapeHtml(day)}</option>
            `).join("")}
          </select>
        </div>

        <div class="button-row">
          <button class="btn btn-primary" id="todayBtn" type="button">Go to Today</button>
          <button class="btn" id="toggleWorkoutModeBtn" type="button">
            ${isWorkoutMode ? "Exit Workout Mode" : "Start Workout Mode"}
          </button>
          <button class="btn btn-danger" id="resetDayBtn" type="button">Reset This Day</button>
        </div>
      </div>
    </section>

    <div class="grid">
      <div class="top-cards mini-grid">
        <section class="card">
          <h2>${escapeHtml(WORKOUT_PLAN.warmup.title)}</h2>
          <p class="goal">${escapeHtml(WORKOUT_PLAN.warmup.goal)}</p>
          ${createList(WORKOUT_PLAN.warmup.items, selectedDay, "warmup")}
        </section>

        <section class="card">
          <h2>${escapeHtml(WORKOUT_PLAN.mobilityDaily.title)}</h2>
          <p class="goal">${escapeHtml(WORKOUT_PLAN.mobilityDaily.goal)}</p>
          ${createList(WORKOUT_PLAN.mobilityDaily.items, selectedDay, "mobilityDaily")}
        </section>

        <section class="card">
          <h2>${escapeHtml(WORKOUT_PLAN.progression.title)}</h2>
          <p class="goal">${escapeHtml(WORKOUT_PLAN.progression.goal)}</p>
          ${createList(WORKOUT_PLAN.progression.items, selectedDay, "progression")}
        </section>
      </div>

      ${createTimerCard()}
      ${createNotesCard(selectedDay)}
      ${renderDay(selectedDay)}
    </div>
  `;

  wireEvents(selectedDay);
  updateHeaderStats();
  resetTimerUi();
}

function wireEvents(selectedDay) {
  const daySelect = document.getElementById("daySelect");
  const todayBtn = document.getElementById("todayBtn");
  const toggleWorkoutModeBtn = document.getElementById("toggleWorkoutModeBtn");
  const resetDayBtn = document.getElementById("resetDayBtn");
  const dayNotes = document.getElementById("dayNotes");
  const notesStatus = document.getElementById("notesStatus");

  daySelect?.addEventListener("change", (event) => {
    renderApp(event.target.value);
  });

  todayBtn?.addEventListener("click", () => {
    renderApp(todayName);
  });

  toggleWorkoutModeBtn?.addEventListener("click", () => {
    setWorkoutMode(!getWorkoutMode());
    renderApp(selectedDay);
  });

  resetDayBtn?.addEventListener("click", () => {
    clearDayProgress(selectedDay);
    clearDayNote(selectedDay);
    renderApp(selectedDay);
  });

  document.querySelectorAll('input[type="checkbox"][data-item-id]').forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const target = event.target;
      const dayName = target.dataset.day;
      const itemId = target.dataset.itemId;
      const checked = target.checked;

      setDayItemChecked(dayName, itemId, checked);
      maybeUpdateStreak(dayName);
      renderApp(dayName);
    });
  });

  if (dayNotes) {
    dayNotes.addEventListener("input", (event) => {
      const value = event.target.value;

      if (noteSaveTimeout) {
        clearTimeout(noteSaveTimeout);
      }

      if (notesStatus) {
        notesStatus.textContent = "Saving...";
        notesStatus.classList.remove("saved");
      }

      noteSaveTimeout = window.setTimeout(() => {
        setDayNote(selectedDay, value);

        if (notesStatus) {
          notesStatus.textContent = "Saved";
          notesStatus.classList.add("saved");
        }
      }, 250);
    });
  }

  document.querySelectorAll("[data-timer]").forEach((button) => {
    button.addEventListener("click", () => {
      const seconds = Number(button.dataset.timer);
      setTimerValue(seconds);
      setTimerStatus(`Preset set: ${formatTime(seconds)}`);
    });
  });

  document.getElementById("startTimerBtn")?.addEventListener("click", startTimer);
  document.getElementById("pauseTimerBtn")?.addEventListener("click", pauseTimer);
  document.getElementById("resetTimerBtn")?.addEventListener("click", resetTimerUi);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getTimerDisplayElement() {
  return document.getElementById("timerDisplay");
}

function getTimerStatusElement() {
  return document.getElementById("timerStatus");
}

function getTimerValue() {
  const display = getTimerDisplayElement();
  if (!display) return 30;

  const [minutes, seconds] = display.textContent.split(":").map(Number);
  return (minutes * 60) + seconds;
}

function setTimerValue(seconds) {
  const display = getTimerDisplayElement();
  if (display) {
    display.textContent = formatTime(seconds);
  }
}

function setTimerStatus(text) {
  const status = getTimerStatusElement();
  if (status) {
    status.textContent = text;
  }
}

function startTimer() {
  pauseTimer();

  let remaining = getTimerValue();
  if (remaining <= 0) {
    remaining = 30;
    setTimerValue(remaining);
  }

  setTimerStatus("Running");

  timerInterval = window.setInterval(() => {
    remaining -= 1;
    setTimerValue(Math.max(remaining, 0));

    if (remaining <= 0) {
      pauseTimer();
      setTimerStatus("Done");
    }
  }, 1000);
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    setTimerStatus("Paused");
  }
}

function resetTimerUi() {
  pauseTimer();
  setTimerValue(30);
  setTimerStatus("Ready");
}

updateHeaderStats();
renderApp(todayName);
