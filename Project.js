const os = require('os');
const fs = require('fs');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

const homedir = os.homedir();

class Project {
  constructor(name, dir) {
    this.config_dir = (dir === undefined) ? (homedir + "/.config/the-seed/") : dir;
    this.config_filename = "config.json";

    if(!fs.existsSync(this.config_dir) || !fs.existsSync(this.config_dir + this.config_filename)) {
      console.log(homedir + "/.config/the-seed/config.json not found. Run 'the-seed-config' to initialize.");
      return;
    }

    this.config = JSON.parse(fs.readFileSync(this.config_dir + this.config_filename));

    this.dir = this.config.projects.directory + name; 
    if(fs.existsSync(this.dir)) {
      console.log("There is already a project named '" + name + "' in '" + this.config.projects.directory + "'.");
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

    this.save();
    console.log("New project created in '" + this.dir + "', please modify 'package.json' as necessary.");
  }

  save() {
    fs.writeFileSync(this.dir + "/package.json", JSON.stringify(this.package, null, 2));
  }
}

module.exports = Project;
