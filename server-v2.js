const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

process.env.PUPPETEER_CACHE_DIR = path.join(
  __dirname,
  ".cache",
  "puppeteer"
);

const puppeteer = require("puppeteer");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/posters", express.static(path.join(__dirname, "posters")));
app.use("/fonts", express.static(path.join(__dirname, "node_modules", "@fontsource", "noto-sans-sc", "files")));
const theme = {
  primary: "#e96f1f",
  primarySoft: "#f7a15f",
  bg: "#fff5ec",
  card: "#ffffff",
  text: "#25313a",
  subtext: "#7b8790",
  line: "#f2d6bf",
  commentBg: "#fff3e5"
};

function getLogoDataUrl() {
  const logoPath = path.join(__dirname, "logo.jpg");

  if (!fs.existsSync(logoPath)) {
    return "";
  }

  const imageBuffer = fs.readFileSync(logoPath);
  const base64 = imageBuffer.toString("base64");

  return `data:image/jpeg;base64,${base64}`;
}

app.get("/", (req, res) => {
  res.send(`
    <h1>普拉提海报生成系统 V2</h1>
    <button onclick="generatePoster()">生成暖阳橙海报</button>

    <script>
      async function generatePoster() {
        const response = await fetch('/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: "2026-05-03",
            weather: "晴",
            studentName: "张小美",
            lessonNumber: "第4课",
            courseTheme: "核心增强",
            studioName: "Han 普拉提工作室",
            studioSubName: "HAN PILATES STUDIO",
            summary: "亲爱的小美～这次训练重点是核心力量强化和脊柱灵活性提升。整体配合度很高，调整后发力感找得越来越好，已经能更稳定地完成动作啦。下次我们继续保持节奏，让身体控制更细腻。",
            actions: [
              { number: 1, equipment: "R", name: "蹬腿系列", benefit: "改善下肢排列", comment: "" },
              { number: 2, equipment: "R", name: "腿绳索系列", benefit: "增加髋部分离能力，改善下肢柔韧性，增强下肢协调能力", comment: "柔韧性的原因无法90°C垂直，但能够找到拉伸感，需要多次练习掌握发力感。" },
              { number: 3, equipment: "R", name: "坐姿体前屈", benefit: "改善下肢柔韧性", comment: "看起来左腿柔韧性更差，坐姿时左侧骨盆偏后，后评估无脊柱侧弯问题。" },
              { number: 4, equipment: "TT", name: "V字挑战", benefit: "增加脊柱屈曲灵活性，强化腹部改善肋骨外翻", comment: "" },
              { number: 5, equipment: "TT", name: "坐姿推杆 + 回旋", benefit: "增加脊柱屈曲灵活性，增加身体回旋", comment: "回旋时右手带动较为紧张，右侧腹部需要放松。" },
              { number: 6, equipment: "M", name: "臀桥（家里练习）", benefit: "改善肋骨外翻", comment: "第一次练习，不需要特别多细节，先把动作行程让身体记住。" },
              { number: 7, equipment: "C", name: "手臂屈撑", benefit: "活动肩胛骨，改善圆肩，增加肩关节外旋能力", comment: "" }
            ]
          })
        });

        const result = await response.json();
        alert(result.message);
      }
    </script>
  `);
});

