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
          res.text.should.contain('Log in to Donate Gifts');
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

            agent
              .get('/users/verify/' + user.verificationHash)
              .end((err, res) => {
                res.should.have.status(200);
                res.text.should.contain(
                  'Verification successful, you can login now!'
                );

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

    it('should get profile when logged in', (done) => {
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
            user.emailVerified = true;
            user.save();

            let loginRequest = {
              email: 'test@email.de',
              password: 'testPassword',
            };
            agent
              .post('/users/login')
              .redirects(1)
              .send(loginRequest)
              .end((err, res) => {
                res.should.have.status(200);
                res.text.should.contain('Welcome ' + user.fName);
                done();
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

    it('it should not login without verified email', (done) => {
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

          let loginRequest = {
            email: 'test@email.de',
            password: 'testPassword',
          };
          agent
            .post('/users/login')
            .send(loginRequest)
            .end((err, res) => {
              res.should.have.status(403);
              res.text.should.contain('Please verify your Email');
              done();
            });
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

    it('it should show agency registration page when logged in and partner', (done) => {
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

          User.findOne({ email: signupRequest.email }).then((user) => {
            user.emailVerified = true;
            user.save();

            let loginRequest = {
              email: 'test@email.de',
              password: 'testPassword',
            };
            agent
              .post('/users/login')
              .redirects(1)
              .send(loginRequest)
              .end((err, res) => {
                res.should.have.status(200);
                res.text.should.contain('agency registration page');

                agent
                  .get('/users/agency')
                  .redirects(1)
                  .send(loginRequest)
                  .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.contain('agency registration page');
                    done();
                  });
              });
          });
        });
    });

    it('it should save agency when logged in and partner', (done) => {
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

          User.findOne({ email: signupRequest.email }).then((user) => {
            user.emailVerified = true;
            user.save();

            let loginRequest = {
              email: 'test@email.de',
              password: 'testPassword',
            };
            agent
              .post('/users/login')
              .redirects(1)
              .send(loginRequest)
              .end((err, res) => {
                res.should.have.status(200);
                res.text.should.contain(' agency registration page');

                let agencyRequest = {
                  agencyName: 'testAgencyName',
                  agencyWebsite: 'http://testAgencyWebsite',
                  agencyPhone: '12334556',
                  agencyBio: 'testAgencyBio',
                };

                agent
                  .post('/users/agency')
                  .redirects(1)
                  .send(agencyRequest)
                  .end((err, res) => {
                    Agency.findOne({ accountManager: user._id }).then(
                      (agency) => {
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
