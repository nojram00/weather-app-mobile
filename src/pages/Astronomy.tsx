import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react'
import React from 'react'
import AstroContainer from '../components/AstroContainer'

export default function Astronomy() {
  return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Sunrise / Sunset</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse='condense'>
                <IonToolbar>
                    <IonTitle size='large'>Sunrise / Sunset</IonTitle>
                </IonToolbar>
            </IonHeader>
            <AstroContainer />
        </IonContent>
    </IonPage>
  )
}
