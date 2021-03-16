import run, { rfs } from '../test-runner'

it('bootstrap3', async () => {
  const from = require.resolve("bootstrap3/dist/css/bootstrap.css")
  , localFrom = `${__dirname}/bootstrap3.css`
  , input = rfs(from)

  await run({
    from: localFrom,
    input
  })
})

it('bootstrap4', async () => {
  const from = require.resolve("bootstrap4/dist/css/bootstrap.css")
  , localFrom = `${__dirname}/bootstrap4.css`
  , input = rfs(from)

  await run({
    from: localFrom,
    input
  })
})

it('material10', async () => {
  const from = require.resolve("material10/dist/material-components-web.css")
  , localFrom = `${__dirname}/material10.css`
  , input = rfs(from)

  await run({
    from: localFrom,
    input
  })
})
