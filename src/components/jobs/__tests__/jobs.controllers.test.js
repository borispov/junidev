const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../../app');
const { jobController } = require('../jobs.controllers');
const { JobDAL } = require('../jobs.DAL');

chai.use(chaiHttp);
chai.should();

const data = {
  body: {
    title: 'brownies developer',
    href: 'https://stackoverflow.com/jobs/119911',
    stack: ['js', 'nodejs', 'github'],
    salary: '$40k-65k',
    description: 'Job Description\n Hilarious Job Benefits... \n Job Requirements',
    joinDate: '2019/09/09',
    jobID: '119911'
  }
}


const jobs = [
  {
    title: 'name',
    href: 'https://stackoverflow.com/jobs/119911',
    stack: ['js', 'nodejs', 'github'],
    salary: '$40k-65k',
    description: 'Job Description\n Hilarious Job Benefits... \n Job Requirements',
    joinDate: '2019/09/09',
    jobID: '119911'
  },
  {
    title: 'name',
    href: 'https://stackoverflow.com/jobs/119911',
    stack: ['js', 'nodejs', 'github'],
    salary: '$40k-65k',
    description: 'Job Description\n Hilarious Job Benefits... \n Job Requirements',
    joinDate: '2019/09/09',
    jobID: '119911'
  },
  {
    title: 'name',
    href: 'https://stackoverflow.com/jobs/119911',
    stack: ['js', 'nodejs', 'github'],
    salary: '$40k-65k',
    description: 'Job Description\n Hilarious Job Benefits... \n Job Requirements',
    joinDate: '2019/09/09',
    jobID: '119911'
  },
  {
    title: 'name',
    href: 'https://stackoverflow.com/jobs/119911',
    stack: ['js', 'nodejs', 'github'],
    salary: '$40k-65k',
    description: 'Job Description\n Hilarious Job Benefits... \n Job Requirements',
    joinDate: '2019/09/09',
    jobID: '119911'
  },
  {
    title: 'brownies developeRs',
    href: 'https://stackoverflow.com/jobs/11',
    stack: ['stripe', 'sinatra', 'ruby'],
    salary: '$99k-115k',
    description: 'Job Description\n Hilarious Job Benefits... \n Job Requirements',
    joinDate: '2019/09/09',
    jobID: '292929'
  }

]





before(async () => {
  await JobDAL.deleteAll();
})

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

    it("send jobs directly", async (done) => {

      const alljobs = await JobDAL.addJobs(jobs)

      should(alljobs.length).to.equal(jobs.length - 1)

      done();

    })

    // it("Valid postJOB request returns status 200 ", (done) => {
    //
    //   chai.request(app)
    //     .post('/api/jobs/postjob')
    //     .send( data.body )
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //     })
    //   done();
    // })

  })

})
