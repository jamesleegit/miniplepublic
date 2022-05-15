export const verifyEmail = (str : string) => {
    return /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(str);
};

export const verifyPassword = (str : string) => {
    return str && str.length > 4 && str.length < 100;
};

export const banNicknameWords = [
    'admin',
    '운영',
    '영자',
    '관리',
    '관리',
    ' '
];
export const verifyNickname = (str : string) => {
    return str && str.length > 1 && str.length < 12 && banNicknameWords.every(word => str.indexOf(word) === -1);
};

export const generateDarkHexColorCode = () => {
    let letters = '0123456789'.split('');
    let color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 10)] || 0;
    }
    return color;
}

export const sleep = (ms : number) => new Promise(resolve => setTimeout(resolve, ms));


export function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }