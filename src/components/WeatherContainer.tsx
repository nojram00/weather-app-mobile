import React, { useEffect, useState } from "react";
import "./WeatherContainer.css";
import { useTime } from "../hooks/useTime";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSpinner,
} from "@ionic/react";
import useWeather from "../hooks/weather";
import { Geolocation } from "@capacitor/geolocation";
import { rainyOutline, thermometerOutline } from "ionicons/icons";

export default function WeatherContainer() {
  const time = useTime();

  const [timeState, setTimeState] = useState("day");
  const [pending, setPending] = useState(true);

  const { data, fetchData } = useWeather<{
    hourly: {
      rain: number[];
      time: string[];
      temperature_2m: number[];
    };
  }>();

  useEffect(() => {
    if (time.hours >= 6 && time.hours < 18) {
      setTimeState("day");
    } else {
      setTimeState("night");
    }
  }, [time.hours]);

  useEffect(() => {
    const fetchWeather = async () => {
      const { coords } = await Geolocation.getCurrentPosition();
      const params = new URLSearchParams({
        latitude: coords.latitude.toString(),
        longitude: coords.longitude.toString(),
        hourly: "rain,temperature_2m",
      });

      fetchData(params);

      setPending(false);
    };

    fetchWeather();
  }, [fetchData]);

  useEffect(() => {
    if (data == null) return;
  }, [data]);

  return (
    <div className="container" data-mode={timeState}>
      {pending ? (
        <div className="p-10">
          <IonSpinner></IonSpinner>
        </div>
      ) : (
        <IonGrid>
          {data?.hourly.time.map((t, index) => (
            <IonRow key={index}>
              <IonCol>
                <IonCard>
                  <IonCardHeader>
                    {new Date(t).toLocaleString("en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList lines="none">
                      <IonItem>
                        <IonIcon icon={rainyOutline}></IonIcon>
                        <span className="divider"></span>
                        <IonLabel>Rain: {data.hourly.rain[index]}%</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonIcon icon={thermometerOutline}></IonIcon>
                        <span className="divider"></span>
                        <IonLabel>
                          Temperature (2m): {data.hourly.temperature_2m[index]}&deg;C
                        </IonLabel>
                      </IonItem>
                    </IonList>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          ))}
        </IonGrid>
      )}
    </div>
  );
}
