const child_process = require("child_process");

const sourceCode = require("./sources").sources;

/** @type {
    [packageName: string]: {
        // Ex, { platform: "win32", arch: "x64" }. Every key is mapped to process[key]
        //  and checked to see if this matches the current system
        jsSystemInfo: { [key: string]: unknown };
        // Exact name of npm package
        packageName: string;
        binaries: {
            // Maps to the name of file inside the package.
            [binaryName: string]: string
        }
    }
} */
let sources = sourceCode();
// Get the valid config object for the current system.

// Also exists in index.js.
let matchingSystems = Object.keys(sources).filter(infoObj => {
    for(let key in infoObj.jsSystemInfo) {
        if(infoObj[key] !== process[key]) return false;
    }
    return true;
}).map(x => sources[x]);

function getPackageObj() {
    if(matchingSystems.length === 0) {
        throw new Error(`Cannot find a matching release for the current system. Require ${systemSuffix}, have ${JSON.stringify(Object.keys(sources))}`);
    }
    if(matchingSystems.length > 1) {
        console.error(`Found more than one matching release for the current system. Found ${JSON.stringify(matchingSystems)}. Defaulting to the first one.`);
    }

    let sourcesObj = matchingSystems[0];
    return sourcesObj;
}

function getBinaryPath(name) {
    let packageObj = getPackageObj();
    let { packageName } = packageObj;
    name = name || Object.keys(packageObj.binaries)[0];
    // Use eval, to allow the require to work within webpack.
    return eval("require")(packageName).getBinaryPath(name);
}

function runBinary(name, ...args) {
    let errorObj = new Error();
    let path = getBinaryPath(name);
    let proc = child_process.spawn(path, args);
    return new Promise((resolve, reject) => {
        let error = "";
        proc.stderr.on("data", (data) => {
            error += data.toString();
        });
        let data = "";
        proc.stdout.on("data", (d) => {
            data += d.toString();
        });
        proc.stdout.on("close", (code) => {
            if(code) {
                // Reject with an error object from the original callstack, giving us information on what
                //  original call caused the error.
                errorObj.message = error;
                let stackArray = errorObj.stack.split("\n");
                stackArray[0] = error;
                errorObj.stack = stackArray.join("\n");
                reject(errorObj);
            } else {
                resolve(data + "\n" + error);
            }
        });
        proc.on("error", (err) => {
            reject(err);
        });
    });
}

let exportsObj = {
    getBinaryPath,
    runBinary
};

let binLookup = {};
for(let binObj of matchingSystems) {
    for(let key in binObj) {
        binLookup[key] = true;
    }
}

for(let name in Object.keys(binLookup)) {
    exportsObj[name] = runBinary.bind(null, name);
}

exportsObj.run = runBinary.bind(null, undefined);

module.exports = exportsObj;