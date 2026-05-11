function resetGomokuGame() {
  clearResultEffect();
  dom.gameKicker.textContent = "Gomoku";
  dom.gameTitle.textContent = "五子棋";
  dom.canvas.setAttribute("aria-label", "15 路五子棋棋盘");
  dom.sideControl.hidden = true;

  gomokuBoard = createEmptyBoard(GOMOKU_SIZE);
  gomokuMoveHistory = [];
  gomokuCurrentPlayer = HUMAN;
  gomokuGameOver = false;
  gomokuComputerThinking = false;
  gomokuWinningLine = [];
  gomokuHoverPoint = null;
  setStatus("黑棋先行", "黑棋");
  renderMoves();
  updateScore();
  updateButtons();
  drawGomokuBoard();
}

function drawGomokuBoard() {
  const size = getLayoutSize(GOMOKU_SIZE);
  ctx.clearRect(0, 0, size, size);

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#e2bb6e");
  gradient.addColorStop(0.48, "#d3a04f");
  gradient.addColorStop(1, "#c98e3c");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(79, 48, 20, 0.82)";
  ctx.lineWidth = Math.max(1, cellSize * 0.024);
  ctx.beginPath();
  for (let i = 0; i < GOMOKU_SIZE; i += 1) {
    const a = boardToPixel(i, 0);
    const b = boardToPixel(i, GOMOKU_SIZE - 1);
    const c = boardToPixel(0, i);
    const d = boardToPixel(GOMOKU_SIZE - 1, i);
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(d.x, d.y);
  }
  ctx.stroke();

  drawGomokuStarPoints();
  drawGomokuHoverTarget();
  drawGomokuStones();
  drawGomokuWinningLine();
}

