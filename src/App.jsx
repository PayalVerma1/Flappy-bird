import React, { useEffect, useState, useCallback } from "react";
import bg from "./assets/flappy.png";
import bird from "./assets/bird.png";
import pipee from "./assets/pipe.png";

const App = () => {
  const Game_width = 400;
  const Game_height = 600;
  const gravity = 8;
  const bird_width = 40;
  const bird_height = 30;
  const pipe_width = 60;
  const pipe_gap = 200;
  const jump = -90;

  const [birdpos, setBirdpos] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generatePipe = useCallback(() => {
    const topHeight =
      Math.floor(Math.random() * (Game_height - pipe_gap - 100)) + 50;
    return {
      x: Game_width,
      topHeight,
      bottomHeight: Game_height - topHeight - pipe_gap,
      passed: false,
    };
  }, []);

  const checkCollision = useCallback((birdY, pipes) => {
    if (birdY > Game_height - bird_height + 25) {
      return true;
    }

    if (birdY < 0) {
      return true;
    }

    for (let pipe of pipes) {
      if (pipe.x <= bird_width && pipe.x + pipe_width >= 0) {
        if (birdY <= pipe.topHeight) {
          return true;
        }

        if (birdY + bird_height >= Game_height - pipe.bottomHeight) {
          return true;
        }
      }
    }
    return false;
  }, []);

  const resetGame = () => {
    setBirdpos(250);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameloop = setInterval(() => {
      setBirdpos((prev) => {
        const newpos = prev + gravity;

        if (checkCollision(newpos, pipes)) {
          setGameOver(true);
          clearInterval(gameloop);
          return prev;
        }

        if (newpos > Game_height - bird_height + 25) {
          return Game_height - bird_height + 25;
        }
        if (newpos < 0) {
          return 0;
        }
        return newpos;

      });

      setPipes((prevPipes) => {
        const updatedPipes = prevPipes
          .map((pipe) => {
            if (!pipe.passed && pipe.x + pipe_width < bird_width) {
              setScore((prevScore) => prevScore + 1);
              pipe.passed = true;
            }
            return { ...pipe, x: pipe.x - 5 };
          })
          .filter((pipe) => pipe.x + pipe_width > 0);

        if (
          prevPipes.length === 0 ||
          prevPipes[prevPipes.length - 1].x < Game_width - 200
        ) {
          return [...updatedPipes, generatePipe()];
        }

        return updatedPipes;
      });
    }, 30);

    return () => clearInterval(gameloop);
  }, [gameStarted, pipes, generatePipe, checkCollision, gameOver]);

  const handleStart = () => {
    if (gameOver) {
      resetGame();
    }
    setGameStarted(true);
  };

  const handleJump = () => {
    if (gameStarted && !gameOver) {
      setBirdpos((prev) => prev + jump);
    }
  };

  return (
    <>
      <main
        className="relative bg-neutral-900 h-screen w-screen flex justify-center items-center overflow-hidden"
        onClick={handleJump}
      >
        <div className="relative h-screen w-full max-w-md border-2 overflow-hidden">
          <img
            src={bg}
            alt="Background"
            className="absolute z-0 h-full w-full"
          />

          {pipes.map((pipe, index) => (
            <div key={index}>
              <img
                src={pipee}
                alt="Top Pipe"
                className="absolute z-10 rotate-180"
                style={{
                  width: `${pipe_width}px`,
                  height: `${pipe.topHeight}px`,
                  left: `${pipe.x}px`,
                  top: 0,
                }}
              />

              <img
                src={pipee}
                alt="Bottom Pipe"
                className="absolute z-10"
                style={{
                  width: `${pipe_width}px`,
                  height: `${pipe.bottomHeight}px`,
                  left: `${pipe.x}px`,
                  bottom: 0,
                }}
              />
            </div>
          ))}

          <img
            src={bird}
            alt="Bird"
            className="absolute z-20"
            style={{
              width: `${bird_width}px`,
              height: `${bird_height}px`,
              top: `${birdpos}px`,
              left: `${bird_width}px`,
            }}
          />

          <div className="absolute z-30 top-4 left-0 right-0 text-center text-white text-4xl font-bold">
            {score}
          </div>

          {(!gameStarted || gameOver) && (
            <div
              className="absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl p-4 font-semibold text-white bg-black bg-opacity-70 text-2xl cursor-pointer text-center"
              onClick={handleStart}
            >
              {gameOver ? (
                <div>
                  <div>GAME OVER</div>
                  <div className="text-xl mt-2">Score: {score}</div>
                  <div className="mt-4 text-lg">CLICK TO RESTART</div>
                </div>
              ) : (
                "CLICK TO START"
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default App;
