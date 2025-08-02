import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";
import "./Home.css";
import { hourToMs } from "../utils/timeConverter";
import { Geolocation } from '@capacitor/geolocation';
import ForecastConditions from "../components/ForecastConditions";
import WindCoastal from "../components/WindCoastal";

export default function Home() {
  const greetingRef = React.useRef<HTMLSpanElement>(null);
  const dateRef = React.useRef<HTMLSpanElement>(null);
  const timeRef = React.useRef<HTMLSpanElement>(null);

  const [dataTime, setTime] = React.useState('day');
  const [coords, setCoords] = React.useState({
    longitude: 0,
    latitude: 0
  })

  const [astronomical_report, setReport] = useState({
    sunrise: "",
    sunset: "",
  });

  React.useEffect(() => {
    const el = dateRef.current;
    if (!el) return;
    const updateGreeting = () => {
      const hours = new Date().getHours();

      if (hours < 12) {
        el.textContent = "Good Morning!";
        setTime('day')
      } else if (hours < 18) {
        el.textContent = "Good Afternoon!";
        setTime('afternoon')
      } else {
        el.textContent = "Good Evening!";
        setTime('night')
      }
    };

    updateGreeting()

    const interval = setInterval(updateGreeting, hourToMs(1));

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const el = dateRef.current;
    if (!el) return;

    el.textContent = new Date().toLocaleDateString([], {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  }, []);

  React.useEffect(() => {
    const el = timeRef.current;

    if (!el) return;

    const updateTime = () => {
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });

      el.textContent = time;
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get Coordinates:
  React.useEffect(() => {
    Geolocation.getCurrentPosition().then(coordinates => {
        setCoords({
            longitude: coordinates.coords.longitude,
            latitude: coordinates.coords.latitude
        })
    })
  }, [])

  // Fetch Sunrise / Sunset:
  React.useEffect(() => {
    const params = new URLSearchParams({
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      daily: "sunrise,sunset",
      forecast_days: "1",
    });

    const decoded = decodeURIComponent(params.toString());

    console.log("decoded: ", decoded);

    fetch(`https://api.open-meteo.com/v1/forecast?${decoded}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);

        const offsetMs = 8 * 60 * 60 * 1000;

        const _sunrise = new Date(data["daily"]["sunrise"][0]);
        const _sunset = new Date(data["daily"]["sunset"][0]);

        setReport({
          sunrise: new Date(_sunrise.getTime() + offsetMs).toLocaleTimeString("en-PH", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: 'Asia/Manila',
            hour12: true
          }),
          sunset: new Date(_sunset.getTime() + offsetMs).toLocaleTimeString("en-PH", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: 'Asia/Manila',
            hour12: true
          }),
        });
      });
  }, [coords]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div id="wrapper" data-mode={dataTime}>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonCard className="time-card" data-time={dataTime}>
                  <IonCardContent>
                    <div id="container">
                      <div className="content-1">
                        <span ref={greetingRef}></span>
                        <span ref={dateRef}></span>
                        <span ref={timeRef}></span>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonCard className="sunrise">
                  <IonCardHeader>
                    <span className="header">Sunrise</span>
                  </IonCardHeader>
                  <IonCardContent>
                    <span>{astronomical_report.sunrise}</span>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol>
                <IonCard className="sunset">
                  <IonCardHeader>
                    <span className="header">Sunset</span>
                  </IonCardHeader>
                  <IonCardContent>
                    <span>{astronomical_report.sunset}</span>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          <div>
            <ForecastConditions />
          </div>
          <div>
            <WindCoastal />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
