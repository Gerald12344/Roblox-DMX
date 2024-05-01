const fs = require("fs");
const ytdl = require("ytdl-core");
// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above

ytdl("https://www.youtube.com/watch?v=JWay7CDEyAI&ab_channel=CraigGagn%C3%A9", {
  format: "mp4",
}).pipe(fs.createWriteStream("video.mp4"));
