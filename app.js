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

const app = document.getElementById("app");
const dayNames = Object.keys(WORKOUT_PLAN.days);

function createList(items) {
  return `
    <ul class="clean-list">
      ${items.map(item => `<li>${item}</li>`).join("")}
    </ul>
  `;
}

function createExerciseList(exercises) {
  return `
    <ul class="clean-list">
      ${exercises.map(ex => `
        <li>
          <div class="exercise-name">${ex.name}</div>
          <div class="exercise-target">${ex.target}</div>
        </li>
      `).join("")}
    </ul>
  `;
}

function createOptions(options) {
  return options.map(option => `
    <div class="option-block">
      <h4>${option.name}</h4>
      ${createList(option.plan)}
    </div>
  `).join("");
}

function createSectionCard(title, content) {
  return `
    <section class="section-card">
      <h3 class="section-title">${title}</h3>
      ${content}
    </section>
  `;
}

function renderDay(dayName) {
  const day = WORKOUT_PLAN.days[dayName];
  const sectionCards = [];

  if (day.exercises?.length) {
    sectionCards.push(createSectionCard("Exercises", createExerciseList(day.exercises)));
  }

  if (day.conditioning?.length) {
    sectionCards.push(createSectionCard("Conditioning", createList(day.conditioning)));
  }

  if (day.core?.length) {
    sectionCards.push(createSectionCard("Core", createList(day.core)));
  }

  if (day.mobility?.length) {
    sectionCards.push(createSectionCard("Mobility", createList(day.mobility)));
  }

  if (day.options?.length) {
    sectionCards.push(createSectionCard("Options", createOptions(day.options)));
  }

  if (day.notes?.length) {
    sectionCards.push(createSectionCard("Notes", createList(day.notes)));
  }

  return `
    <section class="card">
      <h2>${dayName} — ${day.title}</h2>
      <p class="goal">${day.goal}</p>

      <div class="badge-row">
        <span class="badge">Bodyweight Only</span>
        <span class="badge">Pull-Up Bar Ready</span>
        <span class="badge">ACFT Focused</span>
      </div>
    </section>

    <div class="mini-grid">
      ${sectionCards.length ? sectionCards.join("") : `<p class="empty">No workout details found.</p>`}
    </div>
  `;
}

function renderApp(selectedDay = dayNames[0]) {
  app.innerHTML = `
    <section class="controls">
      <div class="control-group">
        <label for="daySelect">Choose a training day</label>
        <select id="daySelect">
          ${dayNames.map(day => `
            <option value="${day}" ${day === selectedDay ? "selected" : ""}>${day}</option>
          `).join("")}
        </select>
      </div>
    </section>

    <div class="grid">
      <section class="card">
        <h2>${WORKOUT_PLAN.warmup.title}</h2>
        <p class="goal">${WORKOUT_PLAN.warmup.goal}</p>
        ${createList(WORKOUT_PLAN.warmup.items)}
      </section>

      <section class="card">
        <h2>${WORKOUT_PLAN.mobilityDaily.title}</h2>
        <p class="goal">${WORKOUT_PLAN.mobilityDaily.goal}</p>
        ${createList(WORKOUT_PLAN.mobilityDaily.items)}
      </section>

      <section class="card">
        <h2>${WORKOUT_PLAN.progression.title}</h2>
        <p class="goal">${WORKOUT_PLAN.progression.goal}</p>
        ${createList(WORKOUT_PLAN.progression.items)}
      </section>

      ${renderDay(selectedDay)}
    </div>
  `;

  const daySelect = document.getElementById("daySelect");
  daySelect.addEventListener("change", (event) => {
    renderApp(event.target.value);
  });
}

renderApp();
