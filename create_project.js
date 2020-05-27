#!/usr/bin/env node
const inquirer = require('inquirer');
const Project = require('./Project')
const Certificates = require('./Certificates');
const args = process.argv;

const name = args[2];

var project = new Project(name);

const certs = new Certificates();

let questions = certs.Questions();

if(questions.size == 0) {
  console.log("No certificates found.");
} else {
  inquirer.prompt(questions).then(answers => {
    project.ChooseCertificate(answers.certificate);
  });
}
