import React, { useEffect, useState } from "react";
import "./ForecastConditions.css";
import useWeather from "../hooks/weather";
import { Geolocation } from "@capacitor/geolocation";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSpinner,
} from "@ionic/react";

export default function ForecastConditions() {
  const [forecast_cond, fetchForecastCond, error] = useWeather<
    {
      _id: string;
      date: string;
      impacts: string;
      place: string;
      weather_condition: string;
    }[]
  >("https://weather-api-781h.onrender.com/forecast-conditions");

  const [pending, setPending] = useState(true)
  useEffect(() => {
    fetchForecastCond();
  }, [fetchForecastCond]);

  useEffect(() => {
    if (forecast_cond) {
      setPending(false)
    }
  }, [forecast_cond]);

  if(pending){
    return(
      <div className="container">
        <IonSpinner></IonSpinner>
      </div>
    )
  }

  if(error){
    return(
      <div className="container">
        <h1>Error</h1>
      </div>
    )
  }

  return (
    <div className="container">
      <IonGrid>
        {forecast_cond &&
          forecast_cond.map((f, idx) => (
            <IonRow key={idx} id={f._id}>
              <IonCol>
                <IonCard color="medium">
                  <IonCardHeader className="forecast-header">
                    <IonCardTitle>
                      {new Date(f.date).toLocaleDateString([], { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long'})}
                    </IonCardTitle>
                    <IonCardSubtitle>{f.place}</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent className="forecast-content">
                    <div className="flex-col pt-5">
                        <IonLabel>
                          Weather Condition: {f.weather_condition}
                        </IonLabel>
                        <IonLabel>Impacts: {f.impacts}</IonLabel>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          ))}
      </IonGrid>
    </div>
  );
}
