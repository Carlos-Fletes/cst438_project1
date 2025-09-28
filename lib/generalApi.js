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
        console.log('🔄 Fetching today\'s comic from XKCD API...');
        const response = await fetch('https://xkcd.com/info.0.json');
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response headers:', response.headers.get('content-type'));
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('📝 Raw response (first 200 chars):', text.substring(0, 200));
        
        const json = JSON.parse(text);
        recentComicNum = json.num;
        console.log('✅ Successfully fetched today\'s comic:', json.num);
        return json;
    } catch (error) {
        console.error('❌ Error fetching today\'s comic:', error);
        console.error('❌ Error type:', error.constructor.name);
        console.error('❌ Error message:', error.message);
    }
    return null;
}

export const getRandomComic = async () => {
    try {
        if (recentComicNum === 0) {
            console.log('⚠️ recentComicNum is 0, fetching today\'s comic first...');
            await getTodaysComic();
        }
        
        var randomNum = Math.floor(Math.random() * recentComicNum) + 1;
        console.log(`🔄 Fetching random comic #${randomNum} from XKCD API...`);
        
        const response = await fetch(`https://xkcd.com/${randomNum}/info.0.json`);
        
        console.log(`📊 Response status for random comic #${randomNum}:`, response.status);
        console.log(`📊 Response headers for random comic #${randomNum}:`, response.headers.get('content-type'));
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log(`📝 Raw response for random comic #${randomNum} (first 200 chars):`, text.substring(0, 200));
        
        const json = JSON.parse(text);
        console.log(`✅ Successfully fetched random comic #${randomNum}`);
        return json;
    } catch (error) {
        console.error('❌ Error fetching random comic:', error);
        console.error('❌ Error type:', error.constructor.name);
        console.error('❌ Error message:', error.message);
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
        // Ensure we have the latest comic number
        if (recentComicNum === 0) {
            console.log('⚠️ recentComicNum is 0, fetching today\'s comic first...');
            await getTodaysComic();
        }
        
        // Validate comic number
        if (comicNum < 1) {
            console.log(`⚠️ Invalid comic number: ${comicNum}, using comic #1 instead`);
            comicNum = 1;
        }
        
        if (comicNum > recentComicNum) {
            console.log(`⚠️ Comic #${comicNum} doesn't exist yet (latest is #${recentComicNum}), using latest instead`);
            comicNum = recentComicNum;
        }
        
        console.log(`🔄 Fetching comic #${comicNum} from XKCD API...`);
        const response = await fetch(`https://xkcd.com/${comicNum}/info.0.json`);
        
        console.log(`📊 Response status for comic #${comicNum}:`, response.status);
        console.log(`📊 Response headers for comic #${comicNum}:`, response.headers.get('content-type'));
        
        if (!response.ok) {
            if (response.status === 404) {
                console.log(`⚠️ Comic #${comicNum} not found, trying comic #1 instead`);
                return await getComicByNumber(1);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log(`📝 Raw response for comic #${comicNum} (first 200 chars):`, text.substring(0, 200));
        
        const json = JSON.parse(text);
        console.log(`✅ Successfully fetched comic #${comicNum}`);
        return json;
    } catch (error) {
        console.error(`❌ Error fetching comic #${comicNum}:`, error);
        console.error('❌ Error type:', error.constructor.name);
        console.error('❌ Error message:', error.message);
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
