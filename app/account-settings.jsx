import {StyleSheet, Text, View} from 'react-native';
import {Link} from 'expo-router';

const Account = () => {
    return (
        <View  style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text>Account Page</Text>


            <Text>Current username: Username</Text>


            <View style={styles.container}>
                <Link href="/empty_page">(Change Username)</Link>
            
                <Link href="/empty_page">(Change Password)</Link>
            </View>
        </View>
    )
}
export default Account;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    }
});




