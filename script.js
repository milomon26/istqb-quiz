const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const reviewScreen = document.getElementById("review-screen");

const startButton = document.getElementById("start-button");
const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");

const timerElement = document.getElementById("timer");
const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("next-button");
const progressBar = document.getElementById("progress-bar");

let questions = [];
let currentQuestion = 0;
let userAnswers = [];

let timeLeft = 60 * 60;
let timerInterval = null;


// ------------------------------------
// AVVIO SIMULAZIONE
// ------------------------------------

startButton.addEventListener("click", async () => {

  errorMessage.classList.add("hidden");
  loadingMessage.classList.remove("hidden");
  startButton.disabled = true;

  try {

    questions = await loadQuestions();

    if (!Array.isArray(questions) || questions.length < 40) {
      throw new Error(
        "Non sono disponibili 40 domande ufficiali complete."
      );
    }

    questions = shuffleArray(questions).slice(0, 40);

    loadingMessage.classList.add("hidden");
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    currentQuestion = 0;
    userAnswers = [];

    startTimer();
    showQuestion();

  } catch (error) {

    loadingMessage.classList.add("hidden");

    errorMessage.textContent =
      error.message ||
      "Errore durante il caricamento delle domande.";

    errorMessage.classList.remove("hidden");
    startButton.disabled = false;
  }

});


// ------------------------------------
// CARICAMENTO DOMANDE
// ------------------------------------

async function loadQuestions() {

  /*
    QUI COLLEGHEREMO IL SERVIZIO PRIVATO
    CHE LEGGERÀ IL NOTEBOOK "ISTQB".

    Non verranno create domande artificiali.

    Il servizio dovrà restituire esclusivamente
    domande presenti nelle fonti NotebookLM.
  */

  throw new Error(
    "Collegamento a NotebookLM non ancora configurato."
  );

}


// ------------------------------------
// VISUALIZZAZIONE DOMANDA
// ------------------------------------

function showQuestion() {

  const question = questions[currentQuestion];

  questionNumber.textContent =
    `Domanda ${currentQuestion + 1} di 40`;

  questionText.textContent = question.question;

  progressBar.style.width =
    `${((currentQuestion + 1) / 40) * 100}%`;

  answersContainer.innerHTML = "";

  feedback.classList.add("hidden");
  nextButton.classList.add("hidden");

  question.answers.forEach((answer, index) => {

    const button = document.createElement("button");

    button.className = "answer-button";

    button.textContent =
      `${String.fromCharCode(65 + index)}. ${answer}`;

    button.addEventListener("click", () => {
      selectAnswer(index);
    });

    answersContainer.appendChild(button);

  });

}


// ------------------------------------
// RISPOSTA
// ------------------------------------

function selectAnswer(selectedIndex) {

  const question = questions[currentQuestion];

  const buttons =
    document.querySelectorAll(".answer-button");

  buttons.forEach(button => {
    button.disabled = true;
  });

  const isCorrect =
    selectedIndex === question.correctAnswer;

  userAnswers[currentQuestion] = {
    selected: selectedIndex,
    correct: isCorrect
  };

  buttons[question.correctAnswer]
    .classList.add("correct");

  if (!isCorrect) {
    buttons[selectedIndex]
      .classList.add("wrong");
  }

  feedback.innerHTML = "";

  const resultTitle =
    document.createElement("strong");

  resultTitle.textContent =
    isCorrect
      ? "Risposta corretta"
      : "Risposta errata";

  const explanation =
    document.createElement("p");

  explanation.textContent =
    question.explanation;

  feedback.appendChild(resultTitle);
  feedback.appendChild(explanation);

  feedback.classList.remove("hidden");

  nextButton.classList.remove("hidden");

}


// ------------------------------------
// DOMANDA SUCCESSIVA
// ------------------------------------

nextButton.addEventListener("click", () => {

  currentQuestion++;

  if (currentQuestion >= 40) {
    finishTest();
  } else {
    showQuestion();
  }

});


// ------------------------------------
// TIMER
// ------------------------------------

function startTimer() {

  clearInterval(timerInterval);

  timeLeft = 60 * 60;

  updateTimer();

  timerInterval = setInterval(() => {

    timeLeft--;

    updateTimer();

    if (timeLeft <= 0) {

      clearInterval(timerInterval);
      finishTest();

    }

  }, 1000);

}


function updateTimer() {

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

  timerElement.textContent =
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;

}


// ------------------------------------
// FINE TEST
// ------------------------------------

function finishTest() {

  clearInterval(timerInterval);

  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const correct =
    userAnswers.filter(answer =>
      answer && answer.correct
    ).length;

  const wrong =
    userAnswers.filter(answer =>
      answer && !answer.correct
    ).length;

  const unanswered =
    40 - correct - wrong;

  const percentage =
    Math.round((correct / 40) * 100);

  document.getElementById("final-correct")
    .textContent = `${correct} / 40`;

  document.getElementById("final-percentage")
    .textContent = `${percentage}%`;

  document.getElementById("correct-count")
    .textContent = correct;

  document.getElementById("wrong-count")
    .textContent = wrong;

  document.getElementById("unanswered-count")
    .textContent = unanswered;

}


// ------------------------------------
// UTILITY
// ------------------------------------

function shuffleArray(array) {

  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {

    const j =
      Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] =
      [copy[j], copy[i]];

  }

  return copy;
}
