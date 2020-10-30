/*----- constants -----*/
const QUESTION_QTY = 10;

let questions = [];
let choices = [];
let stage = -1;
let correct = 0;
let correctChoice = 0;

/*----- app's state (variables) -----*/

/*----- cached element references -----*/
const questionEl = document.querySelector('.question');
const questionNumberEl = document.querySelector('.question-number');
const correctEl = document.querySelector('.correct');
const choicesEl = document.querySelector('.choices');
const allSelectionsEl = document.querySelectorAll('.selection');
const submitEl = document.getElementById('submit');
const replayEl = document.getElementById('replay');
const prevEl = document.querySelector('.prev');

/*----- event listeners -----*/
submitEl.addEventListener('click', handleSubmitClick);
replayEl.addEventListener('click', handleReplayClick);

/*----- functions -----*/
async function init() {
    const data = await fetch(
        'https://sky8the2flies.github.io/tandem-coding-challenge/Apprentice_TandemFor400_Data.json'
    ).then((res) => res.json());
    questions = [];
    stage = -1;
    correct = 0;
    const dataCopy = [...data];
    for (let i = 0; i < QUESTION_QTY; i++) {
        questions.push(dataCopy.splice(getRandom(0, dataCopy.length), 1)[0]);
    }
    beginNewRound();
    render();
}
init();

function beginNewRound() {
    stage = ++stage;
    if (stage >= QUESTION_QTY) {
        return;
    }
    const curQuestion = questions[stage];
    const choicesCopy = [...curQuestion.incorrect];
    const random = getRandom(0, curQuestion.incorrect.length);
    correctChoice = random;
    choicesCopy.splice(random, 0, curQuestion.correct);
    choices = choicesCopy;
}

function handleSubmitClick(e) {
    const selectEl = document.querySelector('.choice:checked');
    if (!selectEl) return;
    if (selectEl.id === `${correctChoice}`) {
        correct = ++correct;
    }
    renderPrevQuestion(selectEl.id === `${correctChoice}`, questions[stage]);
    beginNewRound();
    render();
}

function handleReplayClick(e) {
    init();
    replayEl.style.display = 'none';
}

function render() {
    correctEl.textContent = `Correct: ${correct} / Incorrect: ${
        stage - correct
    }`;
    if (stage >= QUESTION_QTY) {
        replayEl.style.display = 'block';
        return;
    }
    questionNumberEl.textContent = `Question: ${stage + 1}/${QUESTION_QTY}`;
    const curQuestion = questions[stage];
    questionEl.textContent = curQuestion.question;
    renderChoices();
}

function renderChoices() {
    choicesEl.innerHTML = '';
    choices.forEach((ch, idx) => {
        const input = document.createElement('input');
        input.classList = 'choice';
        input.type = 'radio';
        input.name = 'choice';
        input.id = `${idx}`;
        const label = document.createElement('label');
        label.htmlFor = `${idx}`;
        label.textContent = ch;
        choicesEl.append(input, label);
    });
}

function renderPrevQuestion(correct, question) {
    prevEl.innerHTML = '';
    const prev = document.createElement('h5');
    prev.textContent = `${
        correct
            ? 'Correct!'
            : 'Incorrect! The correct answer was: ' + question.correct
    }`;
    prevEl.append(prev);
}

/*----- helpers  -----*/
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
