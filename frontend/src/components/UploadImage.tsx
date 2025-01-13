import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const API_URL = import.meta.env.VITE_API_URL;
const UploadImage: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<
    {
      text: string;
      sender: string;
      isBot: boolean;
      id: string;
      image?: string;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDots, setLoadingDots] = useState<string>("");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading) {
      interval = setInterval(() => {
        setLoadingDots((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
    }

    return () => clearInterval(interval);
  }, [loading]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setChatHistory((prev) => [
        ...prev,
        {
          text: "Uploaded an image",
          sender: "User",
          isBot: false,
          id: `${Date.now()}-user-image`,
          image: imageUrl,
        },
      ]);

      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(`${API_URL}/chat`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        setChatHistory((prev) => [
          ...prev,
          {
            text: data.response || "No response available.",
            sender: "Bot",
            isBot: true,
            id: `${Date.now()}-bot-response`,
          },
        ]);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    setChatHistory((prev) => [
      ...prev,
      {
        text: userInput,
        sender: "User",
        isBot: false,
        id: `${Date.now()}-user`,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        body: JSON.stringify({ userInput }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      setChatHistory((prev) => [
        ...prev,
        {
          text: data.response,
          sender: "Bot",
          isBot: true,
          id: `${Date.now()}-bot`,
        },
      ]);
      setUserInput("");
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      direction="column"
      sx={{
        padding: 2,
        overflowY: "auto",
        flex: 1,
        // height: "75vh",
        // width: "80vw",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
      }}
    >
      <Grid
        item
        container
        direction="column"
        sx={
          {
            // display: "flex",
            // flexDirection: "column",
            // marginTop: "8px",
            // flexGrow: 1,
            // overflowY: "auto",
            // scrollBehavior: "smooth",
            // padding: 2,
            // border: "1px solid #",
            // borderRadius: 2,
            // maxHeight: "70vh",
          }
        }
      >
        {chatHistory.map(({ id, text, isBot, image }) => (
          <Card
            key={id}
            sx={{
              marginBottom: 1,
              maxWidth: "70%",
              width: "fit-content",
              alignSelf: isBot ? "flex-start" : "flex-end",
              backgroundColor: isBot ? "#ecf4fd" : "#1876d2",
              color: isBot ? "black" : "white",
              textAlign: "left",
            }}
          >
            <CardContent>
              {image ? (
                <Box
                  component="img"
                  src={image}
                  alt="Uploaded"
                  sx={{
                    width: 250,
                    height: 250,
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
              ) : (
                <Typography>
                  <span dangerouslySetInnerHTML={{ __html: text }} />
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Show loading dots when loading */}
        {loading && (
          <Card
            sx={{
              marginBottom: 1,
              maxWidth: "70%",
              alignSelf: "flex-start",
              backgroundColor: "#ecf4fd",
              color: "black",
            }}
          >
            <CardContent>
              <Typography>{loadingDots}</Typography>
            </CardContent>
          </Card>
        )}
      </Grid>

      <Grid
        item
        container
        sx={{
          marginTop: 2,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        spacing={1}
      >
        <Grid item xs>
          <TextField
            fullWidth
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a message"
            variant="outlined"
            sx={{
              maxWidth: "100%",
              flexGrow: 1,
            }}
          />
        </Grid>
        <Grid item>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-button"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="upload-button">
            <IconButton component="span" color="primary">
              <PhotoCamera />
            </IconButton>
          </label>
        </Grid>
        <Grid item>
          <IconButton color="primary" onClick={handleUserInput}>
            <SendIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UploadImage;
