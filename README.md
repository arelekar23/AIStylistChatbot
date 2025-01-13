# AI Stylist Chatbot

## Problem Statement
The AI Stylist Chatbot solves the problem of providing users with personalized outfit recommendations based on their uploaded photos. Users can post photos of their outfits and ask for suggestions, and the chatbot returns tailored outfit recommendations for various occasions and weather conditions. It also provides links to potential outfit options.

Due to security restrictions with Google Gemini API, photos of people cannot be directly uploaded. Instead, Azure Vision AI is used to analyze the photo, extract descriptions, and relevant tags and use them in the recommendation process.

---

## Tools and Frameworks Used
- **Google Gemini API**: For handling chat functionality and generating personalized recommendations.
- **Azure Vision AI**: For analyzing uploaded photos and extracting descriptions and tags.
- **Node.js & Express.js**: Backend server implementation.
- **Vite & React**: Frontend framework for user interface.
- **Nodemon**: For auto-restarting the backend server during development.

---

## Instructions to Run the Solution

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```
### 2. Add .env files
1. Backend .env
```bash
VISION_API_KEY=<your-azure-vision-api-key>
VISION_ENDPOINT=<your-azure-vision-endpoint>
GOOGLE_GENAI_KEY=<your-google-generative-ai-api-key>
FRONTEND_URL="http://localhost:5173"
PORT=5001
```
2. Frontend .env
```bash
VITE_API_URL="http://localhost:5001" # Backend API endpoint
```

### 3. Install Dependencies inside both frontend and backend directory
```bash
npm install
```
### 4. Start the Application
Backend:
```bash
nodemon src/server.ts
```
Frontend:
```bash
npm run dev
```
### 5. Access the Application
```bash
http://localhost:5173
```
