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
});

describe('GET /user/:id는', () => {
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

describe('DELETE /users/:id', () => {
  describe('성공시', () => {
    it('204를 응답한다', (done) => {
      request(app)
        .delete('/users/1')
        .expect(204)
        .end(done);
    });
  });
  describe('실패시', () => {
    it('id가 숫자가 아닐경우 400을 응답한다.', done => {
      request(app)
        .delete('/users/one')
        .expect(400)
        .end(done);
    });
  });
});

describe('POST /users', () => {
  describe('성공시', () => {
    let name='daniel',
        body;
    before(done=>{
      request(app)
        .post('/users')
        .send({name})
        .expect(201)
        .end((err, res) => {
          body = res.body;
          done();
        });
    });
    it('생성된 유저를 반환한다.', ()=>{
      body.should.have.property('id');
    });
    it('입력한 name을 반환한다.', ()=>{
      body.should.have.property('name', name);
    });
  });
  describe('실패시', () => {
    it('name 파라미터 누락시 400을 반환한다.', (done)=>{
      request(app)
        .post('/users')
        .send({})
        .expect(400)
        .end(done)
    });
    it('name이 중복인경우 409를 반환한다.', (done) =>{
      request(app)
        .post('/users')
        .send({name: 'daniel'})
        .expect(409)
        .end(done)
    });
  })
})

describe('PUT /user/:id', () => {
  describe('성공시', () => {
    it('변경된 name을 응답한다.', (done) => {
      const name = 'chally';
      request(app)
        .put('/users/3')
        .send({name})
        .end((err, res) => {
          res.body.should.have.property('name', name);
          done();
        });
    })
  })
  describe('실패시', () => {
    it('정수가 아닌 id일 경우 400을 응답한다.', (done) => {
      request(app)
         .put('/users/one')
         .expect(400)
         .end(done)
    });
    it('name이 없을 경우 400을 응답한다.', (done) => {
      request(app)
         .put('/users/1')
         .send({})
         .expect(400)
         .end(done)
    });
    it('없는 user일 경우 404를 응답한다.', (done) => {
      request(app)
         .put('/users/999')
         .send({name:'foo'})
         .expect(404)
         .end(done)
    });
    it('중복된 user일 경우 409을 응답한다.', (done) => {
      request(app)
         .put('/users/3')
         .send({name:'bak'})
         .expect(409)
         .end(done)
    });
  })
})
