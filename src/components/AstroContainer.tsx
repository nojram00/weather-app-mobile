import React, { useEffect, useState } from "react";
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
import { moon, sunny } from "ionicons/icons";

export default function AstroContainer() {
  const time = useTime();
  const [timeState, setTimeState] = useState<"day" | "night">("day");
  const [pending, setPending] = useState(true);

  useEffect(() => {
    if (time.hours >= 6 && time.hours < 18) {
      setTimeState("day");
    } else {
      setTimeState("night");
    }
  }, [time]);

  const [data, fetchData] = useWeather<{
    daily: {
      time: [];
      sunrise: [];
      sunset: [];
    };
  }>();

  useEffect(() => {
    const fetchWeather = async () => {
      const { coords } = await Geolocation.getCurrentPosition();
      const params = new URLSearchParams({
        latitude: coords.latitude.toString(),
        longitude: coords.longitude.toString(),
        daily: "sunrise,sunset",
      });

      fetchData(params);

      setPending(false);
    };

    fetchWeather();
  }, [fetchData]);

  const offsetMs = 8 * 60 * 60 * 1000;

  return (
    <div className="container" data-mode={timeState}>
      {pending ? (
        <div className="p-10">
          <IonSpinner></IonSpinner>
        </div>
      ) : (
        <IonGrid>
          {data?.daily.time.map((t, i) => (
            <IonRow key={i}>
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
                        <IonIcon icon={sunny}></IonIcon>
                        <span className="divider"></span>
                        <IonLabel>{new Date(new Date(data.daily.sunrise[i]).getTime() + offsetMs).toLocaleTimeString()}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonIcon icon={moon}></IonIcon>
                        <span className="divider"></span>
                        <IonLabel>
                          {new Date(new Date(data.daily.sunset[i]).getTime() + offsetMs).toLocaleTimeString()}
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
