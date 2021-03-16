import {createReadStream, unlinkSync, writeFileSync} from 'fs'
import {createInterface} from 'readline'

const filename = `${__dirname}/readline.txt`

afterAll(() => unlinkSync(filename))

it("last not empty", async () => {
  const length = write(["first", "second"])
   expect(await lineReaderCount()).toBe(length)
})

it("first empty", async () => {
  const length = write(["", "first", "second"])
  expect(await lineReaderCount()).toBe(length)
})

it("last empty", async () => {
  const length = write(["first", "second", ""])
  expect(await lineReaderCount()).toBe(length - 1)
})

it("two last empty", async () => {
  const length = write(["first", "second", "", ""])
  expect(await lineReaderCount()).toBe(length - 1)
})


async function lineReaderCount() {
  const lineReader = createInterface({
    input: createReadStream(filename),
    crlfDelay: Infinity,
    historySize: 0
  })

  let i = 0
  for await (const _ of lineReader)
    i++

  lineReader.close()

  return i
}

function write(content: string[]) {
  writeFileSync(filename, content.join("\n"))
  return content.length
}

