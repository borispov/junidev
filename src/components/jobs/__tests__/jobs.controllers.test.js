const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../../app');
const { jobController } = require('../jobs.controllers');
const { JobDAL } = require('../jobs.DAL');

chai.use(chaiHttp);
chai.should();

const data = {
  body: {
    title: 'name',
    href: 'https://stackoverflow.com/jobs/119911',
    stack: ['js', 'nodejs', 'github'],
    salary: '$40k-65k',
    description: 'Job Description\n Hilarious Job Benefits... \n Job Requirements',
    joinDate: '2019/09/09',
    jobID: '119911'
  }
}

// before(async () => {
//   await JobDAL.deleteAll();
// })

describe("Job Control: check correct statuses", () => {

  describe("GET - - Requests", () => {

    // it("GET all jobs", (done) => {
    //
    //   chai.request(app)
    //     .get('/api/jobs')
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       res.body.should.be.a('object');
    //       done();
    //     })
    // })

    // it("GET jobs -- when no jobs found", (done) => {
    //
    //   chai.request(app)
    //     .get('/api/jobs')
    //     .end((err, res) => {
    //       res.should.have.status(404);
    //       done();
    //     })
    // })


  })



  describe("POST - - Request", () => {

    it("Valid postJOB request returns status 200 ", (done) => {

      chai.request(app)
        .post('/api/jobs/postjob')
        .send({ ...data.body })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })

    })

  })

})
