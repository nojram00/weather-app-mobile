import { useEffect, useState } from "react";
import "./ForecastConditions.css";
import useWeather from "../hooks/weather";
import { useTime } from "../hooks/useTime";
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonSpinner,
  IonCardHeader,
  IonChip,
  IonBadge,
} from "@ionic/react";
import {
  warning,
  informationCircle,
  alertCircle,
  checkmarkCircle,
  location,
  calendar,
  cloudyNight,
  rainy,
  thunderstorm,
  snow,
  sunny,
  partlySunny,
  cloudy
} from "ionicons/icons";
import React from "react";

interface ForecastCondition {
  _id: string;
  date: string;
  impacts: string;
  place: string;
  weather_condition: string;
}

export default function ForecastConditions() {
  const time = useTime();
  const [timeState, setTimeState] = useState("day");
  const [forecast_cond, fetchForecastCond, error] = useWeather<ForecastCondition[]>(
    "https://weather-api-781h.onrender.com/forecast-conditions"
  );
  const [pending, setPending] = useState(true);

  useEffect(() => {
    if (time.hours >= 6 && time.hours < 18) {
      setTimeState("day");
    } else {
      setTimeState("night");
    }
  }, [time.hours]);

  useEffect(() => {
    fetchForecastCond();
  }, [fetchForecastCond]);

  useEffect(() => {
    if (forecast_cond || error) {
      setPending(false);
    }
  }, [forecast_cond, error]);

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return sunny;
    if (lowerCondition.includes('partly') || lowerCondition.includes('fair')) return partlySunny;
    if (lowerCondition.includes('cloudy') || lowerCondition.includes('overcast')) return cloudy;
    if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) return rainy;
    if (lowerCondition.includes('storm') || lowerCondition.includes('thunder')) return thunderstorm;
    if (lowerCondition.includes('snow') || lowerCondition.includes('blizzard')) return snow;
    if (lowerCondition.includes('night')) return cloudyNight;
    return cloudy;
  };

  const getSeverityLevel = (impacts: string) => {
    const lowerImpacts = impacts.toLowerCase();
    if (lowerImpacts.includes('severe') || lowerImpacts.includes('dangerous') || lowerImpacts.includes('extreme')) {
      return { level: 'severe', color: 'danger', icon: alertCircle };
    }
    if (lowerImpacts.includes('moderate') || lowerImpacts.includes('caution') || lowerImpacts.includes('warning')) {
      return { level: 'moderate', color: 'warning', icon: warning };
    }
    if (lowerImpacts.includes('minor') || lowerImpacts.includes('light') || lowerImpacts.includes('low')) {
      return { level: 'minor', color: 'medium', icon: informationCircle };
    }
    if (lowerImpacts.includes('none') || lowerImpacts.includes('clear') || lowerImpacts.includes('good')) {
      return { level: 'none', color: 'success', icon: checkmarkCircle };
    }
    return { level: 'info', color: 'primary', icon: informationCircle };
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  if (pending) {
    return (
      <div className="advisory-container" data-mode={timeState}>
        <div className="loading-container">
          <IonSpinner name="crescent" className="advisory-spinner"></IonSpinner>
          <p className="loading-text">Loading weather advisories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="advisory-container" data-mode={timeState}>
        <div className="error-container">
          <IonIcon icon={alertCircle} className="error-icon" />
          <h2 className="error-title">Unable to Load Advisories</h2>
          <p className="error-message">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="advisory-container" data-mode={timeState}>
      <IonGrid className="advisory-grid">
        {/* Header Card */}
        <IonRow>
          <IonCol>
            <IonCard className="advisory-header-card">
              <IonCardContent>
                <div className="header-content">
                  <IonIcon icon={warning} className="header-icon" />
                  <div className="header-text">
                    <h2 className="header-title">Weather Advisory</h2>
                    <p className="header-subtitle">Current conditions and forecasted impacts</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>

        {/* Advisory Cards */}
        {forecast_cond && forecast_cond.length > 0 ? (
          forecast_cond.map((advisory, idx) => {
            const severity = getSeverityLevel(advisory.impacts);
            return (
              <IonRow key={idx}>
                <IonCol>
                  <IonCard className={`advisory-card severity-${severity.level}`}>
                    <IonCardContent>
                      <div className="advisory-item">
                        {/* Date and Location Header */}
                        <div className="advisory-header">
                          <div className="date-location">
                            <div className="date-info">
                              <IonIcon icon={calendar} className="date-icon" />
                              <div className="date-text">
                                <span className="day-name">{getDayName(advisory.date)}</span>
                                <span className="date-full">
                                  {new Date(advisory.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                            <div className="location-info">
                              <IonIcon icon={location} className="location-icon" />
                              <span className="location-name">{advisory.place}</span>
                            </div>
                          </div>
                          <IonBadge color={severity.color} className="severity-badge">
                            <IonIcon icon={severity.icon} className="badge-icon" />
                            {severity.level.toUpperCase()}
                          </IonBadge>
                        </div>

                        {/* Weather Condition */}
                        <div className="weather-condition">
                          <IonIcon 
                            icon={getWeatherIcon(advisory.weather_condition)} 
                            className="condition-icon"
                          />
                          <div className="condition-info">
                            <span className="condition-label">Weather Condition</span>
                            <span className="condition-value">{advisory.weather_condition}</span>
                          </div>
                        </div>

                        {/* Impacts */}
                        <div className="impacts-section">
                          <div className="impacts-header">
                            <IonIcon icon={severity.icon} className="impacts-icon" />
                            <span className="impacts-label">Expected Impacts</span>
                          </div>
                          <div className="impacts-content">
                            <p className="impacts-text">{advisory.impacts}</p>
                          </div>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            );
          })
        ) : (
          <IonRow>
            <IonCol>
              <IonCard className="no-advisory-card">
                <IonCardContent>
                  <div className="no-advisory-content">
                    <IonIcon icon={checkmarkCircle} className="no-advisory-icon" />
                    <h3 className="no-advisory-title">No Active Advisories</h3>
                    <p className="no-advisory-message">
                      Current weather conditions are favorable with no significant impacts expected.
                    </p>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        )}
      </IonGrid>
    </div>
  );
}
