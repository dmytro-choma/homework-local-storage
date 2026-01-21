
const API_KEY = '6233cd14d80db98f490d6623b1730ca2';
const CITY = 'Kherson, ua';
const CACHE_TIME = 2 * 60 * 60 * 1000;

const weatherEl = document.getElementById('weather');

async function fetchWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=uk`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Weather API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
  }

  const data = await response.json();

  localStorage.setItem('weatherData', JSON.stringify(data));
  localStorage.setItem('weatherTimestamp', Date.now().toString());

  return data;
}

function renderWeather(data) {
  weatherEl.innerHTML = `
    <h3>${data.name}</h3>
    <p>🌡 Температура: ${data.main.temp} °C</p>
    <p>☁️ ${data.weather[0].description}</p>
    <p>💨 Вітер: ${data.wind.speed} м/с</p>
  `;
}

async function getWeather() {
  const cachedData = localStorage.getItem('weatherData');
  const cachedTime = localStorage.getItem('weatherTimestamp');

  if (cachedData && cachedTime) {
    const age = Date.now() - Number(cachedTime);

    if (age < CACHE_TIME) {
      renderWeather(JSON.parse(cachedData));
      return;
    }
  }

  try {
    const data = await fetchWeather();
    renderWeather(data);
  } catch (e) {
    weatherEl.textContent = 'Не вдалося отримати погоду';
    console.error(e);
  }
}

getWeather();
