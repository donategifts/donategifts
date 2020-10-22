let User = require('../server/db/models/User');
let Agency = require('../server/db/models/Agency');

//Require the dev-dependencies
let fs = require('fs');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server/app');
const WishCard = require('../server/db/models/WishCard');
//chai docs recommend using var
var should = chai.should();

chai.use(chaiHttp);
let agent = chai.request.agent(server);

let signupRequest = {
  fName: 'testFirstName',
  lName: 'testLastName',
  email: 'test@email.de',
  password: 'testPassword',
  passwordConfirm: 'testPassword',
  userRole: 'partner',
};

let agencyRequest = {
  agencyName: 'testAgencyName',
  agencyWebsite: 'http://testAgencyWebsite',
  agencyPhone: '12334556',
  agencyBio: 'testAgencyBio',
};

let wishcardRequest = {
  childBirthday: '09/10/2020',
  childFirstName: 'Doom',
  childLastName: 'Slayer',
  childInterest: 'Slaying demons',
  wishItemName: 'Doom Slayer statue',
  wishItemPrice: '20',
  wishItemURL: 'http://someamazonlink',
  childStory: 'Doom Slayer traveled to Mars and slayed demons',
};

describe('Wishcard Routes - Authenticated & Verified User', () => {
  before((done) => {
    User.deleteMany({ email: 'test@email.de' }, (err) => {
      Agency.deleteMany({}, (err) => {
        WishCard.deleteMany({}, (err) => {
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

              agent.get('/users/agency').end((err, res) => {
                res.should.have.status(200);
                res.text.should.contain('agency registration page');

                User.findOne({ email: signupRequest.email }).then((user) => {
                  agent
                    .post('/users/agency')
                    .send({ ...agencyRequest, isVerified: true })
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.have.property('url');

                      agent.get('/users/profile').end((err, res) => {
                        res.should.have.status(200);
                        res.text.should.contain('Welcome ' + user.fName);
                        res.text.should.contain('Your email is unverified');
                        res.text.should.not.contain(
                          'Wish card creation feature is disabled for your account',
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

  it('POST /wishcards/', (done) => {
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

  /* it('POST /wishcards/guided - receives url - /wishcards', (done) => {});
  it('POST /wishcards/search - Works as intended', (done) => {});
  //it('PUT /wishcards/update/:id/ - renders wishcard Full Page', (done) => {});
  it('POST /wishcards/message - Receives JSON', (done) => {});
  it('POST /wishcards/lock/:id - Receives JSON', (done) => {}); */
});

/* describe('Wishcard Routes - Authenticated & Unverified User', () => {
  it('POST /wishcards/ - Redirects to Profile', (done) => {});
  it('POST /wishcards/guided - Redirects to profile', (done) => {});
  it('POST /wishcards/search - Works as intended', (done) => {});
  //it('PUT /wishcards/update/:id/ - renders wishcard Full Page', (done) => {});
  it('POST /wishcards/message - Redirects to Profile', (done) => {});
  it('POST /wishcards/lock/:id - Redirects to Profile', (done) => {});
});

describe('Wishcard Routes - Unauthenticated User', () => {
  it('POST /wishcards/ - Redirects to Login', (done) => {});
  it('POST /wishcards/guided - Redirects to Login', (done) => {});
  it('POST /wishcards/search - Works as intended', (done) => {});
  //it('PUT /wishcards/update/:id/ - Redirects to Login', (done) => {});
  it('POST /wishcards/message - Redirects to Login', (done) => {});
  it('POST /wishcards/lock/:id - Redirects to Login', (done) => {});
});

describe('Register/Login and Verify User (Agency)', () => {
  before((done) => {
    User.deleteMany({ email: 'test@email.de' }, (err) => {
      Agency.deleteMany({}, (err) => {
        agent.get('/users/logout').end((err, res) => {
          res.text.should.contain('Sign Up to Donate Gifts');
          res.should.have.status(200);
          res.body.should.be.an('object');
        });
      });
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

        User.findOne({ email: signupRequest.email }).then((user) => {
          user.id.should.equal(res.body.user._id);
          user.email.should.equal(signupRequest.email);

          agent.get('/users/verify/' + user.verificationHash).end((err, res) => {
            res.should.have.status(200);
            res.text.should.contain('Verification successful');

            User.findOne({ email: signupRequest.email }).then((user) => {
              user.emailVerified.should.equal(true);
              done();
            });
          });
        });
      });
  });

  describe('/GET users/logout', () => {
    it('it should GET logout and redirect to login', (done) => {
      agent.get('/users/logout').end((err, res) => {
        res.text.should.contain('Sign Up to Donate Gifts');
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
    });
  });

  describe('/GET users/profile', () => {
    it('should not get profile without being logged in and should redirect to login', (done) => {
      agent.get('/users/profile').end((err, res) => {
        res.text.should.contain('Sign Up to Donate Gifts');
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
    });

    it('should get profile when logged in and display unverified email message', (done) => {
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
          User.findOne({ email: signupRequest.email }).then((user) => {
            user.id.should.equal(res.body.user._id);

            agent.get('/users/profile').end((err, res) => {
              res.text.should.contain('Welcome ' + user.fName);
              res.text.should.contain('Your email is unverified');
              done();
            });
          });
        });
    });

    it('should not display unverified email message once email is verified', (done) => {
      agent
        .post('/users/signup')
        .send(signupRequest)
        .end((err, res) => {
          res.should.have.status(200);
          User.findOne({ email: signupRequest.email }).then((user) => {
            user.emailVerified.should.equal(false);
            agent.get('/users/verify/' + user.verificationHash).end((err, res) => {
              res.should.have.status(200);
              res.text.should.contain('Verification successful');

              User.findOne({ email: signupRequest.email }).then((user) => {
                user.emailVerified.should.equal(true);

                agent.get('/users/profile').end((err, res) => {
                  res.should.have.status(200);
                  res.text.should.contain('Welcome ' + user.fName);
                  res.text.should.not.contain('Your email is unverified');
                  done();
                });
              });
            });
          });
        });
    });
  });

  describe('/GET users/agency', () => {
    it(' /GET agency without being logged in should redirect to login', (done) => {
      agent.get('/users/agency').end((err, res) => {
        res.text.should.contain('Sign Up to Donate Gifts');
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
    });
  });

  describe('/GET users/terms', () => {
    it('it should get terms', (done) => {
      agent.get('/users/terms').end((err, res) => {
        res.text.should.contain('Terms of Service ');
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
    });
  });

  describe('/POST users/signup', () => {
    it('it should not POST without fName', (done) => {
      agent
        .post('/users/signup')
        .send({ ...signupRequest, fName: null })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.msg.should.contain('Invalid value');
          res.body.error.param.should.contain('fName');
          done();
        });
    });

    it('it should not POST without lName', (done) => {
      agent
        .post('/users/signup')
        .send({ ...signupRequest, lName: null })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.msg.should.contain('Invalid value');
          res.body.error.param.should.contain('lName');
          done();
        });
    });

    it('it should not POST without email', (done) => {
      agent
        .post('/users/signup')
        .send({ ...signupRequest, email: null })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.msg.should.contain('Invalid value');
          res.body.error.param.should.contain('email');
          done();
        });
    });

    it('it should not POST without password', (done) => {
      agent
        .post('/users/signup')
        .send({ ...signupRequest, password: null })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.msg.should.contain('Invalid value');
          res.body.error.param.should.contain('password');
          done();
        });
    });

    it('it should create User', (done) => {
      agent
        .post('/users/signup')
        .send(signupRequest)
        .end((err, res) => {
          res.should.have.status(200);

          User.findOne({ email: signupRequest.email }).then((user) => {
            user.email.should.equal(signupRequest.email);
            done();
          });
        });
    });
  });

  describe('/POST users/login', () => {
    it('it should not login without email', (done) => {
      let loginRequest = {
        password: 'testPassword',
      };
      agent
        .post('/users/login')
        .send(loginRequest)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.msg.should.contain('Invalid value');
          res.body.error.param.should.contain('email');
          done();
        });
    });

    it('it should not login without password', (done) => {
      let loginRequest = {
        email: 'test@Email.de',
      };
      agent
        .post('/users/login')
        .send(loginRequest)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.msg.should.contain('Invalid value');
          res.body.error.param.should.contain('password');
          done();
        });
    });

    it("it should not login if user doesn't exist", (done) => {
      let loginRequest = {
        email: 'testEmail@email.de',
        password: 'testPassword',
      };
      agent
        .post('/users/login')
        .send(loginRequest)
        .end((err, res) => {
          res.should.have.status(403);
          res.text.should.contain('Username and/or password incorrect');
          done();
        });
    });
  });

  describe('/POST users/agency', () => {
    it('it should redirect to login if not logged in', (done) => {
      agent.get('/users/agency').end((err, res) => {
        res.should.have.status(200);
        res.text.should.contain('Sign Up to Donate Gifts');
        done();
      });
    });

    it('it should show agency registration page after initial registration for partners', (done) => {
      agent
        .post('/users/signup')
        .send({ ...signupRequest, userRole: 'partner' })
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

          agent.get('/users/agency').end((err, res) => {
            res.should.have.status(200);
            res.text.should.contain('agency registration page');
            done();
          });
        });
    });

    it('it should always redirect to agency registration if user has not completed it and navigates away', (done) => {
      signupRequest.userRole = 'partner';
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

          agent
            .get('/users/profile')
            .redirects(1)
            .end((err, res) => {
              res.should.have.status(200);
              res.text.should.contain('agency registration page');
              done();
            });
        });
    });

    it('it should save agency information', (done) => {
      signupRequest.userRole = 'partner';
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

          agent.get('/users/agency').end((err, res) => {
            res.should.have.status(200);
            res.text.should.contain('agency registration page');

            User.findOne({ email: signupRequest.email }).then((user) => {
              let agencyRequest = {
                agencyName: 'testAgencyName',
                agencyWebsite: 'http://testAgencyWebsite',
                agencyPhone: '12334556',
                agencyBio: 'testAgencyBio',
              };

              agent
                .post('/users/agency')
                .send(agencyRequest)
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.property('url');

                  agent.get('/users/profile').end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.contain('Welcome ' + user.fName);
                    res.text.should.contain('Your email is unverified');

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

    it('it should not save agency without Agency Name', (done) => {
      signupRequest.userRole = 'partner';
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

          agent.get('/users/agency').end((err, res) => {
            res.should.have.status(200);
            res.text.should.contain('agency registration page');

            User.findOne({ email: signupRequest.email }).then((user) => {
              let agencyRequest = {
                agencyWebsite: 'http://testAgencyWebsite',
                agencyPhone: '12334556',
                agencyBio: 'testAgencyBio',
              };

              agent
                .post('/users/agency')
                .send(agencyRequest)
                .end((err, res) => {
                  res.should.have.status(400);
                  res.body.should.have.property('error');
                  res.body.error.msg.should.contain('Invalid value');
                  res.body.error.param.should.contain('agencyName');
                  agent.get('/users/profile').end((err, res) => {
                    res.text.should.contain('agency registration page');
                    done();
                  });
                });
            });
          });
        });
    });

    it('it should not save agency without phone number', (done) => {
      signupRequest.userRole = 'partner';
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

          agent.get('/users/agency').end((err, res) => {
            res.should.have.status(200);
            res.text.should.contain('agency registration page');

            User.findOne({ email: signupRequest.email }).then((user) => {
              let agencyRequest = {
                agencyName: 'testAgencyName',
                agencyWebsite: 'http://testAgencyWebsite',
                agencyBio: 'testAgencyBio',
              };

              agent
                .post('/users/agency')
                .send(agencyRequest)
                .end((err, res) => {
                  res.should.have.status(400);
                  res.body.should.have.property('error');
                  res.body.error.msg.should.contain('Invalid value');
                  res.body.error.param.should.contain('agencyPhone');
                  agent.get('/users/profile').end((err, res) => {
                    res.text.should.contain('agency registration page');
                    done();
                  });
                });
            });
          });
        });
    });
  });
});
 */
