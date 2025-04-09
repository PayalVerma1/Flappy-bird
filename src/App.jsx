import React from "react";
import bg from "./assets/flappy.png";
import bird from "./assets/bird.png";
import pipee from "./assets/pipe.png";
import { useEffect } from "react";
import { useState } from "react";

const App = () => {
  const Game_width = 400;
  const Game_height = 600;
  const gravity = 8;
  const bird_width = 40;
  const bird_height = 30;
  const pipe_width = 50;
  const pipe_height = 300;
  const gap = 30;
  const jump = -90;
  const [birdy, setBirdy] = useState(300);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const [pipe, setpipe] = useState({
    x: 30,
    y: 50,
  });
  const [birdpos, setBirdpos] = useState(300);
  const [birdVelocity, setBirdVelocity] = useState(0);

  useEffect(() => {
    const gameloop = () => {
      setBirdpos((prev) => {
        let newpos = prev + gravity; 
        if (newpos > Game_height - bird_height) {
          return Game_height;
        }
        if (newpos < 0) {
          return 0;
        }
        return newpos;
      });
    };
    const interval = setInterval(gameloop, 30);
    return () => clearInterval(interval);
  }, []);
  const handle = () => {
    setBirdpos((newpos) => newpos + jump);
  };

  return (
    <>
      <main
        className="relative bg-neutral-900 h-screen w-screen flex justify-center items-center"
        onClick={handle}
      >
        <img
          src={bg}
          alt="Background"
          className=" absolute z-0 h-screen w-sm border-2"
        />
        <img
          src={bird}
          alt=""
          className="absolute z-10 "
          style={{
            width: `${bird_width}px`,
            height: `${bird_height}px`,
            top: `${birdpos}px`,
          }}
        />
      </main>
    </>
  );
};

export default App;
