import {StyleSheet, Text, View, Pressable, TextInput} from 'react-native';
import {useRouter} from 'expo-router';
import React, {useState} from 'react';

const Account = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');

    const go_back = () => {
        router.push('/settings');
    };
    const change_Password = () => {
        router.push('/changePassword');
    };
    const change_Username = () => {
        // Add username change logic here
        // For now, just go back
        router.push('/account-settings');
    };

    return (
        <View style={styles.container}>
            <Text>Account Page</Text>
            <Text>Current username: {username}</Text>
            <View style={styles.inner}>
                
                <TextInput
                    style={styles.input}
                    placeholder="New Username"
                    value={newUsername}
                    onChangeText={setNewUsername}
                />
                <Pressable style={styles.button} onPress={change_Username}>
                  <Text style={styles.buttonText}>Change Username</Text>
                </Pressable>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div>Item A</div>
                  <div>Item B</div>
                  <div>Item C</div>
                </div>



                <TextInput
                    style={styles.input}
                    placeholder="Old Password"
                    secureTextEntry={true}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    secureTextEntry={true}
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Repeat New Password"
                    secureTextEntry={true}
                    value={repeatNewPassword}
                    onChangeText={setRepeatNewPassword}
                />
                <Pressable style={styles.button} onPress={change_Password}>
                  <Text style={styles.buttonText}>Change Password</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={go_back}>
                  <Text style={styles.buttonText}>Go Back</Text>
                </Pressable>
            </View>
        </View>
    )
}
export default Account;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});




