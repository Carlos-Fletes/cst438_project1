import { StyleSheet, ActivityIndicator, FlatList, View, Image, Text, Button} from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { insertUserData } from '../lib/UserComic';
import { getTodaysComic, getRandomComic } from '../lib/generalApi';



var recentComicNum = 0;

const Page = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    

    // const getTodaysComic = async () => {
    //     try {
    //         const response = await fetch('https://xkcd.com/info.0.json');
    //         const json = await response.json();
    //         setData([json]);
    //         recentComicNum = json.num;
    //         console.log(json);
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const getRandomComic = async () => {
    //     try {
    //         var randomNum = Math.floor(Math.random() * recentComicNum) + 1;
    //         const response = await fetch(`https://xkcd.com/${randomNum}/info.0.json`);
    //         const json = await response.json();
    //         setData([json]);
    //         console.log(json);
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };





    const addUserFavorite = async (comicNum) => {
        insertUserData(1, comicNum.toString());
        console.log(`Favorite comic ${comicNum} added for user ID 1`);
    };

    const getUserFavorites = async (userId) => {
        const favorites = await getUserDataByUserId(userId);
        console.log(`Favorites for user ID ${userId}:`, favorites);
    };

    useEffect(() => {
        const fetchData = async () => {
            const comic = await getTodaysComic();
            setData([comic]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const fetchRandomComic = async () => {
        setLoading(true);
        const comic = await getRandomComic();
        setData([comic]);
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {isLoading ? <ActivityIndicator /> : (
                <FlatList
                    data={data}
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.title}</Text>
                            <Image source={{ uri: item.img }} style={styles.image} />
                            <Button title="Favorite" onPress={() => addUserFavorite(item.num)} />
                            <Button title="Get Random Comic" onPress={() => fetchRandomComic()} />
                            <Text></Text>
                        </View>
                    )}
                />
            )}
            <Link href="/empty_page">Go to Empty Page(This is link)</Link>
        </View>
    );
}

export default Page;


const styles = StyleSheet.create({
    FlatList:{ flex: 1, width: '100%' },
    image: { width: 350, height: 300, marginBottom: 20 ,resizeMode:'contain',},
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
