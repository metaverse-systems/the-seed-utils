#!/usr/bin/env node
const { execSync } = require('child_process');
const ffi = require('ffi-napi');

function LibraryDependencies(filename) {
  let libdirCommand = "pkg-config the-seed --variable=libdir";
  let libDir = "";
  try {
    libDir = execSync(libdirCommand).toString().replace(/\n/g, '');
  } catch (e) {
    console.log("Couldn't find libthe-seed");
    process.exit(1);
  }

  const seed = ffi.Library(libDir + "/libthe-seed", {
    'depCount': [ 'int', [ 'string' ] ],
    'depGet': [ 'void', [ 'string', 'string', 'int' ] ]
  });

  let filenameBuffer = new Buffer(filename.length + 1);
  filenameBuffer.write(filename, 0);
  
  const depCount = seed.depCount(filenameBuffer);
  let deps = [];
  let counter = 0;
  while(counter < depCount) {
    let libBuffer = new Buffer(256);
    seed.depGet(filenameBuffer, libBuffer, counter);
    counter++;

    let zeroIndex = 0;
    while(zeroIndex < 256) {
      if(libBuffer[zeroIndex] == 0) break;
      zeroIndex++;
    }

    let libName = "";
    let tempName =  libBuffer.toString().toLowerCase();
    let counter2 = 0;
    while(counter2 < zeroIndex) {
      libName += tempName[counter2];
      counter2++;
    }
    deps.push(libName);
  }
  return deps;
}

module.exports = LibraryDependencies;
