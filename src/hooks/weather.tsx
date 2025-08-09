import { Capacitor, CapacitorHttp } from '@capacitor/core'
import { useCallback, useState } from 'react'

export default function useWeather<T>(url? : string): [ data: T | null, fetchData: (params?: URLSearchParams) => void, isError: boolean ] {
  const parsedUrl = (parameters : URLSearchParams) => {
    return decodeURIComponent(parameters.toString())
  }

  const [data, setData] = useState<T | null>(null)
  const [isError, setIsError] = useState(false)

  const fetchData = useCallback((_params?: URLSearchParams) => {
    let parsed = '';
    if(_params){
      parsed = parsedUrl(_params)
    }
    const _url = url ?? 'https://api.open-meteo.com/v1/forecast';
    // if(Capacitor.isNativePlatform()){
    //   CapacitorHttp.get({
    //     url: `${_url}?${parsed}`
    //   }).then(res => {
    //     setData(JSON.parse(res.data))
    //   }).catch((err) => {console.warn(err); setIsError(true)})
    // }
    // else{
    //   fetch(`${_url}?${parsed}`).then(res => res.json())
    //   .then(_data => {
    //       setData(_data)
    //   }).catch((err) => {console.warn(err); setIsError(true)})
    // }
    fetch(`${_url}?${parsed}`).then(res => res.json())
      .then(_data => {
          setData(_data)
      }).catch((err) => {console.warn(err); setIsError(true)})
  }, [])

  return [ data, fetchData, isError ]
}
