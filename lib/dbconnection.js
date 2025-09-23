// lib/dbConnection.js
import * as SQLite from 'expo-sqlite';

let db = null;

export const getDatabase = async () => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('mydatabase.db');
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
  `);

  return db;
};
