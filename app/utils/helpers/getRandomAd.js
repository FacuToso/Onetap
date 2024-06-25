import { AdImageUrl } from "utils/consts";

const getRandomAd = () => {
    const adKeys = Object.keys(AdImageUrl);
    const randomKey = adKeys[Math.floor(Math.random() * adKeys.length)];

    return AdImageUrl[randomKey];
};

export default getRandomAd;