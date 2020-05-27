#!/usr/bin/env node
const inquirer = require('inquirer');
const ResourcePak = require('./ResourcePak');
const path = require('path')
const args = process.argv;

const name = args[2];

var resource_pak = new ResourcePak(name);
