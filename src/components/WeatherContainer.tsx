import { useEffect, useState } from "react";
import "./WeatherContainer.css";
import { useTime } from "../hooks/useTime";
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonSpinner,
} from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";
import { 
  sunny, 
  partlySunny, 
  cloudy, 
  rainy, 
  thunderstorm,
  snow,
  water,
  thermometer
} from "ionicons/icons";

import React from "react";

interface ForecastData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
  };
}

export default function WeatherContainer() {
  const time = useTime();
  const [timeState, setTimeState] = useState("day");
  const [pending, setPending] = useState(true);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);

  useEffect(() => {
    if (time.hours >= 6 && time.hours < 18) {
      setTimeState("day");
    } else {
      setTimeState("night");
    }
  }, [time.hours]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const { coords } = await Geolocation.getCurrentPosition();
        const params = new URLSearchParams({
          latitude: coords.latitude.toString(),
          longitude: coords.longitude.toString(),
          daily: "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,wind_speed_10m_max",
          forecast_days: "7",
          timezone: "auto"
        });

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        const data = await response.json();
        setForecastData(data);
      } catch (error) {
        console.error('Forecast fetch error:', error);
      } finally {
        setPending(false);
      }
    };

    fetchForecast();
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return sunny;
    if (code <= 3) return partlySunny;
    if (code <= 48) return cloudy;
    if (code <= 67) return rainy;
    if (code <= 82) return rainy;
    if (code <= 99) return thunderstorm;
    return cloudy;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy';
    if (code <= 48) return 'Cloudy';
    if (code <= 67) return 'Rainy';
    if (code <= 82) return 'Showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Cloudy';
  };

  const getDayName = (dateString: string, index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="forecast-container" data-mode={timeState}>
      {pending ? (
        <div className="loading-container">
          <IonSpinner name="crescent" className="forecast-spinner"></IonSpinner>
          <p className="loading-text">Loading forecast...</p>
        </div>
      ) : (
        <IonGrid className="forecast-grid">
          {forecastData?.daily.time.map((date, index) => (
            <IonRow key={index}>
              <IonCol>
                <IonCard className="forecast-card">
                  <IonCardContent>
                    <div className="forecast-item">
                      <div className="forecast-day">
                        <span className="day-name">{getDayName(date, index)}</span>
                        <span className="date">
                          {new Date(date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      <div className="forecast-weather">
                        <IonIcon 
                          icon={getWeatherIcon(forecastData.daily.weather_code[index])} 
                          className="forecast-icon"
                        />
                        <span className="weather-desc">
                          {getWeatherDescription(forecastData.daily.weather_code[index])}
                        </span>
                      </div>
                      
                      <div className="forecast-temp">
                        <span className="temp-high">
                          {Math.round(forecastData.daily.temperature_2m_max[index])}°
                        </span>
                        <span className="temp-low">
                          {Math.round(forecastData.daily.temperature_2m_min[index])}°
                        </span>
                      </div>
                      
                      <div className="forecast-details">
                        <div className="detail-item">
                          <IonIcon icon={water} className="detail-icon-small" />
                          <span>{forecastData.daily.precipitation_probability_max[index]}%</span>
                        </div>
                        <div className="detail-item">
                          <IonIcon icon={thermometer} className="detail-icon-small" />
                          <span>{Math.round(forecastData.daily.wind_speed_10m_max[index])} km/h</span>
                        </div>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          ))}
        </IonGrid>
      )}
    </div>
  );
}
