const os = require('os');
const fs = require('fs');
const { execSync } = require('child_process');

const deps = {
  "native": {
    "prefix": "/usr",
    "libs": {
      "jsoncpp": false,
      "uuid": false,
      "ecs-cpp": false
    },
    "files": {
    }
  },
  "win64": {
    "prefix": "/usr/x86_64-w64-mingw32",
    "libs": {
      "jsoncpp": false,
      "ecs-cpp": false
    },
    "files": {
      "include/mingw.thread.h": false,
      "include/mingw.invoke.h": false,
      "include/mingw.mutex.h": false
    }
  }
}

class Dependencies {
  constructor() {
    Object.keys(deps).forEach(target => {
      let prefix = deps[target].prefix;

      let pkg_config_path = prefix + "/lib/pkgconfig";
      let pkg_config_command = "PKG_CONFIG_PATH=" + pkg_config_path + " pkg-config --exists ";

      Object.keys(deps[target].libs).forEach(lib => {
        let check_command = pkg_config_command + lib;
        try {
          execSync(check_command);
          deps[target].libs[lib] = true;
        } catch(err) {
        }
      });

      Object.keys(deps[target].files).forEach(file => {
        if(fs.existsSync(prefix + "/" + file)) {
          deps[target].files[file] = true;
        }
      });
    });
  }

  Dependencies() {
    return deps;
  }
}

module.exports = Dependencies;
