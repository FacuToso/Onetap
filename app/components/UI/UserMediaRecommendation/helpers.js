const emojis = ['🔥', '🔅', '🎇', '🔔', '📢'];

const phrases = [
  'You should watch this!',
  'This is a must watch!',
  'We recomend you',
  'You will enjoy',
  'You also might be interested in',
];

const randomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
};

const randomPhrase = () => {
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
};

export {
  randomEmoji,
  randomPhrase,
};
