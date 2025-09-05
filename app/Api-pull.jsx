import { StyleSheet, ActivityIndicator, FlatList, Text, View, Image } from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';

const Page = async () => {
    const [isLoading, setLoading] = useState(true);
    const [todaysComic, comic, setComic] = useState([]);

    const getTodaysComic = async () => {
        return fetch('https://xkcd.com/info.0.json')
            .then((response) => response.json())
            .then((json) => {
                return json.num;
            });
    };

    const getComicData = async (comicNum) => {
        return fetch(`https://xkcd.com/${comicNum}/info.0.json`)
            .then((response) => response.json())
            .then((json) => {
                return json;
            });
    };

    useEffect(() => {
        getTodaysComic()
            .then((num) => getComicData(num))
            .then((data) => setComic(data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);


    return (
        <View style={styles.container}>

            <Text style={styles.text}>API Data:</Text>
            <Image
                source={{ uri: `https://xkcd.com/${(await getComicData()).num}/info.0.json` }}
                style={styles.image}
            />
            <Link href="/empty_page">Go to Empty Page(This is link)</Link>
        </View>
    );
}

export default Page;
const styles = StyleSheet.create({});
