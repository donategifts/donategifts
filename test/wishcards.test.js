const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../server/db/models/User');
const Agency = require('../server/db/models/Agency');
const WishCard = require('../server/db/models/WishCard');
const Message = require('../server/db/models/Message');
const { getMessageChoices } = require('../server/utils/defaultMessages');

// Require the dev-dependencies
const server = require('../server/app');
const log = require('../server/helper/logger');
// chai docs recommend using var
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);
const agent = chai.request.agent(server);

const signupRequest = {
  fName: 'testFirstName',
  lName: 'testLastName',
  email: 'test@email.de',
  password: 'testPassword1',
  passwordConfirm: 'testPassword1',
  userRole: 'partner',
};

const agencyRequest = {
  agencyName: 'testAgencyName',
  agencyWebsite: 'http://testAgencyWebsite',
  agencyPhone: '12334556',
  agencyBio: 'testAgencyBio',
};

const wishcardRequest = {
  childBirthday: '09/10/2020',
  childFirstName: 'Doom',
  childLastName: 'Slayer',
  childInterest: 'Slaying demons',
  wishItemName: 'Doom Slayer statue',
  wishItemPrice: 20,
  wishItemURL: 'http://someamazonlink',
  childStory: 'Doom Slayer traveled to Mars and slayed demons',
};

const itemChoice = {
  Name: 'Baby Activity Book - Peekaboo',
  Price: 13,
  ItemURL:
    'https://www.amazon.com/gp/item-dispatch?registryID.1=3ERLGLFOY8E4M&registryItemID.1=I1OYPRM1WI7CMA&offeringID.1=ffVJa7sdWT8tHlQTydStzaNNxepB4TVnC1FL1Wj8jOKne2%252FA%252F%252FJ1Q0%252FjxWq5DBw85qzSopctj84FwkkbJCUuUwaDWxeZUFNo%252BaOtV4SXR3W10wdsETSGXHStfXl%252BWYkxQdPhWSwpFh4IJcUDPGeBhg%253D%253D&session-id=146-5423461-6179443&isGift=0&submit.addToCart=1&quantity.1=1&ref_=lv_ov_lig_pab',
};

const guidedwishcardRequest = {
  childBirthday: '09/10/2020',
  childFirstName: 'John',
  childLastName: 'John',
  childInterest: 'Playing with toys',
  childStory: 'John likes toys',
  address1: '1000 Hollywood Hills',
  city: 'San Fransisco',
  state: 'CA',
  zip: '70000',
  country: 'US',
};

