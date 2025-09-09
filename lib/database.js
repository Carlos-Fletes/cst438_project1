import * as SQLite from 'expo-sqlite';

let db = null;
let dbReady = false;

// Initialize and cache the DB connection
export const initDB = async () => {
  try {
    if (dbReady && db) return;

    db = await SQLite.openDatabaseAsync('mydatabase.db');

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        userID TEXT NOT NULL,
        password TEXT NOT NULL
      );
    `);

    dbReady = true;
    console.log('✅ Database initialized');
  } catch (e) {
    console.error('❌ DB init error:', e);
    throw e;
  }
};

// Ensure DB is initialized before calling other functions
const ensureDBReady = () => {
  if (!dbReady || !db) {
    throw new Error('Database not ready. Call initDB() first.');
  }
};

// Insert user if it doesn't already exist
export const insertUser = async (username, userID, password) => {
  try {
    ensureDBReady();

    const existingUser = await db.getFirstAsync(
      'SELECT * FROM users WHERE username = ?;',
      [username]
    );

    if (existingUser) {
      console.log('⚠️ Username already exists:', username);
      return;
    }

    await db.runAsync(
      'INSERT INTO users (username, userID, password) VALUES (?, ?, ?);',
      [username, userID, password]
    );

    console.log('✅ User inserted:', username);
  } catch (e) {
    console.error('❌ Insert user error:', e.message);
  }
};

// Fetch all users
export const getAllUsers = async () => {
  try {
    ensureDBReady();
    const users = await db.getAllAsync('SELECT * FROM users;');
    return users;
  } catch (e) {
    console.error('❌ Get users error:', e.message);
    return [];
  }
};
