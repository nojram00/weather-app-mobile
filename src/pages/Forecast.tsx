import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import React from "react";
import WeatherContainer from "../components/WeatherContainer";
import "./Home.css"; // Reuse the weather app styles

export default function Forecast() {
  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar className="weather-header">
          <IonTitle>7-Day Forecast</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <WeatherContainer />
      </IonContent>
    </IonPage>
  );
}
