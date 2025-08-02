import React, { useEffect } from "react";
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
} from "@ionic/react";

export default function WindCoastal() {
  const [wind_coastalWaters, fetchWindCoastal] = useWeather<
    {
      _id: string;
      date: string;
      place: string;
      speed: string;
      direction: string;
      coastal_water: string;
    }[]
  >("https://weather-api-781h.onrender.com/wind-and-coastal-waters");

  useEffect(() => {
    fetchWindCoastal();
  }, [fetchWindCoastal]);
  return (
    <div className="">
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonLabel className="black">Wind and Coastal Waters</IonLabel>
          </IonCol>
        </IonRow>
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
