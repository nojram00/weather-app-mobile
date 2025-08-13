import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  sunny,
  partlySunny,
  cloudy,
  rainy,
  thunderstorm,
  snow,
  eye,
  water,
  thermometer,
  speedometer,
  compass,
} from "ionicons/icons";
import React, { useState } from "react";
import "./Home.css";
import { hourToMs } from "../utils/timeConverter";
import { Geolocation } from "@capacitor/geolocation";

export default function Home() {
  const greetingRef = React.useRef<HTMLSpanElement>(null);
  const dateRef = React.useRef<HTMLSpanElement>(null);
  const timeRef = React.useRef<HTMLSpanElement>(null);

  const [dataTime, setTime] = React.useState("day");
  const [coords, setCoords] = React.useState({
    longitude: 0,
    latitude: 0,
  });

  const [astronomical_report, setReport] = useState({
    sunrise: "",
    sunset: "",
  });

  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    condition: "sunny",
    humidity: 0,
    windSpeed: 0,
    windDirection: 0,
    visibility: 0,
    pressure: 0,
    location: "Loading...",
  });

  React.useEffect(() => {
    const el = dateRef.current;
    if (!el) return;
    const updateGreeting = () => {
      const hours = new Date().getHours();

      if (hours < 12) {
        el.textContent = "Good Morning!";
        setTime("day");
      } else if (hours < 18) {
        el.textContent = "Good Afternoon!";
        setTime("afternoon");
      } else {
        el.textContent = "Good Evening!";
        setTime("night");
      }
    };

    updateGreeting();

    const interval = setInterval(updateGreeting, hourToMs(1));

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const el = dateRef.current;
    if (!el) return;

    el.textContent = new Date().toLocaleDateString([], {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  }, []);

  React.useEffect(() => {
    const el = timeRef.current;

    if (!el) return;

    const updateTime = () => {
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      el.textContent = time;
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get Coordinates:
  React.useEffect(() => {
    Geolocation.getCurrentPosition().then((coordinates) => {
      setCoords({
        longitude: coordinates.coords.longitude,
        latitude: coordinates.coords.latitude,
      });
    });
  }, []);

  // Fetch Weather Data:
  React.useEffect(() => {
    if (coords.latitude === 0 && coords.longitude === 0) return;

    const params = new URLSearchParams({
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      current:
        "temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,visibility,surface_pressure,weather_code",
      daily: "sunrise,sunset",
      forecast_days: "1",
      timezone: "auto",
    });

    fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        const current = data.current;
        const daily = data.daily;

        // Map weather codes to conditions
        const getWeatherCondition = (code: number) => {
          if (code === 0) return "sunny";
          if (code <= 3) return "partlySunny";
          if (code <= 48) return "cloudy";
          if (code <= 67) return "rainy";
          if (code <= 82) return "rainy";
          if (code <= 99) return "thunderstorm";
          return "cloudy";
        };

        setWeatherData({
          temperature: Math.round(current.temperature_2m),
          condition: getWeatherCondition(current.weather_code),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          windDirection: current.wind_direction_10m,
          visibility: Math.round(current.visibility / 1000),
          pressure: Math.round(current.surface_pressure),
          location: "Current Location",
        });

        const _sunrise = new Date(daily.sunrise[0]);
        const _sunset = new Date(daily.sunset[0]);

        setReport({
          sunrise: _sunrise.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          sunset: _sunset.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        });
      })
      .catch((error) => {
        console.error("Weather fetch error:", error);
      });
  }, [coords]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return sunny;
      case "partlySunny":
        return partlySunny;
      case "cloudy":
        return cloudy;
      case "rainy":
        return rainy;
      case "thunderstorm":
        return thunderstorm;
      case "snow":
        return snow;
      default:
        return sunny;
    }
  };

  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar className="weather-header">
          <IonTitle>Weather</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div id="wrapper" data-mode={dataTime}>
          <IonGrid className="weather-grid">
            {/* Main Weather Display */}
            <IonRow>
              <IonCol>
                <div className="main-weather-card">
                  <div className="location">
                    <span>{weatherData.location}</span>
                  </div>
                  <div className="current-weather">
                    <IonIcon
                      icon={getWeatherIcon(weatherData.condition)}
                      className="weather-icon"
                    />
                    <div className="temperature">
                      {weatherData.temperature}°
                    </div>
                  </div>
                  <div className="greeting-time">
                    <span ref={greetingRef} className="greeting"></span>
                    <span ref={dateRef} className="date"></span>
                    <span ref={timeRef} className="time"></span>
                  </div>
                </div>
              </IonCol>
            </IonRow>

            {/* Weather Details Grid */}
            <IonRow>
              <IonCol size="6">
                <IonCard className="weather-detail-card">
                  <IonCardContent>
                    <div className="detail-item">
                      <IonIcon icon={thermometer} className="detail-icon" />
                      <div className="detail-info">
                        <span className="detail-label">Humidity</span>
                        <span className="detail-value">
                          {weatherData.humidity}%
                        </span>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard className="weather-detail-card">
                  <IonCardContent>
                    <div className="detail-item">
                      <IonIcon icon={speedometer} className="detail-icon" />
                      <div className="detail-info">
                        <span className="detail-label">Wind</span>
                        <span className="detail-value">
                          {weatherData.windSpeed} km/h
                        </span>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol size="6">
                <IonCard className="weather-detail-card">
                  <IonCardContent>
                    <div className="detail-item">
                      <IonIcon icon={eye} className="detail-icon" />
                      <div className="detail-info">
                        <span className="detail-label">Visibility</span>
                        <span className="detail-value">
                          {weatherData.visibility} km
                        </span>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard className="weather-detail-card">
                  <IonCardContent>
                    <div className="detail-item">
                      <IonIcon icon={water} className="detail-icon" />
                      <div className="detail-info">
                        <span className="detail-label">Pressure</span>
                        <span className="detail-value">
                          {weatherData.pressure} hPa
                        </span>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>

            {/* Sun Times */}
            <IonRow>
              <IonCol size="6">
                <IonCard className="sun-card sunrise">
                  <IonCardContent>
                    <div className="sun-info">
                      <span className="sun-label">Sunrise</span>
                      <span className="sun-time">
                        {astronomical_report.sunrise}
                      </span>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard className="sun-card sunset">
                  <IonCardContent>
                    <div className="sun-info">
                      <span className="sun-label">Sunset</span>
                      <span className="sun-time">
                        {astronomical_report.sunset}
                      </span>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
}
