#!/usr/bin/env node
const fs = require('fs');
const inquirer = require('inquirer');
const Certificates = require('./Certificates')
const args = process.argv;

let data = "";
try {
  data = fs.readFileSync("./package.json");
} catch(err) {
  console.log("package.json not found. Are you in a project directory?");
  return;
}

const package_config = JSON.parse(data);

const certs = new Certificates();
let questions = certs.Questions();

if(questions.size == 0) {
  console.log("No certificates found.");
} else {
  inquirer.prompt(questions).then(answers => {
    package_config.codeSigning = {
      "cert": answers.certificate + "/cert.pem",
      "key": answers.certificate + "/key.pem"
    };

    fs.writeFileSync("./package.json", JSON.stringify(package_config, null, 2));
  });
}
