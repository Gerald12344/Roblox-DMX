import { SetStateAction } from "react";
import { main } from "./page";

export default function ProjectControls({
  audioMine,
  currentData,
  setLoadEverything,
  setPos,
  selectedTime,
}: {
  audioMine: HTMLAudioElement;
  currentData: main;
  setLoadEverything: (value: SetStateAction<boolean>) => void;
  setPos: (value: SetStateAction<number>) => void;
  selectedTime: number;
}) {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="flex-grow flex items-center justify-center flex-col space-y-8">
          <div>
            <h1 className="text-center text-lg">Track Controls</h1>
            <button
              className="bg-red-500 p-4 rounded-l-lg hover:bg-red-600 hover:cursor-pointer"
              onClick={(x) => {
                audioMine.play();
              }}
            >
              Play
            </button>
            <button
              className="bg-blue-500 p-4 hover:bg-blue-600 hover:cursor-pointer"
              onClick={(x) => {
                audioMine.pause();
              }}
            >
              Pause
            </button>
            <button
              className="bg-green-500 p-4 hover:bg-green-600 hover:cursor-pointer"
              onClick={(x) => {
                audioMine.currentTime = 0;
                audioMine.play();
              }}
            >
              Stop
            </button>
            <button
              className="bg-yellow-500 p-4 rounded-r-lg hover:bg-yellow-600 hover:cursor-pointer"
              onClick={(x) => {
                audioMine.currentTime = 0;
              }}
            >
              Restart
            </button>
          </div>
          <div>
            <h1 className="text-center text-lg">Scene Controls</h1>
            <button
              className="bg-blue-500 p-4 rounded-l-lg hover:bg-blue-600 hover:cursor-pointer"
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
              Create at Current Time
            </button>
            <button
              className="bg-red-500 p-4 rounded-r-lg hover:bg-red-600 hover:cursor-pointer"
              onClick={() => {
                window.localStorage.removeItem(`timeCode_${selectedTime}`);
                setPos((x) => x + 0.0001);
              }}
            >
              Delete Current
            </button>
          </div>
          <div>
            <h1 className="text-center text-lg">Import / Export</h1>
            <button
              className="bg-green-500 p-4 hover:bg-green-600 hover:cursor-pointer rounded-l-lg"
              onClick={() => setLoadEverything(true)}
            >
              Load Song
            </button>
            <button
              className="bg-blue-500 p-4 hover:bg-blue-600 hover:cursor-pointer"
              onClick={() => setLoadEverything(true)}
            >
              Save Settings
            </button>
            <button
              className="bg-orange-500 p-4 hover:bg-orange-600 hover:cursor-pointer rounded-r-lg"
              onClick={() => setLoadEverything(true)}
            >
              Export for Production
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
