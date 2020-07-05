const os = require('os');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const args = process.argv;
const { execSync } = require('child_process');

const homedir = os.homedir();

const build_command = "npm i; the-seed-libraries-build; the-seed-build";
const build_win64_command = "npm i; the-seed-libraries-build Win64; the-seed-build Win64";

class Skeleton {
  constructor(skeleton_type, name, dir) {
    this.skeleton_type = skeleton_type;
    this.packagePath = path.dirname(args[1]) + "/" + path.dirname(fs.readlinkSync(args[1]));

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
      console.log("There is already a " + skeleton_type + " named '" + name + "' in this directory.");
      return;
    } else {
      this.ExpandSkeleton();
      execSync('npm init --yes', { cwd: this.dir });
    }

    this.package = JSON.parse(fs.readFileSync(this.dir + "/package.json"));
    this.package.author = this.config.author;
    this.package.license = "UNLICENSED";
    this.package.name = this.config.projects.scope + "/" + this.package.name;
    this.package.version = "0.0.1";
    this.package.scripts = {
      "test": "echo \"Error: no test specified\" && exit 1",
      "build": build_command,
      "build-win64": build_win64_command
    };
    delete this.package.main;

    this.Save();
    console.log("New " + skeleton_type + " created in '" + this.dir + "', please modify 'package.json' as necessary.");
  }

  ExpandSkeleton() {
//    const expand = "tar xvf " + this.packagePath + "/skeletons/" + this.skeleton_type + ".tar";
    const copy_skel = "cp -r " + __dirname + "/skeletons/" + this.skeleton_type + " " + this.dir;
    execSync(copy_skel);
//    fs.renameSync("./skeleton_" + this.skeleton_type, this.dir);

    const variables = {
      'AUTHOR_EMAIL': this.config.author.email,
      'AUTHOR_URL': this.config.author.url,
      'SKELETON': this.name
    };

    const files = [
      'AUTHORS',
      'configure.ac',
      'src/Makefile.am',
      'src/SKELETON.hpp',
      'src/SKELETON.cpp'
    ];

    files.forEach((file) => {
      let temp = fs.readFileSync(this.dir + "/" + file).toString();
      Object.keys(variables).forEach((variable) => {
        var regex = new RegExp(variable, "g");
        temp = temp.replace(regex, variables[variable]);
      });
      fs.writeFileSync(this.dir + "/" + file, temp);
    });

    fs.renameSync(this.dir + "/src/SKELETON.hpp", this.dir + "/src/" + this.name + ".hpp");
    fs.renameSync(this.dir + "/src/SKELETON.cpp", this.dir + "/src/" + this.name + ".cpp");
  }

  Save() {
    fs.writeFileSync(this.dir + "/package.json", JSON.stringify(this.package, null, 2));
  }
}

module.exports = Skeleton;
