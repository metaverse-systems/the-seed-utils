const os = require('os');
const fs = require('fs');
const inquirer = require('inquirer');

const homedir = os.homedir();

const author_qs = [
  { 
    name: "email",
    message: "E-mail address?"
  },
  {
    name: "name",
    message: "Name?"
  },
  {
    name: "url",
    message: "Website address?"
  },
  {
    name: "codeSigningCert",
    message: "Code signing certificate?"
  },
  {
    name: "codeSigningKey",
    message: "Code signing key?"
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

    if(this.config.author === undefined) {
      this.config.author = {};
    }
  }

  Questions() {
    var self = this;
    author_qs.forEach(function(q) {
      if(self.config.author[q.name] !== undefined) {
        q.default = self.config.author[q.name];
      }
    });
    return author_qs;
  }

  Answer(answers) {
    var self = this;
    Object.keys(answers).forEach(function(answer) {
      self.config.author[answer] = answers[answer];
    });

    fs.writeFileSync(self.config_dir + self.config_filename, JSON.stringify(self.config, null, 2));
  }
}

module.exports = Config;
