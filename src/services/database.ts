// services/database.ts
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export type LocationRow = {
  latitude: number,
  longitude: number,
  accuracy: number,
  altitude: number | null,
  time: number | null,
  sessionId: number,
}

class DatabaseService {
  private db: SQLiteDBConnection | null = null;
  private dbName = 'location_tracker.db';

  async init() {
    if (this.db) return;
    const sqlite = new SQLiteConnection(CapacitorSQLite);

    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = await sqlite.isConnection(this.dbName, false);

    if (ret.result && isConn.result) {
      this.db = await sqlite.retrieveConnection(this.dbName, false);
    } else {
      // TODO: encryption
      this.db = await sqlite.createConnection(this.dbName, false, "no-encryption", 1, false);
    }

    await this.db.open();

    await this.createTables();
  }

  private async createTables() {
    const sql = `
      CREATE TABLE IF NOT EXISTS location_points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        accuracy REAL,
        altitude REAL,
        timestamp INTEGER NOT NULL,
        session_id INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_session ON location_points(session_id);
      CREATE INDEX IF NOT EXISTS idx_timestamp ON location_points(timestamp);
    `;
    await this.db?.execute(sql);
  }

  /** @throws {DatabaseError} */
  async insertLocationPoint(location: LocationRow) {
    if (!this.db) throw new DatabaseError("DB not initialized");

    const sql = `
      INSERT INTO location_points
      (latitude, longitude, accuracy, altitude, timestamp, session_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await this.db.run(sql, [
      location.latitude,
      location.longitude,
      location.accuracy,
      location.altitude,
      location.time,
      location.sessionId,
    ]);
  }

  /** @throws {DatabaseError} */
  async getSessionPoints(session_id: number): Promise<LocationRow[]> {
    if (!this.db) throw new DatabaseError("DB not initialized.");

    const result = await this.db.query(
      'SELECT * FROM location_points WHERE session_id = ? ORDER BY timestamp ASC',
      [session_id]
    );
    return result.values || [];
  }

  /** @throws {DatabaseError} */
  async getAllPoints(): Promise<LocationRow[]> {
    if (!this.db) throw new DatabaseError("DB not initialized.");

    const result = await this.db.query('SELECT * FROM location_points');
    return result.values || [];
  }

  /** @throws {DatabaseError} */
  async getAllSessions(): Promise<number[]> {
    if (!this.db) throw new DatabaseError("DB not initialized.");

    const result = await this.db.query(
      'SELECT DISTINCT session_id FROM location_points ORDER BY timestamp DESC'
    );
    return result.values || [];
  }

  /** @throws {DatabaseError} */
  async close() {
    if (!this.db) return new DatabaseError("DB not initialized.");

    await this.db.close();
    this.db = null;
  }
}

export const databaseService = new DatabaseService();

