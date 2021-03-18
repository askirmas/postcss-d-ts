import schema = require("./schema.json")
import {
  readFileSync,
  unlink,
  exists,
  open,
  writeFile,
  close,
  mkdir,
  rename
} from "fs"
import { tmpdir } from "os"
import { join } from "path"
import { promisify } from "util"
import { randomString } from "./utils"

const $exists = promisify(exists)
, _unlink = promisify(unlink)
, $open = promisify(open)
, $write = promisify(writeFile)
, $close = promisify(close)
, $mkdir = promisify(mkdir)
, $rename = promisify(rename)
, tempDir = join(tmpdir(), schema.title)

export {
  readlineSync,
  $exists,
  $unlink,
  $open,
  $write,
  $close,
  $rename,
  tempFileName,
  tempDir
}

//TODO replace with common
function readlineSync(path: string, splitter: string) {
  return readFileSync(path).toString().split(splitter)
}

function $unlink(source: Parameters<typeof _unlink>[0]) {
  return $exists(source)
  .then(ex => ex ? _unlink(source) : void 0)
}

async function tempFileName() {
  await $exists(tempDir) || await $mkdir(tempDir)
  return join(tempDir, randomString())
}