describe('Wishcard Routes - Authenticated & Verified User', () => {
  before((done) => {
    User.deleteMany({}).then(() => {
      Agency.deleteMany({}).then(() => {
        WishCard.deleteMany({}, () => {
          agent
            .get('/users/logout')
            .redirects(1)
            .end((_logoutErr, res) => {
              res.text.should.contain('Sign Up to Donate Gifts');
              res.should.have.status(200);
              res.body.should.be.an('object');
            });
          agent
            .post('/users/signup')
            .send(signupRequest)
            .end((_signupErr, res) => {
              res.should.have.status(200);
              res.body.success.should.equal(true);
              res.body.should.have.property('user');
              res.body.user.should.have.property('fName');
              res.body.user.should.have.property('lName');
              res.body.user.should.have.property('email');
              res.body.user.should.have.property('emailVerified');
              res.body.user.should.have.property('verificationHash');
              res.body.user.should.have.property('password');
              res.body.user.should.have.property('userRole');
              res.body.user.should.have.property('_id');
              res.body.user.emailVerified.should.equal(false);
              res.body.should.have.property('url');

              agent.get('/users/agency').end((_agencyErr, agencyRes) => {
                agencyRes.should.have.status(200);
                agencyRes.text.should.contain('agency registration page');

                User.findOne({ email: signupRequest.email }).then((user) => {
                  agent
                    .post('/users/agency')
                    .send({ ...agencyRequest, isVerified: true })
                    .end((_postAgencyErr, postAgencyRes) => {
                      postAgencyRes.should.have.status(200);
                      postAgencyRes.body.should.have.property('url');

                      agent.get('/users/profile').end((_getProfileErr, getProfileRes) => {
                        getProfileRes.should.have.status(200);
                        getProfileRes.text.should.contain(`Welcome ${user.fName}`);
                        getProfileRes.text.should.contain('Your email is unverified');
                        getProfileRes.text.should.not.contain(
                          'Wish card creation feature is disabled',
                        );

                        Agency.findOne({ accountManager: user._id }).then((agency) => {
                          agency.agencyName.should.equal(agencyRequest.agencyName);
                          const aUserId = agency.accountManager.toString();
                          const userId = user._id.toString();
                          aUserId.should.equal(userId);
                          done();
                        });
                      });
                    });
                });
              });
            });
        });
      });
    });
  });

  it('POST wishcards', (done) => {
    agent
      .post('/wishcards/')
      .type('form')
      .field(wishcardRequest)
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((_err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success');
        res.body.should.have.property('url');
        res.body.success.should.equal(true);
        res.body.url.should.equal('/wishcards/');

        WishCard.findOne({ childFirstName: wishcardRequest.childFirstName }).then((wishcard) => {
          wishcardRequest.wishItemName.should.equal(wishcard.wishItemName);
          wishcardRequest.wishItemPrice.should.equal(wishcard.wishItemPrice);
          done();
        });
      });
  });

  it('POST wishcards/guided - receives url - /wishcards', (done) => {
    agent
      .post('/wishcards/guided/')
      .type('form')
      .field(guidedwishcardRequest)
      .field('itemChoice', JSON.stringify(itemChoice))
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success');
        res.body.should.have.property('url');
        res.body.success.should.equal(true);
        res.body.url.should.equal('/wishcards/');

        WishCard.findOne({ childFirstName: guidedwishcardRequest.childFirstName }).then(
          (wishcard) => {
            itemChoice.Name.should.equal(wishcard.wishItemName);
            itemChoice.Price.should.equal(wishcard.wishItemPrice);
            done();
          },
        );
      });
  });

  it('POST wishcards/message - Receives JSON', (done) => {
    User.findOne({ fName: signupRequest.fName }).then((user) => {
      WishCard.findOne({ childFirstName: wishcardRequest.childFirstName }).then((wishcard) => {
        const messageChoices = getMessageChoices(user.fName, wishcard.childFirstName);
        const message = messageChoices[0];

        agent
          .post('/wishcards/message')
          .send({
            messageFrom: user,
            messageTo: wishcard,
            message,
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success');
            res.body.should.have.property('data');
            res.body.success.should.equal(true);
            res.body.data.should.have.property('messageFrom');
            res.body.data.should.have.property('messageTo');
            res.body.data.should.have.property('message');

            Message.findOne({ messageFrom: user }).then((foundMessage) => {
              res.body.data.message.should.equal(foundMessage.message);
              done();
            });
          });
      });
    });
  });

  it('GET wishcards', (done) => {
    agent.get('/wishcards').end((err, res) => {
      res.should.have.status(200);
      res.text.should.contain('See Wish Cards');
      res.text.should.not.contain('No wishcards');
      res.text.should.contain(wishcardRequest.childFirstName);
      done();
    });
  });

  it('GET wishcard by Id', (done) => {
    WishCard.findOne({ childFirstName: wishcardRequest.childFirstName }).then((foundWishcard) => {
      agent.get(`/wishcards/${foundWishcard._id}`).end((err, res) => {
        res.should.have.status(200);
        res.text.should.contain(wishcardRequest.childFirstName);
        res.text.should.contain(wishcardRequest.childInterest);
        res.text.should.contain(wishcardRequest.childStory);
        done();
      });
    });
  });

  it('GET wishcard guided default choices', (done) => {
    agent
      .get('/wishcards/defaults/1')
      .redirects(1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success');
        res.body.should.have.property('html');
        res.body.success.should.equal(true);
        res.body.html.should.contain(itemChoice.Name);
        done();
      });
  });

  // it('POST /wishcards/search - Works as intended', (done) => {});
  // it('PUT /wishcards/update/:id/', (done) => {});
  // it('POST /wishcards/lock/:id - Receives JSON', (done) => {});

  it('POST wishcards - Child First Name is Required', (done) => {
    const newwishcardRequest = { ...wishcardRequest };
    delete newwishcardRequest.childFirstName;
    agent
      .post('/wishcards/')
      .type('form')
      .field(newwishcardRequest)
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((_err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.error.should.have.property('msg');
        done();
      });
  });

  it('POST wishcards - WishItem Name is Required', (done) => {
    const newwishcardRequest = { ...wishcardRequest };
    delete newwishcardRequest.wishItemName;
    agent
      .post('/wishcards/')
      .type('form')
      .field(newwishcardRequest)
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((_err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.error.should.have.property('msg');
        done();
      });
  });

  it('POST wishcards - WishItem Price is required', (done) => {
    const newwishcardRequest = { ...wishcardRequest };
    delete newwishcardRequest.wishItemPrice;
    agent
      .post('/wishcards/')
      .type('form')
      .field(newwishcardRequest)
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((_err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.error.should.have.property('msg');
        done();
      });
  });

  it('POST wishcards - Wishitem URL is required', (done) => {
    const newwishcardRequest = { ...wishcardRequest };
    delete newwishcardRequest.wishItemURL;
    agent
      .post('/wishcards/')
      .type('form')
      .field(newwishcardRequest)
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((_err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.error.should.have.property('msg');
        done();
      });
  });

  it('POST wishcards - Image is Required', (done) => {
    agent
      .post('/wishcards/')
      .type('form')
      .field(wishcardRequest)
      .end((_err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.error.should.have.property('msg');
        done();
      });
  });

  it('POST wishcards/guided - Child First Name is Required', (done) => {
    const newguidedwishcardRequest = { ...guidedwishcardRequest };
    delete newguidedwishcardRequest.childFirstName;
    agent
      .post('/wishcards/guided/')
      .type('form')
      .field(newguidedwishcardRequest)
      .field('itemChoice', JSON.stringify(itemChoice))
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.error.should.have.property('msg');
        done();
      });
  });

  it('POST wishcards/guided - Item is Required', (done) => {
    agent
      .post('/wishcards/guided/')
      .type('form')
      .field(guidedwishcardRequest)
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.error.should.have.property('msg');
        done();
      });
  });

  it('POST wishcards/guided - Item Name is Required', (done) => {
    const newItemChoice = { ...itemChoice };
    delete newItemChoice.Name;
    agent
      .post('/wishcards/guided/')
      .type('form')
      .field(guidedwishcardRequest)
      .field('itemChoice', JSON.stringify(newItemChoice))
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.error.should.have.property('msg');
        done();
      });
  });

  it('POST wishcards/guided - Item Price is Required', (done) => {
    const newItemChoice = { ...itemChoice };
    delete newItemChoice.Price;
    agent
      .post('/wishcards/guided/')
      .type('form')
      .field(guidedwishcardRequest)
      .field('itemChoice', JSON.stringify(newItemChoice))
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.error.should.have.property('msg');
        done();
      });
  });

  it('POST wishcards/guided - Item URL is Required', (done) => {
    const newItemChoice = { ...itemChoice };
    delete newItemChoice.ItemURL;
    agent
      .post('/wishcards/guided/')
      .type('form')
      .field(guidedwishcardRequest)
      .field('itemChoice', JSON.stringify(newItemChoice))
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.error.should.have.property('msg');
        done();
      });
  });

  it('POST wishcards/guided - Image is Required', (done) => {
    agent
      .post('/wishcards/guided/')
      .type('form')
      .field(guidedwishcardRequest)
      .field('itemChoice', JSON.stringify(itemChoice))
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.error.should.have.property('msg');
        done();
      });
  });

  after((done) => {
    User.deleteMany({}).then(() => {
      Agency.deleteMany({}).then(() => {
        WishCard.deleteMany({}).then(() => {
          agent.get('/users/logout').end((err, res) => {
            res.text.should.contain('Sign Up to Donate Gifts');
            res.should.have.status(200);
            res.body.should.be.an('object');
            done();
          });
        });
      });
    });
  });
});

