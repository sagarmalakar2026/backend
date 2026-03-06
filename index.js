const express = require("express");
const cors = require("cors");
const ytdl = require("@distube/ytdl-core");

const app = express();
app.use(cors());

app.get("/info", async (req, res) => {
  try {
    const info = await ytdl.getInfo(req.query.url);
    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop()?.url,
    });
  } catch (e) {
    res.status(400).json({ error: "Could not fetch video info" });
  }
});

app.get("/download", async (req, res) => {
  try {
    const { url, format } = req.query;
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "");

    if (format === "mp3") {
      res.header("Content-Disposition", `attachment; filename="${title}.mp3"`);
      ytdl(url, { filter: "audioonly", quality: "highestaudio" }).pipe(res);
    } else {
      const quality = format === "mp4-1080" ? "highest" : "18";
      res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
      ytdl(url, { quality }).pipe(res);
    }
  } catch (e) {
    res.status(400).json({ error: "Download failed" });
  }
});

app.listen(process.env.PORT || 3001, () => console.log("Server running"));
