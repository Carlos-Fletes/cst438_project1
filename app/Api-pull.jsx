import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

//This is an example of pulling data from an API and displaying it in a React Native component.
//I am testing how to pull data from the API we are intending to use, most of this has been written by AI while i figure this out

const ApiPull = async() => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await response.json();
        console.log(data);
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{data.title}</Text>
            </View>
        );
    } catch (error) {
        console.error(error);
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Error fetching data</Text>
            </View>
        );
    }
};
