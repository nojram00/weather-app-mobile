import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import WindCoastal from "../components/WindCoastal";
import "./Home.css"; // Reuse the weather app styles
import React from "react";

export default function WindAdvisory() {
  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar className="weather-header">
          <IonTitle>Wind & Coastal Advisory</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <WindCoastal />
      </IonContent>
    </IonPage>
  );
}
