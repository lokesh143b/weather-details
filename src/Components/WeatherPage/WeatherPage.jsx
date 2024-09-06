import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './WeatherPage.css';
import searchIcon from '../../assets/search.png';
import clear from '../../assets/clear.png';
import clouds from '../../assets/clouds.png';
import drizzle from '../../assets/drizzle.png';
import mist from '../../assets/mist.png';
import rain from '../../assets/rain.png';
import snow from '../../assets/snow.png';
import haze from '../../assets/haze.png';

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [weather, setWeather] = useState('');
  const [bgImage, setBgImage] = useState('');
  const inputRef = useRef();
  const { cityName } = useParams(); 

  const getWeatherData = async (city) => {
    if (city === '') {
      alert('Enter city');
      return;
    }
    const API_KEY = '91acfebadd5aff0554db013fdcf3bce0';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setWeatherData(data);

        switch (data.weather[0].main) {
          case 'Clear':
            return (
              setWeather(clear),
              setBgImage(
                'https://img.freepik.com/premium-photo/blue-sky_33836-97.jpg'
              )
            );
          case 'Clouds':
            return (
              setWeather(clouds),
              setBgImage(
                'https://c8.alamy.com/comp/2B23YW6/gorgeous-cloudscape-in-springtime-weather-background-with-dynamic-cloud-arrangement-on-a-blue-sky-sunny-and-windy-day-good-weather-forecast-concept-2B23YW6.jpg'
              )
            );
          case 'Drizzle':
            return (
              setWeather(drizzle),
              setBgImage(
                'https://static.vecteezy.com/system/resources/previews/029/887/463/non_2x/rain-drops-on-window-glasses-surface-with-blurred-blue-sky-background-natural-backdrop-of-raindrops-abstract-overlay-for-design-the-concept-of-bad-rainy-weather-rainy-season-photo.jpg'
              )
            );
          case 'Mist':
            return (
              setWeather(mist),
              setBgImage(
                'https://c1.wallpaperflare.com/preview/263/621/319/trees-fog-forest-forrest.jpg'
              )
            );
          case 'Rain':
            return (
              setWeather(rain),
              setBgImage(
                'https://image.slidesdocs.com/responsive-images/background/rainy-season-in-a-moody-stormy-sky-3d-rendering-of-heavy-rainfall-powerpoint-background_0ae549a487__960_540.jpg'
              )
            );
          case 'Snow':
            return (
              setWeather(snow),
              setBgImage(
                'https://images.pexels.com/photos/259583/pexels-photo-259583.jpeg?auto=compress&cs=tinysrgb&w=600'
              )
            );
          case 'Haze':
            return (
              setWeather(haze),
              setBgImage(
                'https://images.unsplash.com/photo-1542669334-9f30f4af1266?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              )
            );
          default:
            return null;
        }
      } else {
        alert('City not found');
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    
      getWeatherData(cityName);
    
  }, []);

  const onclickSearch = (city) => {
    getWeatherData(city);
    inputRef.current.value = '';
  };

  const bgStyle = {
    backgroundImage: `url("${bgImage}")`,
    backgroundSize: 'cover',
  };

  return (
    <div className="weather-container">
      {/* navbar */}
      <div className="nav-bar">
        <div className="input-search">
          <input
            type="text"
            placeholder="Enter city name"
            ref={inputRef}
          />
          <div
            onClick={() => {
              onclickSearch(inputRef.current.value.trim(''));
            }}
            className="search"
          >
            <img src={searchIcon} alt="search" />
          </div>
        </div>
      </div>

      {/* body */}
      {weatherData ? (
        <div className="information-container" style={bgStyle}>
          <h1 className="city-name">{weatherData.name}</h1>
          <div className="temp-container">
            <img src={weather} alt="weather" />
            <div>{Math.round(weatherData.main.temp)}°C</div>
          </div>
          <h1 className="weather-type">{weatherData.weather[0].main}</h1>

          <div className="weather-conditions">
            <div>Feels Like: {Math.round(weatherData.main.feels_like)}°C</div>
            <div>Min Temp: {Math.round(weatherData.main.temp_min)} °C</div>
            <div>Max Temp: {Math.round(weatherData.main.temp_max)} °C</div>
            <div>Wind Speed: {Math.round(weatherData.wind.speed)} km/h</div>
            <div>Barometer: {weatherData.main.pressure}.00 mb</div>
          </div>

          {/* Daily forecast component */}
        </div>
      ) : null}
    </div>
  );
};

export default WeatherPage;
