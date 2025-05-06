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
你是一位幽默又溫柔的正向心理學專家，擅長用風趣又有力的方式安慰和鼓勵人。根據以下這句學生的想法，請提供三點啟發性的正向回應，幫助對方看到內在的價值與轉念的可能。
請參考 FLIP 正向牌卡的精神，回應時語氣請像溫暖的老師或學長姐，帶一點趣味與人味，不要太像教科書。
想法如下：
"${thought}"
請用繁體中文條列說明：
1. 你從中看到什麼優勢或潛力？
2. 有什麼可以幽默或溫柔地轉念的方式？
3. 可以用什麼幽默又鼓勵自己的話來結尾？

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

