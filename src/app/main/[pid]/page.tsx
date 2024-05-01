"use client";

import { useEffect, useState } from "react";
import EditScene from "./editScene";
import Timeline from "./timeline";
import axios from "axios";

export interface main {
  [key: number | string]: {
    data: number[];
    id: number;
  };
}

const lights = 24;

export { lights };

let empty: main = {};
for (let i = 1; i <= lights; i++) {
  empty[i] = {
    data: [0, 0, 0, 0, 0, 0, 0, 255],
    id: i,
  };
}

let audioMine: HTMLAudioElement;

export default function Page() {
  const [currentData, setCurrentData] = useState<main>(empty);
  const [loadEverything, setLoadEverything] = useState(false);
  const [duration, setDuration] = useState(0);
  const [pos, setPos] = useState(0);

  const [universe, setUniverse] = useState(1);

  const [selectedTime, setSelectedTime] = useState(-1);

  let changeCurrent = (x: main) => {
    setCurrentData(x);

    axios.post("/api/save", {
      body: Object.values(x),
    });
  };

  useEffect(() => {
    audioMine = new Audio();
    audioMine.src = "./testTrack.mp3";
    audioMine.load();
    let doc = document.getElementById("pos");
    let line = document.getElementById("theLine");
    if (doc) doc.innerText = audioMine.currentTime.toString();
    audioMine.addEventListener("loadedmetadata", () => {
      setDuration(audioMine.duration);
    });

    setInterval(function () {
      setPos(audioMine.currentTime);
    }, 30);

    window.addEventListener(
      "keydown",
      function (e) {
        if (
          ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
            e.code
          ) > -1
        ) {
          e.preventDefault();
        }
      },
      false
    );
  }, []);

  return (
    <div className="grid grid-rows-2 grid-cols-2 w-[100vw] h-[100vh]">
      <div className="p-2 border-2 border-neutral-700 border-solid rounded-md m-2 flex items-center justify-center flex-col">
        <h1 className="text-3xl">Main Controls</h1>
        <div className="flex flex-row items-center justify-between">
          <div className="flex-grow flex items-center justify-center flex-col space-y-8">
            <div>
              <h1 className="text-center text-lg">Track Controls</h1>
              <button
                className="bg-red-500 p-4"
                onClick={(x) => {
                  audioMine.play();
                }}
              >
                Play
              </button>
              <button
                className="bg-blue-500 p-4"
                onClick={(x) => {
                  audioMine.pause();
                }}
              >
                Pause
              </button>
              <button
                className="bg-green-500 p-4"
                onClick={(x) => {
                  audioMine.currentTime = 0;
                  audioMine.play();
                }}
              >
                Stop
              </button>
              <button
                className="bg-yellow-500 p-4"
                onClick={(x) => {
                  audioMine.currentTime = 0;
                }}
              >
                Restart
              </button>
            </div>
            <div>
              <h1 className="text-center text-lg">Queue Controls</h1>
              <button
                className="bg-blue-500 p-4"
                onClick={() => {
                  window.localStorage.setItem(
                    `timeCode_${audioMine.currentTime}`,
                    JSON.stringify({
                      time: audioMine.currentTime,
                      data: currentData,
                    })
                  );
                }}
              >
                Create New
              </button>
              <button
                className="bg-red-500 p-4"
                onClick={() => {
                  window.localStorage.removeItem(`timeCode_${selectedTime}`);
                  setPos((x) => x + 0.0001);
                }}
              >
                Delete Current
              </button>
            </div>
            <div>
              <h1 className="text-center text-lg">Song Controls</h1>
              <button
                className="bg-green-500 p-4"
                onClick={() => setLoadEverything(true)}
              >
                Load Song and Queues
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 border-2 border-neutral-700 border-solid rounded-md m-2 flex items-center justify-center flex-col">
        <h1 className="text-3xl">Edit Scene</h1>
        <div className="flex-grow flex items-center justify-center flex-col space-y-8">
          <EditScene
            selectedTime={selectedTime}
            currentSceneInfo={currentData}
            changeCurrent={changeCurrent}
          />
        </div>
      </div>

      <div className="p-2 border-2 border-neutral-700 border-solid rounded-md m-2 flex items-center justify-center flex-col col-span-2">
        <div className="flex-grow flex items-center justify-center flex-col space-y-8 w-full">
          <Timeline
            loadEverything={loadEverything}
            currentTime={pos}
            selectedTime={selectedTime}
            changeSelectedTime={(x) => setSelectedTime(x) as any}
            changeInfo={(x) => changeCurrent(x) as any}
            duration={duration}
            requestSeek={(x: number) => {
              audioMine.currentTime = x * audioMine.duration;
              console.log(x * duration, x, duration);
              setPos(x * audioMine.duration);
            }}
            left={() => {
              audioMine.currentTime -= 0.01;
              setPos(audioMine.currentTime);
            }}
            right={() => {
              audioMine.currentTime += 0.01;
              setPos(audioMine.currentTime);
            }}
          />
        </div>
      </div>
    </div>
  );
}
