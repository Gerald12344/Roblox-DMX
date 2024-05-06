import { useState } from "react";
import Slider from "../../../components/slider";
import { main } from "./page";

export default function EditScene({
  currentSceneInfo,
  selectedTime,
  changeCurrent,
  universe,
  project,
}: {
  currentSceneInfo: main;
  selectedTime: number;
  changeCurrent: (x: main) => void;
  universe: { name: string; id: number } | undefined;
  project: { id: string; title: string } | undefined;
}) {
  const [currentLight, setCurrentLight] = useState(1);
  const lightInfo = currentSceneInfo[currentLight];
  const tilt = lightInfo?.data[0] || 0;
  const pan = lightInfo?.data[1] || 0;
  const r = lightInfo?.data[2] || 0;
  const g = lightInfo?.data[3] || 0;
  const b = lightInfo?.data[4] || 0;
  const intensity = lightInfo?.data[5] || 0;
  const beamAngle = lightInfo?.data[6] || 0;
  const speed = lightInfo?.data[7] || 255;

  const save = () => {
    window.localStorage.setItem(
      `${project?.id}_${universe?.id}_timeCode_${selectedTime}`,
      JSON.stringify({
        time: selectedTime,
        data: currentSceneInfo,
        universe: universe?.id,
      })
    ) as any;
  };

  const update = (object: any) => {
    let existing = {
      tilt,
      pan,
      r,
      g,
      b,
      intensity,
      beamAngle,
      speed,
      ...object,
    };
    let newScene = {
      ...currentSceneInfo,
      [currentLight]: {
        data: [
          existing.tilt,
          existing.pan,
          existing.r,
          existing.g,
          existing.b,
          existing.intensity,
          existing.beamAngle,
          existing.speed,
        ],
        id: currentLight,
      },
    };

    changeCurrent(newScene as any);
  };

  const changeLight = (light: number) => {
    setCurrentLight(light);
  };

  return (
    <div>
      <button
        className="p-2 bg-orange-500 m-2 rounded-lg ml-4 absolute right-0 top-0"
        onClick={save}
      >
        Save Scene
      </button>
      <div className="flex flex-row  items-center">
        <h1>Light Selector ({currentLight}): </h1>
      </div>
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <button
            className={`py-2 px-4 ${
              currentLight === i + 1 ? "bg-red-500" : "bg-green-500"
            }  m-1 rounded-lg`}
            onClick={() => changeLight(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <input
          placeholder="Light Id Number..."
          className="py-2 px-4 m-1 rounded-lg"
          type="number"
          onChange={(e) => changeLight(parseInt(e.target.value))}
        />
      </div>

      <div className="flex flex-row">
        <Slider
          val={(tilt + 255) / 2}
          setVal={(x) => update({ tilt: x * 2 - 255 })}
          title="Tilt"
        />
        <Slider
          val={(pan + 255) / 2}
          setVal={(x) => update({ pan: x * 2 - 255 })}
          title="Pan"
        />
        <Slider val={r} setVal={(r) => update({ r })} title="Red" />
        <Slider val={g} setVal={(g) => update({ g })} title="Green" />
        <Slider val={b} setVal={(b) => update({ b })} title="Blue" />
        <Slider
          val={intensity}
          setVal={(intensity) => update({ intensity })}
          title="Intensity"
        />
        <Slider
          val={beamAngle}
          setVal={(beamAngle) => update({ beamAngle })}
          title="Beam Angle"
        />
        <Slider
          val={speed}
          setVal={(speed) => update({ speed })}
          title="Speed"
        />
      </div>
    </div>
  );
}
