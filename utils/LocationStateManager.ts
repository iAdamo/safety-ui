interface LocationData {
  latitude: number;
  longitude: number;
}

class LocationStateManager {
  private location: LocationData | null = null;

  private listeners: ((location: LocationData | null) => void)[] = [];

  setLocation(location: LocationData) {
    this.location = location;
    this.notifyListeners();
  }

  getLocation() {
    return this.location;
  }

  subscribe(listener: (location: LocationData | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.location));
  }
}

export const locationStateManager = new LocationStateManager();
