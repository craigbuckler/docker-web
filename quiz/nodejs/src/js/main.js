// main application

// question API URL
const questionAPI = '/question';

// initialize state
const state = {};

'answered,right,wrong,category,question,a0,a1,a2,a3'
  .split(',')
  .forEach(prop => {
    state[prop] = {
      node: document.getElementById(prop),
      value: 0
    };
  });

// answer event handler
document.getElementById('answers').addEventListener('click', answerHandler, false);


// start first question
(async () => await newQuestion())();


// new question
async function newQuestion() {

  const question = await fetchQuestion();

  // populate state
  for (const prop in question) {
    if (state[prop] && state[prop].node) state[prop].value = question[prop];
  }

  // render question
  for (const prop in state) {
    if (state[prop].node) state[prop].node.innerHTML = state[prop].value;
  }

  // correct answer
  state.correct = 'a' + question.correct;

}


// next question
async function fetchQuestion() {

  const
    call = await fetch(questionAPI),
    q = await call.json();

  q.answers.forEach((a, i) => { q['a'+i] = a; });
  delete q.answers;

  return q;

}


// answer clicked
function answerHandler(e) {

  const clicked = e.target;
  if (state.done || clicked.nodeName !== 'BUTTON') return;

  state.done = true;

  const correct = state[state.correct].node;

  state.answered.value++;
  clicked.blur();

  if (clicked === correct) {
    state.right.value++;
    clicked.classList.add('right');
  }
  else {
    state.wrong.value++;
    clicked.classList.add('wrong');
    correct.classList.add('right', 'reveal');
  }

  setTimeout(async () => {

    clicked.classList.remove('right', 'wrong');
    correct.classList.remove('right', 'reveal');

    await newQuestion();
    state.done = false;

  }, 3000);

}
