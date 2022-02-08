#!/usr/bin/env node
const inquirer = require('inquirer');
const path = require('path')
const args = process.argv;
const fs = require('fs');
const mime = require('mime-types');

const config = JSON.parse(fs.readFileSync("./package.json"));

const resources = [];

config.resources.forEach((resource) => {
  const stats = fs.statSync(resource.filename);
  const r = {
    "name": resource.name,
    "mime_type": mime.lookup(resource.filename),
    "bytes": stats["size"],
  };
  resources.push(r);
});

const header = {
  "name": config["name"],
  "header_size": JSON.stringify(resources).length.toString().padStart(10, 0),
  "resources": resources,
};

header.header_size = JSON.stringify(header).length.toString().padStart(10, 0);

let [org, name] = config.name.split("\/");

fs.writeFileSync(name + ".pak", JSON.stringify(header));

config.resources.forEach((resource) => {
  const data = fs.readFileSync(resource.filename);
  fs.writeFileSync(name + ".pak", data, { flag: "a+" });
});
