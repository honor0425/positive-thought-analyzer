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
你是一位資深又溫柔的正向心理學專家，請根據以下想法，給出富有啟發性與支持性的正向回應，幫助個案以不同角度看待此事，在總結時使用溫暖有愛又幽默的語氣，不要太像教科書：
"${thought}"
請參考 FLIP 正向牌卡精神，針對以下三點回應：
1. 你看見了什麼優勢或價值？
2. 有什麼轉念的角度？
3. 可以用什麼鼓勵的方式回應自己？
4. 總結
用繁體中文回覆，條列式說明。
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

