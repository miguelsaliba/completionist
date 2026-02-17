import type { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation';
import { registerPlugin } from '@capacitor/core';
import type { LocalNotificationsPlugin } from '@capacitor/local-notifications';
import { defineStore } from 'pinia'
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");
const LocalNotifications = registerPlugin<LocalNotificationsPlugin>("LocalNotifications")

export const useLocationStore = defineStore('location', {
  state: () => ({
    watcherId: null as string | null
  }),
  getters: {
    isWatching: (state) => state.watcherId !== null,
  },
  actions: {
    async startWatching() {
      this.watcherId = await BackgroundGeolocation.addWatcher(
        {
          backgroundMessage: "Cancel to prevent battery drain.",
          backgroundTitle: "Tracking You.",
          requestPermissions: true,
          stale: false,
          distanceFilter: 1,
        },
        function callback(location, error) {
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

          LocalNotifications.schedule({
            notifications: [
              {
                title: `You are at ${location?.latitude}, ${location?.longitude}`,
                body: `Accuracy is ${location?.accuracy}`,
                id: 2,
                ongoing: true,
              }
            ]
          });

          return console.log(location);
        }
      );
    },
    removeWatcher() {
      if (this.watcherId === null) return;

      BackgroundGeolocation.removeWatcher({ id: this.watcherId });
      this.watcherId = null;
    }
  },
})
