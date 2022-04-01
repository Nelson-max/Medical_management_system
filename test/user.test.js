/*eslint-disable */
const chaiHttp = require('chai-http');
const { expect } = require('chai');
const chai = require('chai');
const app = require('../src/index');
const User = require('../src/models/user.model');

chai.use(chaiHttp);
chai.should();

const existingUser = {
    "name":"marcel",
    "email":"marcel@gmail.com",
    "username":"max",
    "password":"paciphice",
    "confirmPassword":"paciphice"
}

let token = null;
let userid= null;

describe('All about users tests', ()=>{

  before(async () => {
    await User.deleteMany()
  })


  it('Should create a new account', (done)=>{
    chai.request(app)
        .post('/api/auth/register')
        .send(existingUser)
        .end((error, response)=>{
            response.should.have.status(200);
            response.body.should.have.property('message');
            response.body.message.should.equal('User registered successfully!');
            done();
        })
});

it('Should not save the user who is already there', (done)=>{
  chai.request(app)
      .post('/api/auth/register')
      .send(existingUser)
      .end((error, response)=>{
          response.should.have.status(403);
          response.body.should.have.property('message');
          response.body.message.should.equal('User already exists!');
          done();
      })
});

it('It should login with email and password', (done) => {
  chai.request(app)
    .post('/api/auth/login')
    .send({ email: existingUser.email, password: existingUser.password })
    .end((err, response) => {
      response.should.have.status(200);
      response.body.should.have.property('message');
      response.body.message.should.equal('User logged in Successfully');
      response.body.should.have.property('success');
      response.body.success.should.equal(true);
      token = response.body.token;
      done();
    });
});

it('It should not login with Invalid password', (done) => {
  chai.request(app)
    .post('/api/auth/login')
    .send({ email: existingUser.email, password: "kjhgfdfgh" })
    .end((err, response) => {
      response.should.have.status(401);
      response.body.should.have.property('message');
      response.body.message.should.equal('Wrong credentials pass!');
      done();
    });
});


it('Should not signup the user with invalid email', (done)=>{
  chai.request(app)
      .post('/api/auth/register')
      .send({"email": "test@gmail.", "password": "test@gmail.com","name": "marcel","username": "niyitegeka"})
      .end((error, response)=>{
          response.should.have.status(400);
          response.body.should.have.property('message');
          response.body.message.should.equal("\"email\" must be a valid email");

          done();

      })
});

it('Should not signup the user with invalid password', (done)=>{
  chai.request(app)
      .post('/api/auth/register')
      .send({"email": "test@gmail.com", "password": "","name": "marcel","username": "niyitegeka"})
      .end((error, response)=>{
          response.should.have.status(400);
          response.body.should.have.property('message');
          response.body.message.should.equal('\"password\" is not allowed to be empty');

          done();

      })
});

it('should show that the names is required', (done)=>{
  chai.request(app)
      .post('/api/auth/register')
      .send({"email": "test@gmail.com", "password": "adfjals","name": "","username": "niyitegeka"})
      .end((err, res)=>{
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.equal('\"name\" is not allowed to be empty');

          done();
      })
});

it('should show that the username is required', (done)=>{
  chai.request(app)
      .post('/api/auth/register')
      .send({"email": "test@gmail.com", "password": "adfjals","name": "kjhadsfa","username": ""})
      .end((err, res)=>{
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.equal('\"username\" is not allowed to be empty');

          done();
      })
});

});

// user with invalid email
// user without password
// names are required

