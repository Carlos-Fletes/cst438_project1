import {StyleSheet, Text, View} from 'react-native';
import {Link} from 'expo-router';

const Home = () => {
    return (
        <View>
            <Text>Welcome to the Home Page</Text>
            <Link href="/empty_page">Go to Empty Page(This is link)</Link>
            
            <Link href="/Api-pull">Go to API Pull Page(This is link)</Link>
        </View>
    )
}
export default Home;
const styles = StyleSheet.create({});
