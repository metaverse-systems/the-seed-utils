const os = require('os');
const fs = require('fs');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

const homedir = os.homedir();

class ResourcePak {
  constructor(name, dir) {
    this.config_dir = (dir === undefined) ? (homedir + "/.config/the-seed/") : dir;
    this.config_filename = "config.json";

    if(!fs.existsSync(this.config_dir) || !fs.existsSync(this.config_dir + this.config_filename)) {
      console.log(homedir + "/.config/the-seed/config.json not found. Run 'the-seed-config' to initialize.");
      return;
    }

    this.config = JSON.parse(fs.readFileSync(this.config_dir + this.config_filename));

    this.name = name;
    this.dir = "./" + name; 
    if(fs.existsSync(this.dir)) {
      console.log("There is already a resource pak named '" + name + "' in this directory.");
      return;
    } else {
      fs.mkdirSync(this.dir);
      const init = execSync('npm init --yes', { cwd: this.dir });
    }

    this.package = JSON.parse(fs.readFileSync(this.dir + "/package.json"));
    this.package.author = this.config.author;
    this.package.license = "UNLICENSED";
    this.package.name = this.config.projects.scope + "/" + this.package.name;
    delete this.package.main;
    this.package.scripts = {
      "build": "the-seed-resource-build"
    };
    this.package.resources = [
    ];

    this.Save();
    console.log("New resource pak created in '" + this.dir + "', please modify 'package.json' as necessary.");
  }

  Save() {
    fs.writeFileSync(this.dir + "/package.json", JSON.stringify(this.package, null, 2));
  }
}

module.exports = ResourcePak;
