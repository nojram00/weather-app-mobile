import { useEffect, useState } from "react";
import useWeather from "../hooks/weather";
import { useTime } from "../hooks/useTime";
import "./WindCoastal.css";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonIcon,
  IonBadge,
} from "@ionic/react";
import {
  compass,
  speedometer,
  water,
  location,
  calendar,
  alertCircle,
  checkmarkCircle,
  warning,
  informationCircle,
  boat,
  flag,
} from "ionicons/icons";
import React from "react";

interface WindCoastalData {
  _id: string;
  date: string;
  place: string;
  speed: string;
  direction: string;
  coastal_water: string;
}

export default function WindCoastal() {
  const time = useTime();
  const [timeState, setTimeState] = useState("day");
  const [wind_coastalWaters, fetchWindCoastal, error] = useWeather<
    WindCoastalData[]
  >("https://weather-api-781h.onrender.com/wind-and-coastal-waters");
  const [pending, setPending] = useState(true);

  useEffect(() => {
    if (time.hours >= 6 && time.hours < 18) {
      setTimeState("day");
    } else {
      setTimeState("night");
    }
  }, [time.hours]);

  useEffect(() => {
    fetchWindCoastal();
  }, [fetchWindCoastal]);

  useEffect(() => {
    if (wind_coastalWaters || error) {
      setPending(false);
    }
  }, [wind_coastalWaters, error]);

  const getWindSeverity = (speed: string) => {
    const speedValue = parseFloat(speed.replace(/[^\d.]/g, ""));
    if (speedValue >= 40) {
      return {
        level: "severe",
        color: "danger",
        icon: alertCircle,
        label: "HIGH WIND",
      };
    }
    if (speedValue >= 25) {
      return {
        level: "moderate",
        color: "warning",
        icon: warning,
        label: "MODERATE",
      };
    }
    if (speedValue >= 15) {
      return {
        level: "minor",
        color: "medium",
        icon: informationCircle,
        label: "LIGHT",
      };
    }
    return {
      level: "calm",
      color: "success",
      icon: checkmarkCircle,
      label: "CALM",
    };
  };

  const getCoastalSeverity = (coastal: string) => {
    const lowerCoastal = coastal.toLowerCase();
    if (
      lowerCoastal.includes("rough") ||
      lowerCoastal.includes("very rough") ||
      lowerCoastal.includes("high")
    ) {
      return { level: "severe", color: "danger", icon: alertCircle };
    }
    if (lowerCoastal.includes("moderate") || lowerCoastal.includes("choppy")) {
      return { level: "moderate", color: "warning", icon: warning };
    }
    if (lowerCoastal.includes("slight") || lowerCoastal.includes("light")) {
      return { level: "minor", color: "medium", icon: informationCircle };
    }
    return { level: "calm", color: "success", icon: checkmarkCircle };
  };

  const getDirectionIcon = (direction: string) => {
    // Return compass icon for all directions
    return compass;
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  if (pending) {
    return (
      <div className="wind-container" data-mode={timeState}>
        <div className="loading-container">
          <IonSpinner name="crescent" className="wind-spinner"></IonSpinner>
          <p className="loading-text">Loading wind & coastal data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wind-container" data-mode={timeState}>
        <div className="error-container">
          <IonIcon icon={alertCircle} className="error-icon" />
          <h2 className="error-title">Unable to Load Wind Data</h2>
          <p className="error-message">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="wind-container" data-mode={timeState}>
      <IonGrid className="wind-grid">
        {/* Header Card */}
        <IonRow>
          <IonCol>
            <IonCard className="wind-header-card">
              <IonCardContent>
                <div className="header-content">
                  <IonIcon icon={flag} className="header-icon" />
                  <div className="header-text">
                    <h2 className="header-title">Wind & Coastal Advisory</h2>
                    <p className="header-subtitle">
                      Current wind conditions and coastal water status
                    </p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>

        {/* Wind Advisory Cards */}
        {wind_coastalWaters && wind_coastalWaters.length > 0 ? (
          wind_coastalWaters.map((advisory, idx) => {
            const windSeverity = getWindSeverity(advisory.speed);
            const coastalSeverity = getCoastalSeverity(advisory.coastal_water);
            const overallSeverity =
              windSeverity.level === "severe" ||
              coastalSeverity.level === "severe"
                ? windSeverity.level === "severe"
                  ? windSeverity
                  : coastalSeverity
                : windSeverity.level === "moderate" ||
                  coastalSeverity.level === "moderate"
                ? windSeverity.level === "moderate"
                  ? windSeverity
                  : coastalSeverity
                : windSeverity;

            return (
              <IonRow key={idx}>
                <IonCol>
                  <IonCard
                    className={`wind-card severity-${overallSeverity.level}`}
                  >
                    <IonCardContent>
                      <div className="wind-item">
                        {/* Date and Location Header */}
                        <div className="wind-header">
                          <div className="date-location">
                            <div className="date-info">
                              <IonIcon icon={calendar} className="date-icon" />
                              <div className="date-text">
                                <span className="day-name">
                                  {getDayName(advisory.date)}
                                </span>
                                <span className="date-full">
                                  {new Date(advisory.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="location-info">
                              <IonIcon
                                icon={location}
                                className="location-icon"
                              />
                              <span className="location-name">
                                {advisory.place}
                              </span>
                            </div>
                          </div>
                          <IonBadge
                            color={overallSeverity.color}
                            className="severity-badge"
                          >
                            <IonIcon
                              icon={overallSeverity.icon}
                              className="badge-icon"
                            />
                            {windSeverity.label}
                          </IonBadge>
                        </div>

                        {/* Wind Information */}
                        <div className="wind-info-grid">
                          <div className="wind-speed-card">
                            <div className="info-header">
                              <IonIcon
                                icon={speedometer}
                                className="info-icon"
                              />
                              <span className="info-label">Wind Speed</span>
                            </div>
                            <div className="info-content">
                              <span className="info-value">
                                {advisory.speed}
                              </span>
                              <IonBadge
                                color={windSeverity.color}
                                className="mini-badge"
                              >
                                {windSeverity.label}
                              </IonBadge>
                            </div>
                          </div>

                          <div className="wind-direction-card">
                            <div className="info-header">
                              <IonIcon
                                icon={getDirectionIcon(advisory.direction)}
                                className="info-icon"
                              />
                              <span className="info-label">Wind Direction</span>
                            </div>
                            <div className="info-content">
                              <span className="info-value">
                                {advisory.direction}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Coastal Waters */}
                        <div className="coastal-section">
                          <div className="coastal-header">
                            <IonIcon icon={boat} className="coastal-icon" />
                            <span className="coastal-label">
                              Coastal Waters
                            </span>
                            <IonBadge
                              color={coastalSeverity.color}
                              className="coastal-badge"
                            >
                              <IonIcon
                                icon={coastalSeverity.icon}
                                className="badge-icon"
                              />
                            </IonBadge>
                          </div>
                          <div className="coastal-content">
                            <IonIcon icon={water} className="water-icon" />
                            <p className="coastal-text">
                              {advisory.coastal_water}
                            </p>
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
              <IonCard className="no-wind-card">
                <IonCardContent>
                  <div className="no-wind-content">
                    <IonIcon icon={checkmarkCircle} className="no-wind-icon" />
                    <h3 className="no-wind-title">No Active Wind Advisories</h3>
                    <p className="no-wind-message">
                      Current wind and coastal conditions are favorable with no
                      significant advisories.
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
