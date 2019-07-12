import { Neovim } from '@chemzqm/neovim'
import OutputChannel from '../../model/outputChannel'
import { wait } from '../../util'
import helper from '../helper'

let nvim: Neovim
beforeAll(async () => {
  await helper.setup()
  nvim = helper.nvim
})

afterEach(async () => {
  await helper.reset()
})

afterAll(async () => {
  await helper.shutdown()
})

describe('OutputChannel', () => {
  test('outputChannel.show(true)', async () => {
    let c = new OutputChannel('0', nvim)
    let bufnr = (await nvim.buffer).id
    c.show(true)
    await wait(100)
    let nr = (await nvim.buffer).id
    expect(bufnr).toBe(nr)
  })

  test('outputChannel.show(false)', async () => {
    let c = new OutputChannel('1', nvim)
    let bufnr = (await nvim.buffer).id
    c.show()
    await wait(100)
    let nr = (await nvim.buffer).id
    expect(bufnr).toBeLessThan(nr)
  })

  test('outputChannel.appendLine()', async () => {
    let c = new OutputChannel('2', nvim)
    c.show()
    await wait(100)
    let buf = await nvim.buffer
    c.appendLine('foo')
    await wait(100)
    let lines = await buf.getLines({ start: 0, end: -1, strictIndexing: false })
    expect(lines).toContain('foo')
  })

  test('outputChannel.append()', async () => {
    let c = new OutputChannel('3', nvim)
    c.show(false)
    await wait(60)
    let buf = await nvim.buffer
    c.append('foo')
    c.append('bar')
    await wait(300)
    let lines = await buf.lines
    expect(lines.join('\n')).toMatch('foo')
  })

  test('outputChannel.clear()', async () => {
    let c = new OutputChannel('4', nvim)
    c.show(false)
    await wait(30)
    let buf = await nvim.buffer
    c.appendLine('foo')
    c.appendLine('bar')
    await wait(30)
    c.clear()
    await wait(30)
    let lines = await buf.lines
    let content = lines.join('')
    expect(content).toBe('')
  })
})
