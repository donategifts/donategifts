let User = require('../models/User');
let Agency = require('../models/Agency');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
let agent = chai.request.agent(server);

let signupRequest;

describe('Users', () => {
  beforeEach((done) => {
    signupRequest = {
      fName: 'testFirstName',
      lName: 'testLastName',
      email: 'test@email.de',
      password: 'testPassword',
      passwordConfirm: 'testPassword',
      userRole: 'donor',
    };
    //Before each test we empty the database
    User.deleteMany({ email: 'test@email.de' }, (err) => {
      Agency.deleteMany({}, (err) => {
        agent.get('/users/logout').end((err, res) => {
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
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < 18; i++) {
        hash += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      agent.get('/users/verify/' + hash).end((err, res) => {
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

            agent
              .get('/users/verify/' + user.verificationHash)
              .end((err, res) => {
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
            agent
              .get('/users/verify/' + user.verificationHash)
              .end((err, res) => {
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
      delete signupRequest.fName;
      agent
        .post('/users/signup')
        .send(signupRequest)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.msg.should.contain('Invalid value');
          res.body.error.param.should.contain('fName');
          done();
        });
    });

    it('it should not POST without lName', (done) => {
      delete signupRequest.lName;
      agent
        .post('/users/signup')
        .send(signupRequest)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.msg.should.contain('Invalid value');
          res.body.error.param.should.contain('lName');
          done();
        });
    });

    it('it should not POST without email', (done) => {
      delete signupRequest.email,
        agent
          .post('/users/signup')
          .send(signupRequest)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('error');
            res.body.error.msg.should.contain('Invalid value');
            res.body.error.param.should.contain('email');
            done();
          });
    });

    it('it should not POST without password', (done) => {
      delete signupRequest.password,
        agent
          .post('/users/signup')
          .send(signupRequest)
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
      signupRequest.userRole = 'partner';
      agent
        .post('/users/signup')
        .send(signupRequest)
        .end((err, res) => {
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
                  res.body.should.have.property('url');

                  agent.get('/users/profile').end((err, res) => {
                    res.text.should.contain('Welcome ' + user.fName);
                    res.text.should.contain('Your email is unverified');

                    Agency.findOne({ accountManager: user._id }).then(
                      (agency) => {
                        agency.agencyName.should.equal(
                          agencyRequest.agencyName
                        );
                        const aUserId = agency.accountManager.toString();
                        const userId = user._id.toString();
                        aUserId.should.equal(userId);
                        done();
                      }
                    );
                  });
                });
            });
          });
        });
    });
  });
});
