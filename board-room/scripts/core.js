const GAME_GOMOKU = "gomoku";
const GAME_CANNONS = "cannons";

const GOMOKU_SIZE = 15;
const CANNON_SIZE = 5;
const HUMAN = 1;
const COMPUTER = 2;
const EMPTY = 0;
const CANNON = 3;
const SOLDIER = 4;
const GOMOKU_CELL_COUNT = GOMOKU_SIZE * GOMOKU_SIZE;
const LINE_DIRECTIONS = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
];
const ORTHOGONAL_DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const dom = {
  entryView: document.querySelector("#entryView"),
  gameView: document.querySelector("#gameView"),
  gameChoices: document.querySelectorAll(".game-choice"),
  boardWrap: document.querySelector(".board-wrap"),
  canvas: document.querySelector("#board"),
  difficultySelect: document.querySelector("#difficulty"),
  sideControl: document.querySelector("#sideControl"),
  sideSelect: document.querySelector("#sideSelect"),
  statusText: document.querySelector("#statusText"),
  turnText: document.querySelector("#turnText"),
  thinkingBadge: document.querySelector("#thinking"),
  resultEffect: document.querySelector("#resultEffect"),
  resultTitle: document.querySelector("#resultTitle"),
  resultDetail: document.querySelector("#resultDetail"),
  gameKicker: document.querySelector("#gameKicker"),
  gameTitle: document.querySelector("#gameTitle"),
  newGameButton: document.querySelector("#newGame"),
  undoMoveButton: document.querySelector("#undoMove"),
  backToMenuButton: document.querySelector("#backToMenu"),
  soundToggle: document.querySelector("#soundToggle"),
  soundText: document.querySelector("#soundText"),
  moveList: document.querySelector("#moveList"),
  scoreEls: {
    human: document.querySelector("#humanWins"),
    computer: document.querySelector("#computerWins"),
    draw: document.querySelector("#draws"),
  },
};

const ctx = dom.canvas.getContext("2d");

let activeGame = null;
let cellSize = 0;
let padding = 0;
let resultEffectTimer = null;

let gomokuBoard = createEmptyBoard(GOMOKU_SIZE);
let gomokuMoveHistory = [];
let gomokuCurrentPlayer = HUMAN;
let gomokuGameOver = false;
let gomokuComputerThinking = false;
let gomokuWinningLine = [];
let gomokuScores = { human: 0, computer: 0, draw: 0 };
let gomokuHoverPoint = null;

let cannonBoard = createEmptyBoard(CANNON_SIZE);
let cannonMoveHistory = [];
let cannonCurrentPlayer = CANNON;
let cannonHumanSide = CANNON;
let cannonGameOver = false;
let cannonComputerThinking = false;
let cannonSelected = null;
let cannonScores = { human: 0, computer: 0, draw: 0 };
let cannonHoverPoint = null;

const audio = {
  context: null,
  musicOn: true,
  musicTimer: null,
  musicStep: 0,
};

function createEmptyBoard(size) {
  return Array.from({ length: size }, () => Array(size).fill(EMPTY));
}

function cloneBoard(targetBoard) {
  return targetBoard.map((row) => [...row]);
}

function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function inBounds(row, col, size) {
  return row >= 0 && row < size && col >= 0 && col < size;
}

function resizeCanvas() {
  const rect = dom.canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  dom.canvas.width = Math.round(rect.width * scale);
  dom.canvas.height = Math.round(rect.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  drawActiveBoard();
}

function getLayoutSize(boardSize) {
  const rect = dom.canvas.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height);
  padding = size * (boardSize === CANNON_SIZE ? 0.14 : 0.06);
  cellSize = (size - padding * 2) / (boardSize - 1);
  return size;
}

function boardToPixel(row, col) {
  return {
    x: padding + col * cellSize,
    y: padding + row * cellSize,
  };
}

