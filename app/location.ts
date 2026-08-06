import type { UserLocation } from "./providers/types";

const LOCATION_SESSION_KEY = "momentrip:last-location";

export function saveLocation(location: UserLocation) {
  sessionStorage.setItem(LOCATION_SESSION_KEY, JSON.stringify(location));
}

export function loadLocation(): UserLocation | null {
  try {
    const value = sessionStorage.getItem(LOCATION_SESSION_KEY);
    return value ? JSON.parse(value) as UserLocation : null;
  } catch {
    return null;
  }
}

export function requestCurrentLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("이 브라우저에서는 위치 기능을 사용할 수 없습니다."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({
        lat: coords.latitude,
        lng: coords.longitude,
        accuracy: coords.accuracy,
        label: "현재 위치",
        source: "geolocation",
      }),
      reject,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  });
}
