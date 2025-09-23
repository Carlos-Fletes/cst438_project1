import * as SQLite from "expo-sqlite";

let db = null;
let dbReady = false;

export const initDB = async () => {
  try {
    if (dbReady && db) return;

    db = await SQLite.openDatabaseAsync("mydatabase.db");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    dbReady = true;
    console.log("✅ Users table initialized");
  } catch (e) {
    console.error("❌ DB init error:", e);
    throw e;
  }
};

const ensureDBReady = () => {
  if (!dbReady || !db) throw new Error("Database not ready. Call initDB() first.");
};

export const insertUser = async (username, password) => {
  try {
    ensureDBReady();

    const existingUser = await db.getFirstAsync(
      "SELECT * FROM users WHERE username = ?;",
      [username]
    );

    if (existingUser) {
      console.log("⚠️ Username already exists:", username);
      return existingUser.id;
    }

    const result = await db.runAsync(
      "INSERT INTO users (username, password) VALUES (?, ?);",
      [username, password]
    );

    const insertedId = result.insertId;
    console.log("✅ User inserted:", username, "with ID:", insertedId);
    return insertedId;
  } catch (e) {
    console.error("❌ Insert user error:", e.message);
  }
};

export const getAllUsers = async () => {
  try {
    ensureDBReady();
    return await db.getAllAsync("SELECT * FROM users;");
  } catch (e) {
    console.error("❌ Get users error:", e.message);
    return [];
  }
};

export const FindUserByUsername = async (username) => {
  try {
    ensureDBReady();
    return (
      (await db.getFirstAsync("SELECT * FROM users WHERE username = ?;", [username])) ||
      null
    );
  } catch (e) {
    console.error("❌ FindUserByUsername error:", e.message);
    return null;
  }
};

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
      console.log(`✅ User "${username}" deleted`);
    } else {
      console.log(`⚠️ No user "${username}" found`);
    }
  } catch (e) {
    console.error("❌ Delete user error:", e.message);
  }
};

export const findUserByCredentials = async (username, password) => {
  try {
    ensureDBReady();
    const user = await db.getFirstAsync(
      "SELECT * FROM users WHERE username = ? AND password = ?;",
      [username, password]
    );
    return user || null;
  } catch (e) {
    console.error("❌ findUserByCredentials error:", e.message);
    return null;
  }
};
