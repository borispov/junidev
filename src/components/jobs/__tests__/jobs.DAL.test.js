const { JobDAL } = require('../jobs.DAL');
const chai = require('chai');
const { expect } = chai;

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
    title: 'brownies developeRs',
    href: 'https://stackoverflow.com/jobs/119901',
    stack: ['stripe', 'sinatra', 'ruby'],
    salary: '$99k-115k',
    description: 'Job Description\n Hilarious Job Benefits... \n Job Requirements',
    joinDate: '2019/09/09',
    jobID: '292929'
  }

]

const jobPost = {
  title: 'name',
  href: 'https://stackoverflow.com/jobs/119911',
  stack: ['js', 'nodejs', 'github'],
  salary: '$40k-65k',
  description: 'Job Description\n Hilarious Job Benefits... \n Job Requirements',
  joinDate: '2019/09/09',
  jobID: '119911'
};



// before(async () => {
//   await JobDAL.deleteAll();
// })

describe("Database Functions...", () => {

  // it("add collection of jobs to DB", async () => {
  //
  //   const jobsAdded = await JobDAL.addJobs(jobs);
  //
  //   console.log(jobsAdded)
  //
  //   expect(jobsAdded).to.be.an('array').that.is.not.empty;
  // })


  // it("Serializes New JobPost Correctly", async () => {
  //
  //   const newJob = await JobDAL.addJob(jobPost);
  //
  //   const expectedString = JSON.stringify(jobPost).jobID;
  //   const actual = JSON.stringify(newJob).jobID;
  //
  //   expect(expectedString).to.equal(actual);
  // })

  // it("Get All Jobs", async () => {
  //
  //   const jobs = await JobDAL.getJobs();
  //
  //   expect(Object.keys(jobs)).to.not.be.empty;
  // })

  // it("retrieve a job from database", async () => {
  //   const id = '119911';
  //
  //   const job = await JobDAL.getJob(id)
  //
  //   expect(job).to.be.an('object').have.property('title');
  // })

  // it("Should Delete All Jobs From DB", async() => {
  //
  //   await JobDAL.deleteAll();
  //
  //   const jobs = await JobDAL.getJobs();
  //
  //   console.log(jobs)
  //
  //   expect(jobs).to.be.empty;
  // })

})
