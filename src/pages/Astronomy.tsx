import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react'
import React from 'react'
import ExploreContainer from '../components/ExploreContainer'

export default function Astronomy() {
  return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Astronomy</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse='condense'>
                <IonToolbar>
                    <IonTitle size='large'>Astronomy</IonTitle>
                </IonToolbar>
            </IonHeader>
            <ExploreContainer name='Astronomy'></ExploreContainer>
        </IonContent>
    </IonPage>
  )
}