function pixelToBoard(x, y, boardSize) {
  getLayoutSize(boardSize);
  const col = Math.round((x - padding) / cellSize);
  const row = Math.round((y - padding) / cellSize);
  if (!inBounds(row, col, boardSize)) return null;

  const point = boardToPixel(row, col);
  const maxDistance = cellSize * (boardSize === CANNON_SIZE ? 0.48 : 0.42);
  if (Math.hypot(point.x - x, point.y - y) > maxDistance) return null;
  return { row, col };
}

function getCanvasPoint(event, boardSize) {
  const rect = dom.canvas.getBoundingClientRect();
  return pixelToBoard(event.clientX - rect.left, event.clientY - rect.top, boardSize);
}

function setStatus(message, turn) {
  dom.statusText.textContent = message;
  dom.turnText.textContent = turn;
}

function showEntry() {
  activeGame = null;
  dom.entryView.hidden = false;
  dom.gameView.hidden = true;
  dom.thinkingBadge.hidden = true;
  clearResultEffect();
}

function startGame(game) {
  activeGame = game;
  dom.entryView.hidden = true;
  dom.gameView.hidden = false;
  dom.boardWrap.classList.toggle("cannon-board", game === GAME_CANNONS);
  clearResultEffect();
  ensureAudio();

  if (game === GAME_GOMOKU) {
    resetGomokuGame();
  } else {
    resetCannonGame();
  }

  resizeCanvas();
}

function restartActiveGame() {
  if (activeGame === GAME_GOMOKU) resetGomokuGame();
  if (activeGame === GAME_CANNONS) resetCannonGame();
}

function updateScore() {
  const scores = activeGame === GAME_CANNONS ? cannonScores : gomokuScores;
  dom.scoreEls.human.textContent = scores.human;
  dom.scoreEls.computer.textContent = scores.computer;
  dom.scoreEls.draw.textContent = scores.draw;
}

function updateButtons() {
  if (activeGame === GAME_CANNONS) {
    dom.undoMoveButton.disabled =
      cannonComputerThinking || cannonGameOver || cannonMoveHistory.length === 0;
    dom.difficultySelect.disabled = cannonComputerThinking;
    dom.sideSelect.disabled = cannonComputerThinking;
    dom.thinkingBadge.hidden = !cannonComputerThinking;
    return;
  }

  dom.undoMoveButton.disabled =
    gomokuComputerThinking || gomokuGameOver || gomokuMoveHistory.length === 0;
  dom.difficultySelect.disabled = gomokuComputerThinking;
  dom.sideSelect.disabled = false;
  dom.thinkingBadge.hidden = !gomokuComputerThinking;
}

function drawActiveBoard() {
  if (activeGame === GAME_CANNONS) {
    drawCannonBoard();
  } else if (activeGame === GAME_GOMOKU) {
    drawGomokuBoard();
  }
}

function clearResultEffect() {
  if (resultEffectTimer) {
    window.clearTimeout(resultEffectTimer);
    resultEffectTimer = null;
  }
  dom.resultEffect.hidden = true;
  dom.resultEffect.className = "result-effect";
  dom.resultTitle.textContent = "";
  dom.resultDetail.textContent = "";
  dom.boardWrap.classList.remove("result-win", "result-loss", "result-draw");
}

function showResultEffect(outcome, title, detail) {
  clearResultEffect();
  dom.resultEffect.classList.add(outcome);
  dom.resultTitle.textContent = title;
  dom.resultDetail.textContent = detail;
  dom.resultEffect.hidden = false;
  dom.boardWrap.classList.add(`result-${outcome}`);
  playResultSound(outcome);

  resultEffectTimer = window.setTimeout(() => {
    dom.boardWrap.classList.remove("result-win", "result-loss", "result-draw");
    resultEffectTimer = null;
  }, 1600);
}

function ensureAudio() {
  if (!audio.musicOn) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!audio.context) {
    audio.context = new AudioContextClass();
  }
  if (audio.context.state === "suspended") {
    audio.context.resume();
  }
  startBackgroundMusic();
  syncSoundButton();
}

function startBackgroundMusic() {
  if (!audio.context || audio.musicTimer || !audio.musicOn) return;
  playMusicNote();
  audio.musicTimer = window.setInterval(playMusicNote, 720);
}

