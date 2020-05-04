#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const process = require('process');
const build_target = process.argv[2] !== undefined ? process.argv[2] : "Native";

const Config = require('@metaverse-systems/the-seed-utils/Config');
const config_file = new Config();

const Dependencies = require('@metaverse-systems/the-seed-utils/Dependencies');
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
  console.log(result);
} catch(err) {
  console.log(err);
}

let host = target["Prefix"] ? " --host=" + target["Prefix"] : "";
host = host.substring(0, host.length - 1); 

let configure_command = "PKG_CONFIG_PATH=" + target["Prefix directory"] +"/lib/pkgconfig/ ";
configure_command += "./configure --prefix=" + target["Prefix directory"] + host;
try {
  let result = execSync(configure_command).toString();
  console.log(result);
} catch(err) {
  console.log(err);
}

let make_command = "make";
try {
  let result = execSync(make_command).toString();
  console.log(result);
} catch(err) {
  console.log(err);
}

if(build_target == "Native") {
  process.exit(0);
}

let files = fs.readdirSync("src/.libs");
files.forEach(file => {
  if(!file.endsWith(".dll")) {
    return;
  }

  let copy_command = "cp src/.libs/" + file + " ..";
  try {
    let result = execSync(copy_command).toString();
  } catch(err) {
    console.log(err);
  }

  let strip_command = "strip ../" + file;
  try {
    let result = execSync(strip_command).toString();
  } catch(err) {
    console.log(err);
  }
});
