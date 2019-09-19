export function run(... args: string[]): Promise<string>;
export function getBinaryPath(binaryName: string): string;
export function runBinary(binaryName: string, ...args: string[]): Promise<string>;
export function clang(...args: string[]): Promise<string>;