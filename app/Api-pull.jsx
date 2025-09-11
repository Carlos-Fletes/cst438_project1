import { StyleSheet, ActivityIndicator, FlatList, Text, View, Image } from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';

const Page = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const getTodaysComic = async () => {
        try {
            const response = await fetch('https://xkcd.com/613/info.0.json');
            const json = await response.json();
            setData([json]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTodaysComic();
    }, []);

    return (
        <View style={styles.container}>
            {isLoading ? <ActivityIndicator /> : (
                <FlatList
                    data={data}
                    keyExtractor={({ id }, index) => id}
                    renderItem={({ item }) => (
                        <Image source={{ uri: item.img }} style={styles.image} />
                    )}
                />
            )}
            <Link href="/empty_page">Go to Empty Page(This is link)</Link>
        </View>
    );
}

export default Page;


const styles = StyleSheet.create({
    image: { width: 600, height: 300, marginBottom: 20 },
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
