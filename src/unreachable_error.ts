export class UnreachableError extends Error {
  constructor(x: never) {
    super(`Unreachable value: ${x}`)
  }
}
