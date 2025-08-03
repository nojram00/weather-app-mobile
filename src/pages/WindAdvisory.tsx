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
import WindCoastal from "../components/WindCoastal";

export default function WindAdvisory() {
  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Advisory - Wind and Coastal Waters</IonTitle>
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
        <WindCoastal />
      </IonContent>
    </IonPage>
  );
}
