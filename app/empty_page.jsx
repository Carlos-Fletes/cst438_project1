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

const styles = StyleSheet.create({
  inner: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  button: {
    width: "80%", height: 50, backgroundColor: "#007BFF", borderRadius: 8,
    justifyContent: "center", alignItems: "center", marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