function drawGomokuStarPoints() {
  ctx.fillStyle = "rgba(68, 40, 16, 0.88)";
  const points = [
    [3, 3],
    [3, 7],
    [3, 11],
    [7, 3],
    [7, 7],
    [7, 11],
    [11, 3],
    [11, 7],
    [11, 11],
  ];
  for (const [row, col] of points) {
    const { x, y } = boardToPixel(row, col);
    ctx.beginPath();
    ctx.arc(x, y, Math.max(3, cellSize * 0.08), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGomokuHoverTarget() {
  if (!gomokuHoverPoint || gomokuCurrentPlayer !== HUMAN || gomokuGameOver || gomokuComputerThinking) {
    return;
  }
  if (gomokuBoard[gomokuHoverPoint.row][gomokuHoverPoint.col] !== EMPTY) return;
  const { x, y } = boardToPixel(gomokuHoverPoint.row, gomokuHoverPoint.col);
  ctx.save();
  ctx.globalAlpha = 0.36;
  drawGomokuStoneAt(x, y, HUMAN);
  ctx.restore();
}

function drawGomokuStones() {
  for (let row = 0; row < GOMOKU_SIZE; row += 1) {
    for (let col = 0; col < GOMOKU_SIZE; col += 1) {
      if (gomokuBoard[row][col] === EMPTY) continue;
      const { x, y } = boardToPixel(row, col);
      drawGomokuStoneAt(x, y, gomokuBoard[row][col]);
    }
  }

  const lastMove = gomokuMoveHistory.at(-1);
  if (lastMove) {
    const { x, y } = boardToPixel(lastMove.row, lastMove.col);
    ctx.strokeStyle = lastMove.player === HUMAN ? "#ffffff" : "#1b1a17";
    ctx.lineWidth = Math.max(2, cellSize * 0.05);
    ctx.beginPath();
    ctx.arc(x, y, cellSize * 0.16, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawGomokuStoneAt(x, y, player) {
  const radius = cellSize * 0.39;
  const gradient = ctx.createRadialGradient(
    x - radius * 0.32,
    y - radius * 0.38,
    radius * 0.1,
    x,
    y,
    radius,
  );

  if (player === HUMAN) {
    gradient.addColorStop(0, "#62605b");
    gradient.addColorStop(0.5, "#22211f");
    gradient.addColorStop(1, "#050505");
  } else {
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.58, "#efe8d8");
    gradient.addColorStop(1, "#bfb39d");
  }

  ctx.fillStyle = gradient;
  ctx.shadowColor = "rgba(22, 16, 8, 0.34)";
  ctx.shadowBlur = cellSize * 0.12;
  ctx.shadowOffsetY = cellSize * 0.08;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.strokeStyle = player === HUMAN ? "rgba(0, 0, 0, 0.56)" : "rgba(116, 102, 78, 0.56)";
  ctx.lineWidth = Math.max(1, cellSize * 0.025);
  ctx.stroke();
}

function drawGomokuWinningLine() {
  if (gomokuWinningLine.length < 2) return;
  const start = boardToPixel(gomokuWinningLine[0].row, gomokuWinningLine[0].col);
  const end = boardToPixel(gomokuWinningLine.at(-1).row, gomokuWinningLine.at(-1).col);
  ctx.strokeStyle = "rgba(177, 74, 61, 0.92)";
  ctx.lineWidth = Math.max(4, cellSize * 0.12);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

function placeGomokuMove(row, col, player) {
  if (!inBounds(row, col, GOMOKU_SIZE) || gomokuBoard[row][col] !== EMPTY || gomokuGameOver) {
    return false;
  }
  gomokuBoard[row][col] = player;
  gomokuMoveHistory.push({ row, col, player });
  playMoveSound("stone", false);
  return true;
}

function finishGomokuMove(row, col, player) {
  const result = getGomokuWinResult(gomokuBoard, row, col, player);
  if (result.won) {
    gomokuGameOver = true;
    gomokuWinningLine = result.line;
    if (player === HUMAN) {
      gomokuScores.human += 1;
      setStatus("你赢了", "终局");
      showResultEffect("win", "胜利", "五子连珠");
    } else {
      gomokuScores.computer += 1;
      setStatus("电脑赢了", "终局");
      showResultEffect("loss", "失败", "电脑完成连五");
    }
    updateScore();
    updateButtons();
    drawGomokuBoard();
    return;
  }

  if (gomokuMoveHistory.length === GOMOKU_CELL_COUNT) {
    gomokuGameOver = true;
    gomokuScores.draw += 1;
    setStatus("平局", "终局");
    showResultEffect("draw", "平局", "棋盘已满");
    updateScore();
    updateButtons();
    drawGomokuBoard();
    return;
  }

  gomokuCurrentPlayer = player === HUMAN ? COMPUTER : HUMAN;
  updateGomokuStatusForTurn();
  drawGomokuBoard();

  if (gomokuCurrentPlayer === COMPUTER) {
    queueGomokuComputerMove();
  }
}

function getGomokuWinResult(targetBoard, row, col, player) {
  for (const [dr, dc] of LINE_DIRECTIONS) {
    const line = [{ row, col }];
    let r = row + dr;
    let c = col + dc;
    while (inBounds(r, c, GOMOKU_SIZE) && targetBoard[r][c] === player) {
      line.push({ row: r, col: c });
      r += dr;
      c += dc;
    }

    r = row - dr;
    c = col - dc;
    while (inBounds(r, c, GOMOKU_SIZE) && targetBoard[r][c] === player) {
      line.unshift({ row: r, col: c });
      r -= dr;
      c -= dc;
    }

    if (line.length >= 5) {
      return { won: true, line: line.slice(0, 5) };
    }
  }
  return { won: false, line: [] };
}

function queueGomokuComputerMove() {
  gomokuComputerThinking = true;
  updateButtons();
  setTimeout(() => {
    const move = chooseGomokuComputerMove(dom.difficultySelect.value);
    gomokuComputerThinking = false;

    if (!move || gomokuGameOver || activeGame !== GAME_GOMOKU) {
      updateButtons();
      return;
    }

    placeGomokuMove(move.row, move.col, COMPUTER);
    finishGomokuMove(move.row, move.col, COMPUTER);
    renderMoves();
    updateButtons();
  }, 260);
}

function chooseGomokuComputerMove(difficulty) {
  if (gomokuMoveHistory.length === 0) {
    return { row: 7, col: 7 };
  }

  if (difficulty === "easy") {
    return chooseGomokuEasyMove();
  }

  if (difficulty === "madness") {
    return chooseGomokuMadnessMove();
  }

  return chooseGomokuHardMove();
}

function chooseGomokuEasyMove() {
  const seed = Date.now() + gomokuMoveHistory.length * 97;
  const rng = createRng(seed);
  const tactical =
    findGomokuImmediateWin(gomokuBoard, COMPUTER) ||
    (rng() < 0.48 ? findGomokuImmediateWin(gomokuBoard, HUMAN) : null);
  if (tactical) return tactical;

  const candidates = getGomokuCandidateMoves(gomokuBoard, 2);
  if (candidates.length === 0) return gomokuCenterMove();

  candidates.sort((a, b) => {
    const centerBiasA = 10 - gomokuDistanceFromCenter(a);
    const centerBiasB = 10 - gomokuDistanceFromCenter(b);
    return centerBiasB + rng() * 5 - (centerBiasA + rng() * 5);
  });

  const pool = candidates.slice(0, Math.min(18, candidates.length));
  return pool[Math.floor(rng() * pool.length)];
}

function chooseGomokuHardMove() {
  const win = findGomokuImmediateWin(gomokuBoard, COMPUTER);
  if (win) return win;

  const block = findGomokuImmediateWin(gomokuBoard, HUMAN);
  if (block) return block;

  const forcingMove = findGomokuBestThreatMove(gomokuBoard, COMPUTER, 120000);
  if (forcingMove) return forcingMove;

  return chooseGomokuBestByEvaluation(gomokuBoard, COMPUTER, 12, false).move || gomokuCenterMove();
}

function chooseGomokuMadnessMove() {
  const win = findGomokuImmediateWin(gomokuBoard, COMPUTER);
  if (win) return win;

  const block = findGomokuImmediateWin(gomokuBoard, HUMAN);
  if (block) return block;

  const doubleThreat = findGomokuBestThreatMove(gomokuBoard, COMPUTER, 70000);
  if (doubleThreat) return doubleThreat;

  const mustBlock = findGomokuBestThreatMove(gomokuBoard, HUMAN, 90000);
  if (mustBlock) return mustBlock;

  const primary = chooseGomokuBestByEvaluation(gomokuBoard, COMPUTER, 10, true);
  return primary.move || gomokuCenterMove();
}

function findGomokuImmediateWin(targetBoard, player) {
  const candidates = getGomokuCandidateMoves(targetBoard, 1);
  for (const move of candidates) {
    targetBoard[move.row][move.col] = player;
    const won = getGomokuWinResult(targetBoard, move.row, move.col, player).won;
    targetBoard[move.row][move.col] = EMPTY;
    if (won) return move;
  }
  return null;
}

function findGomokuBestThreatMove(targetBoard, player, threshold) {
  const opponent = player === HUMAN ? COMPUTER : HUMAN;
  let bestMove = null;
  let bestScore = -Infinity;

  for (const move of getGomokuCandidateMoves(targetBoard, 1)) {
    targetBoard[move.row][move.col] = player;
    const ownScore = evaluateGomokuPoint(targetBoard, move.row, move.col, player);
    targetBoard[move.row][move.col] = opponent;
    const opponentRisk = evaluateGomokuPoint(targetBoard, move.row, move.col, opponent) * 0.18;
    targetBoard[move.row][move.col] = EMPTY;
    const total = ownScore + opponentRisk - gomokuDistanceFromCenter(move) * 3;
    if (total > bestScore) {
      bestScore = total;
      bestMove = move;
    }
  }

  return bestScore >= threshold ? bestMove : null;
}

function chooseGomokuBestByEvaluation(targetBoard, player, candidateLimit, useLookAhead) {
  const opponent = player === HUMAN ? COMPUTER : HUMAN;
  const candidates = getGomokuCandidateMoves(targetBoard, 2)
    .map((move) => ({
      ...move,
      baseScore: scoreGomokuCandidate(targetBoard, move, player),
    }))
    .sort((a, b) => b.baseScore - a.baseScore)
    .slice(0, candidateLimit);

  let best = { move: null, score: -Infinity };

  for (const move of candidates) {
    targetBoard[move.row][move.col] = player;
    let score =
      evaluateGomokuBoard(targetBoard, player) - evaluateGomokuBoard(targetBoard, opponent) * 0.92;

    if (useLookAhead) {
      const reply = chooseGomokuOpponentReply(targetBoard, opponent, 8);
      if (reply.move) {
        targetBoard[reply.move.row][reply.move.col] = opponent;
        score = Math.min(
          score,
          evaluateGomokuBoard(targetBoard, player) -
            evaluateGomokuBoard(targetBoard, opponent) * 1.08,
        );
        targetBoard[reply.move.row][reply.move.col] = EMPTY;
      }
    }

    targetBoard[move.row][move.col] = EMPTY;

    if (score > best.score) {
      best = { move, score };
    }
  }

  return best;
}

function chooseGomokuOpponentReply(targetBoard, player, candidateLimit) {
  const win = findGomokuImmediateWin(targetBoard, player);
  if (win) return { move: win, score: Infinity };

  return chooseGomokuBestByEvaluationShallow(targetBoard, player, candidateLimit);
}

function chooseGomokuBestByEvaluationShallow(targetBoard, player, candidateLimit) {
  const candidates = getGomokuCandidateMoves(targetBoard, 2)
    .map((move) => ({
      move,
      score: scoreGomokuCandidate(targetBoard, move, player),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, candidateLimit);

  return candidates[0] || { move: null, score: -Infinity };
}

function scoreGomokuCandidate(targetBoard, move, player) {
  const opponent = player === HUMAN ? COMPUTER : HUMAN;
  targetBoard[move.row][move.col] = player;
  const attack = evaluateGomokuPoint(targetBoard, move.row, move.col, player);
  targetBoard[move.row][move.col] = EMPTY;

  targetBoard[move.row][move.col] = opponent;
  const defense = evaluateGomokuPoint(targetBoard, move.row, move.col, opponent);
  targetBoard[move.row][move.col] = EMPTY;

  return attack * 1.16 + defense * 1.02 - gomokuDistanceFromCenter(move) * 4;
}

function evaluateGomokuBoard(targetBoard, player) {
  let score = 0;
  const seen = new Set();

  for (let row = 0; row < GOMOKU_SIZE; row += 1) {
    for (let col = 0; col < GOMOKU_SIZE; col += 1) {
      if (targetBoard[row][col] !== player) continue;
      for (const [dr, dc] of LINE_DIRECTIONS) {
        const prevRow = row - dr;
        const prevCol = col - dc;
        if (
          inBounds(prevRow, prevCol, GOMOKU_SIZE) &&
          targetBoard[prevRow][prevCol] === player
        ) {
          continue;
        }
        const key = `${row},${col},${dr},${dc}`;
        if (seen.has(key)) continue;
        seen.add(key);
        score += evaluateGomokuLine(targetBoard, row, col, dr, dc, player);
      }
    }
  }

  return score;
}

function evaluateGomokuPoint(targetBoard, row, col, player) {
  let total = 0;
  for (const [dr, dc] of LINE_DIRECTIONS) {
    total += evaluateGomokuPointDirection(targetBoard, row, col, dr, dc, player);
  }
  return total;
}

function evaluateGomokuPointDirection(targetBoard, row, col, dr, dc, player) {
  let count = 1;
  let openEnds = 0;
  let gapBonus = 0;

  let r = row + dr;
  let c = col + dc;
  while (inBounds(r, c, GOMOKU_SIZE) && targetBoard[r][c] === player) {
    count += 1;
    r += dr;
    c += dc;
  }
  if (inBounds(r, c, GOMOKU_SIZE) && targetBoard[r][c] === EMPTY) {
    openEnds += 1;
    if (inBounds(r + dr, c + dc, GOMOKU_SIZE) && targetBoard[r + dr][c + dc] === player) {
      gapBonus += 1;
    }
  }

  r = row - dr;
  c = col - dc;
  while (inBounds(r, c, GOMOKU_SIZE) && targetBoard[r][c] === player) {
    count += 1;
    r -= dr;
    c -= dc;
  }
  if (inBounds(r, c, GOMOKU_SIZE) && targetBoard[r][c] === EMPTY) {
    openEnds += 1;
    if (inBounds(r - dr, c - dc, GOMOKU_SIZE) && targetBoard[r - dr][c - dc] === player) {
      gapBonus += 1;
    }
  }

  return gomokuShapeScore(count, openEnds, gapBonus);
}

function evaluateGomokuLine(targetBoard, row, col, dr, dc, player) {
  let count = 0;
  let r = row;
  let c = col;
  while (inBounds(r, c, GOMOKU_SIZE) && targetBoard[r][c] === player) {
    count += 1;
    r += dr;
    c += dc;
  }

  let openEnds = 0;
  if (inBounds(r, c, GOMOKU_SIZE) && targetBoard[r][c] === EMPTY) openEnds += 1;
  const backRow = row - dr;
  const backCol = col - dc;
  if (inBounds(backRow, backCol, GOMOKU_SIZE) && targetBoard[backRow][backCol] === EMPTY) {
    openEnds += 1;
  }

  return gomokuShapeScore(count, openEnds, 0);
}

function gomokuShapeScore(count, openEnds, gapBonus) {
  if (count >= 5) return 10000000;
  if (count === 4 && openEnds === 2) return 900000;
  if (count === 4 && openEnds === 1) return 150000;
  if (count === 3 && openEnds === 2) return 65000 + gapBonus * 12000;
  if (count === 3 && openEnds === 1) return 8000 + gapBonus * 2500;
  if (count === 2 && openEnds === 2) return 2800 + gapBonus * 800;
  if (count === 2 && openEnds === 1) return 520 + gapBonus * 200;
  if (count === 1 && openEnds === 2) return 70;
  return 10;
}

function getGomokuCandidateMoves(targetBoard, radius) {
  const hasMoves = targetBoard.some((row) => row.some(Boolean));
  if (!hasMoves) return [gomokuCenterMove(targetBoard)];

  const candidateMap = new Map();
  for (let row = 0; row < GOMOKU_SIZE; row += 1) {
    for (let col = 0; col < GOMOKU_SIZE; col += 1) {
      if (targetBoard[row][col] === EMPTY) continue;
      for (let dr = -radius; dr <= radius; dr += 1) {
        for (let dc = -radius; dc <= radius; dc += 1) {
          if (dr === 0 && dc === 0) continue;
          const nextRow = row + dr;
          const nextCol = col + dc;
          if (
            !inBounds(nextRow, nextCol, GOMOKU_SIZE) ||
            targetBoard[nextRow][nextCol] !== EMPTY
          ) {
            continue;
          }
          candidateMap.set(`${nextRow},${nextCol}`, { row: nextRow, col: nextCol });
        }
      }
    }
  }

  return [...candidateMap.values()].sort(
    (a, b) => gomokuDistanceFromCenter(a) - gomokuDistanceFromCenter(b),
  );
}

function gomokuDistanceFromCenter(move) {
  return Math.abs(move.row - 7) + Math.abs(move.col - 7);
}

function gomokuCenterMove(targetBoard = gomokuBoard) {
  if (targetBoard[7][7] === EMPTY) return { row: 7, col: 7 };
  const candidates = getGomokuCandidateMoves(targetBoard, 1);
  return candidates[0] || null;
}

function handleGomokuClick(event) {
  if (gomokuGameOver || gomokuCurrentPlayer !== HUMAN || gomokuComputerThinking) return;
  const point = getCanvasPoint(event, GOMOKU_SIZE);
  if (!point || gomokuBoard[point.row][point.col] !== EMPTY) return;

  placeGomokuMove(point.row, point.col, HUMAN);
  finishGomokuMove(point.row, point.col, HUMAN);
  renderMoves();
  updateButtons();
}

function updateGomokuStatusForTurn() {
  if (gomokuGameOver) return;
  if (gomokuCurrentPlayer === HUMAN) {
    setStatus("轮到你", "黑棋");
  } else {
    setStatus("电脑落子", "白棋");
  }
}

function undoGomokuMove() {
  if (gomokuComputerThinking || gomokuGameOver || gomokuMoveHistory.length === 0) return;

  const last = gomokuMoveHistory.pop();
  gomokuBoard[last.row][last.col] = EMPTY;

  if (last.player === COMPUTER && gomokuMoveHistory.length > 0) {
    const humanMove = gomokuMoveHistory.pop();
    gomokuBoard[humanMove.row][humanMove.col] = EMPTY;
  }

  gomokuCurrentPlayer = HUMAN;
  updateGomokuStatusForTurn();
  renderMoves();
  updateButtons();
  drawGomokuBoard();
}
