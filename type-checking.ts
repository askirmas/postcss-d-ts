export function classNames(...args: (HTMLElement["className"]|undefined)[]) {
  return args.join(' ')
}