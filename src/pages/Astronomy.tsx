import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import AstroContainer from "../components/AstroContainer";
import "./Home.css"; // Reuse the weather app styles

import React from "react";

export default function Astronomy() {
  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar className="weather-header">
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Astronomy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <AstroContainer />
      </IonContent>
    </IonPage>
  );
}
