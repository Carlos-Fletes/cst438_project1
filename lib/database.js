// lib/database.js
import * as SQLite from "expo-sqlite";

let db = null;
let dbReady = false;

// Initialize and cache the DB connection
export const initDB = async () => {
  try {
    if (dbReady && db) return;

    db = await SQLite.openDatabaseAsync("mydatabase.db");

    // IMPORTANT: no DROP TABLE here (keeps existing users)
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    dbReady = true;
    console.log("✅ Database initialized");
  } catch (e) {
    console.error("❌ DB init error:", e);
    throw e;
  }
};

// Ensure DB is initialized before calling other functions
const ensureDBReady = () => {
  if (!dbReady || !db) {
    throw new Error("Database not ready. Call initDB() first.");
  }
};

// Insert user if it doesn't already exist
export const insertUser = async (username, password) => {
  try {
    ensureDBReady();

    const existingUser = await db.getFirstAsync(
      "SELECT * FROM users WHERE username = ?;",
      [username]
    );

    if (existingUser) {
      console.log("⚠️ Username already exists:", username);
      return;
    }

    await db.runAsync(
      "INSERT INTO users (username, password) VALUES (?, ?);",
      [username, password]
    );

    console.log("✅ User inserted:", username);
  } catch (e) {
    console.error("❌ Insert user error:", e.message);
  }
};

// Fetch all users
export const getAllUsers = async () => {
  try {
    ensureDBReady();
    const users = await db.getAllAsync("SELECT * FROM users;");
    return users;
  } catch (e) {
    console.error("❌ Get users error:", e.message);
    return [];
  }
};

// Finds full user row by username
export const FindUserByUsername = async (username) => {
  try {
    ensureDBReady();
    const user = await db.getFirstAsync(
      "SELECT * FROM users WHERE username = ?;",
      [username]
    );
    return user || null;
  } catch (e) {
    console.error("❌ FindUserByUsername error:", e.message);
    return null;
  }
};

// Returns the username if found, otherwise null
export const FindUser = async (username) => {
  try {
    ensureDBReady();
    const user = await db.getFirstAsync(
      "SELECT * FROM users WHERE username = ?;",
      [username]
    );
    return user ? user.username : null;
  } catch (e) {
    console.error("❌ FindUser error:", e.message);
    return null;
  }
};

// Returns the password if the user exists, otherwise null
export const FindPassword = async (username) => {
  try {
    ensureDBReady();
    const user = await db.getFirstAsync(
      "SELECT * FROM users WHERE username = ?;",
      [username]
    );
    return user ? user.password : null;
  } catch (e) {
    console.error("❌ FindPassword error:", e.message);
    return null;
  }
};

export const deleteUserByUsername = async (username) => {
  try {
    ensureDBReady();

    const result = await db.runAsync(
      "DELETE FROM users WHERE username = ?;",
      [username]
    );

    if (result.changes > 0) {
      console.log(`✅ User "${username}" deleted successfully.`);
    } else {
      console.log(`⚠️ No user found with username "${username}".`);
    }
  } catch (e) {
    console.error("❌ Delete user error:", e.message);
  }
};
