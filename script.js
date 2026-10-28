/* Baldi Think Pad cosplay — offline, dependency-free, fully local. */
(() => {
  'use strict';
  const BASE_WIDTH = 1536;
  const BASE_HEIGHT = 689;
  const scene = document.getElementById('scene');
  const equationDisplay = document.getElementById('equation');
  const titleDisplay = document.getElementById('question-title');
  const countDisplay = document.getElementById('question-count');
  const answerDisplay = document.getElementById('answer-display');
  const glitchDisplay = document.getElementById('corruption');
  const angryPortrait = document.getElementById('angry-portrait');
  const readout = document.getElementById('screenreader-progress');
  const statuses = [1, 2, 3].map(n => document.getElementById(`status-${['one', 'two', 'three'][n-1]}`));
  const keys = [...document.querySelectorAll('.key')];

  let problems = [];
  let questionIndex = 0;             // 0, 1, 2
  let entry = '';
  let frozen = false;
  let marks = [null, null, null];    // null, 'correct', or 'wrong'

  function fitScreen() {
    // Preserve the precise 1536 x 689 image composition on any Android phone.
    const visual = window.visualViewport;
    const width = visual?.width || window.innerWidth;
    const height = visual?.height || window.innerHeight;
    const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
    scene.style.setProperty('--scene-scale', String(scale));
  }

  function makeProblem() {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    const minus = Math.random() < 0.5;
    return {
      display: `${a} ${minus ? '−' : '+'} ${b} =`,
      answer: minus ? a - b : a + b
    };
  }

  function startOver() {
    // Ensure both normal problems are different (the third is always corrupted).
    const first = makeProblem();
    let second = makeProblem();
    while (second.display === first.display) second = makeProblem();
    problems = [first, second];
    questionIndex = 0;
    frozen = false;
    marks = [null, null, null];
    entry = '';
    updateScreen();
    readout.textContent = 'Restarted. Question one of three.';
  }

  function updateScreen() {
    scene.classList.toggle('frozen', frozen);
    titleDisplay.textContent = `SOLVE MATH Q${questionIndex + 1}:`;
    countDisplay.textContent = `${questionIndex + 1} / 3`;
    equationDisplay.textContent = questionIndex < 2 ? problems[questionIndex].display : '';
    glitchDisplay.hidden = questionIndex !== 2;
    angryPortrait.hidden = !frozen;
    // Native control states match the picture: no keys operate after failure.
    keys.forEach(key => { key.disabled = frozen; });
    answerDisplay.textContent = entry;
    statuses.forEach((el, index) => {
      const mark = marks[index];
      el.classList.toggle('correct', mark === 'correct');
      el.classList.toggle('wrong', mark === 'wrong');
      el.textContent = mark === 'correct' ? '✓' : mark === 'wrong' ? '✕' : '';
      el.setAttribute('aria-label', `Question ${index+1}: ${mark || 'not yet answered'}`);
    });
  }

  function submit() {
    if (frozen || entry === '' || entry === '-') return;
    if (questionIndex < 2) {
      const correct = Number(entry) === problems[questionIndex].answer;
      marks[questionIndex] = correct ? 'correct' : 'wrong';
      questionIndex++;
      entry = '';
      readout.textContent = `${correct ? 'Correct.' : 'Incorrect.'} Question ${questionIndex+1} of three.`;
    } else {
      // The impossible question always fails: every input is wrong.
      marks[2] = 'wrong';
      frozen = true;
      readout.textContent = 'Wrong. Baldi is angry. Tap his portrait to restart.';
    }
    updateScreen();
  }

  function handleKey(value) {
    if (frozen) return;
    if (value === 'OK') return submit();
    if (value === 'C') entry = '';
    else if (value === '-') {
      entry = entry.startsWith('-') ? entry.slice(1) : '-' + entry;
    } else if (/^[0-9]$/.test(value)) {
      // A maximum of 8 digits prevents overflowing the original answer area.
      if (entry.replace('-', '').length < 8) entry += value;
    } else return;
    updateScreen();
  }

  // Clicking/tapping the drawn buttons. The base mockup contains all the art.
  document.getElementById('keypad').addEventListener('click', event => {
    const button = event.target.closest('[data-key]');
    if (button) handleKey(button.dataset.key);
  });
  document.getElementById('baldi-reset').addEventListener('click', startOver);

  // Handy during development and when used with an external keyboard.
  document.addEventListener('keydown', event => {
    if (/^[0-9]$/.test(event.key)) { event.preventDefault(); handleKey(event.key); }
    else if (event.key === 'Enter' || event.key === '=') { event.preventDefault(); handleKey('OK'); }
    else if (event.key === '-' || event.key === 'Subtract') { event.preventDefault(); handleKey('-'); }
    else if (event.key === 'Escape' || event.key.toLowerCase() === 'c') { event.preventDefault(); handleKey('C'); }
    else if (event.key === 'Backspace') {
      event.preventDefault();
      if (!frozen) { entry = entry.slice(0, -1); updateScreen(); }
    }
  });

  // Offline caching begins when hosted on HTTPS or localhost. file:// testing
  // still runs the game normally, but cannot install a service worker.
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(err => {
        console.info('Offline installation unavailable:', err.message);
      });
    });
  }
  window.addEventListener('resize', fitScreen, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', fitScreen, { passive: true });
  document.addEventListener('contextmenu', ev => ev.preventDefault());
  fitScreen();
  startOver();
})();
