import { useEffect, useState } from "react";
import { main } from "./page";

const widthOfSong = 12000;
const canvasHeight = 300;

export default function Timeline({
  loadEverything,
  requestSeek,
  selectedTime,
  changeSelectedTime,
  currentTime,
  duration,
  left,
  right,
  changeInfo,
}: {
  loadEverything: boolean;
  requestSeek: (x: number) => void;
  selectedTime: number;
  changeSelectedTime: (x: number) => void;
  currentTime: number;
  duration: number;
  left: () => void;
  right: () => void;
  changeInfo: (x: main) => void;
}) {
  useEffect(() => {
    if (!loadEverything) return;
    // AUDIO CONTEXT
    findLatestBehindMe();
    window.AudioContext = window.AudioContext;

    if (!AudioContext)
      alert(
        "This site cannot be run in your Browser. Try a recent Chrome or Firefox. "
      );

    let audioContext = new AudioContext();
    let currentBuffer = null;

    // CANVAS
    let canvasWidth = widthOfSong;

    let newCanvas = createCanvas(canvasWidth, canvasHeight);
    let context: any = null;

    appendCanvas();
    function appendCanvas() {
      document.getElementById("canvasHolder")?.appendChild(newCanvas);
      context = newCanvas.getContext("2d");
    }

    // MUSIC LOADER + DECODE
    function loadMusic(url: string) {
      let req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.responseType = "arraybuffer";
      req.onreadystatechange = function (e) {
        if (req.readyState == 4) {
          if (req.status == 200)
            audioContext.decodeAudioData(
              req.response,
              function (buffer) {
                currentBuffer = buffer;
                displayBuffer(buffer);
              },
              onDecodeError
            );
          else alert("error during the load.Wrong url or cross origin issue");
        }
      };
      req.send();
    }

    function onDecodeError() {
      alert("error while decoding your file.");
    }

    // MUSIC DISPLAY
    function displayBuffer(buff: AudioBuffer /* is an AudioBuffer */) {
      let leftChannel = buff.getChannelData(0); // Float32Array describing left channel
      let lineOpacity = canvasWidth / leftChannel.length;

      if (context === null) return;

      context.fillStyle = "#222";
      context.fillRect(0, 0, canvasWidth, canvasHeight);
      context.strokeStyle = "#121";
      context.globalCompositeOperation = "lighter";
      context.translate(0, canvasHeight / 2);
      context.globalAlpha = 0.06; // lineOpacity ;
      for (let i = 0; i < leftChannel.length; i++) {
        // on which line do we get ?
        let x = Math.floor((canvasWidth * i) / leftChannel.length);
        let y = (leftChannel[i] * canvasHeight) / 2;
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x + 1, y);
        context.stroke();
      }
      context.restore();
      console.log("done");
    }

    function createCanvas(w: number, h: number) {
      let newCanvas = document.createElement("canvas");
      newCanvas.width = w;
      newCanvas.height = h;
      return newCanvas;
    }

    console.log("loading music");
    loadMusic("./testTrack.mp3");
  }, [loadEverything]);

  useEffect(() => {
    let outerHolder = document.getElementById("outerHolder");

    window.addEventListener("mousemove", (e) => {
      let mouse = document.getElementById("theMouse");
      if (!outerHolder) return;

      if (mouse)
        mouse.style.left = `${e.clientX + outerHolder.scrollLeft - 20}px`;
    });

    window.addEventListener("click", (e) => {
      // check if mouse is inside canvas holder
      let canvasHolder = document.getElementById("outerHolder");
      if (!canvasHolder) return;
      let rect = canvasHolder.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      )
        return;

      if (!outerHolder) return;
      let percent = (e.clientX + outerHolder.scrollLeft - 20) / widthOfSong;
      console.log("percent", percent * duration);
      requestSeek(percent);
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") left();
      if (e.key === "ArrowRight") right();
    });
  }, []);

  let loadTimeQueus = () => {
    // fetch everything from local storage that starts with timeCode_
    let keys = Object.keys(window.localStorage);
    let timeKeys = keys.filter((key) => key.startsWith("timeCode_"));
    let timeQueues = timeKeys.map((key) => {
      return {
        time: parseFloat(key.split("_")[1]),
        data: JSON.parse(window.localStorage.getItem(key) as any),
      };
    });

    return timeQueues;
  };

  let findLatestBehindMe = () => {
    let x = loadTimeQueus();
    let time = currentTime;

    let behind = x.filter((q) => q.time <= time);

    if (behind.length === 0) return x;
    let latest = behind.reduce((prev, current) =>
      prev.time > current.time ? prev : current
    );

    if (selectedTime !== latest.time) {
      changeSelectedTime(latest.time);
      let start = window.localStorage.getItem(`timeCode_${latest.time}`) as any;

      console.log("start", start);
      changeInfo(JSON.parse(start).data);
    }
    return x;
  };

  findLatestBehindMe();

  return (
    <div className="w-full overflow-x-auto" id="outerHolder">
      <div>
        <h1>Universes:</h1>
        <div>
          <button className="bg-green-500 p-2 rounded-lg">Create New</button>
        </div>
      </div>
      <div id="canvasHolder" className="relative mt-4 min-h-[300px]">
        <div
          style={{
            height: canvasHeight + "px",
            left: `${(currentTime / duration) * widthOfSong}px`,
          }}
          className="absolute bg-red-400 w-[1px] top-0"
        ></div>

        {loadTimeQueus()
          .sort((a, b) => a.time - b.time)
          .map((q, i) => {
            return (
              <div
                style={{
                  left: widthOfSong * (q.time / duration),
                  height: canvasHeight + "px",
                }}
                className={` ${
                  selectedTime == q.time ? "w-[2px] bg-pink-400" : "w-[1px]"
                } absolute bg-blue-400  top-0`}
              ></div>
            );
          })}

        <div
          id={"theMouse"}
          className="absolute bg-green-400 w-[1px]  top-0"
          style={{ height: canvasHeight + "px" }}
        ></div>
      </div>
    </div>
  );
}
