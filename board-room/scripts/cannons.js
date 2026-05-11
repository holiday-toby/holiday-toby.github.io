function createCannonStartBoard() {
  const targetBoard = createEmptyBoard(CANNON_SIZE);
  for (const row of [0, 2, 4]) {
    targetBoard[row][0] = CANNON;
  }
  for (let row = 0; row < CANNON_SIZE; row += 1) {
    for (let col = 2; col < CANNON_SIZE; col += 1) {
      targetBoard[row][col] = SOLDIER;
    }
  }
  return targetBoard;
}

function resetCannonGame() {
  clearResultEffect();
  dom.gameKicker.textContent = "Cannons";
  dom.gameTitle.textContent = "三炮十五兵";
  dom.canvas.setAttribute("aria-label", "5 路三炮十五兵棋盘");
  dom.sideControl.hidden = false;

  cannonBoard = createCannonStartBoard();
  cannonMoveHistory = [];
  cannonCurrentPlayer = CANNON;
  cannonHumanSide = dom.sideSelect.value === "soldier" ? SOLDIER : CANNON;
  cannonGameOver = false;
  cannonComputerThinking = false;
  cannonSelected = null;
  cannonHoverPoint = null;
  updateCannonStatusForTurn();
  renderMoves();
  updateScore();
  updateButtons();
  drawCannonBoard();

  if (cannonCurrentPlayer !== cannonHumanSide) {
    queueCannonComputerMove();
  }
}

