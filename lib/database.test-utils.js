// lib/database.test-utils.js

import { openDatabaseAsync } from 'expo-sqlite';

// Creates or resets the test database
const createTestDB = async () => {
  const db = await openDatabaseAsync('test.db');

  await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('PRAGMA foreign_keys = ON;');
      tx.executeSql('DROP TABLE IF EXISTS user_data;');
      tx.executeSql('DROP TABLE IF EXISTS users;');

      tx.executeSql(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `);

      tx.executeSql(
        `
        CREATE TABLE user_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          info TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `,
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });

  return db;
};

// Async wrapper helpers
const runAsync = (db, sql, params = []) =>
  new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });

const getAllAsync = (db, sql, params = []) =>
  new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, { rows }) => {
          const results = [];
          for (let i = 0; i < rows.length; i++) {
            results.push(rows.item(i));
          }
          resolve(results);
        },
        (_, error) => reject(error)
      );
    });
  });

const getFirstAsync = async (db, sql, params = []) => {
  const results = await getAllAsync(db, sql, params);
  return results.length ? results[0] : null;
};

export default {
  createTestDB,
  runAsync,
  getAllAsync,
  getFirstAsync,
};
