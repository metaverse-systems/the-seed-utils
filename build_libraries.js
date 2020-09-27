#!/usr/bin/env node
const inquirer = require('inquirer');
const path = require('path')
const args = process.argv;
const fs = require('fs');
const { execSync } = require('child_process');

const build_target = (args[2] === undefined) ? "Native" : args[2];
const libraries = JSON.parse(fs.readFileSync("./package.json")).dependencies;

if(libraries == null) process.exit();

Object.keys(libraries).forEach((library) => {
  console.log("Building " + library);

  let path = "./node_modules/" + library;
  let config = JSON.parse(fs.readFileSync(path + "/package.json"));

  let build_cmd = "";
  if(args[2] == "Win64") {
    build_cmd = config.scripts["build-win64"];
  } else {
    build_cmd = config.scripts.build;
  }

  console.log(build_cmd);
  let cwd = process.cwd();
  process.chdir(path);
  execSync(build_cmd, (error, stdout, stderr) => {
    console.log(stdout);
  });
  process.chdir(cwd);

  let files = fs.readdirSync(path + "/dist");
  files.forEach((file) => {
    console.log("Copying " + path + "/dist/" + file + " to ./dist");
    fs.copyFileSync(path + "/dist/" + file, "./dist/" + file);
  });

  let dist = JSON.parse(fs.readFileSync("./package.json"))._dist;
  if(dist === undefined) return;

  files = dist[build_target];
  if(files === undefined) return;

  files.forEach((file) => {
    console.log("Copying " + file.file + " to ./dist");
    fs.copyFileSync(file.path + file.file, "./dist/" + file.file);
  });
});

