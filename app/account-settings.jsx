import {StyleSheet, Text, View, Pressable} from 'react-native';
import {Link, useRouter} from 'expo-router';

const Account = () => {
    const router = useRouter();

    const change_Password = () => {
        router.push('/changePassword');
    };
    const change_Username = () => {
        router.push('/changeUsername');
    };

    return (
        <View  style={styles.container}>
            <Text>Account Page</Text>


            <Text>Current username: Username</Text>



            <View style={styles.inner}>
                    <Pressable style={styles.button} onPress={change_Username}>
                      <Text style={styles.buttonText}>Change Username</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={change_Password}>
                      <Text style={styles.buttonText}>Change Password</Text>
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




