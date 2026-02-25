import type { GeoJSONSourceDiff } from "maplibre-gl";
import type { Location } from '@capacitor-community/background-geolocation';
import { databaseService, type LocationRow } from "./database";

export async function generateGeojson(): Promise<GeoJSON.GeoJSON> {
  const points = await databaseService.getAllPoints();
  const sessionMap = new Map<number, LocationRow[]>();

  points.forEach(point => {
    if (!sessionMap.has(point.sessionId)) {
      sessionMap.set(point.sessionId, [])
    }
    sessionMap.get(point.sessionId)?.push(point);
  });

  const features: GeoJSON.Feature[] = [];
  sessionMap.forEach((sessionPoints, sessionId) => {
    features.push({
      id: sessionId,
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: sessionPoints.map(p => [p.longitude, p.latitude, p.altitude ?? 0]),
      },
      properties: {
        pointCount: sessionPoints.length,
        endTime: sessionPoints[sessionPoints.length - 1]?.time,
      },
    });
  })

  return {
    type: 'FeatureCollection',
    features: features,
  }
}

export function generateGeojsonDiff(locations: Location[], sessionId: number): GeoJSONSourceDiff | null {
  if (!locations.length) return null;

  let feature: GeoJSON.Feature = {
    id: sessionId,
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: locations.map(p => [p.longitude, p.latitude]), // adding altitude breaks this for some reason
    },
    properties: {
      pointCount: locations.length,
      endTime: locations[locations.length - 1]?.time,
    },
  };

  return {
    add: [feature],
  }
}
