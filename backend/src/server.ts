import express, { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import fs from 'fs';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';


const app = express();
app.use(express.json());

require('dotenv').config();

app.use(cors());

const upload = multer({ dest: 'uploads/' });

const VISION_API_KEY = process.env.VISION_API_KEY;
const VISION_ENDPOINT = process.env.VISION_ENDPOINT;

const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_GENAI_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/chat', upload.single('image'), async (req: any, res: any) => {
  const { userInput } = req.body;

  try {
    let imageDescription = "";
    let tags: string[] = [];
    let chatbotResponse = "";

    if (req.file) {
      const imagePath = req.file.path;

      try {
        const { tags: imageTags, description } = await analyzeClothing(imagePath);
        imageDescription = description;
        tags = imageTags;

        const prompt = `The outfit in the image is described as: '${imageDescription}'. It includes items like ${tags.join(", ")}.\n\nProvide recommendations on how to improve this outfit for different occasions and weather conditions. Keep the recommendations short and in a single paragraph. Also send a different message with relevant real shopping links inside <a target="_blank" > tags`;
        const result = await model.generateContent(prompt);
        chatbotResponse = result.response.text();
      } catch (error) {
        chatbotResponse = "The uploaded image does not contain a person or clothing. Please upload a suitable image.";
      } finally {
        fs.unlinkSync(imagePath);
      }
    } else {
      const prompt = userInput;
      const result = await model.generateContent(prompt);
      chatbotResponse = result.response.text();
    }

    res.json({
      response: chatbotResponse,
    });
  } catch (error) {
    console.error('Error communicating with Gemini AI:', error);
    res.status(500).json({ error: 'Failed to process the request.' });
  }
});

async function analyzeClothing(imagePath: string) {
  try {
    const visionHeaders = {
      "Ocp-Apim-Subscription-Key": VISION_API_KEY,
      "Content-Type": "application/octet-stream"
    };

    const imageBuffer = fs.readFileSync(imagePath);

    const visionResponse = await axios.post(`${VISION_ENDPOINT}`, imageBuffer, { headers: visionHeaders });
    const visionResult = visionResponse.data;

    const tags = visionResult.tags.map((tag: { name: string }) => tag.name);
    const description = visionResult.description?.captions[0]?.text || '';

    const hasPersonOrClothing = tags.some((tag: string) =>
      ["person", "clothing", "dress", "shirt", "pants", "jacket"].includes(tag)
    );

    if (!hasPersonOrClothing) {
      throw new Error("No person or clothing detected in the image.");
    }

    return { tags, description };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error analyzing image:', error.message);
      throw new Error(error.message);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Failed to analyze the image due to an unknown error.');
    }
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});