import express from "express";
import fs from "fs";
import { v4 as generateId } from "uuid";
import "dotenv/config";

const router = express.Router();
const notFoundError = { message: "Video with the provided ID not found" };
const incompletePostError = {
  message: "POST request is missing required fields",
  requiredFields: ["title", "description"],
};
const missingApiKeyError = {
  message:
    "API key query parameter is required. You can use any string (including your name) as your API key.",
};

const readVideosData = () =>
  JSON.parse(fs.readFileSync("./data/videos.json", "utf8"));

const writeVideosData = (data) =>
  fs.writeFileSync("./data/videos.json", JSON.stringify(data, null, 2));

router
  .route("/")
  .get((req, res) => {
    const apiKey = req.query.api_key;
    if (!apiKey) {
      return res.status(401).json(missingApiKeyError);
    }

    const videos = readVideosData();
    res
      .status(200)
      .json(
        videos.map(({ id, title, channel, image }) => ({
          id,
          title,
          channel,
          image,
        }))
      );
  })
  .post((req, res) => {
    const apiKey = req.query.api_key;
    if (!apiKey) {
      return res.status(401).json(missingApiKeyError);
    }

    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json(incompletePostError);
    }

    const newVideo = {
      id: generateId(),
      title,
      channel: "Mohan Muruge",
      image: "http://localhost:8080/images/Upload-video-preview.jpg",
      description,
      views: "0",
      likes: "0",
      duration: `${Math.floor(Math.random() * 20)}:${Math.floor(
        Math.random() * 60
      )}`,
      video: "http://localhost:8080/videos/BrainStation_Sample_Video.mp4",
      timeStamp: Date.now(),
      comments: [],
    };

    const videos = readVideosData();
    videos.push(newVideo);
    writeVideosData(videos);

    res.status(201).json(newVideo);
  });

router
  .route("/:id")
  .get((req, res) => {
    const apiKey = req.query.api_key;
    if (!apiKey) {
      return res.status(401).json(missingApiKeyError);
    }

    const videoId = req.params.id;
    const videos = readVideosData();
    const video = videos.find((video) => video.id === videoId);

    if (!video) {
      return res.status(404).json(notFoundError);
    }

    res.status(200).json(video);
  })
  .delete((req, res) => {
    const apiKey = req.query.api_key;
    if (!apiKey) {
      return res.status(401).json(missingApiKeyError);
    }

    const videoId = req.params.id;
    const videos = readVideosData();
    const videoIndex = videos.findIndex((video) => video.id === videoId);

    if (videoIndex === -1) {
      return res.status(404).json(notFoundError);
    }

    videos.splice(videoIndex, 1);
    writeVideosData(videos);

    res.status(200).json({ message: "Video deleted successfully" });
  });

export default router;
