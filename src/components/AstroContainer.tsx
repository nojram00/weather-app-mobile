import { useEffect, useState } from "react";
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
  moon, 
  time as timeIcon,
  calendar,
  location,
  arrowUp,
  arrowDown
} from "ionicons/icons";
import "./AstroContainer.css";
import React from "react";

interface AstronomyData {
  daily: {
    time: string[];
    sunrise: string[];
    sunset: string[];
  };
}

export default function AstroContainer() {
  const time = useTime();
  const [timeState, setTimeState] = useState<"day" | "night">("day");
  const [pending, setPending] = useState(true);
  const [astronomyData, setAstronomyData] = useState<AstronomyData | null>(null);
  const [currentLocation, setCurrentLocation] = useState("Loading...");

  useEffect(() => {
    if (time.hours >= 6 && time.hours < 18) {
      setTimeState("day");
    } else {
      setTimeState("night");
    }
  }, [time]);

  useEffect(() => {
    const fetchAstronomy = async () => {
      try {
        const { coords } = await Geolocation.getCurrentPosition();
        
        // Fetch location name
        try {
          const locationResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
          );
          const locationData = await locationResponse.json();
          setCurrentLocation(locationData.city || locationData.locality || "Current Location");
        } catch {
          setCurrentLocation("Current Location");
        }

        // Fetch astronomy data
        const params = new URLSearchParams({
          latitude: coords.latitude.toString(),
          longitude: coords.longitude.toString(),
          daily: "sunrise,sunset",
          forecast_days: "7",
          timezone: "auto"
        });

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        const data = await response.json();
        setAstronomyData(data);
      } catch (error) {
        console.error('Astronomy fetch error:', error);
      } finally {
        setPending(false);
      }
    };

    fetchAstronomy();
  }, []);

  const getDayName = (dateString: string, index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateDayLength = (sunrise: string, sunset: string) => {
    const sunriseTime = new Date(sunrise);
    const sunsetTime = new Date(sunset);
    const diffMs = sunsetTime.getTime() - sunriseTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getCurrentSunStatus = () => {
    if (!astronomyData) return null;
    
    const now = new Date();
    const todaySunrise = new Date(astronomyData.daily.sunrise[0]);
    const todaySunset = new Date(astronomyData.daily.sunset[0]);
    
    if (now < todaySunrise) {
      return { status: 'before-sunrise', nextEvent: 'sunrise', time: todaySunrise };
    } else if (now < todaySunset) {
      return { status: 'daylight', nextEvent: 'sunset', time: todaySunset };
    } else {
      const tomorrowSunrise = new Date(astronomyData.daily.sunrise[1]);
      return { status: 'after-sunset', nextEvent: 'sunrise', time: tomorrowSunrise };
    }
  };

  const sunStatus = getCurrentSunStatus();

  return (
    <div className="astronomy-container" data-mode={timeState}>
      {pending ? (
        <div className="loading-container">
          <IonSpinner name="crescent" className="astronomy-spinner"></IonSpinner>
          <p className="loading-text">Loading astronomy data...</p>
        </div>
      ) : (
        <IonGrid className="astronomy-grid">
          {/* Current Status Card */}
          <IonRow>
            <IonCol>
              <IonCard className="current-status-card">
                <IonCardContent>
                  <div className="status-header">
                    <IonIcon icon={location} className="location-icon" />
                    <span className="location-name">{currentLocation}</span>
                  </div>
                  
                  {sunStatus && (
                    <div className="sun-status">
                      <div className="status-info">
                        <IonIcon 
                          icon={sunStatus.nextEvent === 'sunrise' ? sunny : moon} 
                          className="status-icon"
                        />
                        <div className="status-text">
                          <span className="status-label">
                            {sunStatus.status === 'before-sunrise' && 'Sun rises in'}
                            {sunStatus.status === 'daylight' && 'Sun sets in'}
                            {sunStatus.status === 'after-sunset' && 'Sun rises in'}
                          </span>
                          <span className="status-time">
                            {formatTime(sunStatus.time.toISOString())}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Daily Astronomy Cards */}
          {astronomyData?.daily.time.map((date, index) => (
            <IonRow key={index}>
              <IonCol>
                <IonCard className="astronomy-card">
                  <IonCardContent>
                    <div className="astronomy-item">
                      <div className="astronomy-day">
                        <IonIcon icon={calendar} className="calendar-icon" />
                        <div className="day-info">
                          <span className="day-name">{getDayName(date, index)}</span>
                          <span className="date">
                            {new Date(date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: index === 0 ? undefined : 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="sun-times">
                        <div className="sun-event sunrise-event">
                          <div className="event-header">
                            <IonIcon icon={arrowUp} className="event-arrow" />
                            <IonIcon icon={sunny} className="sun-icon" />
                            <span className="event-label">Sunrise</span>
                          </div>
                          <span className="event-time">
                            {formatTime(astronomyData.daily.sunrise[index])}
                          </span>
                        </div>
                        
                        <div className="sun-event sunset-event">
                          <div className="event-header">
                            <IonIcon icon={arrowDown} className="event-arrow" />
                            <IonIcon icon={moon} className="moon-icon" />
                            <span className="event-label">Sunset</span>
                          </div>
                          <span className="event-time">
                            {formatTime(astronomyData.daily.sunset[index])}
                          </span>
                        </div>
                      </div>
                      
                      <div className="day-length">
                        <IonIcon icon={timeIcon} className="time-icon" />
                        <div className="length-info">
                          <span className="length-label">Daylight</span>
                          <span className="length-value">
                            {calculateDayLength(
                              astronomyData.daily.sunrise[index], 
                              astronomyData.daily.sunset[index]
                            )}
                          </span>
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
