import {StyleSheet, Text, View, Pressable} from 'react-native';
import {Link, useRouter} from 'expo-router';

const Account = () => {
    const router = useRouter();

    const settings_About = () => {
        router.push('/empty_page');
    };
    const settings_Notifications = () => {
        router.push('/empty_page');
    };
    const settings_Account = () => {
        router.push('/account-settings');
    };

    return (
        <View  style={styles.container}>
            <Text>Settings</Text>


            <Text>Current username: Username</Text>



            <View style={styles.inner}>
                    <Pressable style={styles.button} onPress={settings_Account}>
                      <Text style={styles.buttonText}>Account</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={settings_Notifications}>
                      <Text style={styles.buttonText}>Notifications</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={settings_About}>
                      <Text style={styles.buttonText}>About</Text>
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