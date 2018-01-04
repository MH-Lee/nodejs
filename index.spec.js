const request = require('supertest');
const should = require('should')
const app = require('./index');

describe('GET /users는', () => {
  describe('success', () => {
    it('유저 객체를 담은 배열로 응답', (done) => {
      request(app)
        .get('/users')
        .end((err, res) => {
          // console.log(res.body);
          res.body.should.be.instanceOf(Array)
          done();
        });
    });

    it('최대 limit 갯수만큼 응답한다.', (done) => {
      request(app)
        .get('/users?limit=2')
        .end((err, res) => {
          res.body.should.have.lengthOf(2)
          done();
        });
    });
  });
  describe('실패시', () => {
    it('limit이 숫자형이 아니면 400을 응답한다.', (done) => {
      request(app)
        .get('/users?limit=two')
        .expect(400)
        .end(done);
    })
  })
})

describe('GET /user/1는', () => {
  describe('suceess', () => {
    it('id가 1인 유저객체를 반환', (done) => {
      request(app)
        .get('/users/1')
        .end((err, res) => {
          res.body.should.have.property('id',1);
          done();
        });
    });
  });
  describe('fail', () => {
    it('id가 숫자가 아닌 경우 400을 응답', (done) => {
      request(app)
        .get('/users/one')
        .expect(400)
        .end(done)
    });
    it('id로 user를 찾을 수 없는 경우 404을 응답', (done) => {
      request(app)
        .get('/users/999')
        .expect(404)
        .end(done)
    });
  });
});
