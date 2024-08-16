const axios = require('axios');

// 기상청 API에서 날씨 정보를 가져오는 함수
const getWeather = async (nx, ny) => {
  const apiKey = AejhR2GmI7gR%2BDXAIbREg1jzQj4IvhTmDF4TooRgF9JRHXF%2Bitk6aOBvNOwwMWBivcblGFhFKN8qs%2Bqnaujs9A%3D%3D;  // 공공 데이터 포털에서 발급받은 API 키
  const url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst';
  const baseDate = '20240101';  // YYYYMMDD 형식으로 기준 날짜를 설정
  const baseTime = '0500';  // HHMM 형식으로 기준 시간을 설정
  
  const params = {
    serviceKey: apiKey,
    numOfRows: 10,
    pageNo: 1,
    base_date: baseDate,
    base_time: baseTime,
    nx: nx,  // 격자 좌표 X값
    ny: ny,  // 격자 좌표 Y값
    dataType: 'JSON'
  };

  try {
    const response = await axios.get(url, { params });
    const items = response.data.response.body.items.item;
    return items;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};

module.exports = { getWeather };
