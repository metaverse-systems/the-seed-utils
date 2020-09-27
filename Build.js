#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const process = require('process');
const ffi = require('ffi-napi');
const build_target = process.argv[2] !== undefined ? process.argv[2] : "Native";
const Config = require('./Config');
const config_file = new Config();
const Dependencies = require('./Dependencies');
const deps = new Dependencies().Dependencies();
const target = deps[build_target];
const LibraryDependencies = require('./LibraryDependencies');

let libdirCommand = "PKG_CONFIG_PATH=" + target["Prefix directory"] +"/lib/pkgconfig/ pkg-config the-seed --variable=libdir";
let libDir = "";
try {
  libDir = execSync(libdirCommand).toString().replace(/\n/g, '');
} catch (e) {
}

libDir = "/usr/local/lib";

const seed = ffi.Library(libDir + "/libthe-seed", {
  'depCount': [ 'int', [ 'string' ] ],
  'depGet': [ 'void', [ 'string', 'string', 'int' ] ]
});

const libsExclude = [
  'kernel32',
  'msvcrt',
  'rpcrt4',
  'advapi32',
  'user32',
  'ws2_32',
  'msi',
  'stdc++',
  'c',
  'gcc'
];

let copiedDeps = [];

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

if(!fs.existsSync("./dist")) {
  fs.mkdirSync("./dist");
}

let files = fs.readdirSync("./src/.libs");
files.forEach((file) => {
  if(build_target == "Win64") {
    let ext = file.substr(file.length - 4);
    if((ext != ".dll") && (ext != ".exe")) {
      return;
    }
  } else {
    let ext = file.substr(file.length - 3);
    if(ext != ".so") {
      return;
    }
  }

  console.log("Copying " + file + " to ./dist");
  fs.copyFileSync("./src/.libs/" + file, "./dist/" + file);

  const name = "./src/.libs/" + file;
  const deps = LibraryDependencies(name);

  copyDependencies(deps);
});

function copyDependencies(deps) {
  deps.forEach((dep) => {
    let library = dep.split(".");
    if(library[1] != "dll") {
      library = library[0].split("lib")[1];
    } else {
      library = library[0];
    }

    if(libsExclude.indexOf(library) != -1) return;
    if(copiedDeps.indexOf(library) != -1) {
      return;
    }
    copiedDeps.push(library);

    let libDir = "";
    if(build_target == "Win64") {
      libDir = target["Prefix directory"] + "/bin";
    } else {
      let libdirCommand = "PKG_CONFIG_PATH=" + target["Prefix directory"] +"/lib/pkgconfig/ pkg-config " + library + " --variable=libdir";
      try {
        libDir = execSync(libdirCommand).toString().replace(/\n/g, '');
      } catch (e) {
      }
      if(libDir.length == 0) return;
    }

    let filePath = libDir + "/" + dep;

    console.log("Copying " + filePath + " to ./dist");
    fs.copyFileSync(filePath, "./dist/" + dep);

    let new_deps = LibraryDependencies("./dist/" + dep);
    if(new_deps.length > 0) copyDependencies(new_deps);
  });

}
