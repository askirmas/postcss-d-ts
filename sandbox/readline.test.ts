import {createReadStream, readFileSync} from 'fs'
import {createInterface} from 'readline'

it("last empty", async () => {
  const filename = `${__dirname}/readline.last--empty.txt`
  , {length} = readFileSync(filename).toString().split("\n")
  , lineReader = createInterface(createReadStream(filename))

  let i = 0
  for await (const _ of lineReader)
    i++
  
  expect(i).toBe(length - 1)
})

it("last not empty", async () => {
  const filename = `${__dirname}/readline.last--not_empty.txt`
  , {length} = readFileSync(filename).toString().split("\n")
  , lineReader = createInterface(createReadStream(filename))

  let i = 0
  for await (const _ of lineReader)
    i++
  
  expect(i).toBe(length)
})