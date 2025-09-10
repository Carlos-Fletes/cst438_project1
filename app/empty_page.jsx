import {StyleSheet, Text, View, Pressable, TextInput} from 'react-native';
import {Link, useRouter} from 'expo-router' 
const Page = () => {
    const router = useRouter();

    const go_to_account = () => {
        router.push('/account-settings');
    };

    return(
        <View>
            <Text >Empty Page to add to.</Text>
            <Pressable style={styles.button} onPress={go_to_account}>
                <Text style={styles.buttonText}>Go to Account</Text>
            </Pressable>
        </View>
        
    )

}
export default Page;
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