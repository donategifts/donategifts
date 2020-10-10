
let mongoose = require("mongoose");
let User = require('../models/User');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
let agent = chai.request.agent(server);

describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.deleteMany({}, (err) => {
            done();
        });
    });
    /*
      * Test the /GET route
      */
    describe('/GET users/', () => {

        it('it should GET home', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });

    });

    describe('/GET users/signup', () => {

        it('it should GET signup', (done) => {
            chai.request(server)
                .get('/users/signup')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });

    });

    describe('/GET users/login', () => {

        it('it should GET login', (done) => {
            chai.request(server)
                .get('/users/login')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });

    });

    describe('/GET users/logout', () => {

        it('it should GET logout and redirect to login', (done) => {
            chai.request(server)
                .get('/users/logout')
                .end((err, res) => {
                    res.text.should.contain('Sign Up to Donate Gifts')
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });

    });

    describe('/GET users/profile', () => {

        it('should not get profile without being logged in and should redirect to login', (done) => {
            chai.request(server)
                .get('/users/profile')
                .end((err, res) => {
                    res.text.should.contain('Sign Up to Donate Gifts')
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });

        it('should get profile when logged in', (done) => {

            let signupRequest = {
                fName: 'testFirstName',
                lName: 'testLastName',
                email: 'test@email.de',
                password: 'testPassword',
                userRole: 'donor'

            };
                agent.post('/users/signup')
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

                    User.findOne({email: signupRequest.email})
                        .then(user => {
                            user.emailVerified = true;
                            user.save()

                            let loginRequest = {
                                email: 'test@email.de',
                                password: 'testPassword',
                            };
                                agent.post('/users/login')
                                .redirects(1)
                                .send(loginRequest)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.text.should.contain('Welcome ' + user.fName)
                                    done();

                                });
                        })


                });

        });

    });

    describe('/GET users/agency', () => {

        it(' /GET agency without being logged in should redirect to login', (done) => {
            chai.request(server)
                .get('/users/agency')
                .end((err, res) => {
                    res.text.should.contain('Sign Up to Donate Gifts')
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });

    });

    describe('/GET users/terms', () => {

        it('it should get terms', (done) => {
            chai.request(server)
                .get('/users/terms')
                .end((err, res) => {
                    res.text.should.contain('Terms of Service ')
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });

    });

    describe('/POST users/signup', () => {

        it('it should not POST without fName', (done) => {

            let signupRequest = {
                lName: 'testLastName',
                email: 'test@email.de',
                password: 'testPassword',
                userRole: 'donor'
            };
            chai.request(server)
                .post('/users/signup')
                .send(signupRequest)
                .end((err, res) => {
                    res.should.have.status(206);
                    res.body.should.have.property('error');
                    res.body.error.message.should.contain('fName missing')
                    done();
                });
        });

        it('it should not POST without lName', (done) => {

            let signupRequest = {
                fName: 'testFirstName',
                email: 'test@email.de',
                password: 'testPassword',
                userRole: 'donor'
            };
            chai.request(server)
                .post('/users/signup')
                .send(signupRequest)
                .end((err, res) => {
                    res.should.have.status(206);
                    res.body.should.have.property('error');
                    res.body.error.message.should.contain('lName missing')
                    done();
                });
        });

        it('it should not POST without email', (done) => {

            let signupRequest = {
                fName: 'testFirstName',
                lName: 'testLastName',
                password: 'testPassword',
                userRole: 'donor'
            }
            chai.request(server)
                .post('/users/signup')
                .send(signupRequest)
                .end((err, res) => {
                    res.should.have.status(206);
                    res.body.should.have.property('error');
                    res.body.error.message.should.contain('User validation failed: email: Path `email` is required.')
                    done();
                });
        });

        it('it should not POST without password', (done) => {

            let signupRequest = {
                fName: 'testFirstName',
                lName: 'testLastName',
                email: 'test@email.de',
                userRole: 'donor'
            };
            chai.request(server)
                .post('/users/signup')
                .send(signupRequest)
                .end((err, res) => {
                    res.should.have.status(206);
                    res.body.should.have.property('error');
                    res.body.error.message.should.contain('Password missing')
                    done();
                });
        });

        it('it should create User', (done) => {

            let signupRequest = {
                fName: 'testFirstName',
                lName: 'testLastName',
                email: 'test@email.de',
                password: 'testPassword',
                userRole: 'donor'

            };
            chai.request(server)
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

                    User.findOne({email: signupRequest.email})
                        .then(user => {
                            user.id.should.equal(res.body.user._id)
                            done();
                        })
                });
        });

    });

    describe('/POST users/login', () => {

        it('it should not login without email', (done) => {

            let loginRequest = {
                password: 'testPassword',
            };
            chai.request(server)
                .post('/users/login')
                .send(loginRequest)
                .end((err, res) => {
                    res.should.have.status(206);
                    res.body.should.have.property('error');
                    res.body.error.message.should.contain('Email missing')
                    done();
                });
        });

        it('it should not login without password', (done) => {

            let loginRequest = {
                email: 'testEmail',
            };
            chai.request(server)
                .post('/users/login')
                .send(loginRequest)
                .end((err, res) => {
                    res.should.have.status(206);
                    res.body.should.have.property('error');
                    res.body.error.message.should.contain('Password missing')
                    done();
                });
        });

        it('it should not login if user doesn\'t exist', (done) => {

            let loginRequest = {
                email: 'testEmail',
                password: 'testPassword',
            };
            chai.request(server)
                .post('/users/login')
                .send(loginRequest)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.text.should.contain('Username and/or password incorrect')
                    done();
                });
        });

        it('it should not login without verified email', (done) => {

            let signupRequest = {
                fName: 'testFirstName',
                lName: 'testLastName',
                email: 'test@email.de',
                password: 'testPassword',
                userRole: 'donor'

            };
            chai.request(server)
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
                    chai.request(server)
                        .post('/users/login')
                        .send(loginRequest)
                        .end((err, res) => {
                            res.should.have.status(403);
                            res.text.should.contain('Please verify your Email')
                            done();
                        });
                });

        });

    });

});