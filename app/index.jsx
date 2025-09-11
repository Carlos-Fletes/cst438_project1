import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { initDB, insertUser, getAllUsers } from '../lib/database';

export default function IndexPage() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        setDbReady(true);

        // Insert user if not exists
        await insertUser('testuser', 'u001', 'password123');

        // Get all users and log them
        const users = await getAllUsers();
        console.log('📦 Users in DB:', users);
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

      <Link href="/Api-pull" style={styles.link}>
        Go to API Pull Page (This is link)
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