describe('Wishcard Routes - Authenticated & Unverified User', () => {
  before((done) => {
    User.deleteMany({}).then(() => {
      Agency.deleteMany({}).then(() => {
        WishCard.deleteMany({}).then(() => {
          agent
            .get('/users/logout')
            .redirects(1)
            .end((err, res) => {
              res.text.should.contain('Sign Up to Donate Gifts');
              res.should.have.status(200);
              res.body.should.be.an('object');
            });
          agent
            .post('/users/signup')
            .send(signupRequest)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.success.should.equal(true);
              res.body.should.have.property('user');
              res.body.user.should.have.property('fName');
              res.body.user.should.have.property('lName');
              res.body.user.should.have.property('email');
              res.body.user.should.have.property('emailVerified');
              res.body.user.should.have.property('verificationHash');
              res.body.user.should.have.property('password');
              res.body.user.should.have.property('userRole');
              res.body.user.should.have.property('_id');
              res.body.user.emailVerified.should.equal(false);
              res.body.should.have.property('url');

              agent.get('/users/agency').end((_err, agencyRes) => {
                agencyRes.should.have.status(200);
                agencyRes.text.should.contain('agency registration page');

                User.findOne({ email: signupRequest.email }).then((user) => {
                  agent
                    .post('/users/agency')
                    .send(agencyRequest)
                    .end((_userFindErr, userFindRes) => {
                      userFindRes.should.have.status(200);
                      userFindRes.body.should.have.property('url');

                      agent.get('/users/profile').end((_profileErr, profileRes) => {
                        profileRes.should.have.status(200);
                        profileRes.text.should.contain(`Welcome ${user.fName}`);
                        profileRes.text.should.contain('Your email is unverified');
                        profileRes.text.should.contain(
                          'Wish card creation feature is disabled',
                        );

                        Agency.create({ accountManager: user._id, ...agencyRequest }).then(
                          (agency) => {
                            agency.agencyName.should.equal(agencyRequest.agencyName);

                            WishCard.create({ createdBy: user._id, ...wishcardRequest }).then(
                              (wishcard) => {
                                wishcard.childFirstName.should.equal(
                                  wishcardRequest.childFirstName,
                                );
                              },
                            );
                            done();
                          },
                        );
                      });
                    });
                });
              });
            });
        });
      });
    });

    after((_done) => {
      User.deleteMany({}).then(() => {
        Agency.deleteMany({}).then(() => {
          WishCard.deleteMany({}).then(() => {
            agent.get('/users/logout').end((err, res) => {
              res.text.should.contain('Sign Up to Donate Gifts');
              res.should.have.status(200);
              res.body.should.be.an('object');
              _done();
            });
          });
        });
      });
    });
  });

  it('POST /wishcards/ - Object with profile url', (done) => {
    agent
      .post('/wishcards/')
      .type('form')
      .field(wishcardRequest)
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.property('success');
        res.body.should.have.property('url');
        res.body.success.should.equal(false);
        res.body.url.should.equal('/users/profile');
        done();
      });
  });

  it('POST /wishcards/guided - Object with profile url', (done) => {
    agent
      .post('/wishcards/guided/')
      .type('form')
      .field(guidedwishcardRequest)
      .field('itemChoice', JSON.stringify(itemChoice))
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.property('success');
        res.body.should.have.property('url');
        res.body.success.should.equal(false);
        res.body.url.should.equal('/users/profile');
        done();
      });
  });

  it('POST /wishcards/message - Object with profile url', (done) => {
    User.findOne({ fName: signupRequest.fName }).then((user) => {
      WishCard.findOne({ childFirstName: wishcardRequest.childFirstName }).then((wishcard) => {
        const messageChoices = getMessageChoices(user.fName, wishcard.childFirstName);
        const message = messageChoices[0];

        agent
          .post('/wishcards/message')
          .send({
            messageFrom: user,
            messageTo: wishcard,
            message,
          })
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property('success');
            res.body.should.have.property('url');
            res.body.success.should.equal(false);
            res.body.url.should.equal('/users/profile');
            done();
          });
      });
    });
  });

  it('GET wishcards', (done) => {
    agent.get('/wishcards').end((err, res) => {
      res.should.have.status(200);
      res.text.should.contain('See Wish Cards');
      res.text.should.not.contain('No wishcards');
      res.text.should.contain(wishcardRequest.childFirstName);
      done();
    });
  });

  it('GET wishcard by Id', (done) => {
    WishCard.findOne({ childFirstName: wishcardRequest.childFirstName }).then((foundWishcard) => {
      agent.get(`/wishcards/${foundWishcard._id}`).end((err, res) => {
        res.should.have.status(200);
        res.text.should.contain(wishcardRequest.childFirstName);
        res.text.should.contain(wishcardRequest.childInterest);
        res.text.should.contain(wishcardRequest.childStory);
        done();
      });
    });
  });

  it('GET wishcard guided default choices -  Object with profile url', (done) => {
    agent.get('/wishcards/defaults/1').end((err, res) => {
      res.should.have.status(403);
      res.body.should.have.property('success');
      res.body.should.have.property('url');
      res.body.success.should.equal(false);
      res.body.url.should.equal('/users/profile');
      done();
    });
  });

  // it('POST /wishcards/search - Works as intended', (done) => {});
  // it('PUT /wishcards/update/:id/', (done) => {});
  // it('POST /wishcards/lock/:id - Redirects to Profile', (done) => {});

  after((done) => {
    WishCard.deleteMany({}).then(() => {
      agent.get('/users/logout').end((err, res) => {
        res.text.should.contain('Sign Up to Donate Gifts');
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
    });
  });
});

