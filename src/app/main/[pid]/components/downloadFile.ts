import { v4 } from "uuid";
import { main } from "../page";

export function DownloadFile(id: string, title: string, universeCount: number) {
  let dataIn: {
    [key: string]: {
      // timecode
      universe: number;
      data: {
        [key: string]: {
          data: number[];
          id: number;
          universe: number;
        };
      };
    };
  } = {};
  let keys = Object.keys(window.localStorage);

  // keys are projectId_universeId_timeCode_time

  //time code is a const
  keys.forEach((key) => {
    let projectId = key.split("_")[0];
    if (projectId === id) {
      console.log(localStorage.getItem(key));
      let data = JSON.parse(localStorage.getItem(key) ?? "") as {
        time: number;
        data: main;
        universe: number;
      };

      dataIn[data.time + "_" + v4()] = {
        data: data.data,
        universe: data.universe,
      };
    }
  });

  // put into an array sorted
  let dataArr = Object.keys(dataIn).map((key) => {
    return {
      key: key,
      data: dataIn[key],
    };
  });

  dataArr.sort((a, b) => {
    return parseFloat(a.key.split("_")[0]) - parseFloat(b.key.split("_")[0]);
  });

  let stripUneccessaryData = dataArr.map((x, i) => {
    console.log(x.key.split("_")[0]);
    return {
      gapBefore:
        parseFloat(x.key.split("_")[0]) -
        (i === 0 ? 0 : parseFloat(dataArr[i - 1].key.split("_")[0])),
      data: x.data.data,
      universe: x.data.universe,
    };
  });

  let outputString = `
-- Auto Generated Lighting File, created by GeraldIn2016's Lighting System
-- Track ID ${id}
-- Track Title ${title}

-- Create universes
${Array.from({ length: universeCount }, (_, i) => {
  return `local Fire_DMX_${i} = Instance.new("BindableEvent", game.ServerStorage)
Fire_DMX_${i}.name = "Fire_DMX_${i}"`;
}).join("\n")}

`;

  stripUneccessaryData.forEach((x) => {
    outputString += `wait(${x.gapBefore})\n`;
    let id = v4().replaceAll("-", "");
    let miniOutput = `function func_${id}(){\n`;
    Object.entries(x.data).forEach(([key, val]) => {
      miniOutput += `   Fire_DMX_${x.universe}:Fire(${key}, {${val.data.join(
        ","
      )}})\n`;
    });
    miniOutput += `}\ncoroutine.resume(coroutine.create(func_${id}))\n`;
    outputString += miniOutput;
  });

  outputString += `-- END OF SONG -- \n`;

  let blob = new Blob([outputString], { type: "text/plain" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = `${id}.lua`;
  a.click();
  URL.revokeObjectURL(url);
}
