import {
  readFileSync,
  unlink,
  exists,
  open,
  writeFile,
  close,
} from "fs"
import {promisify} from "util"

const $exists = promisify(exists)
, _unlink = promisify(unlink)
, $open = promisify(open)
, $write = promisify(writeFile)
, $close = promisify(close)


export {
  readlineSync,
  $exists,
  $unlink,
  $open,
  $write,
  $close
}

//TODO replace with common
function readlineSync(path: string, splitter: string) {
  return readFileSync(path).toString().split(splitter)
}

function $unlink(source: Parameters<typeof _unlink>[0]) {
  return $exists(source)
  .then(ex => ex ? _unlink(source) : void 0)
}
