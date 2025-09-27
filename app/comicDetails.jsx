import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';
import {
    getComicByNumber,
    getRandomComic,
} from "../lib/generalApi";
import {
    init_DB,
    insertUserData,
    getUserDataWithoutTimestamp,
    getUserDataByUserId,
    removeUserData
} from "../lib/UserComic";
import { useAuth } from '../context/AuthContext';
import { useRoute } from '@react-navigation/native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';




const ComicDetails = ({ comicNum }) => {
    const { user } = useAuth();
    const route = useRoute();
    const comicNumFromRoute = route.params?.comicNum || comicNum || 1;
    const [comic, setComic] = useState(null);

    console.log("Received comicNum prop:", comicNumFromRoute);

    const comicNumber = Number.isInteger(Number(comicNumFromRoute)) && Number(comicNumFromRoute) > 0 ? Number(comicNumFromRoute) : 1;


    const setup = async () => {
        await init_DB();
        console.log("Fetching comic number:", comicNumber);
        const fetchedComic = await getComicByNumber(comicNumber);
        setComic(fetchedComic);
    };
    
    const handleAddToFavorites = async (comic) => {
        // Ensure user is logged in
        if (!user || !user.id) {
            console.log("User not logged in. Cannot add to favorites.");
            return;
        }
        // Insert user data into the database
        // If the comic is already in favorites, remove it from the database and do not add it again
        const existingData = await getUserDataByUserId(user.id);
        const isAlreadyFavorite = existingData.some(data => data.info === `${comic.num}`);
        if (isAlreadyFavorite) {
            console.log("Comic is already in favorites. Removing from favorites.");
            // Call your delete function here
        } else {
            console.log("Adding comic to favorites.");
            await insertUserData(user.id, `${comic.num}`);
        }
    };

    useEffect(() => {
        setup();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {comic ? (
                <>
                    <Text style={styles.title}>{comic.title}</Text>
                    <Image source={{ uri: comic.img }} style={styles.image} />
                    <Text style={styles.altText}>{comic.alt}</Text>
                    <Text style={styles.infoText}>Comic Number: {comic.num}</Text>
                    <Text style={styles.infoText}>Date: {comic.day}/{comic.month}/{comic.year}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16, paddingHorizontal: 20 }}>
                        <Button title="Previous" onPress={() => setup(comicNumber - 1)} />
                        <Button title="Random" onPress={async () => {
                            const randomComic = await getRandomComic();
                            setComic(randomComic);
                        }} />
                        <Button title="Next" onPress={() => setup(comicNumber + 1)} />
                    </View>
                    <View style={{ alignItems: 'center', marginBottom: 16 }}>
                        <Button title="Add to Favorites" onPress={() => handleAddToFavorites(comic)} />
                    </View>
                    
                </>
            ) : (
                <Text style={styles.infoText}>Loading...</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    bannerWrap: { paddingHorizontal: 12, paddingTop: 12 },
    banner: { width: "100%", height: 200, borderRadius: 12, marginBottom: 12 },
    cta: { marginTop: 8, paddingHorizontal: 12 },
    ctaTitle: { fontSize: 22, fontWeight: "700", marginBottom: 6, paddingHorizontal: 4 },
    ctaCard: {
        borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12,
        backgroundColor: "#fafafa", flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    },
    ctaText: { fontSize: 14, flex: 1, marginRight: 12 },
    ctaButton: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#007BFF", borderRadius: 8 },
    ctaButtonText: { color: "#fff", fontWeight: "600" },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
    image: { width: '100%', height: 300, resizeMode: 'contain', marginVertical: 10 },
    altText: { fontStyle: 'italic', textAlign: 'center', marginVertical: 10, paddingHorizontal: 10 },
    infoText: { textAlign: 'center', marginVertical: 5 },
});

export default ComicDetails;