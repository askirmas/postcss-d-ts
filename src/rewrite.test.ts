import rewrite = require("./rewrite")
import {
 rmdirSync, statSync, writeFileSync
} from "fs"
import {rfsl} from "../test-runner"
import {$unlink, tempDir} from "./fs"

const filePath = `${__dirname}/rewrite.txt`
, whenModified = () => statSync(filePath).mtimeMs
, ctx = (eol: string, checkMode: boolean) => ({
  write: (content: string[]) => {
    writeFileSync(filePath, content.join(eol))

return whenModified()
  },
  rewriteCheck: async(content: string[], expectedContent = content) => {
    await rewrite(filePath, content, eol, checkMode)
    expect(rfsl(filePath, eol)).toStrictEqual(expectedContent)

return whenModified()
  }
})
, unlink = () => $unlink(filePath)

beforeAll(() => rmdirSync(tempDir, {recursive: true}))

afterEach(unlink)

describe("eols", () =>
  ([
    ["\\n", "\n"],
    ["\\r\\n", "\r\n"],
  ] as const).forEach(([title, eol]) => {
    afterEach(unlink)

    const {write, rewriteCheck} = ctx(eol, false)

    describe(title, () => {
      describe("create", () => {
        beforeEach(unlink)

        it("content", async() => expect(typeof await rewriteCheck(
          ["content"]
        )).toBe("number"))

        it("empty", async() => expect(typeof await rewriteCheck(
          [""]
        )).toBe("number"))

        it("blank", async() => expect(typeof await rewriteCheck(
          [],
          [""]
        )).toBe("number"))

        it("new line", async() => expect(typeof await rewriteCheck(
          ["", ""]
        )).toBe("number"))
      })

      describe("same", () => {
        it("no last line", async() => {
          const created = write(["first line", "second line"])

          expect(await rewriteCheck(["first line", "second line"])).toBe(created)
        })

        it("with last line", async() => {
          const created = write(["first line", "second line", ""])

          expect(await rewriteCheck(["first line", "second line", ""])).toBe(created)
        })

        it("with 2 last lines", async() => {
          const created = write(["first line", "second line", "", ""])

          expect(await rewriteCheck(["first line", "second line", "", ""])).toBe(created)
        })
      })

      describe("cross new lines", () => {
        it("with to no", async() => {
          const created = write(["first line", "second line", ""])

          expect(await rewriteCheck(
            ["first line", "second line"],
            ["first line", "second line", ""]
          )).toBe(
            created
          )
        })

        it("no to with", async() => {
          const created = write(
            ["first line", "second line"]
          )

          expect(await rewriteCheck(
            ["first line", "second line", ""],
            ["first line", "second line"]
          )).toBe(created)
        })
      })

      describe("modifications", () => {
        it("less", async() => {
          write(["first line", "second line", "", "third line", ""])
          await rewriteCheck(["first line", "second line", ""])
        })

        it("more", async() => {
          write(["first line", "second line", ""])
          await rewriteCheck(["first line", "second line", "", "third line", ""])
        })

        it("changed", async() => {
          write(["first line", "second line", "", "third line", ""])
          await rewriteCheck(["first line", "second line", "", "LINE", ""])
        })
      })
    })
  })
)

describe("check mode", () => {
  const {write, rewriteCheck} = ctx("\n", true)

  it("same", async() => {
    const created = write(["line1"])

    expect(await rewriteCheck(["line1"])).toBe(created)
  })

  it("changed", async() => {
    write(["line1"])
    expect(
      await rewriteCheck(["line2"])
      .catch(error => error)
    ).toBeInstanceOf(Error)
  })
})
