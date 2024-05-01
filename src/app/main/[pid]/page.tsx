"use client";

import { useEffect, useState } from "react";
import EditScene from "./editScene";
import Timeline from "./timeline";
import axios from "axios";
import ProjectControls from "./ProjectControls";
import { Button } from "@mantine/core";
import Link from "next/link";

export interface main {
  [key: number | string]: {
    data: number[];
    id: number;
    universe: number;
  };
}

const lights = 40;

export { lights };

let empty: main = {};
for (let i = 1; i <= lights; i++) {
  empty[i] = {
    data: [0, 0, 0, 0, 0, 0, 0, 255],
    id: i,
    universe: 0,
  };
}

let audioMine: HTMLAudioElement;

export interface ProjectSettings {
  title: string;
  description: string;
  id: string;
  universes: { name: string; id: number }[];
}

export default function Page({ params }: { params: { pid: string } }) {
  const [currentData, setCurrentData] = useState<main>(empty);
  const [loadEverything, setLoadEverything] = useState(false);
  const [duration, setDuration] = useState(0);
  const [pos, setPos] = useState(0);
  const [universe, setUniverse] = useState<{ name: string; id: number }>();
  const [selectedTime, setSelectedTime] = useState(-1);

  const [projectSettings, setProjectSettings] = useState<ProjectSettings>();

  let changeCurrent = (x: main) => {
    setCurrentData(x);

    axios.post("/api/save", {
      body: Object.values(x),
    });
  };

  let loadUniverses = () => {
    let id = params.pid;
    if (!id) return;
    // get projects
    let projects = localStorage.getItem("projects");
    if (!projects) return;
    let parsed = JSON.parse(projects).projects;
    let project = parsed.find((x: any) => x.id === id);

    setProjectSettings(project);
  };

  useEffect(() => {
    loadUniverses();
    setUniverse({ name: "DEFAULT - 0", id: 0 });
    audioMine = new Audio();
    audioMine.src = "../testTrack.mp3";
    audioMine.load();
    let doc = document.getElementById("pos");
    let line = document.getElementById("theLine");
    if (doc) doc.innerText = audioMine.currentTime.toString();
    audioMine.addEventListener("loadedmetadata", () => {
      console.log("loaded, duration", audioMine.duration);
      setDuration(audioMine.duration);
    });

    setInterval(function () {
      setPos(audioMine.currentTime);
    }, 30);

    window.addEventListener(
      "keydown",
      function (e) {
        if (
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) >
          -1
        ) {
          e.preventDefault();
        }
      },
      false
    );
  }, []);

  return (
    <div className="grid grid-rows-2 grid-cols-2 w-[100vw] h-[100vh]">
      <div className="p-2 border-2 border-neutral-700 border-solid rounded-md m-2 flex items-center justify-center w-[98%] flex-col">
        <h1 className="text-3xl">Main Controls</h1>
        <div className="flex flex-row items-between w-full justify-center">
          <div className="flex items-center flex-col justify-center h-full flex-grow">
            <h1 className="text-2xl">{projectSettings?.title}</h1>
            <p>{projectSettings?.description}</p>
            <Link href="/main" className="mt-4">
              <Button>Change Project</Button>
            </Link>
          </div>
          <ProjectControls
            universe={universe}
            audioMine={audioMine}
            currentData={currentData}
            setLoadEverything={setLoadEverything}
            setPos={setPos}
            project={projectSettings}
            selectedTime={selectedTime}
          />
        </div>
      </div>

      <div className="p-2  border-2 border-neutral-700 border-solid rounded-md m-2 flex items-center justify-center flex-col relative">
        <h1 className="text-3xl">Edit Scene - ({universe?.name})</h1>
        <div className="flex-grow flex items-center justify-center flex-col space-y-8">
          <EditScene
            project={projectSettings}
            universe={universe}
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
            setUniverse={setUniverse}
            universe={universe}
            projectSettings={projectSettings}
            loadUniverses={loadUniverses}
          />
        </div>
      </div>
    </div>
  );
}
