#!/usr/bin/env node
const inquirer = require('inquirer');
const Skeleton = require('./Skeleton');
const path = require('path')
const args = process.argv;

const name = args[2];

var component = new Skeleton("component", name);
