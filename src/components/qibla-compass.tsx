"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Loader2, Compass as CompassIcon } from "lucide-react"

export default function QiblaCompass() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null)
  const [deviceHeading, setDeviceHeading] = useState<number>(0)
  const headingRef = useRef<number | null>(null)
  const [location, setLocation] = useState<string>("Getting location...")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [needsPermissionPrompt, setNeedsPermissionPrompt] = useState(false)
  const [orientationError, setOrientationError] = useState<string | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [calibrationHint, setCalibrationHint] = useState(false)

  const calculateQiblaDirection = (lat: number, lng: number) => {
    const kaabaLat = 21.4225
    const kaabaLng = 39.826181

    const dLng = ((kaabaLng - lng) * Math.PI) / 180
    const lat1 = (lat * Math.PI) / 180
    const lat2 = (kaabaLat * Math.PI) / 180

    const y = Math.sin(dLng) * Math.cos(lat2)
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)

    let bearing = (Math.atan2(y, x) * 180) / Math.PI
    bearing = (bearing + 360) % 360

    return bearing
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          try {
            const locationRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            )
            const locationData = await locationRes.json()
            setLocation(`${locationData.city || locationData.locality}, ${locationData.countryName}`)

            const qibla = calculateQiblaDirection(latitude, longitude)
            setQiblaDirection(qibla)
            setLoading(false)
          } catch (fetchError) {
            console.error("Error fetching location:", fetchError)
            setError("Unable to fetch location")
            setLoading(false)
          }
        },
        (geoError) => {
          console.error("Geolocation error:", geoError)
          setError("Location access denied. Please enable location services.")
          setLoading(false)
        },
      )
    } else {
      setError("Geolocation not supported by this browser")
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      setNeedsPermissionPrompt(true)
    } else {
      setPermissionGranted(true)
    }
  }, [])

  const handlePermissionRequest = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        const granted = permission === "granted"
        setPermissionGranted(granted)
        setNeedsPermissionPrompt(!granted)
        if (!granted) {
          setOrientationError("يتطلب عرض البوصلة منح إذن مستشعر الاتجاه.")
        } else {
          setOrientationError(null)
        }
      } catch (requestError) {
        console.error("Error requesting orientation permission:", requestError)
        setOrientationError("حدث خطأ أثناء طلب الإذن. يرجى المحاولة مرة أخرى.")
      }
    } else {
      setPermissionGranted(true)
    }
  }

  const smoothHeading = useCallback((nextHeading: number) => {
    if (headingRef.current === null) {
      headingRef.current = nextHeading
      setDeviceHeading(nextHeading)
      return
    }
    const previous = headingRef.current
    const delta = ((nextHeading - previous + 540) % 360) - 180
    const eased = (previous + delta * 0.2 + 360) % 360
    headingRef.current = eased
    setDeviceHeading(eased)
  }, [])

  useEffect(() => {
    if (!permissionGranted) return
    if (typeof window === "undefined" || typeof DeviceOrientationEvent === "undefined") {
      setOrientationError("جهازك لا يدعم مستشعر البوصلة.")
      return
    }

    setOrientationError(null)

    const handleOrientation = (event: DeviceOrientationEvent & { webkitCompassHeading?: number; webkitCompassAccuracy?: number }) => {
      let heading: number | null = null
      let reportedAccuracy = typeof event.webkitCompassAccuracy === "number" ? event.webkitCompassAccuracy : null

      if (typeof event.webkitCompassHeading === "number" && !Number.isNaN(event.webkitCompassHeading)) {
        heading = event.webkitCompassHeading
      } else if (typeof event.alpha === "number") {
        const alphaHeading = event.absolute ? event.alpha : 360 - event.alpha
        heading = (360 - alphaHeading + 360) % 360
        if (!reportedAccuracy) {
          reportedAccuracy = event.absolute ? 15 : 45
        }
      }

      if (heading === null) return

      smoothHeading(heading)
      if (reportedAccuracy !== null) {
        setAccuracy(reportedAccuracy)
        setCalibrationHint(reportedAccuracy > 15)
      } else {
        setCalibrationHint(event.absolute === false)
      }
    }

    window.addEventListener("deviceorientationabsolute" as any, handleOrientation, true)
    window.addEventListener("deviceorientation", handleOrientation, true)

    return () => {
      window.removeEventListener("deviceorientationabsolute" as any, handleOrientation, true)
      window.removeEventListener("deviceorientation", handleOrientation, true)
    }
  }, [permissionGranted, smoothHeading])

  const compassRotation =
    qiblaDirection !== null ? (qiblaDirection - deviceHeading + 360) % 360 : 0

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-sm">
            <MapPin size={16} className="text-primary" />
            <span className="text-muted-foreground">{location}</span>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-destructive">{error}</p>
            <p className="text-center text-xs text-muted-foreground mt-2">
              Please enable location services and refresh the page
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {needsPermissionPrompt && !permissionGranted && (
            <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CompassIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <p className="text-center text-sm font-semibold text-foreground font-arabic">
                    معايرة البوصلة
                  </p>
                </div>
                <p className="text-center text-sm text-muted-foreground font-arabic">
                  يتطلب iOS إذناً لاستخدام مستشعر الاتجاه. اضغط على الزر أدناه لتفعيل البوصلة.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-arabic" 
                  onClick={handlePermissionRequest}
                >
                  تفعيل البوصلة
                </Button>
              </CardContent>
            </Card>
          )}

          {permissionGranted && calibrationHint && (
            <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CompassIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 font-arabic">
                    معايرة البوصلة
                  </p>
                </div>
                <p className="text-sm text-muted-foreground text-center font-arabic">
                  حرّك هاتفك على شكل رقم ٨ لتحسين دقة البوصلة.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/20 font-arabic"
                  onClick={handlePermissionRequest}
                >
                  إعادة المعايرة
                </Button>
              </CardContent>
            </Card>
          )}

          {orientationError && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-destructive text-sm">{orientationError}</p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-pink-500/10 border-purple-400 border-0 shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative w-72 h-72">
                  <div className="absolute inset-0 rounded-full border-4 border-muted">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-muted-foreground">
                      N
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      E
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-muted-foreground">
                      S
                    </div>
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      W
                    </div>
                  </div>

                  <div
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
                    style={{ transform: `rotate(${compassRotation}deg)` }}
                  >
                    <div className="flex flex-col items-center">
                      <Navigation size={80} className="text-primary fill-primary drop-shadow-lg" />
                      <p className="text-sm font-bold text-primary mt-2">QIBLA</p>
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-2xl font-arabic text-foreground">الكعبة المشرفة</p>
                  <p className="text-sm text-muted-foreground">Kaaba Direction</p>
                  {qiblaDirection !== null && (
                    <p className="text-lg font-mono font-semibold text-primary">
                      {Math.round(qiblaDirection)}°
                    </p>
                  )}
                  {accuracy !== null && (
                    <p className="text-xs text-muted-foreground">
                      دقة المستشعر ±{Math.round(accuracy)}°
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6 space-y-3">
              <p className="text-sm text-muted-foreground text-center leading-relaxed font-arabic">
                ضع هاتفك بشكل مسطح ودوّره حتى يشير السهم إلى الأعلى لتحصل على اتجاه القبلة. تأكد من
                تفعيل خدمات الموقع والمعايرة عند الحاجة.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
