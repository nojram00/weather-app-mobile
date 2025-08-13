import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import ForecastConditions from "../components/ForecastConditions";
import "./Home.css"; // Reuse the weather app styles
import React from "react";

export default function ForecastAdvisory() {
  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar className="weather-header">
          <IonTitle>Weather Advisory</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ForecastConditions />
      </IonContent>
    </IonPage>
  );
}
