const WORKOUT_PLAN = {
  warmup: {
    title: "Daily Warmup",
    goal: "10–12 minutes before every session",
    items: [
      "Jump rope or jumping jacks — 2 minutes",
      "Arm circles — 20 each direction",
      "Hip circles — 20",
      "Walking lunges — 10 each leg",
      "Pushups — 15",
      "Dead hang — 30 seconds",
      "Deep squat hold — 45 seconds"
    ]
  },

  mobilityDaily: {
    title: "Daily Mobility",
    goal: "10 minutes morning or night",
    items: [
      "Deep squat hold — 2 minutes",
      "Shoulder dislocates — 20",
      "Hip flexor stretch — 1 min each side",
      "Hamstring stretch — 1 min each",
      "Dead hang — 60 seconds"
    ]
  },

  days: {
    Monday: {
      title: "Upper Push + Conditioning",
      goal: "Chest, triceps, push endurance",
      exercises: [
        { name: "DB Bench Press", target: "4 sets (15-12-10-8)" },
        { name: "Incline DB Press", target: "3 sets" },
        { name: "DB Fly → Press", target: "3 supersets" },
        { name: "Overhead Tricep Extension", target: "3 sets" },
        { name: "Bench Dips", target: "2 sets to failure" },
        { name: "Push-ups", target: "2 max sets" }
      ],
      finisher: [
        "5 rounds:",
        "20 push-ups",
        "30 sec plank"
      ]
    },

    Tuesday: {
      title: "Upper Pull + Core",
      goal: "Back, biceps, grip strength",
      exercises: [
        { name: "Pull-ups", target: "4 sets max reps" },
        { name: "DB Rows", target: "4 sets" },
        { name: "Romanian Deadlift", target: "3 sets" },
        { name: "Hammer Curls", target: "3 sets" },
        { name: "Dead Hang", target: "3 sets max time" }
      ],
      core: [
        "3 rounds:",
        "Hanging knee raises x15",
        "Plank x45 sec",
        "Russian twists x20"
      ]
    },

    Wednesday: {
      title: "Conditioning + Mobility",
      goal: "Recovery + endurance",
      exercises: [
        { name: "Steady Cardio", target: "20–30 minutes (run, bike, ruck)" }
      ],
      mobility: [
        "Hip mobility work",
        "Hamstring stretching",
        "Shoulder mobility"
      ]
    },

    Thursday: {
      title: "Legs + Explosive Power",
      goal: "Lower body strength + athleticism",
      exercises: [
        { name: "Goblet Squats", target: "4 sets" },
        { name: "Bulgarian Split Squats", target: "3 sets each leg" },
        { name: "DB Deadlifts", target: "3 sets" },
        { name: "Walking Lunges", target: "2 sets" }
      ],
      power: [
        { name: "Jump Squats", target: "3x10" },
        { name: "Explosive Step-ups", target: "3x10 each leg" }
      ],
      finisher: [
        "5 rounds:",
        "10 lunges each leg",
        "10 squats",
        "30 sec wall sit"
      ]
    },

    Friday: {
      title: "Shoulders + Arms",
      goal: "Hypertrophy + weak point focus",
      exercises: [
        { name: "Shoulder Press", target: "4 sets" },
        { name: "Lateral Raises", target: "3 sets" },
        { name: "Rear Delt Raises", target: "3 sets" },
        { name: "Bicep Curls", target: "3 sets" },
        { name: "Tricep Extensions", target: "3 sets" }
      ],
      finisher: [
        "Push-ups — 1 max set",
        "Pull-ups — 1 max set"
      ]
    },

    Saturday: {
      title: "Military Conditioning",
      goal: "Endurance + full-body performance",
      options: [
        {
          name: "Run + Circuit",
          plan: [
            "Run 1 mile",
            "5 rounds:",
            "20 push-ups",
            "15 squats",
            "10 pull-ups"
          ]
        },
        {
          name: "Ruck",
          plan: [
            "3–6 miles",
            "20–40 lb pack"
          ]
        },
        {
          name: "Long Run",
          plan: [
            "3–5 mile steady run"
          ]
        }
      ]
    },

    Sunday: {
      title: "Rest Day",
      goal: "Full recovery",
      notes: [
        "Light walking optional",
        "Stretching recommended"
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

  if (day.power?.length) {
    sectionCards.push(createSectionCard("Power", createExerciseList(day.power)));
  }

  if (day.finisher?.length) {
    sectionCards.push(createSectionCard("Finisher", createList(day.finisher)));
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
        <span class="badge">Warmup Included</span>
        <span class="badge">Mobility Included</span>
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

      ${renderDay(selectedDay)}
    </div>
  `;

  const daySelect = document.getElementById("daySelect");
  daySelect.addEventListener("change", (event) => {
    renderApp(event.target.value);
  });
}

renderApp();