function stopBackgroundMusic() {
  if (!audio.musicTimer) return;
  window.clearInterval(audio.musicTimer);
  audio.musicTimer = null;
}

function playMusicNote() {
  if (!audio.context || !audio.musicOn) return;
  const melody = [196, 246.94, 293.66, 246.94, 220, 261.63, 329.63, 261.63];
  const bass = [98, 123.47, 110, 130.81];
  const frequency = melody[audio.musicStep % melody.length];
  const bassFrequency = bass[Math.floor(audio.musicStep / 2) % bass.length];
  playTone(frequency, 0.42, "sine", 0.022);
  if (audio.musicStep % 2 === 0) {
    playTone(bassFrequency, 0.62, "triangle", 0.012);
  }
  audio.musicStep += 1;
}

function playMoveSound(kind = "stone", capture = false) {
  if (!audio.musicOn) return;
  ensureAudio();
  if (!audio.context) return;

  if (kind === "cannon") {
    playCannonMoveSound(capture);
    return;
  }

  if (kind === "soldier") {
    playSoldierMoveSound();
    return;
  }

  playStoneMoveSound();
}

function playStoneMoveSound() {
  playTone(330, 0.08, "sine", 0.065);
  playTone(220, 0.1, "triangle", 0.048, 0.06);
}

function playSoldierMoveSound() {
  playTone(523.25, 0.045, "square", 0.032);
  playTone(392, 0.06, "triangle", 0.042, 0.045);
  playTone(261.63, 0.07, "sine", 0.024, 0.11);
}

function playCannonMoveSound(capture) {
  playTone(130.81, 0.1, "sawtooth", 0.07);
  playTone(196, 0.15, "triangle", 0.055, 0.055);
  playNoiseBurst(capture ? 0.22 : 0.09, capture ? 0.095 : 0.035, capture ? 0.02 : 0);
  if (capture) {
    playTone(392, 0.1, "triangle", 0.086, 0.09);
    playTone(587.33, 0.18, "sine", 0.07, 0.17);
  }
}

function playResultSound(outcome) {
  if (!audio.musicOn) return;
  ensureAudio();
  if (!audio.context) return;

  if (outcome === "win") {
    [392, 493.88, 587.33, 783.99].forEach((frequency, index) => {
      playTone(frequency, 0.18, "triangle", 0.07, index * 0.1);
    });
    playNoiseBurst(0.18, 0.035, 0.34);
    return;
  }

  if (outcome === "loss") {
    [329.63, 246.94, 196, 146.83].forEach((frequency, index) => {
      playTone(frequency, 0.22, "sawtooth", 0.045, index * 0.12);
    });
    playNoiseBurst(0.28, 0.035, 0.04);
    return;
  }

  [293.66, 349.23, 293.66].forEach((frequency, index) => {
    playTone(frequency, 0.16, "sine", 0.045, index * 0.12);
  });
}

function playTone(frequency, duration, type, volume, delay = 0) {
  if (!audio.context) return;
  const now = audio.context.currentTime + delay;
  const oscillator = audio.context.createOscillator();
  const gain = audio.context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain);
  gain.connect(audio.context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);
}

function playNoiseBurst(duration, volume, delay = 0) {
  if (!audio.context) return;
  const sampleRate = audio.context.sampleRate;
  const frameCount = Math.max(1, Math.floor(sampleRate * duration));
  const buffer = audio.context.createBuffer(1, frameCount, sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i += 1) {
    output[i] = (Math.random() * 2 - 1) * (1 - i / frameCount);
  }

  const now = audio.context.currentTime + delay;
  const source = audio.context.createBufferSource();
  const gain = audio.context.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(gain);
  gain.connect(audio.context.destination);
  source.start(now);
  source.stop(now + duration + 0.02);
}

function toggleSound() {
  audio.musicOn = !audio.musicOn;
  if (audio.musicOn) {
    ensureAudio();
  } else {
    stopBackgroundMusic();
  }
  syncSoundButton();
}

function syncSoundButton() {
  dom.soundText.textContent = audio.musicOn ? "声音 开" : "声音 关";
}
