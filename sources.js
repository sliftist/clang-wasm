export function sources() {
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
    let sourcesObj = (
        // Autogenerated. Don't modify this manually.
// AUTO_GENERATED_SOURCES_START
{
    "clang-win32-x64": {
        "jsSystemInfo": {
            "platform": "win32",
            "arch": "x64"
        },
        "packageName": "clang-win32-x64",
        "binaries": {
            "clang": "clang.exe"
        }
    },
    "clang-wasm-win64": {
        "jsSystemInfo": {
            "platform": "win32",
            "arch": "x64"
        },
        "packageName": "clang-wasm-win64",
        "binaries": {
            "clang": "clang.exe"
        }
    }
}
// AUTO_GENERATED_SOURCES_END
    )
    ;
}