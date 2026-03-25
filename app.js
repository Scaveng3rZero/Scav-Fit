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

function renderDay(dayData) {
  let html = `<h2>${dayData.title}</h2><p>${dayData.goal}</p>`;

  if (dayData.exercises) {
    html += `
      <h3>Exercises</h3>
      <ul>
        ${dayData.exercises.map(ex => `<li>${ex.name} — ${ex.target}</li>`).join("")}
      </ul>
    `;
  }

  if (dayData.power) {
    html += `
      <h3>Power</h3>
      <ul>
        ${dayData.power.map(ex => `<li>${ex.name} — ${ex.target}</li>`).join("")}
      </ul>
    `;
  }

  if (dayData.finisher) {
    html += `
      <h3>Finisher</h3>
      <ul>
        ${dayData.finisher.map(item => `<li>${item}</li>`).join("")}
      </ul>
    `;
  }

  if (dayData.core) {
    html += `
      <h3>Core</h3>
      <ul>
        ${dayData.core.map(item => `<li>${item}</li>`).join("")}
      </ul>
    `;
  }

  if (dayData.mobility) {
    html += `
      <h3>Mobility</h3>
      <ul>
        ${dayData.mobility.map(item => `<li>${item}</li>`).join("")}
      </ul>
    `;
  }

  if (dayData.options) {
    html += `
      <h3>Options</h3>
      ${dayData.options.map(opt => `
        <div>
          <strong>${opt.name}</strong>
          <ul>
            ${opt.plan.map(step => `<li>${step}</li>`).join("")}
          </ul>
        </div>
      `).join("")}
    `;
  }

  if (dayData.notes) {
    html += `
      <h3>Notes</h3>
      <ul>
        ${dayData.notes.map(note => `<li>${note}</li>`).join("")}
      </ul>
    `;
  }

  return html;
}
    
  }
};
