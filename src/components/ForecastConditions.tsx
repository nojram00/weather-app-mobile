import React, { useEffect } from "react";
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
} from "@ionic/react";

export default function ForecastConditions() {
  const [forecast_cond, fetchForecastCond] = useWeather<
    {
      _id: string;
      date: string;
      impacts: string;
      place: string;
      weather_condition: string;
    }[]
  >("https://weather-api-781h.onrender.com/forecast-conditions");

  useEffect(() => {
    fetchForecastCond();
  }, [fetchForecastCond]);

  useEffect(() => {
    if (forecast_cond) {
      console.log("Data: ", forecast_cond);
    }
  }, [forecast_cond]);

  return (
    <div className="container">
      {/* <IonList lines="none" className="p-10">
        <IonLabel>Forecast Conditions</IonLabel>
        { forecast_cond && forecast_cond.map((f, idx) => (
            <IonItem key={idx}>
                <IonCard>
                    <IonCardHeader>
                        { new Date(f.date).toLocaleString() }
                    </IonCardHeader>
                </IonCard>
            </IonItem>
        ))}
      </IonList> */}

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
