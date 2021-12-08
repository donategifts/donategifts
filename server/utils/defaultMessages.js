const getMessageChoices = (userFirstName, childFirstName) => {
  if (!userFirstName || !childFirstName) {
    return [];
  }
  return [
    `${userFirstName} sends you love, ${childFirstName}.`,
    `${userFirstName} wishes you a happy Hanukkah!`,
    `${userFirstName} wishes you a merry Christmas!`,
    `${userFirstName} wishes you happy holidays!`,
    `Merry Christmas, ${childFirstName}`,
    `Happy holidays, ${childFirstName}`,
    'Merry Christmas and a Happy New Year',
    `${childFirstName}, have a happy holiday`,
    `${childFirstName}, you are awesome!`,
    `Lots of love and best wishes, ${childFirstName}`,
    `${childFirstName}, we love you and we want you to know that! You are amazing!`,
    `${childFirstName}, hope you enjoy my gift!`,
    'Happy birthday to the sweetest kid in the entire world.',
    `Happy birthday, ${childFirstName}`,
    `Congratulations, ${childFirstName}`,
  ];
};

module.exports = {
  getMessageChoices,
};
