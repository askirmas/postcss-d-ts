import {promisify} from "util"
import {createReadStream, exists, open, writeFile, close } from 'fs'
import {createInterface} from 'readline'

const $exists = promisify(exists)
, $open = promisify(open)
, $write = promisify(writeFile)
, $close = promisify(close)

export = rewrite

// TODO #12 with .trim() https://jsbench.me/fykmaajqmc/

async function rewrite(filename: string, lines: string[], eol: string) {
  const {length} = lines
  , fileExists = await $exists(filename)

  if (fileExists) {
    const lineReader = createInterface({
      input: createReadStream(filename),
      crlfDelay: Infinity,
      historySize: 0
    })

    let row = -1
    , isSame = true

    for await (const line of lineReader) {
      row++
      if (line !== lines[row]) {
        isSame = false
        continue
      }
    }

    lineReader.close()

    if (isSame) {
      if (lines[row + 1] === "")
        row++
      if (length === row + 1)
        return
    }
  }

  const fd = await $open(filename, "w")

  for (let i = 0; i < length; i++)
    await $write(fd, `${
      i ? eol : ''
    }${lines[i]
    }`)

  await $close(fd)
}
