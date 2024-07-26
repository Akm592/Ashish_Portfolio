import React, { useRef, useEffect, useState, useCallback } from "react";

const FlappyBirdGame = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const canvasWidth = screenWidth < 768 ? 400 : 800;
  const canvasHeight = screenHeight < 768 ? 300 : 600;

  const canvasRef = useRef(null);
  const gameRef = useRef({
    birdY: 0,
    birdVelocity: 0,
    pipes: [],
    score: 0,
    gameOver: false,
    gameStarted: false,
  });

  const [, forceUpdate] = useState({});

  const updateScore = useCallback(() => {
    gameRef.current.score += 1;
    forceUpdate({});
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationFrameId;

    const birdSize = 30;
    const gravity = 0.25;
    const jumpStrength = -4.5;
    const pipeWidth = 60;
    const pipeGap = 180;
    const gameSpeed = 2;

    const skyColor = "#87CEEB";
    const birdColor = "#FFFF00";
    const pipeColor = "#2ECC71";

    const createPipe = () => {
      const minHeight = 50;
      const maxHeight = canvas.height - pipeGap - minHeight;
      const pipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;
      return {
        x: canvas.width,
        topHeight: pipeHeight,
        bottomY: pipeHeight + pipeGap,
        scored: false,
      };
    };

    const initializePipes = () => {
      const pipes = [];
      const pipeDistance = 300;
      const numInitialPipes = Math.ceil(canvas.width / pipeDistance) + 1;
      for (let i = 0; i < numInitialPipes; i++) {
        pipes.push({
          ...createPipe(),
          x: canvas.width + i * pipeDistance,
        });
      }
      return pipes;
    };

    const drawBird = () => {
      ctx.fillStyle = birdColor;
      ctx.beginPath();
      ctx.arc(100, gameRef.current.birdY, birdSize / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(110, gameRef.current.birdY - 5, 5, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawPipes = () => {
      ctx.fillStyle = pipeColor;
      gameRef.current.pipes.forEach((pipe) => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(
          pipe.x,
          pipe.bottomY,
          pipeWidth,
          canvas.height - pipe.bottomY
        );
      });
    };

    const updateGame = () => {
      const game = gameRef.current;
      if (!game.gameStarted || game.gameOver) return;

      game.birdVelocity += gravity;
      game.birdY += game.birdVelocity;

      game.pipes.forEach((pipe, index) => {
        pipe.x -= gameSpeed;

        if (
          100 < pipe.x + pipeWidth &&
          100 + birdSize > pipe.x &&
          (game.birdY - birdSize / 2 < pipe.topHeight ||
            game.birdY + birdSize / 2 > pipe.bottomY)
        ) {
          game.gameOver = true;
          forceUpdate({});
        }

        if (!pipe.scored && pipe.x + pipeWidth < 100) {
          pipe.scored = true;
          updateScore();
        }

        if (pipe.x + pipeWidth < 0) {
          const lastPipe = game.pipes[game.pipes.length - 1];
          game.pipes[index] = {
            ...createPipe(),
            x: lastPipe.x + 300,
          };
        }
      });

      if (
        game.birdY > canvas.height - birdSize / 2 ||
        game.birdY < birdSize / 2
      ) {
        game.gameOver = true;
        forceUpdate({});
      }
    };

    const drawGame = () => {
      ctx.fillStyle = skyColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawPipes();
      drawBird();

      ctx.fillStyle = "white";
      ctx.font = "bold 24px Arial";
      ctx.fillText(`Score: ${gameRef.current.score}`, 10, 30);

      if (!gameRef.current.gameStarted) {
        ctx.fillStyle = "black";
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";
       ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.textAlign = "left";
      }

      if (gameRef.current.gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 50);
        ctx.fillText(
          `Final Score: ${gameRef.current.score}`,
          canvas.width / 2,
          canvas.height / 2
        );
        ctx.fillText(
          "Tap or Press Space to Restart",
          canvas.width / 2,
          canvas.height / 2 + 50
        );
        ctx.textAlign = "left";
      }
    };

    const gameLoop = () => {
      updateGame();
      drawGame();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    const handleInput = () => {
      const game = gameRef.current;
      if (!game.gameStarted) {
        game.gameStarted = true;
        game.pipes = initializePipes();
        forceUpdate({});
      } else if (game.gameOver) {
        game.gameOver = false;
        game.score = 0;
        game.birdY = canvas.height / 2;
        game.birdVelocity = 0;
        game.pipes = initializePipes();
        forceUpdate({});
      } else {
        game.birdVelocity = jumpStrength;
      }
    };

    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleInput();
      }
    };

    const handleTouch = (e) => {
      e.preventDefault();
      handleInput();
    };

    gameRef.current = {
      ...gameRef.current,
      birdY: canvas.height / 2,
      pipes: initializePipes(),
    };

    window.addEventListener("keydown", handleKeyPress);
    canvas.addEventListener("touchstart", handleTouch);
    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      canvas.removeEventListener("touchstart", handleTouch);
      cancelAnimationFrame(animationFrameId);
    };
  }, [updateScore]);

  return (
    <div className="flex justify-center items-center h-screen">
      {canvasWidth && canvasHeight && (
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border-4 border-black rounded-lg"
        />
      )}
    </div>
  );
};

export default FlappyBirdGame;