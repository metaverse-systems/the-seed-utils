const os = require('os');
const fs = require('fs');
const inquirer = require('inquirer');

const homedir = os.homedir();

const qs = [
  { 
    name: "author.email",
    message: "E-mail address?"
  },
  {
    name: "author.name",
    message: "Name?"
  },
  {
    name: "author.url",
    message: "Website address?"
  },
  {
    name: "projects.scope",
    message: "Default scope?",
    default: "company-name"
  },
  {
    name: "projects.directory",
    message: "Default directory for projects?",
    default: homedir + "/projects/"
  }
];

class Config {
  constructor(dir, filename) {
    this.config_dir = (dir === undefined) ? (homedir + "/.config/the-seed/") : dir;
    this.config_filename = (filename === undefined) ? "config.json" : filename;

    this.config = {};

    if(!fs.existsSync(this.config_dir)) {
      console.log("Creating " + this.config_dir);
      fs.mkdirSync(this.config_dir);
    }

    if(!fs.existsSync(this.config_dir + this.config_filename)) {
      console.log("Creating " + this.config_dir + this.config_filename);
      fs.writeFileSync(this.config_dir + this.config_filename, JSON.stringify(this.config, null, 2));
    }
    else {
      this.config = JSON.parse(fs.readFileSync(this.config_dir + this.config_filename));
    }

    qs.forEach(q => {
      let [section, option] = q.name.split(".");

      if(this.config[section] === undefined) {
        this.config[section] = {};
      }

      if(this.config[section][option] === undefined) {
        this.config[section][option] = "";
      }
    });
  }

  Questions() {
    qs.forEach((q) => {
      let [section, name] = q.name.split(".");
        if(this.config[section][name] !== undefined) {
          q.default = this.config[section][name];
        }
    });
    return qs;
  }

  Answer(answers) {
    Object.keys(answers).forEach((section) => {
      Object.keys(answers[section]).forEach((name) => {
        this.config[section][name] = answers[section][name];
      });
    });

    this.save();
  }

  save() {
    fs.writeFileSync(this.config_dir + this.config_filename, JSON.stringify(this.config, null, 2));
  }
}

module.exports = Config;