app.post("/generate", async (req, res) => {
 const data = req.body;

function normalizeWeather(value) {
  const text = String(value || "").trim();

  if (!text) return "晴";

  if (
    text.includes("晴") ||
    text.includes("☀") ||
    text.toLowerCase().includes("sunny") ||
    text.toLowerCase().includes("sun")
  ) {
    return "晴";
  }

  if (
    text.includes("阴") ||
    text.toLowerCase().includes("overcast")
  ) {
    return "阴";
  }

  if (
    text.includes("多云") ||
    text.includes("云") ||
    text.includes("☁") ||
    text.toLowerCase().includes("cloud")
  ) {
    return "多云";
  }

  if (
    text.includes("小雨") ||
    text.includes("light_rain") ||
    text.toLowerCase().includes("light rain")
  ) {
    return "小雨";
  }

  if (
    text.includes("雨") ||
    text.includes("🌧") ||
    text.includes("☔") ||
    text.toLowerCase().includes("rain")
  ) {
    return "雨";
  }

  return text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, "").trim() || "晴";
}

const weatherText = normalizeWeather(data.weather);
const logoDataUrl = getLogoDataUrl();

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});
  const page = await browser.newPage();

  const html = `
  <html>
  <head>
  
  <style>
@font-face {
  font-family: "Noto Sans SC";
  src: url("http://localhost:${PORT}/fonts/noto-sans-sc-chinese-simplified-400-normal.woff2") format("woff2");
  font-weight: 400;
}

@font-face {
  font-family: "Noto Sans SC";
  src: url("http://localhost:${PORT}/fonts/noto-sans-sc-chinese-simplified-700-normal.woff2") format("woff2");
  font-weight: 700;
}

@font-face {
  font-family: "Noto Sans SC";
  src: url("http://localhost:${PORT}/fonts/noto-sans-sc-chinese-simplified-900-normal.woff2") format("woff2");
  font-weight: 900;
}


body {
  margin: 0;
  background: ${theme.bg};
  font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif;
}
      body {
  margin: 0;
  background: ${theme.bg};
  font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif;
}
        

      .poster {
        width: 1080px;
        min-height: 1920px;
        box-sizing: border-box;
        background: linear-gradient(180deg, ${theme.primary} 0px, ${theme.primarySoft} 230px, ${theme.bg} 470px);
        padding: 54px 48px 70px;
      }

      .header {
        color: white;
        padding: 12px 20px 34px;
      }

      .header-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 30px;
      }

      .student {
        font-size: 76px;
        font-weight: 900;
        line-height: 1.1;
      }

      .meta {
        margin-top: 18px;
        font-size: 30px;
        opacity: 0.9;
        white-space: nowrap;
      }

      .lesson-pill {
        padding: 16px 34px;
        border-radius: 999px;
        background: rgba(255,255,255,0.20);
        font-size: 30px;
        font-weight: 800;
      }

      .main-card {
        margin-top: 36px;
        background: white;
        border-radius: 42px;
        padding: 44px;
        box-shadow: 0 20px 50px rgba(80,62,42,0.06);
      }

      .section-title {
        font-size: 40px;
        font-weight: 850;
        color: ${theme.text};
        margin-bottom: 42px;
      }

      .action {
        position: relative;
        display: flex;
        padding-bottom: 46px;
      }

      .axis {
        width: 92px;
        position: relative;
        flex-shrink: 0;
      }

      .axis-line {
        position: absolute;
        top: 10px;
        bottom: -46px;
        left: 45px;
        width: 3px;
        background: ${theme.line};
        border-radius: 99px;
      }

      .axis-number {
        position: relative;
        z-index: 2;
        width: 92px;
        text-align: center;
        font-size: 58px;
        font-weight: 900;
        color: rgba(233,111,31,0.22);
        line-height: 1;
      }

      .action-content {
        flex: 1;
        padding-left: 8px;
      }

      .action-head {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        column-gap: 16px;
        row-gap: 10px;
      }

      .equipment {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 42px;
        height: 34px;
        padding: 0 12px;
        border-radius: 999px;
        background: #f3f0ed;
        color: #7a6d62;
        font-size: 22px;
        font-weight: 700;
      }

      .name {
        font-size: 40px;
        font-weight: 850;
        color: ${theme.text};
      }

      .benefit {
        font-size: 30px;
        color: ${theme.subtext};
        line-height: 1.55;
      }

      .comment {
        margin-top: 20px;
        background: ${theme.commentBg};
        border-radius: 18px;
        padding: 24px 30px;
        font-size: 28px;
        line-height: 1.75;
        color: #6b5b4f;
      }

      .summary {
        margin-top: 18px;
        margin-left: 28px;
        margin-right: 28px;
        background: white;
        border-radius: 34px;
        padding: 42px 48px;
        box-shadow: 0 14px 40px rgba(80,62,42,0.05);
      }

      .summary-title {
        font-size: 34px;
        font-weight: 850;
        color: ${theme.primary};
        margin-bottom: 18px;
      }

      .summary-text {
        font-size: 32px;
        line-height: 1.9;
        color: #4a4038;
      }

      .footer-card {
        margin-top: 54px;
        background: white;
        border-radius: 36px;
        min-height: 180px;
        padding: 0 56px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 18px 45px rgba(80,62,42,0.08);
      }

      .logo-box {
        position: absolute;
        left: 58px;
        width: 124px;
        height: 124px;
        border-radius: 30px;
        overflow: hidden;
        background: #f5f1ea;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .logo-box img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .studio-info {
        text-align: center;
      }

      .studio-name {
        font-size: 42px;
        font-weight: 850;
        color: #1f2937;
        letter-spacing: 1px;
      }

      .studio-en {
        margin-top: 10px;
        font-size: 22px;
        letter-spacing: 5px;
        color: #9ca3af;
      }
    </style>
  </head>

  <body>
    <div class="poster">

      <div class="header">
        <div class="header-top">
          <div>
            <div class="student">${data.studentName}</div>
            <div class="meta">${data.date} · ${weatherText}</div>
          </div>

          <div class="lesson-pill">${data.lessonNumber}</div>
        </div>
      </div>

      <div class="main-card">
        <div class="section-title">训练内容：${data.courseTheme}</div>

        ${data.actions.map((action, index) => `
          <div class="action">
            <div class="axis">
              ${index !== data.actions.length - 1 ? `<div class="axis-line"></div>` : ""}
              <div class="axis-number">${String(action.number).padStart(2, "0")}</div>
            </div>

            <div class="action-content">
              <div class="action-head">
                <span class="equipment">${action.equipment}</span>
                <span class="name">${action.name}</span>
                <span class="benefit">${action.benefit}</span>
              </div>

              ${action.comment ? `<div class="comment">${action.comment}</div>` : ""}
            </div>
          </div>
        `).join("")}
      </div>

      <div class="summary">
        <div class="summary-title">课后总结</div>
        <div class="summary-text">${data.summary}</div>
      </div>

      <div class="footer-card">
        <div class="logo-box">
          ${logoDataUrl ? `<img src="${logoDataUrl}" />` : "LOGO"}
        </div>

        <div class="studio-info">
          <div class="studio-name">${data.studioName}</div>
          <div class="studio-en">${data.studioSubName}</div>
        </div>
      </div>

    </div>
  </body>
  </html>
  `;

  await page.setViewport({
    width: 1080,
    height: 1920
  });

  await page.setContent(html, {
  waitUntil: "domcontentloaded",
  timeout: 120000
});

await page.evaluateHandle("document.fonts.ready");
const fileName = `poster-${Date.now()}.png`;

const outputPath = path.join(
  __dirname,
  "posters",
  fileName
);


await page.screenshot({
  path: outputPath,
  fullPage: true
});

  await browser.close();

   res.json({
    success: true,
    message: "暖阳橙海报生成成功！",
    imageUrl: `https://pilates-poster-api.onrender.com/posters/${fileName}`
  });

});

app.listen(PORT, () => {
  console.log(`服务器运行中：http://localhost:${PORT}`);
});
