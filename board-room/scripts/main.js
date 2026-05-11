function handleBoardClick(event) {
  if (activeGame === GAME_CANNONS) {
    handleCannonClick(event);
  } else if (activeGame === GAME_GOMOKU) {
    handleGomokuClick(event);
  }
}

function handleBoardMove(event) {
  if (activeGame === GAME_CANNONS) {
    cannonHoverPoint = getCanvasPoint(event, CANNON_SIZE);
    drawCannonBoard();
    return;
  }

  if (activeGame === GAME_GOMOKU) {
    gomokuHoverPoint = getCanvasPoint(event, GOMOKU_SIZE);
    drawGomokuBoard();
  }
}

function handleBoardLeave() {
  if (activeGame === GAME_CANNONS) {
    cannonHoverPoint = null;
    drawCannonBoard();
    return;
  }

  if (activeGame === GAME_GOMOKU) {
    gomokuHoverPoint = null;
    drawGomokuBoard();
  }
}

function undoActiveMove() {
  if (activeGame === GAME_CANNONS) undoCannonMove();
  if (activeGame === GAME_GOMOKU) undoGomokuMove();
}

function renderMoves() {
  dom.moveList.innerHTML = "";
  const history = activeGame === GAME_CANNONS ? cannonMoveHistory : gomokuMoveHistory;
  const recent = history.slice(-30);

  for (const move of recent) {
    const item = document.createElement("li");
    if (activeGame === GAME_CANNONS) {
      const role = move.player === CANNON ? "炮" : "兵";
      const verb = move.capture ? "吃" : "走";
      item.textContent = `${role} ${move.fromRow + 1},${move.fromCol + 1} ${verb} ${
        move.toRow + 1
      },${move.toCol + 1}`;
    } else {
      const role = move.player === HUMAN ? "黑" : "白";
      item.textContent = `${role} ${move.row + 1}, ${move.col + 1}`;
    }
    dom.moveList.appendChild(item);
  }
  dom.moveList.scrollTop = dom.moveList.scrollHeight;
}

function runSelfTests() {
  const testBoard = createEmptyBoard(GOMOKU_SIZE);
  for (let col = 3; col < 8; col += 1) testBoard[6][col] = HUMAN;
  console.assert(getGomokuWinResult(testBoard, 6, 5, HUMAN).won, "horizontal win");

  const blockBoard = createEmptyBoard(GOMOKU_SIZE);
  for (let col = 4; col < 8; col += 1) blockBoard[8][col] = HUMAN;
  const block = findGomokuImmediateWin(blockBoard, HUMAN);
  console.assert(block && block.row === 8 && (block.col === 3 || block.col === 8), "find block");

  const aiBoard = createEmptyBoard(GOMOKU_SIZE);
  aiBoard[7][7] = COMPUTER;
  aiBoard[7][8] = COMPUTER;
  aiBoard[7][9] = COMPUTER;
  aiBoard[7][10] = COMPUTER;
  const win = findGomokuImmediateWin(aiBoard, COMPUTER);
  console.assert(win && win.row === 7 && (win.col === 6 || win.col === 11), "find win");

  const cannonTestBoard = createCannonStartBoard();
  console.assert(countCannonPiece(cannonTestBoard, CANNON) === 3, "three cannons");
  console.assert(countCannonPiece(cannonTestBoard, SOLDIER) === 15, "fifteen soldiers");
  const openingCapture = getCannonMovesForPiece(cannonTestBoard, 0, 0, CANNON).find(
    (move) => move.toRow === 0 && move.toCol === 2 && move.capture,
  );
  console.assert(openingCapture, "cannon opening capture");

  const trappedBoard = createEmptyBoard(CANNON_SIZE);
  trappedBoard[2][2] = CANNON;
  trappedBoard[1][2] = SOLDIER;
  trappedBoard[2][1] = SOLDIER;
  trappedBoard[2][3] = SOLDIER;
  trappedBoard[3][2] = SOLDIER;
  console.assert(getCannonTerminalWinner(trappedBoard) === SOLDIER, "soldiers trap cannon");
}

dom.gameChoices.forEach((button) => {
  button.addEventListener("click", () => startGame(button.dataset.game));
});
dom.canvas.addEventListener("click", handleBoardClick);
dom.canvas.addEventListener("mousemove", handleBoardMove);
dom.canvas.addEventListener("mouseleave", handleBoardLeave);
dom.newGameButton.addEventListener("click", restartActiveGame);
dom.undoMoveButton.addEventListener("click", undoActiveMove);
dom.backToMenuButton.addEventListener("click", showEntry);
dom.soundToggle.addEventListener("click", toggleSound);
dom.difficultySelect.addEventListener("change", restartActiveGame);
dom.sideSelect.addEventListener("change", () => {
  if (activeGame === GAME_CANNONS) resetCannonGame();
});
window.addEventListener("resize", resizeCanvas);

runSelfTests();
syncSoundButton();
showEntry();
