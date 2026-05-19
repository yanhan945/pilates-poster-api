const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

const PORT = 3000;

app.use(express.json());



// 首页
app.get("/", (req, res) => {

  res.send(`

    <h1>普拉提海报生成系统</h1>

    <button onclick="generatePoster()">
      生成海报
    </button>

    <script>

      async function generatePoster() {

        const response = await fetch('/generate', {

          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({

            date: "2026年4月22日",
            weather: "晴",
            courseName: "核心强化",
            lessonNumber: "第1课",

            studentName: "小雨",

            coachName: "Luna",

            summary: "今天核心控制进步明显，骨盆稳定性提升很多，训练稳定性比上节课更好。",

            actions: [

              {
                number: 1,
                equipment: "R",
                name: "肩胛骨系列",
                benefit: "增加肩胛前引、后缩",
                comment: "训练过程中肩带稳定性提升明显"
              },

              {
                number: 2,
                equipment: "C",
                name: "臀桥",
                benefit: "改善下肢排列，增强臀腿力量",
                comment: "骨盆左侧容易出现代偿"
              },

              {
                number: 3,
                equipment: "M",
                name: "平板支撑",
                benefit: "增强核心稳定能力",
                comment: "后半程核心耐力下降明显"
              },

              {
                number: 4,
                equipment: "R",
                name: "飞鸟",
                benefit: "增强肩胛稳定，改善胸椎活动",
                comment: "整体控制比上节课更稳定"
              }

            ]

          })

        });

        const result = await response.json();

        alert(result.message);

      }

    </script>

  `);

});




// 海报生成接口
app.post("/generate", async (req, res) => {

  const data = req.body;

  // 启动浏览器
  const browser = await puppeteer.launch();

  const page = await browser.newPage();




  // 海报 HTML
  const html = `

  <html>

  <head>

    <style>

      body{

        margin:0;
        padding:0;

        background:#f4efe8;

        font-family:
        "Microsoft YaHei",
        sans-serif;

      }

      .poster{

        width:1080px;

        padding:60px;

        box-sizing:border-box;

        background:
        linear-gradient(
          180deg,
          #2bb59d 0%,
          #f4efe8 260px
        );

      }

      .header{

        color:white;

      }

      .date{

        font-size:30px;

        opacity:0.95;

      }

      .weather{

        margin-top:12px;

        font-size:26px;

        opacity:0.9;

      }

      .main-title{

        margin-top:40px;

        font-size:72px;

        font-weight:bold;

        line-height:1.3;

      }

      .lesson{

        margin-top:20px;

        display:inline-block;

        padding:14px 30px;

        background:rgba(255,255,255,0.18);

        border-radius:999px;

        font-size:30px;

      }

      .card{

        margin-top:50px;

        background:white;

        border-radius:40px;

        padding:50px;

        box-shadow:
        0 10px 40px rgba(0,0,0,0.06);

      }

      .section-title{

        font-size:50px;

        font-weight:bold;

        color:#222;

        margin-bottom:40px;

      }

      .action-item{

        position:relative;

        padding-left:90px;

        padding-bottom:60px;

      }

      .line{

        position:absolute;

        left:22px;

        top:40px;

        width:2px;

        height:100%;

        background:#d8d8d8;

      }

      .dot{

        position:absolute;

        left:12px;

        top:16px;

        width:20px;

        height:20px;

        border-radius:50%;

        background:#21b59d;

      }

      .action-top{

        display:flex;

        align-items:center;

        flex-wrap:wrap;

      }

      .number{

        font-size:52px;

        font-weight:bold;

        color:#d3d3d3;

        width:60px;

      }

      .equipment{

        margin-left:10px;

        padding:6px 14px;

        border-radius:999px;

        background:#f2f2f2;

        font-size:24px;

        color:#666;

        font-weight:bold;

      }

      .name{

        margin-left:18px;

        font-size:42px;

        font-weight:bold;

        color:#222;

      }

      .benefit{

        margin-left:18px;

        font-size:30px;

        color:#777;

      }

      .comment{

        margin-top:24px;

        margin-left:90px;

        background:#f7f1e7;

        border-radius:20px;

        padding:24px 28px;

        font-size:28px;

        line-height:1.8;

        color:#7a6248;

      }

      .summary-box{

        margin-top:40px;

        background:#f7faf8;

        border:2px dashed #9fdbc9;

        border-radius:28px;

        padding:34px;

      }

      .summary-title{

        font-size:30px;

        color:#1ea38e;

        margin-bottom:16px;

        font-weight:bold;

      }

      .summary-text{

        font-size:34px;

        line-height:1.8;

        color:#444;

      }

      .footer-card{

  margin-top:80px;

  background:white;

  border-radius:32px;

  padding:32px 40px;

  display:flex;

  align-items:center;

  box-shadow:
  0 10px 30px rgba(0,0,0,0.05);

}

.logo-box{

  width:110px;
  height:110px;

  border-radius:24px;

  background:#f3efe8;

  display:flex;

  align-items:center;
  justify-content:center;

  font-size:26px;

  color:#9c8b78;

  margin-right:28px;

}

.studio-info{

  flex:1;

}

.studio-name{

  font-size:38px;

  font-weight:bold;

  color:#2f2f2f;

}

.studio-en{

  margin-top:10px;

  font-size:22px;

  letter-spacing:4px;

  color:#999;

}

    </style>

  </head>

  <body>

    <div class="poster">

      <div class="header">

        <div class="date">
          ${data.date}
        </div>

        <div class="weather">
          ${data.weather}
        </div>

        <div class="main-title">
          ${data.studentName}
          ·
          ${data.courseName}
        </div>

        <div class="lesson">
          ${data.lessonNumber}
        </div>

      </div>





      <div class="card">

        <div class="section-title">
          训练动作
        </div>

        ${data.actions.map((action, index) => `

          <div class="action-item">

            ${index !== data.actions.length - 1
              ? '<div class="line"></div>'
              : ''
            }

            <div class="dot"></div>

            <div class="action-top">

              <div class="number">
                ${action.number}
              </div>

              <div class="equipment">
                ${action.equipment}
              </div>

              <div class="name">
                ${action.name}
              </div>

              <div class="benefit">
                ${action.benefit}
              </div>

            </div>

            ${action.comment
              ? `
                <div class="comment">
                  ${action.comment}
                </div>
              `
              : ''
            }

          </div>

        `).join("")}




        <div class="summary-box">

          <div class="summary-title">
            课程总结
          </div>

          <div class="summary-text">
            ${data.summary}
          </div>

        </div>

      </div>




     <div class="footer-card">

  <div class="logo-box">
    LOGO
  </div>

  <div class="studio-info">

    <div class="studio-name">
      Han 普拉提工作室
    </div>

    <div class="studio-en">
      HAN PILATES STUDIO
    </div>

  </div>

</div>

    </div>

  </body>

  </html>

  `;




  // 页面尺寸
  await page.setViewport({

    width: 1080,
    height: 1920

  });




  // 加载 HTML
  await page.setContent(html);




  // 生成图片
  await page.screenshot({

    path: "poster.png",

    fullPage: true

  });




  await browser.close();




  res.json({

    success: true,

    message: "海报生成成功！"

  });

});




// 启动服务器
app.listen(PORT, () => {

  console.log(
    `服务器运行中：http://localhost:${PORT}`
  );

});