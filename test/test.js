let mongoose = require("mongoose");
let User = require('../models/users');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
describe('Users', () => { 
  describe('/GET /api', () => {
      it('it should GET home page', (done) => {
        chai.request(server)
            .get('/api')
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });
  });

  describe('/POST /api/signup', () => {
      it('it should sign up with users data', (done) => {
        let user = {
            name: "Ayush Bhandari",
            email: "ayush@kozzaja.com",
            gender: "male",
            age: "23",
            fb_id: "12312312789012",
            profile_pic:"http://profile_pic.url.jpg"
        }
        chai.request(server)
            .post('/api/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
              done();
            });
      });

  });
  describe('/POST /api/login', () => {
      it('it should login with users data', (done) => {
        let user = {
            fb_id: "12312312789012"
        }
        chai.request(server)
            .post('/api/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });

  });
  describe('/POST /api/v1/restaurant/list', () => {
      it('it should get the list of restaurants based on nearby location', (done) => {
        let data = {
            lat: 40.747767,
            long: -73.985098,
            city_address: "New York",
            search_params: "pizza"
        }
        chai.request(server)
            .post('/api/v1/restaurant/list')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });

  });

  describe('/POST /api/v1/restaurant/detail', () => {
      it('it should get the details of a restaurant based on requested restaurant id', (done) => {
        let data = {
            restaurant_id: "test"
        }
        chai.request(server)
            .post('/api/v1/restaurant/detail')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
      });

  });

  describe('/POST /api/v1/restaurant/rate', () => {
      it('it should post the ratings of restaurants menu items', (done) => {
        let data = {
            restaurant_id: "testID",
            food_id: "testID",
            ratings_value: 3.5
        }
        chai.request(server)
            .post('/api/v1/restaurant/rate')
            .send(data)
            .end((err, res) => {
                res.should.have.status(201);
              done();
            });
      });

  });

  describe('/POST /api/v1/restaurant/restaurant_image_upload', () => {
      it('it should upload images of restaurant with restaurant_id', (done) => {
        let data = {
            restaurant_id: "testID",
            restaurant_image: "d.jpg"
        }
        chai.request(server)
            .post('/api/v1/restaurant/restaurant_image_upload')
            .send(data)
            .end((err, res) => {
                res.should.have.status(201);
              done();
            });
      });

  });

  describe('/POST /api/v1/restaurant/food_image_upload', () => {
      it('it should upload images of food with restaurant_id and food_id', (done) => {
        let data = {
            restaurant_id: "testID",
            food_id: "testID",
            food_image: "d.jpg"
        }
        chai.request(server)
            .post('/api/v1/restaurant/food_image_upload')
            .send(data)
            .end((err, res) => {
                res.should.have.status(201);
              done();
            });
      });

  });


describe('/POST /api/v1/restaurant/review', () => {
      it('it should store review of food with restaurant_id, food_id and user review', (done) => {
        let data = {
            restaurant_id: "testID",
            food_id: "testID",
            food_name: "testID",
            review: "This is a test review"
        }
        chai.request(server)
            .post('/api/v1/restaurant/review')
            .send(data)
            .end((err, res) => {
                res.should.have.status(201);
              done();
            });
      });

  });

});