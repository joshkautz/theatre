import {tightJsonStringify} from './tightJsonStringify'

/**
 * Stringifies any value given. If an object is given and `indentJSON` is true,
 * then a developer-readable, command line friendly (not too spaced out, but with
 * enough whitespace to be readable).
 */
export function devStringify(
  input: unknown,
  indentJSON: boolean = true,
): string {
  try {
    return typeof input === 'string'
      ? input
      : typeof input === 'function' || input instanceof Error
      ? input.toString()
      : indentJSON
      ? tightJsonStringify(input)
      : JSON.stringify(input)
  } catch (err) {
    return (
      (input != null && typeof input === 'object' && 'name' in input
        ? String(input.name)
        : undefined) || String(input)
    )
  }
}
