"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Navigation, Loader2 } from "lucide-react"

export default function QiblaCompass() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null)
  const [deviceHeading, setDeviceHeading] = useState<number>(0)
  const [location, setLocation] = useState<string>("Getting location...")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [permissionGranted, setPermissionGranted] = useState(false)

  // Calculate Qibla direction from user's location to Kaaba
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
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          try {
            // Fetch location name
            const locationRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            )
            const locationData = await locationRes.json()
            setLocation(`${locationData.city || locationData.locality}, ${locationData.countryName}`)

            // Calculate Qibla direction
            const qibla = calculateQiblaDirection(latitude, longitude)
            setQiblaDirection(qibla)
            setLoading(false)
          } catch (error) {
            console.error("Error fetching location:", error)
            setError("Unable to fetch location")
            setLoading(false)
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
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
    // Request device orientation permission (iOS 13+)
    const requestPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission()
          setPermissionGranted(permission === "granted")
        } catch (error) {
          console.error("Error requesting orientation permission:", error)
        }
      } else {
        setPermissionGranted(true)
      }
    }

    requestPermission()
  }, [])

  useEffect(() => {
    // Handle device orientation
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // Alpha gives the compass heading (0-360)
        // Adjust for iOS/Android differences
        let heading = event.webkitCompassHeading || event.alpha
        if (event.webkitCompassHeading === undefined) {
          heading = 360 - heading
        }
        setDeviceHeading(heading)
      }
    }

    if (permissionGranted) {
      window.addEventListener("deviceorientationabsolute" as any, handleOrientation, true)
      window.addEventListener("deviceorientation", handleOrientation, true)
    }

    return () => {
      window.removeEventListener("deviceorientationabsolute" as any, handleOrientation, true)
      window.removeEventListener("deviceorientation", handleOrientation, true)
    }
  }, [permissionGranted])

  const compassRotation = qiblaDirection !== null ? qiblaDirection - deviceHeading : 0

  return (
    <div className="p-6 space-y-6 ">
      {/* Location Info */}
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
          {/* Compass Display */}
          <Card className="bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-pink-500/10 border-purple-400 border-0 shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center space-y-6">
                {/* Compass Circle */}
                <div className="relative w-72 h-72">
                  {/* Background compass marks */}
                  <div className="absolute inset-0 rounded-full border-4 border-muted">
                    {/* Cardinal directions */}
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

                  {/* Rotating Qibla Indicator */}
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
                    style={{ transform: `rotate(${compassRotation}deg)` }}
                  >
                    <div className="flex flex-col items-center">
                      <Navigation size={80} className="text-primary fill-primary drop-shadow-lg" />
                      <p className="text-sm font-bold text-primary mt-2">QIBLA</p>
                    </div>
                  </div>

                  {/* Center Kaaba indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Direction Info */}
                <div className="text-center space-y-2">
                  <p className="text-2xl font-arabic text-foreground">الكعبة المشرفة</p>
                  <p className="text-sm text-muted-foreground">Kaaba Direction</p>
                  {qiblaDirection !== null && (
                    <p className="text-lg font-mono font-semibold text-primary">{Math.round(qiblaDirection)}°</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Hold your device flat and rotate until the arrow points upward to find the Qibla direction. Make sure
                location services and compass calibration are enabled.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
