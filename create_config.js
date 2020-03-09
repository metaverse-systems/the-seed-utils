#!/usr/bin/env node
const inquirer = require('inquirer');
const Config = require('./Config')
const args = process.argv;

const dir = args[2];
const filename = args[3];

var config_file = new Config(dir, filename);

inquirer.prompt(config_file.Questions()).then(answers => {
  config_file.Answer(answers);
});
