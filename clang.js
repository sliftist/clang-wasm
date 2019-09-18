#!/usr/bin/env node
let path = require("./index.js").getBinaryPath("clang");
let args = process.argv.slice(1);
require("child_process").execFileSync(path, args, { stdio: "inherit" });
