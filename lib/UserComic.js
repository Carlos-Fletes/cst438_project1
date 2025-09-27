// lib/UserComic.js

import * as SQLite from 'expo-sqlite';

let db = null;
let dbReady = false;

export const init_DB = async () => {
  try {
    if (dbReady && db) return;

    db = await SQLite.openDatabaseAsync('mydatabase.db');

    await db.execAsync(`PRAGMA foreign_keys = ON;`);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        info INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    dbReady = true;
    console.log('✅ UserComic DB initialized');
  } catch (e) {
    console.error('❌ init_DB error:', e.message);
    throw e;
  }
};

const ensureReady = () => {
  if (!dbReady || !db) throw new Error('DB not ready. Call init_DB first.');
};

export const insertUserData = async (user_id, info) => {
  try {
    ensureReady();

    // Check if this user_id and info pair already exists
    const existing = await db.getFirstAsync(
      'SELECT * FROM user_data WHERE user_id = ? AND info = ?;',
      [user_id, info]
    );

    if (existing) {
      console.log(`⚠️ Duplicate info (${info}) for user_id ${user_id} already exists.`);
      return;
    }

    await db.runAsync(
      'INSERT INTO user_data (user_id, info) VALUES (?, ?);',
      [user_id, info]
    );

    console.log(`✅ Info (${info}) added for user ID ${user_id}`);
  } catch (e) {
    console.error('❌ Insert user data error:', e.message);
  }
};


export const getUserDataByUserId = async (user_id) => {
  try {
    ensureReady();
    return await db.getAllAsync(`SELECT * FROM user_data WHERE user_id = ?`, [user_id]);
  } catch (e) {
    console.error('❌ Get user data error:', e.message);
    return [];
  }
};

export const getAllData = async () => {
  try {
    ensureReady();
    return await db.getAllAsync('SELECT * FROM user_data;');
  } catch (e) {
    console.error('❌ Get all data error:', e.message);
    return [];
  }
};
export const getUserDataWithoutTimestamp = async () => {
  try {
    if (!db) throw new Error('DB not initialized');
    return await db.getAllAsync(`
      SELECT id, user_id, info FROM user_data;
    `);
  } catch (e) {
    console.error('❌ getUserDataWithoutTimestamp error:', e.message);
    return [];
  }
};

//to make sure users can remove comics from their favorites
export const removeUserData = async (user_id, info) => {
  try {
    ensureReady();
    await db.runAsync(
      'DELETE FROM user_data WHERE user_id = ? AND info = ?;',
      [user_id, info]
    );
    console.log(`✅ Removed info (${info}) for user ID ${user_id}`);
  } catch (e) {
    console.error('❌ Remove user data error:', e.message);
  }
};

export const removeDuplicateUserData = async () => {
  try {
    ensureReady();

    await db.runAsync(`
      DELETE FROM user_data
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM user_data
        GROUP BY user_id, info
      );
    `);

    console.log('✅ Duplicate user_data entries removed.');
  } catch (e) {
    console.error('❌ Failed to remove duplicates:', e.message);
  }
};
