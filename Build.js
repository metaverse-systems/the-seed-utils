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
const seed = ffi.Library("libthe-seed", {
  'depCount': [ 'int', [ 'string' ] ],
  'depGet': [ 'void', [ 'string', 'string', 'int' ] ]
});

const dllsExclude = [
  'kernel32.dll',
  'msvcrt.dll'
];

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

if(build_target == "Win64") {
  let files = fs.readdirSync("./src/.libs");
  files.forEach((file) => {
    let ext = file.substr(file.length - 4);
    if((ext != ".dll") && (ext != ".exe")) {
      return;
    }
    console.log("Copying " + file + " to ./dist");
    fs.copyFileSync("./src/.libs/" + file, "./dist/" + file);

    const name = "./src/.libs/" + file;
    const nameBuffer = new Buffer(name.length + 1);
    nameBuffer.write(name, 0);

    const depCount = seed.depCount(nameBuffer);
    let counter = 0;
    while(counter < depCount) {
      let dllBuffer = new Buffer(256);
      seed.depGet(nameBuffer, dllBuffer, counter);
      counter++;

      let zeroIndex = 0;
      while(zeroIndex < 256) {
        if(dllBuffer[zeroIndex] == 0) break;
        zeroIndex++;
      }

      let dllName = "";
      let tempName =  dllBuffer.toString().toLowerCase();
      let counter2 = 0;
      while(counter2 < zeroIndex) {
        dllName += tempName[counter2];
        counter2++;
      }

      if(dllsExclude.indexOf(dllName) == -1) {
        console.log("Need to copy " + dllName);
      }
    }
  });

  files = [ "libecs-cpp-0.dll", "libjsoncpp.dll", "libthe-seed-0.dll" ];
  files.forEach((file) => {
    let filePath = target["Prefix directory"] + "/bin/" + file;
    console.log("Copying " + file + " to ./dist");
    fs.copyFileSync(filePath, "./dist/" + file);
  });
}
