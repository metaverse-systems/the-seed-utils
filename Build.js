#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const process = require('process');
const build_target = process.argv[2] !== undefined ? process.argv[2] : "Native";

const Config = require('./Config');
const config_file = new Config();

const Dependencies = require('./Dependencies');
const deps = new Dependencies().Dependencies();

const target = deps[build_target];

Object.keys(target["Build tools"]).forEach(tool => {
  if(target["Build tools"][tool] === false) {
    console.log("Cannot build, " + tool + " is not installed.");
    process.exit(1);
  }
});

let autogen_command = "./autogen.sh";
try {
  let result = execSync(autogen_command).toString();
  console.log("Completed " + autogen_command);
} catch(err) {
  console.log(err);
}

let host = target["Prefix"] ? " --host=" + target["Prefix"] : "";
host = host.substring(0, host.length - 1); 

let configure_command = "PKG_CONFIG_PATH=" + target["Prefix directory"] +"/lib/pkgconfig/ ";
configure_command += "./configure --prefix=" + target["Prefix directory"] + host;
try {
  let result = execSync(configure_command).toString();
  console.log("Completed " + configure_command);
} catch(err) {
  console.log(err);
}

let make_command = "make clean; make";
try {
  let result = execSync(make_command).toString();
  console.log("Completed " + make_command);
} catch(err) {
  console.log(err);
}
