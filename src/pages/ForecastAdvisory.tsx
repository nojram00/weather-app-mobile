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
import ForecastConditions from "../components/ForecastConditions";

export default function ForecastAdvisory() {
  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Advisory - Forecast Conditions</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Sunrise / Sunset</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ForecastConditions />
      </IonContent>
    </IonPage>
  );
}
