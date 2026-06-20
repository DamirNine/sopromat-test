const NUM_QUESTIONS = 45;

let quiz = [];      // array of {q, options: [...], correctIndex, userIndex}
let current = 0;

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const optionsEl = document.getElementById('options');
const progressFill = document.getElementById('progress-fill');

const scoreText = document.getElementById('score-text');
const reviewEl = document.getElementById('review');

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuiz() {
  const indices = shuffle([...QUESTIONS.keys()]).slice(0, NUM_QUESTIONS);
  quiz = indices.map(i => {
    const item = QUESTIONS[i];
    const correctText = item.a[0];
    const options = shuffle(item.a);
    return {
      q: item.q,
      options,
      correctIndex: options.indexOf(correctText),
      userIndex: null
    };
  });
}

function startQuiz() {
  buildQuiz();
  current = 0;
  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  const item = quiz[current];
  questionCounter.textContent = `Вопрос ${current + 1} из ${quiz.length}`;
  questionText.textContent = item.q;
  progressFill.style.width = `${(current / quiz.length) * 100}%`;

  optionsEl.innerHTML = '';
  item.options.forEach((opt, idx) => {
    const div = document.createElement('div');
    div.className = 'option';
    div.textContent = opt;
    div.addEventListener('click', () => selectOption(idx));
    optionsEl.appendChild(div);
  });

  nextBtn.disabled = true;
  nextBtn.textContent = (current === quiz.length - 1) ? 'Давершить' : 'Далее';

  // restore previous selection if navigating back is ever added (not currently)
  if (item.userIndex !== null) {
    highlightAnswer(item);
    nextBtn.disabled = false;
  }
}

function selectOption(idx) {
  const item = quiz[current];
  if (item.userIndex !== null) return; // already answered
  item.userIndex = idx;
  highlightAnswer(item);
  nextBtn.disabled = false;
}

function highlightAnswer(item) {
  const opts = optionsEl.querySelectorAll('.option');
  opts.forEach((el, idx) => {
    el.classList.add('disabled');
    if (idx === item.correctIndex) el.classList.add('correct');
    else if (idx === item.userIndex) el.classList.add('wrong');
  });
}

function nextQuestion() {
  if (current < quiz.length - 1) {
    current++;
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  const correctCount = quiz.filter(i => i.userIndex === i.correctIndex).length;
  const pct = Math.round((correctCount / quiz.length) * 100);
  scoreText.textContent = `${correctCount} из ${quiz.length} правильно (${pct}%)`;

  reviewEl.innerHTML = '';
  quiz.forEach((item, i) => {
    const ok = item.userIndex === item.correctIndex;
    const div = document.createElement('div');
    div.className = 'review-item' + (ok ? ' ok' : '');
    const yourAnswer = item.options[item.userIndex];
    const correctAnswer = item.options[item.correctIndex];
    div.innerHTML = `
      <p class="q">${i + 1}. ${item.q}</p>
      <p class="your-answer">Ваш ответ: ${yourAnswer}</p>
      ${ok ? '' : `<p class="correct-answer">Правильный ответ: ${correctAnswer}</p>`}
    `;
    reviewEl.appendChild(div);
  });
}

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', () => {
  resultScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});
