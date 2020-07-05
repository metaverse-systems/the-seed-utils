#!/usr/bin/env node
const inquirer = require('inquirer');
const path = require('path')
const args = process.argv;
const fs = require('fs');
const { execSync } = require('child_process');

const libraries = JSON.parse(fs.readFileSync("./package.json")).dependencies;

if(libraries == null) process.exit();

Object.keys(libraries).forEach((library) => {
  console.log("Building " + library);

  let path = "./node_modules/" + library;
  let config = JSON.parse(fs.readFileSync(path + "/package.json"));

  let build_cmd = "";
  if(args[2] == "Win64") {
console.log("Win64 build");
    build_cmd = config.scripts["build-win64"];
  } else {
console.log("native build");
    build_cmd = config.scripts.build;
  }

console.log(build_cmd);
  let cwd = process.cwd();
  process.chdir(path);
  execSync(build_cmd, (error, stdout, stderr) => {
    console.log(stdout);
  });
  process.chdir(cwd);
});

