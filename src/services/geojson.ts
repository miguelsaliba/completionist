import { databaseService, type LocationRow } from "./database";

export async function generateGeojson(): Promise<GeoJSON.GeoJSON> {
  const points = await databaseService.getAllPoints();
  const sessionMap = new Map<number, LocationRow[]>();
  console.log("points", points);

  points.forEach(point => {
    if (!sessionMap.has(point.sessionId)) {
      sessionMap.set(point.sessionId, [])
    }
    sessionMap.get(point.sessionId)?.push(point);
  });
  console.log("sessionMap", sessionMap);

  const features: GeoJSON.Feature[] = [];
  sessionMap.forEach((sessionPoints, sessionId) => {
    features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: sessionPoints.map(p => [p.longitude, p.latitude, p.altitude ?? 0]),
      },
      properties: {
        sessionId: sessionId,
        pointCount: sessionPoints.length,
        endTime: sessionPoints[sessionPoints.length - 1]?.time,
      },
    });
  })
  console.log("features", features);

  return {
    type: 'FeatureCollection',
    features: features,
  }
}
