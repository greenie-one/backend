export function createAddressString(...args: (string | undefined)[]) {
  let ret = ''
  for (const a of args) {
    ret += `${a ?? ''}${a ? ', ' : ''}`
  }

  return ret.substring(0, ret.length - 1)
}