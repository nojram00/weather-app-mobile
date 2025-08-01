import { useCallback, useState } from 'react'

export default function useWeather<T>(url? : string) {
  const parsedUrl = (parameters : URLSearchParams) => {
    return decodeURIComponent(parameters.toString())
  }

  const [data, setData] = useState<T | null>(null)

  const fetchData = useCallback((_params: URLSearchParams) => {
    const parsed = parsedUrl(_params)
    const _url = url ?? 'https://api.open-meteo.com/v1/forecast';
    fetch(`${_url}?${parsed}`).then(res => res.json())
    .then(_data => {
        setData(_data)
    }).catch((err) => console.warn(err))
  }, [])

  return { data, fetchData }
}