describe('Wishcard Routes - Unauthenticated User', () => {
  before((done) => {
    WishCard.create(wishcardRequest).then(() => {
      done();
    });
  });
  it('POST /wishcards/ - Object with login url', (done) => {
    agent
      .post('/wishcards/')
      .type('form')
      .field(wishcardRequest)
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.property('success');
        res.body.should.have.property('url');
        res.body.success.should.equal(false);
        res.body.url.should.equal('/users/login');
        done();
      });
  });

  it('POST /wishcards/guided - Object with login url', (done) => {
    agent
      .post('/wishcards/guided/')
      .type('form')
      .field(guidedwishcardRequest)
      .field('itemChoice', JSON.stringify(itemChoice))
      .attach(
        'wishCardImage',
        fs.readFileSync('client/public/img/card-sample-1.jpg'),
        'card-sample1.jpg',
      )
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.property('success');
        res.body.should.have.property('url');
        res.body.success.should.equal(false);
        res.body.url.should.equal('/users/login');
        done();
      });
  });

  it('GET wishcards', (done) => {
    agent.get('/wishcards').end((err, res) => {
      res.should.have.status(200);
      res.text.should.contain('See Wish Cards');
      res.text.should.not.contain('No wishcards');
      res.text.should.contain(wishcardRequest.childFirstName);
      done();
    });
  });

  it('GET wishcard by Id - Redirects to login', (done) => {
    WishCard.findOne({ childFirstName: wishcardRequest.childFirstName }).then((foundWishcard) => {
      agent
        .get(`/wishcards/${foundWishcard._id}`)
        .redirects(1)
        .end((err, res) => {
          res.text.should.contain('Sign Up to Donate Gifts');
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        });
    });
  });

  it('GET wishcard guided default choices -  Object with login url', (done) => {
    agent.get('/wishcards/defaults/1').end((err, res) => {
      res.should.have.status(403);
      res.body.should.have.property('success');
      res.body.should.have.property('url');
      res.body.success.should.equal(false);
      res.body.url.should.equal('/users/login');
      done();
    });

    after((_done) => {
      WishCard.deleteMany({}).then(() => {
        _done();
      });
    });
  });

  // it('POST /wishcards/search - Works as intended', (done) => {});
  // it('PUT /wishcards/update/:id/ - Redirects to Login', (done) => {});
  // it('POST /wishcards/lock/:id - Redirects to Login', (done) => {});
});
