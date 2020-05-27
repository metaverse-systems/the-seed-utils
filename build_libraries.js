#!/usr/bin/env node
const inquirer = require('inquirer');
const path = require('path')
const args = process.argv;
const fs = require('fs');
const { execSync } = require('child_process');

const libraries = JSON.parse(fs.readFileSync("./package.json")).dependencies;

Object.keys(libraries).forEach((library) => {
  console.log("Building " + library);

  let path = "./node_modules/" + library;
  let config = JSON.parse(fs.readFileSync(path + "/package.json"));
  let build_cmd = config.scripts.build;

  let cwd = process.cwd();
  process.chdir(path);
  execSync(build_cmd, (error, stdout, stderr) => {
    console.log(stdout);
  });
  process.chdir(cwd);
});