function drawCannonBoard() {
  const size = getLayoutSize(CANNON_SIZE);
  ctx.clearRect(0, 0, size, size);

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#d5ddbd");
  gradient.addColorStop(0.52, "#bacb9e");
  gradient.addColorStop(1, "#9fb47f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(40, 57, 34, 0.66)";
  ctx.lineWidth = Math.max(2, cellSize * 0.018);
  ctx.beginPath();
  for (let i = 0; i < CANNON_SIZE; i += 1) {
    const a = boardToPixel(i, 0);
    const b = boardToPixel(i, CANNON_SIZE - 1);
    const c = boardToPixel(0, i);
    const d = boardToPixel(CANNON_SIZE - 1, i);
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(d.x, d.y);
  }
  ctx.stroke();

  drawCannonMoveHints();
  drawCannonPieces();
  drawCannonLastMove();
}

function drawCannonMoveHints() {
  if (
    !cannonSelected ||
    cannonGameOver ||
    cannonComputerThinking ||
    cannonCurrentPlayer !== cannonHumanSide
  ) {
    return;
  }

  const moves = getCannonMovesForPiece(
    cannonBoard,
    cannonSelected.row,
    cannonSelected.col,
    cannonHumanSide,
  );

  for (const move of moves) {
    const { x, y } = boardToPixel(move.toRow, move.toCol);
    ctx.fillStyle = move.capture ? "rgba(168, 71, 61, 0.28)" : "rgba(47, 111, 115, 0.26)";
    ctx.beginPath();
    ctx.arc(x, y, cellSize * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = move.capture ? "rgba(168, 71, 61, 0.72)" : "rgba(47, 111, 115, 0.72)";
    ctx.lineWidth = Math.max(2, cellSize * 0.02);
    ctx.stroke();
  }
}

function drawCannonPieces() {
  for (let row = 0; row < CANNON_SIZE; row += 1) {
    for (let col = 0; col < CANNON_SIZE; col += 1) {
      const piece = cannonBoard[row][col];
      if (piece === EMPTY) continue;
      const { x, y } = boardToPixel(row, col);
      drawCannonPieceAt(x, y, piece);
    }
  }

  if (cannonSelected) {
    const { x, y } = boardToPixel(cannonSelected.row, cannonSelected.col);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
    ctx.lineWidth = Math.max(4, cellSize * 0.05);
    ctx.beginPath();
    ctx.arc(x, y, cellSize * 0.42, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (cannonHoverPoint && cannonCurrentPlayer === cannonHumanSide && !cannonGameOver) {
    const piece = cannonBoard[cannonHoverPoint.row][cannonHoverPoint.col];
    if (piece === cannonHumanSide) {
      const { x, y } = boardToPixel(cannonHoverPoint.row, cannonHoverPoint.col);
      ctx.strokeStyle = "rgba(27, 26, 23, 0.3)";
      ctx.lineWidth = Math.max(2, cellSize * 0.026);
      ctx.beginPath();
      ctx.arc(x, y, cellSize * 0.47, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawCannonPieceAt(x, y, piece) {
  const radius = cellSize * 0.36;
  const gradient = ctx.createRadialGradient(
    x - radius * 0.28,
    y - radius * 0.32,
    radius * 0.08,
    x,
    y,
    radius,
  );

  if (piece === CANNON) {
    gradient.addColorStop(0, "#ffe1ca");
    gradient.addColorStop(0.58, "#c95b4b");
    gradient.addColorStop(1, "#913329");
  } else {
    gradient.addColorStop(0, "#e9f2ff");
    gradient.addColorStop(0.58, "#4d78ac");
    gradient.addColorStop(1, "#24456f");
  }

  ctx.fillStyle = gradient;
  ctx.shadowColor = "rgba(22, 16, 8, 0.28)";
  ctx.shadowBlur = cellSize * 0.1;
  ctx.shadowOffsetY = cellSize * 0.06;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.strokeStyle = piece === CANNON ? "rgba(99, 28, 20, 0.56)" : "rgba(22, 54, 91, 0.58)";
  ctx.lineWidth = Math.max(2, cellSize * 0.025);
  ctx.stroke();

  ctx.fillStyle = "#fffaf2";
  ctx.font = `900 ${Math.max(20, cellSize * 0.42)}px "Noto Sans SC", "Microsoft YaHei", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(piece === CANNON ? "炮" : "兵", x, y + cellSize * 0.01);
}

function drawCannonLastMove() {
  const lastMove = cannonMoveHistory.at(-1);
  if (!lastMove) return;
  const start = boardToPixel(lastMove.fromRow, lastMove.fromCol);
  const end = boardToPixel(lastMove.toRow, lastMove.toCol);
  ctx.strokeStyle = lastMove.capture ? "rgba(168, 71, 61, 0.86)" : "rgba(31, 85, 89, 0.72)";
  ctx.lineWidth = Math.max(3, cellSize * 0.032);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  ctx.fillStyle = lastMove.capture ? "rgba(168, 71, 61, 0.18)" : "rgba(255, 255, 255, 0.26)";
  ctx.beginPath();
  ctx.arc(end.x, end.y, cellSize * 0.43, 0, Math.PI * 2);
  ctx.fill();
}

function getCannonMovesForPiece(targetBoard, row, col, player) {
  if (!inBounds(row, col, CANNON_SIZE) || targetBoard[row][col] !== player) return [];
  const moves = [];

  for (const [dr, dc] of ORTHOGONAL_DIRECTIONS) {
    const nextRow = row + dr;
    const nextCol = col + dc;
    if (inBounds(nextRow, nextCol, CANNON_SIZE) && targetBoard[nextRow][nextCol] === EMPTY) {
      moves.push({
        player,
        fromRow: row,
        fromCol: col,
        toRow: nextRow,
        toCol: nextCol,
        capture: false,
        captured: EMPTY,
      });
    }

    if (player !== CANNON) continue;
    const targetRow = row + dr * 2;
    const targetCol = col + dc * 2;
    if (
      inBounds(nextRow, nextCol, CANNON_SIZE) &&
      inBounds(targetRow, targetCol, CANNON_SIZE) &&
      targetBoard[nextRow][nextCol] === EMPTY &&
      targetBoard[targetRow][targetCol] === SOLDIER
    ) {
      moves.push({
        player,
        fromRow: row,
        fromCol: col,
        toRow: targetRow,
        toCol: targetCol,
        capture: true,
        captured: SOLDIER,
      });
    }
  }

  return moves;
}

function getCannonGameMoves(targetBoard, player) {
  const moves = [];
  for (let row = 0; row < CANNON_SIZE; row += 1) {
    for (let col = 0; col < CANNON_SIZE; col += 1) {
      if (targetBoard[row][col] === player) {
        moves.push(...getCannonMovesForPiece(targetBoard, row, col, player));
      }
    }
  }
  return moves;
}

function applyCannonMove(targetBoard, move) {
  const applied = {
    ...move,
    captured: targetBoard[move.toRow][move.toCol],
    capture: targetBoard[move.toRow][move.toCol] === SOLDIER,
  };
  targetBoard[move.fromRow][move.fromCol] = EMPTY;
  targetBoard[move.toRow][move.toCol] = move.player;
  return applied;
}

function applyCannonMoveOnClone(targetBoard, move) {
  const nextBoard = cloneBoard(targetBoard);
  applyCannonMove(nextBoard, move);
  return nextBoard;
}

function revertCannonMove(move) {
  cannonBoard[move.fromRow][move.fromCol] = move.player;
  cannonBoard[move.toRow][move.toCol] = move.captured || EMPTY;
}

function countCannonPiece(targetBoard, piece) {
  let total = 0;
  for (const row of targetBoard) {
    for (const value of row) {
      if (value === piece) total += 1;
    }
  }
  return total;
}

function otherCannonSide(player) {
  return player === CANNON ? SOLDIER : CANNON;
}

function cannonSideName(player) {
  return player === CANNON ? "炮兵" : "小兵";
}

function getCannonAiSide() {
  return otherCannonSide(cannonHumanSide);
}

function getCannonTerminalWinner(targetBoard) {
  if (countCannonPiece(targetBoard, SOLDIER) === 0) return CANNON;
  if (getCannonGameMoves(targetBoard, CANNON).length === 0) return SOLDIER;
  if (getCannonGameMoves(targetBoard, SOLDIER).length === 0) return CANNON;
  return null;
}

function makeCannonMove(move) {
  const applied = applyCannonMove(cannonBoard, move);
  cannonMoveHistory.push(applied);
  cannonSelected = null;
  playMoveSound(applied.player === CANNON ? "cannon" : "soldier", applied.capture);
  return applied;
}

function finishCannonMove(move) {
  const winner = getCannonTerminalWinner(cannonBoard);
  if (winner) {
    cannonGameOver = true;
    if (winner === cannonHumanSide) {
      cannonScores.human += 1;
      setStatus("你赢了", "终局");
      showResultEffect("win", "胜利", winner === CANNON ? "炮兵清场" : "小兵围困成功");
    } else {
      cannonScores.computer += 1;
      setStatus("电脑赢了", "终局");
      showResultEffect("loss", "失败", winner === CANNON ? "炮兵清场" : "小兵完成围困");
    }
    updateScore();
    renderMoves();
    updateButtons();
    drawCannonBoard();
    return;
  }

  cannonCurrentPlayer = otherCannonSide(move.player);
  updateCannonStatusForTurn();
  renderMoves();
  updateButtons();
  drawCannonBoard();

  if (cannonCurrentPlayer !== cannonHumanSide) {
    queueCannonComputerMove();
  }
}

function updateCannonStatusForTurn() {
  if (cannonGameOver) return;
  if (cannonCurrentPlayer === cannonHumanSide) {
    setStatus(cannonSelected ? "选择落点" : "轮到你", cannonSideName(cannonCurrentPlayer));
  } else {
    setStatus("电脑落子", cannonSideName(cannonCurrentPlayer));
  }
}

function handleCannonClick(event) {
  if (cannonGameOver || cannonComputerThinking || cannonCurrentPlayer !== cannonHumanSide) return;
  const point = getCanvasPoint(event, CANNON_SIZE);
  if (!point) return;
  const piece = cannonBoard[point.row][point.col];

  if (piece === cannonHumanSide) {
    cannonSelected = point;
    updateCannonStatusForTurn();
    drawCannonBoard();
    return;
  }

  if (!cannonSelected) return;

  const move = getCannonMovesForPiece(
    cannonBoard,
    cannonSelected.row,
    cannonSelected.col,
    cannonHumanSide,
  ).find((candidate) => candidate.toRow === point.row && candidate.toCol === point.col);

  if (!move) {
    cannonSelected = null;
    updateCannonStatusForTurn();
    drawCannonBoard();
    return;
  }

  const applied = makeCannonMove(move);
  finishCannonMove(applied);
}

function queueCannonComputerMove() {
  if (cannonGameOver || activeGame !== GAME_CANNONS) return;
  cannonComputerThinking = true;
  updateButtons();
  setTimeout(() => {
    const move = chooseCannonComputerMove(dom.difficultySelect.value);
    cannonComputerThinking = false;

    if (!move || cannonGameOver || activeGame !== GAME_CANNONS) {
      updateButtons();
      return;
    }

    const applied = makeCannonMove(move);
    finishCannonMove(applied);
    updateButtons();
  }, 320);
}

function chooseCannonComputerMove(difficulty) {
  const aiSide = getCannonAiSide();
  const moves = getCannonGameMoves(cannonBoard, aiSide);
  if (moves.length === 0) return null;

  const win = findCannonImmediateWin(cannonBoard, aiSide);
  if (win) return win;

  if (difficulty === "easy") {
    return chooseCannonEasyMove(cannonBoard, aiSide);
  }

  if (difficulty === "madness") {
    return chooseCannonBestMove(cannonBoard, aiSide, 3, 18).move || moves[0];
  }

  return chooseCannonBestMove(cannonBoard, aiSide, 1, 24).move || moves[0];
}

function chooseCannonEasyMove(targetBoard, aiSide) {
  const seed = Date.now() + cannonMoveHistory.length * 131;
  const rng = createRng(seed);
  const moves = getCannonGameMoves(targetBoard, aiSide);
  if (moves.length === 0) return null;

  const tactical = findCannonImmediateWin(targetBoard, aiSide);
  if (tactical && rng() < 0.74) return tactical;

  const ordered = orderCannonMoves(targetBoard, moves, aiSide, aiSide);
  const poolSize = Math.min(8, ordered.length);
  const pool = rng() < 0.58 ? ordered.slice(0, poolSize) : moves;
  return pool[Math.floor(rng() * pool.length)];
}

function findCannonImmediateWin(targetBoard, player) {
  const moves = orderCannonMoves(targetBoard, getCannonGameMoves(targetBoard, player), player, player);
  for (const move of moves) {
    const nextBoard = applyCannonMoveOnClone(targetBoard, move);
    if (getCannonTerminalWinner(nextBoard) === player) return move;
  }
  return null;
}

function chooseCannonBestMove(targetBoard, aiSide, depth, limit) {
  const moves = orderCannonMoves(targetBoard, getCannonGameMoves(targetBoard, aiSide), aiSide, aiSide).slice(
    0,
    limit,
  );
  let best = { move: null, score: -Infinity };

  for (const move of moves) {
    const nextBoard = applyCannonMoveOnClone(targetBoard, move);
    const score = cannonMinimax(
      nextBoard,
      otherCannonSide(aiSide),
      depth - 1,
      aiSide,
      -Infinity,
      Infinity,
    );
    if (score > best.score) {
      best = { move, score };
    }
  }

  return best;
}

function cannonMinimax(targetBoard, sideToMove, depth, aiSide, alpha, beta) {
  const winner = getCannonTerminalWinner(targetBoard);
  if (winner) {
    return winner === aiSide ? 1000000 + depth * 1000 : -1000000 - depth * 1000;
  }

  if (depth <= 0) {
    return evaluateCannonBoard(targetBoard, aiSide);
  }

  const moves = orderCannonMoves(
    targetBoard,
    getCannonGameMoves(targetBoard, sideToMove),
    sideToMove,
    aiSide,
  ).slice(0, depth >= 2 ? 18 : 24);

  if (moves.length === 0) {
    const stalledWinner = sideToMove === CANNON ? SOLDIER : CANNON;
    return stalledWinner === aiSide ? 1000000 : -1000000;
  }

  if (sideToMove === aiSide) {
    let best = -Infinity;
    for (const move of moves) {
      const nextBoard = applyCannonMoveOnClone(targetBoard, move);
      best = Math.max(
        best,
        cannonMinimax(nextBoard, otherCannonSide(sideToMove), depth - 1, aiSide, alpha, beta),
      );
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  }

  let best = Infinity;
  for (const move of moves) {
    const nextBoard = applyCannonMoveOnClone(targetBoard, move);
    best = Math.min(
      best,
      cannonMinimax(nextBoard, otherCannonSide(sideToMove), depth - 1, aiSide, alpha, beta),
    );
    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return best;
}

function orderCannonMoves(targetBoard, moves, movingSide, perspective) {
  return moves
    .map((move) => ({
      move,
      score: scoreCannonMoveOrder(targetBoard, move, movingSide, perspective),
    }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.move);
}

function scoreCannonMoveOrder(targetBoard, move, movingSide, perspective) {
  const nextBoard = applyCannonMoveOnClone(targetBoard, move);
  const winner = getCannonTerminalWinner(nextBoard);
  let score = evaluateCannonBoard(nextBoard, perspective) * (movingSide === perspective ? 1 : -1) * 0.02;
  if (winner === movingSide) score += 100000;
  if (move.capture) score += movingSide === CANNON ? 900 : 0;
  score -= Math.abs(move.toRow - 2) * 3 + Math.abs(move.toCol - 2) * 3;
  return score;
}

function evaluateCannonBoard(targetBoard, perspective) {
  const winner = getCannonTerminalWinner(targetBoard);
  if (winner) return winner === perspective ? 1000000 : -1000000;

  const soldierCount = countCannonPiece(targetBoard, SOLDIER);
  const cannonMoves = getCannonGameMoves(targetBoard, CANNON);
  const soldierMoves = getCannonGameMoves(targetBoard, SOLDIER);
  const captureMoves = cannonMoves.filter((move) => move.capture).length;
  const blockScore = getCannonBlockScore(targetBoard);
  const soldierPressure = getSoldierPressureScore(targetBoard);

  const cannonScore =
    (15 - soldierCount) * 260 + captureMoves * 360 + cannonMoves.length * 34 - blockScore * 80;
  const soldierScore =
    soldierCount * 54 +
    blockScore * 120 +
    soldierPressure * 18 +
    soldierMoves.length * 5 -
    captureMoves * 180 -
    cannonMoves.length * 32;
  const raw = cannonScore - soldierScore;
  return perspective === CANNON ? raw : -raw;
}

function getCannonBlockScore(targetBoard) {
  let score = 0;
  for (let row = 0; row < CANNON_SIZE; row += 1) {
    for (let col = 0; col < CANNON_SIZE; col += 1) {
      if (targetBoard[row][col] !== CANNON) continue;
      for (const [dr, dc] of ORTHOGONAL_DIRECTIONS) {
        const nextRow = row + dr;
        const nextCol = col + dc;
        if (!inBounds(nextRow, nextCol, CANNON_SIZE) || targetBoard[nextRow][nextCol] !== EMPTY) {
          score += 1;
        }
      }
    }
  }
  return score;
}

function getSoldierPressureScore(targetBoard) {
  const cannons = [];
  for (let row = 0; row < CANNON_SIZE; row += 1) {
    for (let col = 0; col < CANNON_SIZE; col += 1) {
      if (targetBoard[row][col] === CANNON) cannons.push({ row, col });
    }
  }

  let score = 0;
  for (let row = 0; row < CANNON_SIZE; row += 1) {
    for (let col = 0; col < CANNON_SIZE; col += 1) {
      if (targetBoard[row][col] !== SOLDIER) continue;
      const nearest = cannons.reduce((best, cannon) => {
        const distance = Math.abs(cannon.row - row) + Math.abs(cannon.col - col);
        return Math.min(best, distance);
      }, Infinity);
      score += Math.max(0, 6 - nearest);
    }
  }
  return score;
}

function undoCannonMove() {
  if (cannonComputerThinking || cannonGameOver || cannonMoveHistory.length === 0) return;

  const aiSide = getCannonAiSide();
  let last = cannonMoveHistory.pop();
  revertCannonMove(last);

  if (last.player === aiSide && cannonMoveHistory.length > 0) {
    last = cannonMoveHistory.pop();
    revertCannonMove(last);
  }

  cannonSelected = null;
  cannonCurrentPlayer = cannonHumanSide;
  updateCannonStatusForTurn();
  renderMoves();
  updateButtons();
  drawCannonBoard();

  if (cannonMoveHistory.length === 0 && cannonHumanSide === SOLDIER) {
    cannonCurrentPlayer = CANNON;
    updateCannonStatusForTurn();
    queueCannonComputerMove();
  }
}
