const questions = [
  {
    question: "Which tag is used to create a hyperlink in HTML?",
    options: ["<a>", "<link>", "<href>", "<url>"],
    answer: 0,
  },
  {
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
    answer: 2,
  },
  {
    question: "Which JavaScript method adds a new element at the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: 0,
  },
  {
    question: "How do you select an element by ID in CSS?",
    options: [".element", "#element", "element", "*element"],
    answer: 1,
  },
  {
    question: "Which HTML attribute contains the URL of an image?",
    options: ["src", "href", "alt", "title"],
    answer: 0,
  },
];

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const timerEl = document.getElementById("timer");
const questionNumberEl = document.getElementById("questionNumber");
const questionTextEl = document.getElementById("questionText");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextButton = document.getElementById("nextButton");
const restartButton = document.getElementById("restartButton");

let currentQuestionIndex = 0;
let score = 0;
let timer = 60;
let intervalId = null;
let answered = false;

function loadHighScore() {
  const saved = localStorage.getItem("quizHighScore");
  highScoreEl.textContent = saved ? saved : "0";
}

function updateHighScore() {
  const saved = parseInt(localStorage.getItem("quizHighScore") || "0", 10);
  if (score > saved) {
    localStorage.setItem("quizHighScore", score.toString());
    highScoreEl.textContent = score;
  }
}

function startTimer() {
  timerEl.textContent = timer;
  intervalId = setInterval(() => {
    timer -= 1;
    timerEl.textContent = timer;
    if (timer <= 0) {
      clearInterval(intervalId);
      endQuiz("Time's up! Quiz finished.");
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(intervalId);
  timer = 60;
  startTimer();
}

function renderQuestion() {
  const current = questions[currentQuestionIndex];
  questionNumberEl.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  questionTextEl.textContent = current.question;
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "Select an answer to see instantly if it's correct.";
  answered = false;
  nextButton.disabled = true;

  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.textContent = option;
    button.type = "button";
    button.addEventListener("click", () => handleAnswer(index, button));
    optionsEl.appendChild(button);
  });
}

function handleAnswer(selectedIndex, button) {
  if (answered) return;
  answered = true;
  const current = questions[currentQuestionIndex];
  const correctButton = optionsEl.children[current.answer];
  correctButton.classList.add("correct");

  if (selectedIndex === current.answer) {
    score += 1;
    feedbackEl.textContent = "Correct! Great job.";
  } else {
    button.classList.add("wrong");
    feedbackEl.textContent = `Incorrect. Correct answer: ${current.options[current.answer]}.`;
  }

  Array.from(optionsEl.children).forEach((optionBtn) => {
    optionBtn.classList.add("disabled");
    optionBtn.disabled = true;
  });

  scoreEl.textContent = score;
  updateHighScore();
  nextButton.disabled = false;
}

function nextQuestion() {
  currentQuestionIndex += 1;
  if (currentQuestionIndex >= questions.length) {
    endQuiz("Quiz completed! See your results above.");
    return;
  }
  renderQuestion();
}

function endQuiz(message) {
  clearInterval(intervalId);
  feedbackEl.textContent = message;
  Array.from(optionsEl.children).forEach((optionBtn) => {
    optionBtn.disabled = true;
    optionBtn.classList.add("disabled");
  });
  nextButton.disabled = true;
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  scoreEl.textContent = score;
  loadHighScore();
  resetTimer();
  renderQuestion();
}

nextButton.addEventListener("click", nextQuestion);
restartButton.addEventListener("click", restartQuiz);

loadHighScore();
startTimer();
renderQuestion();
