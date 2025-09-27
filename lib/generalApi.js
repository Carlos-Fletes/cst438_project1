import {
  init_DB,
  insertUserData,
  getUserDataByUserId,
  getAllData,
  getUserDataWithoutTimestamp,
  removeDuplicateUserData,
} from "../lib/UserComic";

export var recentComicNum = 0;

export const getTodaysComic = async () => {
    try {
        const response = await fetch('https://xkcd.com/info.0.json');
        const json = await response.json();
        recentComicNum = json.num;
        //console.log(json);
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
        //console.log(json);
        return json;
    } catch (error) {
        console.error(error);
    }
    return null;
}

export const getRandomComics = async (n) => {
    const randomComics = [];
    const comicNums = new Set();

    while (comicNums.size < n) {
        var randomNum = Math.floor(Math.random() * recentComicNum) + 1;
        comicNums.add(randomNum);
    }

    for (const num of comicNums) {
        const comic = await getComicByNumber(num);
        if (comic) {
            randomComics.push(comic);
        }
    }
    return randomComics;
}

export const getComicByNumber = async (comicNum) => {
    try {
        const response = await fetch(`https://xkcd.com/${comicNum}/info.0.json`);
        const json = await response.json();
        //console.log(json);
        return json;
    } catch (error) {
        console.error(error);
    }
    return null;
}

export const getPopularComics = async () => {
    const popularComics = [];
    getAllData().then(async (data) => {
        const comicNums = data.map(entry => parseInt(entry.info)).filter(num => !isNaN(num));
        const uniqueComicNums = [...new Set(comicNums)];
        for (const num of uniqueComicNums) {
            const comic = await getComicByNumber(num);
            if (comic) {
                popularComics.push(comic);
            }
        }
    });
    return popularComics;
}

export const getRecommendedComics = async (userId) => {
    const recommendedComics = [];
    const userData = await getUserDataByUserId(userId);
    const favoriteComicIds = userData.map(entry => entry.info);
    for (const comicId of favoriteComicIds) {
        const comic = await getComicByNumber(comicId);
        if (comic) {
            recommendedComics.push(comic);
        }
    }
    return recommendedComics;
}

export const getFavoriteComics = async (userId) => {
    const favoriteComics = [];
    const userData = await getUserDataByUserId(userId);
    const favoriteComicIds = userData.map(entry => entry.info);
    for (const comicId of favoriteComicIds) {
        const comic = await getComicByNumber(comicId);
        if (comic) {
            favoriteComics.push(comic);
        }
    }
    return favoriteComics;
}
