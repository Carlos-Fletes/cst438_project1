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

      -- Drop the existing table (only for dev/test!)
      DROP TABLE IF EXISTS users;

      -- Recreate the table without userID
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
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
export const insertUser = async (username,  password) => {
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
      'INSERT INTO users (username,  password) VALUES (?,  ?);',
      [username,  password]
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

// Finds user by username
export const FindUserByUsername = async (username) => {
  try {
    ensureDBReady();
    const user = await db.getFirstAsync(
      'SELECT * FROM users WHERE username = ?;',
      [username]
    );
    return id || null;
  } catch (e) {
    console.error("❌ User doesn't exist :", e.message);
    return null;
  }
};

export const FindUser = async (username) => {
  try {
    ensureDBReady();
    const user = await db.getFirstAsync(
      'SELECT * FROM users WHERE username = ?;',
      [username]
    );
    return username || null;
  } catch (e) {
    console.error("❌ User doesn't exist :", e.message);
    return null;
  }
};

export const FindPassword = async (username) => {
  try {
    ensureDBReady();
    const user = await db.getFirstAsync(
      'SELECT * FROM users WHERE username = ?;',
      [username]
    );
    return user ? user.password : null;
  } catch (e) {
    console.error("❌ User doesn't exist :", e.message);
    return null;
  }
};


export const deleteUserByUsername = async (username) => {
  try {
    ensureDBReady();

    const result = await db.runAsync(
      'DELETE FROM users WHERE username = ?;',
      [username]
    );

    if (result.changes > 0) {
      console.log(`✅ User "${username}" deleted successfully.`);
    } else {
      console.log(`⚠️ No user found with username "${username}".`);
    }
  } catch (e) {
    console.error('❌ Delete user error:', e.message);
  }
};
