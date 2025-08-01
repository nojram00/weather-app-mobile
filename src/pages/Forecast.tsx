import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react'
import React from 'react'
import WeatherContainer from '../components/WeatherContainer'

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
            {/* <ExploreContainer name='Forecast'></ExploreContainer> */}
            <WeatherContainer />
        </IonContent>
    </IonPage>
  )
}
