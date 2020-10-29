const bcrypt = require('bcrypt');

const users = [
  {
    fName: 'John',
    lName: 'Doe',
    email: 'johndoe@gmail.com',
    emailVerified: true,
    verificationHash: 'randomString',
    userRole: 'Donor',
    password: bcrypt.hashSync('johndoe1!', 10),
  },
  {
    fName: 'Jane',
    lName: 'Doe',
    email: 'janedoe@gmail.com',
    emailVerified: true,
    verificationHash: 'anotherRandomString',
    password: bcrypt.hashSync('janedoe1!', 10),
    userRole: 'Partner',
  },
  {
    fName: 'Ricky',
    lName: 'bobby',
    email: 'rickybobby@gmail.com',
    emailVerified: true,
    verificationHash: 'oogabooga',
    password: bcrypt.hashSync('rickybobby1!', 10),
    userRole: 'admin',
  },
];

const wishcards = [
  {
    approvedByAdmin: true,
    childFirstName: 'princess',
    chaldLastName: 'Elsa',
    childInterest: 'playing video games',
    wishItemName: 'Amazon Gift Card LOL',
    wishCardImage: 'https://picsum.photos/seed/picsum/300/300',
    wishItemUrl: 'https://www.google.com',
  },
  {
    approvedByAdmin: true,
    childFirstName: 'princess',
    chaldLastName: 'Stacey',
    childInterest: 'playing video games',
    wishItemName: 'Amazon Gift Card LOL',
    wishCardImage: 'https://picsum.photos/seed/picsum/300/300',
    wishItemUrl: 'https://www.google.com',
  },
  {
    approvedByAdmin: true,
    childFirstName: 'princess',
    chaldLastName: 'Patric',
    childInterest: 'playing video games',
    wishItemName: 'Amazon Gift Card LOL',
    wishCardImage: 'https://picsum.photos/seed/picsum/300/300',
    wishItemUrl: 'https://www.google.com',
  },
];

module.exports = { users, wishcards };
