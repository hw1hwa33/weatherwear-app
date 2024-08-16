const express = require('express');
const { WebClient } = require('@slack/web-api');
const { getWeather } = require('../services/weatherService');

const router = express.Router();
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

router.post('/command', async (req, res) => {
  const { text: location, user_id } = req.body;

  try {
    // 서울의 격자 좌표를 예시로 설정 (필요에 따라 변경 가능)
    const nx = 60;
    const ny = 127;
    
    const weatherData = await getWeather(nx, ny);
    const weatherInfo = `현재 ${location}의 날씨 정보: ${weatherData[0].category} - ${weatherData[0].fcstValue}`;

    // Slack 메시지로 날씨 정보 전송
    await slackClient.chat.postMessage({
      channel: '#general',
      text: `Hello <@${user_id}>! ${weatherInfo}`
    });

    res.status(200).send('Weather data sent to Slack!');
  } catch (error) {
    console.error('Error processing Slack command:', error);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;
