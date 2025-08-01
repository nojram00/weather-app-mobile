import { useEffect, useState } from "react"

export const useTime = () => {
    const[time, setTime] = useState({
        hours: 12,
        minutes: 0,
        seconds: 60,
        day: 30,
        month: 12,
        year: 2023
    })

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date();
            setTime({
                hours: date.getHours(),
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
                minutes: date.getMinutes(),
                seconds: date.getSeconds()
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return time;
}