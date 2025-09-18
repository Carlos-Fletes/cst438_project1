import * as SQLite from 'expo-sqlite';

let db = null;
let dbReady = false;

// Initialize DB and create both tables
export const init_DB = async () => {
  try {
    if (dbReady && db) return;

    db = await SQLite.openDatabaseAsync('mydatabase.db');

    await db.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        info TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    dbReady = true;
    console.log('✅ Database initialized');
  } catch (e) {
    console.error('❌ DB init error:', e.message);
    throw e;
  }
};

const ensureDBReady = () => {
  if (!dbReady || !db) {
    throw new Error('Database not ready. Call initDB() first.');
  }
};

export const insertUserData = async (userId, info) => {
  try {
    ensureDBReady();

    await db.runAsync(
      'INSERT INTO user_data (user_id, info) VALUES (?, ?);',
      [userId, info]
    );

    console.log(`✅ Info added for user ID ${userId}`);
  } catch (e) {
    console.error('❌ Insert user data error:', e.message);
  }
};

export const getUserDataByUserId = async (userId) => {
  try {
    ensureDBReady();

    const data = await db.getAllAsync(
      'SELECT * FROM user_data WHERE user_id = ?;',
      [userId]
    );

    return data;
  } catch (e) {
    console.error('❌ Get user data error:', e.message);
    return [];
  }
};
