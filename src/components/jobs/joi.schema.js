const Joi = require('joi');

module.exports.jobSchema = Joi.object({
  title: Joi.string().required(),
  href: Joi.string().uri().required(),
  company: Joi.object({
    name: Joi.string(),
    location: Joi.string()
  }),
  stack: Joi.array().items(Joi.string()).required(),
  description: Joi.string().required(),
  salary: Joi.string(),
  joinDate: Joi.date().required(),
  jobID: Joi.string().alphanum().required()
})
