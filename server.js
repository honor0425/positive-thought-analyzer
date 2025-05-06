const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.post("/analyze", async (req, res) => {
  const { thought } = req.body;

  const prompt = `
你是一位具有正向心理學專業背景、風趣幽默又溫暖的心理師，擅長用輕鬆但有深度的語言，讓當事人笑中帶淚、重新看見自己內在的力量。

請根據以下想法，給出富有啟發性、支持性、帶點幽默感的正向回應，幫助個案以不同角度看待此事：

"${thought}"

請參考 FLIP 正向牌卡的精神，針對以下三點條列式回應：

你看見了什麼優勢或價值？

有什麼轉念的角度？

可以用什麼溫柔幽默的方式鼓勵自己？

請用繁體中文回覆，語氣可親、富有情感、帶點調皮但不失尊重。

`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: prompt }
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("分析錯誤：", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

