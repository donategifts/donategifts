const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../server/db/models/User');
const Agency = require('../server/db/models/Agency');

// Require the dev-dependencies
const server = require('../server/app');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);
const agent = chai.request.agent(server);

let signupRequest;

describe('Users', () => {
  beforeEach((done) => {
    signupRequest = {
      fName: 'testFirstName',
      lName: 'testLastName',
      email: 'test@email.de',
      password: 'testPassword1',
      passwordConfirm: 'testPassword1',
      userRole: 'donor',
    };
    // Before each test we empty the database
    User.deleteMany({ email: 'test@email.de' }, () => {
      Agency.deleteMany({}, () => {
        agent.get('/users/logout').end((_err, res) => {
          res.text.should.contain('Sign Up to Donate Gifts');
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        });
      });
    });
  });
  /*
   * Test the /GET route
   */
  describe('/GET users/', () => {
    it('it should GET home', (done) => {
      agent.get('/users').end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
    });
  });

  describe('/GET users/signup', () => {
    it('it should GET signup', (done) => {
      agent.get('/users/signup').end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
    });
  });

  describe('/GET users/', () => {
    it('it should GET home', (done) => {
      agent.get('/users').end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
    });
  });

  describe('/GET users/verify/hash', () => {
    it('it should not verify non existing hash', (done) => {
      let hash = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < 18; i++) {
        hash += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      agent.get(`/users/verify/${hash}`).end((err, res) => {
        res.should.have.status(400);
        res.text.should.contain('Verification failed');
        done();
      });
    });

    it('it should verify existing hash', (done) => {
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

            agent.get(`/users/verify/${user.verificationHash}`).end((_, verifyRes) => {
              verifyRes.should.have.status(200);
              verifyRes.text.should.contain('Verification successful');

              User.findOne({ email: signupRequest.email }).then((userResult) => {
                userResult.emailVerified.should.equal(true);
                done();
              });
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

            agent.get('/users/profile').end((_, profileRes) => {
              profileRes.text.should.contain(`Welcome ${user.fName}`);
              profileRes.text.should.contain('Your email is unverified');
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
            agent.get(`/users/verify/${user.verificationHash}`).end((_err, verifyRes) => {
              verifyRes.should.have.status(200);
              verifyRes.text.should.contain('Verification successful');

              User.findOne({ email: signupRequest.email }).then((userResult) => {
                userResult.emailVerified.should.equal(true);

                agent.get('/users/profile').end((_profileErr, profileRes) => {
                  profileRes.should.have.status(200);
                  profileRes.text.should.contain(`Welcome ${userResult.fName}`);
                  profileRes.text.should.not.contain('Your email is unverified');
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
          res.body.error.msg.should.contain('First name is required!');
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
          res.body.error.msg.should.contain('Last name is required!');
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
          res.body.error.msg.should.contain('Email is required!');
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
      const loginRequest = {
        password: 'testPassword',
      };
      agent
        .post('/users/login')
        .send(loginRequest)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.msg.should.contain('Email is required!');
          res.body.error.param.should.contain('email');
          done();
        });
    });

    it('it should not login without password', (done) => {
      const loginRequest = {
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
      const loginRequest = {
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

          agent.get('/users/agency').end((_, agencyRes) => {
            agencyRes.should.have.status(200);
            agencyRes.text.should.contain('Register as a Foster Care Partner');
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
            .end((_, profileRes) => {
              profileRes.should.have.status(200);
              profileRes.text.should.contain('Register as a Foster Care Partner');
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

          agent.get('/users/agency').end((_, agencyRes) => {
            agencyRes.should.have.status(200);
            agencyRes.text.should.contain('Register as a Foster Care Partner');

            User.findOne({ email: signupRequest.email }).then((user) => {
              const agencyRequest = {
                agencyName: 'testAgencyName',
                agencyWebsite: 'http://testAgencyWebsite',
                agencyPhone: '111-222-3333',
                agencyBio: 'testAgencyBio',
                agencyAddress: {
                  address1: 'Test address',
                  city: 'Test city',
                  state: 'Test state',
                  country: 'Test country',
                  zipcode: '12345',
                },
              };

              agent
                .post('/users/agency')
                .send(agencyRequest)
                .end((_agencyErr, postAgencyRes) => {
                  postAgencyRes.should.have.status(200);
                  postAgencyRes.body.should.have.property('url');

                  agent.get('/users/profile').end((_profileErr, profileRes) => {
                    profileRes.should.have.status(200);
                    profileRes.text.should.contain(`Welcome ${user.fName}`);
                    profileRes.text.should.contain('Your email is unverified');

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

          agent.get('/users/agency').end((_, agencyRes) => {
            agencyRes.should.have.status(200);
            agencyRes.text.should.contain('Register as a Foster Care Partner');

            User.findOne({ email: signupRequest.email }).then(() => {
              const agencyRequest = {
                agencyWebsite: 'http://testAgencyWebsite',
                agencyPhone: '111-222-3333',
                agencyBio: 'testAgencyBio',
                agencyAddress: {
                  address1: 'Test address',
                  city: 'Test city',
                  state: 'Test state',
                  country: 'Test country',
                  zipcode: '12345',
                },
              };

              agent
                .post('/users/agency')
                .send(agencyRequest)
                .end((_agencyErr, postAgencyRes) => {
                  postAgencyRes.should.have.status(400);
                  postAgencyRes.body.should.have.property('error');
                  postAgencyRes.body.error.msg.should.contain('Invalid value');
                  postAgencyRes.body.error.param.should.contain('agencyName');
                  agent.get('/users/profile').end((_profileErr, profileRes) => {
                    profileRes.text.should.contain('Register as a Foster Care Partner');
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

          agent.get('/users/agency').end((_, agencyRes) => {
            agencyRes.should.have.status(200);
            agencyRes.text.should.contain('Register as a Foster Care Partner');

            User.findOne({ email: signupRequest.email }).then(() => {
              const agencyRequest = {
                agencyName: 'testAgencyName',
                agencyWebsite: 'http://testAgencyWebsite',
                agencyBio: 'testAgencyBio',
                agencyAddress: {
                  address1: 'Test address',
                  city: 'Test city',
                  state: 'Test state',
                  country: 'Test country',
                  zipcode: '12345',
                },
              };

              agent
                .post('/users/agency')
                .send(agencyRequest)
                .end((_agencyErr, postAgencyRes) => {
                  postAgencyRes.should.have.status(400);
                  postAgencyRes.body.should.have.property('error');
                  postAgencyRes.body.error.msg.should.contain('Invalid value');
                  postAgencyRes.body.error.param.should.contain('agencyPhone');
                  agent.get('/users/profile').end((_profileErr, profileRes) => {
                    profileRes.text.should.contain('Register as a Foster Care Partner');
                    done();
                  });
                });
            });
          });
        });
    });
  });
});
