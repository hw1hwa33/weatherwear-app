require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const slackRoutes = require('./routes/slack');
const verifySlackRequest = require('./middleware/verifySlackRequest');

const app = express();
const PORT = process.env.PORT || 3000;

// Slack에서 들어오는 요청의 원본 데이터를 저장하기 위한 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// Slack 요청에 대해 서명 검증 미들웨어를 적용
app.use(verifySlackRequest);

// Slack 관련 라우트 설정
app.use('/slack', slackRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
