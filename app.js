const form = document.querySelector("#assessment-form");
const questions = [
  {
    name: "capabilities",
    recommendation: "Learn the strengths and limits of your approved AI tools, and choose tasks where they can add value."
  },
  {
    name: "prompting",
    recommendation: "Practice giving AI a clear goal, relevant context, and the format you want in its response."
  },
  {
    name: "application",
    recommendation: "Choose one low-risk, repeatable task and experiment with an approved AI tool to support it."
  },
  {
    name: "verification",
    recommendation: "Build in a review step: verify important facts, calculations, and sources before using AI output."
  },
  {
    name: "safety",
    recommendation: "Review your organization's AI and data-handling guidance before entering work information into a tool."
  },
  {
    name: "workflow",
    recommendation: "Map a routine process and identify one step where AI could assist while a person remains accountable."
  }
];

const progressLabel = document.querySelector("#progress-label");
const progressBar = document.querySelector(".progress-track");
const progressFill = document.querySelector(".progress-fill");
const results = document.querySelector("#results");
const scoreOutput = document.querySelector("#score");
const summaryOutput = document.querySelector("#score-summary");
const resultMeter = document.querySelector("#result-meter-fill");
const recommendations = document.querySelector("#recommendations");

function getAnsweredCount() {
  return questions.filter(({ name }) => form.querySelector(`input[name="${name}"]:checked`)).length;
}

function updateProgress() {
  const answered = getAnsweredCount();
  progressLabel.textContent = `${answered} of ${questions.length} answered`;
  progressBar.setAttribute("aria-valuenow", String(answered));
  progressFill.style.width = `${(answered / questions.length) * 100}%`;
}

function getSummary(score) {
  if (score >= 80) {
    return "You report strong habits across the practices in this check-in. Keep learning and sharing what works.";
  }
  if (score >= 60) {
    return "You have a solid foundation. A little focused practice can help make your AI use more consistent.";
  }
  if (score >= 40) {
    return "You’re building your foundations. Start with one practical skill and grow your confidence step by step.";
  }
  return "This is a starting point, not a verdict. Begin with safe, guided experiments and build familiarity at your own pace.";
}

function showResults() {
  const scores = questions.map((question) => ({
    ...question,
    score: Number(form.querySelector(`input[name="${question.name}"]:checked`).value)
  }));
  const score = Math.round((scores.reduce((total, item) => total + item.score, 0) / (questions.length * 5)) * 100);

  scoreOutput.textContent = String(score);
  summaryOutput.textContent = getSummary(score);
  resultMeter.style.width = `${score}%`;
  recommendations.replaceChildren();

  scores
    .sort((first, second) => first.score - second.score)
    .slice(0, 3)
    .forEach(({ recommendation }) => {
      const item = document.createElement("li");
      item.textContent = recommendation;
      recommendations.append(item);
    });

  results.hidden = false;
  results.focus();
}

form.addEventListener("change", updateProgress);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  showResults();
});

document.querySelector("#retake-button").addEventListener("click", () => {
  form.reset();
  results.hidden = true;
  updateProgress();
  document.querySelector("#assessment-title").scrollIntoView({ behavior: "smooth" });
  form.querySelector("input").focus({ preventScroll: true });
});

updateProgress();
