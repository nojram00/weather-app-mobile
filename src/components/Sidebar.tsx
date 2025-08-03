import { IonAccordion, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonPopover, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";

export default function Sidebar() {
  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>MENU</IonTitle>
            <IonButtons slot="start">
                <IonMenuButton></IonMenuButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            <IonList lines="none">
                <IonItem id="advisory">
                    Tropical Cyclone Advisory
                </IonItem>
                <IonPopover trigger="advisory" side="right" alignment="center">
                    <IonContent>
                        <IonList>
                            <IonItem routerLink="/forecast-conditions">
                                <IonLabel>Forecast Condition</IonLabel>
                            </IonItem>
                            <IonItem routerLink="/wind-and-coastal-waters">
                                <IonLabel>Wind and Coastal Waters</IonLabel>
                            </IonItem>
                        </IonList>
                    </IonContent>
                </IonPopover>
            </IonList>
        </IonContent>
      </IonMenu>
    </>
  );
}
