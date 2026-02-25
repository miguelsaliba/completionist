import { databaseService } from '@/services/database';
import type { BackgroundGeolocationPlugin, Location } from '@capacitor-community/background-geolocation';
import { registerPlugin } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { defineStore } from 'pinia'
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

export const useLocationStore = defineStore('location', {
  state: () => ({
    watcherId: null as string | null,
    sessionId: null as number | null,
    lastPosition: null as Location | null,
    sessionPoints: [] as Location[]
  }),
  getters: {
    isWatching: (state) => state.watcherId !== null,
  },
  actions: {
    async startWatching() {
      await requestNotificationPermission();

      this.sessionId = Math.floor(Date.now() / 1000);
      this.watcherId = await BackgroundGeolocation.addWatcher(
        {
          backgroundTitle: "Location Tracking Active",
          backgroundMessage: "Tap to open app",
          requestPermissions: true,
          stale: false,
          distanceFilter: 10,
        },
        (location, error) => {
          if (error) {
            if (error.code === "NOT_AUTHORIZED") {
              console.warn("Not authorized");
              if (window.confirm(
                "This app needs your location, " +
                "but does not have permission.\n\n" +
                "Open settings now?"
              )) {
                BackgroundGeolocation.openSettings();
              }
            }
            return console.error(error);
          }

          if (!location) return console.error("Location object is null");
          if (!this.sessionId) return console.error("Session ID is null"); // Should be impossible

          this.lastPosition = location;
          this.sessionPoints.push(location);
          databaseService.insertLocationPoint({ ...location, sessionId: this.sessionId });
          return console.log(location);
        }
      );
    },
    async stopWatching() {
      if (this.watcherId === null) return;

      BackgroundGeolocation.removeWatcher({ id: this.watcherId })
        .finally(() => {
          this.watcherId = null;
          this.sessionId = null;
          this.sessionPoints = [];
        });
    }
  },
})

/**
 * Android requires location permission in order to keep location tracking active
 * TODO: make android only
 */
async function requestNotificationPermission(): Promise<boolean> {
  let permission = await LocalNotifications.checkPermissions();
  if (permission.display.startsWith('prompt')) {
    permission = await LocalNotifications.requestPermissions();
  }

  return permission.display == 'granted';
}
