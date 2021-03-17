import {promisify} from "util"
import {createReadStream, exists, open, writeFile, close, truncate } from 'fs'
import {createInterface} from 'readline'

const $exists = promisify(exists)
, $open = promisify(open)
, $write = promisify(writeFile)
, $truncate = promisify(truncate)
, $close = promisify(close)

export = rewrite

// TODO #12 with .trim() https://jsbench.me/fykmaajqmc/

async function rewrite(filename: string, lines: string[], eol: string) {
  const {length} = lines
  , {length: eolLength} = eol
  , fileExists = await $exists(filename)

  let row = 0
  , position = 0

  if (fileExists) {
    const lineReader = createInterface({
      input: createReadStream(filename),
      crlfDelay: Infinity,
      historySize: 0
    })

    let isSame = true

    for await (const line of lineReader) {
      if (line !== lines[row]) {
        isSame = false
        continue
      }
      row++
      position += line.length
    }

    lineReader.close()

    if (isSame) {
      if (lines[row] === "")
        row++
      if (length === row)
        return
    }

    await $truncate(filename, position + eolLength * (row - 1))
  }

  const fd = await $open(filename, "a")

  for (let i = row; i < length; i++)
    await $write(fd, `${
      i ? eol : ''
    }${
      lines[i]
    }`)

  await $close(fd)
}
