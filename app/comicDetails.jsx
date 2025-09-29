import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import {
    getComicByNumber,
    getRandomComic,
    getTodaysComic,
    recentComicNum
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




const ComicDetails = ({ comicNum }) => {
    const { user } = useAuth();
    const route = useRoute();
    const comicNumFromRoute = route.params?.comicNum || comicNum || 1;
    const [comic, setComic] = useState(null);
    // Ensure comicNumber is always a number, not a string
    const [comicNumber, setComicNumber] = useState(parseInt(comicNumFromRoute, 10) || 1);
    const [maxComicNumber, setMaxComicNumber] = useState(0);

    //console.log("Received comicNum prop:", comicNumFromRoute);

    
    

    const setup = async () => {
        try {
            await init_DB();
            
            // Get the latest comic to set maximum bounds
            const todaysComic = await getTodaysComic();
            if (todaysComic) {
                setMaxComicNumber(todaysComic.num);
                console.log(`📊 Latest comic number: ${todaysComic.num}`);
            }
            
            console.log("Fetching comic number:", comicNumber);
            const fetchedComic = await getComicByNumber(comicNumber);
            if (fetchedComic) {
                setComic(fetchedComic);
                // Update comicNumber to the actual comic number returned (in case it was adjusted)
                // Ensure it's always stored as a number, not string
                setComicNumber(parseInt(fetchedComic.num, 10));
            } else {
                console.log("⚠️ No comic data received, showing error state");
                setComic({ 
                    title: "Unable to load comic", 
                    img: "https://via.placeholder.com/300x300?text=Error+Loading+Comic",
                    alt: "Unable to load comic data. Please check your internet connection.",
                    num: comicNumber,
                    day: "N/A",
                    month: "N/A", 
                    year: "N/A"
                });
            }
        } catch (error) {
            console.error("❌ Error in setup:", error);
            setComic({ 
                title: "Error loading comic", 
                img: "https://via.placeholder.com/300x300?text=Error",
                alt: "An error occurred while loading the comic.",
                num: comicNumber,
                day: "N/A",
                month: "N/A",
                year: "N/A"
            });
        }
    };

    const handleComicChange = async (newComicNumber) => {
        try {
            // Ensure newComicNumber is a valid integer
            const parsedComicNumber = parseInt(newComicNumber, 10);
            if (isNaN(parsedComicNumber)) {
                console.log("⚠️ Invalid comic number, staying on current comic");
                return;
            }

            // Bounds checking - prevent going below 1
            if (parsedComicNumber < 1) {
                console.log("⚠️ Cannot go below comic #1");
                return;
            }

            // Bounds checking - prevent going above maximum comic number
            if (maxComicNumber > 0 && parsedComicNumber > maxComicNumber) {
                console.log(`⚠️ Cannot go above comic #${maxComicNumber} (latest available)`);
                return;
            }

            console.log(`🔄 Changing to comic #${parsedComicNumber}`);
            setComicNumber(parsedComicNumber); // This will now always be a number
            
            const fetchedComic = await getComicByNumber(parsedComicNumber);
            if (fetchedComic) {
                setComic(fetchedComic);
                // Ensure the comic number stays as a number, not string
                setComicNumber(parseInt(fetchedComic.num, 10));
            }
        } catch (error) {
            console.error("❌ Error changing comic:", error);
        }
    };
    
    const handleAddToFavorites = async (comic) => {
        // Ensure user is logged in
        if (!user || !user.id) {
            //console.log("User not logged in. Cannot add to favorites.");
            return;
        }
        // Insert user data into the database
        // If the comic is already in favorites, remove it from the database and do not add it again
        const existingData = await getUserDataByUserId(user.id);
        const isAlreadyFavorite = existingData.some(data => data.info === `${comic.num}`);
        if (isAlreadyFavorite) {
            console.log("Comic is already in favorites. Removing from favorites.");
            await removeUserData(user.id, `${comic.num}`);
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
            <Stack.Screen 
                options={{
                    title: "Comic Details",
                    headerShown: true,
                    headerTitleStyle: {
                        fontSize: 16, // Smaller font since comic titles can be long
                    },
                }}
            />
            {comic ? (
                <>
                    <Text style={styles.title}>{comic.title}</Text>
                    <Image source={{ uri: comic.img }} style={styles.image} />
                    <Text style={styles.altText}>{comic.alt}</Text>
                    <Text style={styles.infoText}>Comic Number: {comic.num}</Text>
                    <Text style={styles.infoText}>Date: {comic.day}/{comic.month}/{comic.year}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.navButton, comicNumber <= 1 && styles.disabledButton]} 
                            disabled={comicNumber <= 1}
                            onPress={() => handleComicChange(comicNumber - 1)}
                        >
                            <Text style={[styles.buttonText, comicNumber <= 1 && styles.disabledButtonText]}>Previous</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.navButton}
                            onPress={async () => {
                                try {
                                    const randomComic = await getRandomComic();
                                    if (randomComic) {
                                        // Ensure we set both as numbers
                                        const randomNum = parseInt(randomComic.num, 10);
                                        setComicNumber(randomNum);
                                        setComic(randomComic);
                                    } else {
                                        console.log("⚠️ Failed to get random comic");
                                    }
                                } catch (error) {
                                    console.error("❌ Error getting random comic:", error);
                                }
                            }}
                        >
                            <Text style={styles.buttonText}>Random</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.navButton, maxComicNumber > 0 && comicNumber >= maxComicNumber && styles.disabledButton]}
                            disabled={maxComicNumber > 0 && comicNumber >= maxComicNumber}
                            onPress={() => handleComicChange(comicNumber + 1)}
                        >
                            <Text style={[styles.buttonText, maxComicNumber > 0 && comicNumber >= maxComicNumber && styles.disabledButtonText]}>Next</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.favoriteContainer}>
                        <TouchableOpacity 
                            style={styles.favoriteButton}
                            onPress={() => handleAddToFavorites(comic)}
                        >
                            <Text style={styles.buttonText}>Add to Favorites</Text>
                        </TouchableOpacity>
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
    ctaButton: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#007BFF", borderRadius: 8, minWidth: 100, },
    ctaButtonText: { color: "#fff", fontWeight: "600" },
    
    // New button container and styles
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
        paddingHorizontal: 20,
        gap: 10, // Space between buttons
    },
    navButton: {
        flex: 1, // Each button takes equal space
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44, // Minimum touch target size
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    disabledButtonText: {
        color: '#888',
    },
    
    // Favorites button styles
    favoriteContainer: {
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    favoriteButton: {
        backgroundColor: '#28a745', // Green color for favorites
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
        minWidth: 200, // Make it wider than navigation buttons
    },
    
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
    image: { width: '100%', height: 300, resizeMode: 'contain', marginVertical: 10 },
    altText: { fontStyle: 'italic', textAlign: 'center', marginVertical: 10, paddingHorizontal: 10 },
    infoText: { textAlign: 'center', marginVertical: 5 },
});

export default ComicDetails;