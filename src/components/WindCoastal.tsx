import React, { useEffect, useState } from "react";
import useWeather from "../hooks/weather";
import "./WindCoastal.css";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSpinner,
} from "@ionic/react";

export default function WindCoastal() {
  const [wind_coastalWaters, fetchWindCoastal, error] = useWeather<
    {
      _id: string;
      date: string;
      place: string;
      speed: string;
      direction: string;
      coastal_water: string;
    }[]
  >("https://weather-api-781h.onrender.com/wind-and-coastal-waters");

  const [pending, setPending] = useState(true)

  useEffect(() => {
    fetchWindCoastal();
  }, [fetchWindCoastal]);

  useEffect(() => {
    if (wind_coastalWaters) {
      setPending(false)
    }
  }, [wind_coastalWaters]);

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
        {wind_coastalWaters &&
          wind_coastalWaters.map((w, idx) => (
            <IonRow key={idx} id={w._id}>
              <IonCol>
                <IonCard color="medium">
                  <IonCardHeader className="forecast-header">
                    <IonCardTitle>
                      {new Date(w.date).toLocaleString()}
                    </IonCardTitle>
                    <IonCardSubtitle>{w.place}</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent className="forecast-content">
                    <div className="flex-col pt-5">
                      <IonLabel>Speed: {w.speed}</IonLabel>
                      <IonLabel>Direction: {w.direction}</IonLabel>
                      <IonLabel>Coastal Water: {w.coastal_water}</IonLabel>
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
