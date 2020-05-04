const os = require('os');
const fs = require('fs');

const homedir = os.homedir();

class Certificates {
  constructor(dir) {
    this.cert_dir = (dir === undefined) ? (homedir + "/.config/the-seed/certificates/") : dir;

    if(!fs.existsSync(this.cert_dir)) {
      console.log("Creating " + this.cert_dir);
      fs.mkdirSync(this.cert_dir);
    }
  }

  create() {
  }

  list() {
    let files = fs.readdirSync(this.cert_dir, { "withFileTypes": true });
    let dirs = [];
    files.forEach(file => {
      if(file.isDirectory()) {
        dirs.push(file.name);
      }
    });
    return dirs;
  }

  Questions() {
    let certs = this.list();
    if(certs.length == 0) return [];

    return [
      {
        type: "list",
        name: "certificate",
        message: "Choose a certificate",
        choices: certs
      }
    ];
  }

  show() {
    let certs = this.list();
    console.log(certs);
  }

  link() {
  }
}

module.exports = Certificates;
