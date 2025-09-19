import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { initDB, insertUser, getAllUsers, FindUserByUsername } from '../lib/database';
import { init_DB, insertUserData, getUserDataByUserId, getUserDataWithoutTimestamp, removeDuplicateUserData } from '../lib/UserComic.js';

export default function IndexPage() {
  const [dbReady, setDbReady] = useState(false);
  const [dbRead, setDbRead] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        // Initialize databases
        await initDB();
        await init_DB();
        setDbReady(true);
        setDbRead(true);

        // Insert users
        await insertUser('testuser', 'password123');
        await insertUser('Admin', 'AdminPass');

        // Get Admin user and add info 42
        const adminUser = await FindUserByUsername('Admin');
        if (adminUser) {
          await insertUserData(adminUser.id, 42);
        }
        const testUser = await FindUserByUsername('testuser');
if (testUser) {
  await insertUserData(testUser.id, 28);
}

        // 👉 Log all users with username & password
        const users = await getAllUsers();
        console.log('📋 All Users:');
        users.forEach(user => {
          console.log(`👤 Username: ${user.username}, Password: ${user.password}`);
        });
        await removeDuplicateUserData();
        console.log('Admin user ID:', adminUser.id);
console.log('Test user ID:', testUser.id);



        // 👉 Log user_data (excluding created_at)
        const userData = await getUserDataWithoutTimestamp();
        console.log('📊 All user_data (no created_at):', userData);
        const user1Data = await getUserDataByUserId(1);
        const user2Data= await getUserDataByUserId(2);
console.log('🔍 Info for user_id 1:', user1Data.map(row => row.info));
console.log('🔍 Info for user_id 2:', user2Data.map(row => row.info));
      } catch (err) {
        console.log('❌ Setup error:', err.message);
      }
    };

    setup();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {dbReady ? 'SQLite is ready!' : 'Initializing...'}
      </Text>

      <Button title="Do Nothing" onPress={() => {}} />

      <Link href="/empty_page" style={styles.link}>
        Go to Empty Page (This is link)
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  link: {
    marginTop: 20,
    color: 'blue',
  },
});
