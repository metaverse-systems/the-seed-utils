const os = require('os');
const fs = require('fs');
const { execSync } = require('child_process');

const deps = {
  "Native": {
    "Prefix": "",
    "Prefix directory": "/usr",
    "Build tools": {
      "libtoolize": false,
      "aclocal": false,
      "autoheader": false,
      "automake": false,
      "autoconf": false,
    },
    "Compilers": {
      "g++": false,
    },
    "Libraries": {
      "jsoncpp": false,
      "uuid": false,
      "ecs-cpp": false,
      "the-seed": false
    },
    "Files": {
    }
  },
  "Win64": {
    "Prefix": "x86_64-w64-mingw32-",
    "Prefix directory": "/usr/x86_64-w64-mingw32",
    "Build tools": {
      "libtoolize": false,
      "aclocal": false,
      "autoheader": false,
      "automake": false,
      "autoconf": false,
    },
    "Compilers": {
      "g++": false
    },
    "Libraries": {
      "jsoncpp": false,
      "ecs-cpp": false,
      "the-seed": false
    },
    "Files": {
      "include/mingw.thread.h": false,
      "include/mingw.invoke.h": false,
      "include/mingw.mutex.h": false
    }
  }
}

class Dependencies {
  constructor() {
    Object.keys(deps).forEach(target => {
      let prefix = deps[target].Prefix;
      let prefixDir = deps[target]["Prefix directory"];

      let pkg_config_path = prefixDir + "/lib/pkgconfig";
      let pkg_config_command = "PKG_CONFIG_PATH=" + pkg_config_path + " pkg-config --exists ";

      Object.keys(deps[target].Libraries).forEach(lib => {
        let check_command = pkg_config_command + lib;
        try {
          execSync(check_command);
          deps[target].Libraries[lib] = true;
        } catch(err) {
        }
      });

      Object.keys(deps[target]["Build tools"]).forEach(tool => {
        let check_command = "which " + tool;
        try {
          let result = execSync(check_command).toString();
          deps[target]["Build tools"][tool] = result;
        } catch(err) {
        }
      });

      Object.keys(deps[target]["Compilers"]).forEach(compiler => {
        let check_command = "which " + prefix + compiler;
        try {
          let result = execSync(check_command).toString();
          deps[target]["Compilers"][compiler] = result;
        } catch(err) {
        }
      });

      Object.keys(deps[target].Files).forEach(file => {
        if(fs.existsSync(prefixDir + "/" + file)) {
          deps[target].Files[file] = true;
        }
      });
    });
  }

  Dependencies() {
    return deps;
  }
}

module.exports = Dependencies;
