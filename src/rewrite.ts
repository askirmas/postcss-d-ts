import { createReadStream } from 'fs'
import { createInterface} from 'readline'
import {
  $exists,
  $open,
  $write,
  $close,
  $rename,
  tempFileName
} from "./fs"

export = rewrite

async function rewrite(filename: string, lines: string[], eol: string, checkMode: boolean) {
  const {length} = lines
  , fileExists = await $exists(filename)

  if (fileExists) {
    const lineReader = createInterface({
      input: createReadStream(filename),
      crlfDelay: Infinity,
      historySize: 0
    })

    let isSame = true
    , row = 0

    for await (const line of lineReader) {
      if (line !== lines[row]) {
        isSame = false
        break
      }
      row++
    }

    lineReader.close()

    if (isSame) {
      if (lines[row] === "")
        row++
      if (length === row)
        return
    }
  }

  if (checkMode)
    throw Error(`Content of "${filename}" should be another`)

  const tempFile = await tempFileName()
  , fd = await $open(tempFile, "w")

  for (let i = 0; i < length; i++)
    await $write(fd, `${
      i ? eol : ''
    }${
      lines[i]
    }`)

  await $close(fd)
  await $rename(tempFile, filename)
}
