import {StyleSheet, Text, View} from 'react-native';
import {Link } from 'expo-router'
const Page = () => {
    return(
        <View>
            <Text >Empty Page to add to.</Text>
            <Link href="/account-settings">(account)</Link>
        </View>
        
    )

}
export default Page;
const styles = StyleSheet.create({});