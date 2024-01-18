/* tslint:disable */
/* eslint-disable */
/**
* @returns {any}
*/
export function setup_unsafe(): any;
/**
* @param {Uint8Array} ckey_bytes_1
* @param {Uint8Array} ckey_bytes_2
* @param {number} x
* @returns {any}
*/
export function commit(ckey_bytes_1: Uint8Array, ckey_bytes_2: Uint8Array, x: number): any;
/**
* @param {Uint8Array} ckey_bytes_1
* @param {Uint8Array} ckey_bytes_2
* @param {Uint8Array} commit
* @param {number} y
* @param {number} message
* @returns {any}
*/
export function encrypt(ckey_bytes_1: Uint8Array, ckey_bytes_2: Uint8Array, commit: Uint8Array, y: number, message: number): any;
/**
* @param {Uint8Array} ckey_bytes_1
* @param {Uint8Array} ckey_bytes_2
* @param {Uint8Array} proj_key_bytes
* @param {Uint8Array} rand_bytes
* @param {number} ciphertext
* @param {number} x
* @param {Uint8Array} r_commit_bytes
* @returns {number}
*/
export function decrypt(ckey_bytes_1: Uint8Array, ckey_bytes_2: Uint8Array, proj_key_bytes: Uint8Array, rand_bytes: Uint8Array, ciphertext: number, x: number, r_commit_bytes: Uint8Array): number;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly setup_unsafe: () => number;
  readonly commit: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly encrypt: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly decrypt: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
