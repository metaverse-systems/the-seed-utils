#!/usr/bin/env node
const inquirer = require('inquirer');
const path = require('path')
const args = process.argv;
const fs = require('fs');
const mime = require('mime-type/with-db');

const config = JSON.parse(fs.readFileSync("./package.json"));

config.resources.forEach((resource) => {
  resource.mime_type = mime.contentType(resource.filename);
  var stats = fs.statSync(resource.filename)
  resource.bytes = stats["size"];
});

const header = {
  "header_size": JSON.stringify(config.resources).length.toString().padStart(10, 0),
  "resources": config.resources
};

header.header_size = JSON.stringify(header).length.toString().padStart(10, 0);

let [org, name] = config.name.split("\/");

fs.writeFileSync(name + ".pak", JSON.stringify(header));

header.resources.forEach((resource) => {
  let data = fs.readFileSync(resource.filename);
  fs.writeFileSync(name + ".pak", data, { flag: "a+" });
});
