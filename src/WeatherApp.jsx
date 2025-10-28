import React, { useState } from "react";
import "./WeatherApp.css";
import "./index.css";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const weatherDescriptions = {
    0: "Clear Sky ☀️",
    1: "Mainly Clear 🌤️",
    2: "Partly Cloudy ⛅",
    3: "Overcast ☁️",
    45: "Fog 🌫️",
    48: "Depositing Rime Fog 🌫️",
    51: "Light Drizzle 🌦️",
    53: "Moderate Drizzle 🌧️",
    55: "Dense Drizzle 🌧️",
    61: "Slight Rain 🌧️",
    63: "Moderate Rain 🌧️",
    65: "Heavy Rain 🌧️",
    71: "Slight Snowfall ❄️",
    73: "Moderate Snowfall ❄️",
    75: "Heavy Snowfall ❄️",
    95: "Thunderstorm ⛈️",
    99: "Hail Storm 🌨️",
  };

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name!");
      setWeather(null);
      return;
    }

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found!");
        setWeather(null);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=apparent_temperature,relative_humidity_2m&timezone=auto`
      );
      const weatherData = await weatherRes.json();

      if (!weatherData.current_weather) {
        setError("Weather data not available.");
        setWeather(null);
        return;
      }

      const current = weatherData.current_weather;
      const currentIndex = weatherData.hourly.time.indexOf(current.time);
      const feelsLike = weatherData.hourly.apparent_temperature?.[currentIndex];
      const humidity = weatherData.hourly.relative_humidity_2m?.[currentIndex];

      setWeather({
        name,
        country,
        temp: current.temperature,
        windspeed: current.windspeed,
        winddir: current.winddirection,
        condition: weatherDescriptions[current.weathercode] || "Unknown",
        feelsLike,
        humidity,
        time: current.time,
      });

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data.");
      setWeather(null);
    }
  };

  // 🌗 Toggle dark mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <>
      {/* 🌗 Toggle Button positioned at the page corner */}
      <button className="toggle-btn" onClick={toggleTheme}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="weather-container">
        <h1 className="title">🌤️ Weather Now</h1>

        <div className="input-section">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="city-input"
          />
          <button onClick={fetchWeather} className="weather-btn">
            Get Weather
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-card">
            <h2>
              {weather.name}, {weather.country}
            </h2>
            <p>🕒 Local Time: <span>{new Date(weather.time).toLocaleString()}</span></p>
            <p>🌡️ Temperature: <span>{weather.temp}°C</span></p>
            <p>💧 Humidity: <span>{weather.humidity}%</span></p>
            <p>🌬️ Wind Speed: <span>{weather.windspeed} km/h</span></p>
            <p>🧭 Wind Direction: <span>{weather.winddir}°</span></p>
            <p>☁️ Condition: <span>{weather.condition}</span></p>
          </div>
        )}
      </div>
    </>
  );
};

export default WeatherApp;
