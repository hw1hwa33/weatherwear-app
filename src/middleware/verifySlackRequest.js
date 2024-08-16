const crypto = require('crypto');

// Slack 서명을 검증하는 미들웨어 함수
const verifySlackRequest = (req, res, next) => {
  const slackSignature = req.headers['x-slack-signature'];
  const requestTimestamp = req.headers['x-slack-request-timestamp'];
  const signingSecret = process.env.SLACK_SIGNING_SECRET;

  // 요청이 너무 오래된 경우 무시 (기본적으로 5분 이전 요청은 무시)
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - (60 * 5);
  
  if (requestTimestamp < fiveMinutesAgo) {
    return res.status(400).send('Request is too old.');
  }

  // Slack의 서명 검증을 위한 기반 문자열 구성
  const sigBasestring = `v0:${requestTimestamp}:${req.rawBody}`;
  const mySignature = `v0=${crypto
    .createHmac('sha256', signingSecret)
    .update(sigBasestring, 'utf8')
    .digest('hex')}`;

  // 서명 비교 (타이밍 공격을 방지하기 위해 안전한 비교 방식 사용)
  if (crypto.timingSafeEqual(Buffer.from(mySignature, 'utf8'), Buffer.from(slackSignature, 'utf8'))) {
    next(); // 검증 통과 시 다음 미들웨어로 진행
  } else {
    return res.status(400).send('Slack verification failed');
  }
};

module.exports = verifySlackRequest;
