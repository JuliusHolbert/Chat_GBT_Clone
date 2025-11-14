const PORT = 8000;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
require('dotenv').config();

const API_KEY = process.env.API_KEY;

app.post('/completions', async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model : "llama-3.1-8b-instant",
      messages: [{role: "user", content: req.body.message}],
      max_tokens: 100,
    })
  }
  // try{
  //   const response = await fetch('https://api.openai.com/v1/chat/completions', options)
  //   const data = await response.json()
  //   res.send(data)
  // } catch (error) {
  //   console.error(error);
  // }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', options);
    const data = await response.json();

    if (data.error) {
      console.error("OpenAI error:", data.error);
      return res.status(500).send({ error: data.error.message });
    }

    res.send(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send({ error: "Something went wrong" });
  }
})

app.listen(PORT, () => console.log('your backend server is running on PORT ' + PORT));