var agent = require('superagent');
var expect = require('expect.js');

// __________________________________________________________________
// API testing
describe('New visitor (not logged in)', function(){
  var url = 'localhost:9000';

  it('should be able to GET path "/"',
    function(done){
      agent.get(url + '/').end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.type).to.equal('text/html');
        expect(res.text).to.contain('ng-app=');
        done();
      });
    }
  );

  it('should not be able to GET a bad path "/bad/path/"',
    function(done){
      agent.get(url + '/bad/path/').end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        done();
      });
    }
  );

  it('should not be considered as "logged in" by the server',
    function(done){
      agent.get(url + '/api/logout').end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        // expect(res).to.contain('no user');
        done();
      });
    }
  );

  it('should receive a 401 error when trying to create a comparison',
    function(done){
      agent.post(url + '/api/submit').send({}).end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        done();
      });
    }
  );

  it('should get redirected to login via Facebook',
    function(done){
      agent.post(url + '/api/auth/facebook').send({}).end(function(res){
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        done();
      });
    }
  );

});
