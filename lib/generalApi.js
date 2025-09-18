//import { initDB, insertUser, getAllUsers, FindUserByUsername } from '../lib/database';
//import {init_DB, insertUserData} from '.../lib/UserComic.js';

export var recentComicNum = 0;

export const getTodaysComic = async () => {
    try {
        const response = await fetch('https://xkcd.com/info.0.json');
        const json = await response.json();
        recentComicNum = json.num;
        console.log(json);
        return json;
    } catch (error) {
        console.error(error);
    }
    return null;
}

export const getRandomComic = async () => {
    try {
        var randomNum = Math.floor(Math.random() * recentComicNum) + 1;
        const response = await fetch(`https://xkcd.com/${randomNum}/info.0.json`);
        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error);
    }
    return null;
}

export const getComicByNumber = async (comicNum) => {
    try {
        const response = await fetch(`https://xkcd.com/${comicNum}/info.0.json`);
        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error);
    }
    return null;
}