import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react'
import React from 'react'
import ExploreContainer from '../components/ExploreContainer'

export default function Forecast() {

    

  return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Forecast</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse='condense'>
                <IonToolbar>
                    <IonTitle size='large'>Forecast</IonTitle>
                </IonToolbar>
            </IonHeader>
            <ExploreContainer name='Astronomy'></ExploreContainer>
        </IonContent>
    </IonPage>
  )
}
