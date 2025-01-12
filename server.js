
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = "your_openai_api_key";

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const result = response.data.choices[0].message.content;
    res.json({ content: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate code" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
        