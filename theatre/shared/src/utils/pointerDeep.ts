import type {Pointer} from '@tomorrowevening/theatre-dataverse'
import type {PathToProp} from './addresses'

/**
 * Points deep into a pointer, using `toAppend` as the path. This is _NOT_ type-safe, so use with caution.
 */
export default function pointerDeep<T>(
  base: Pointer<T>,
  toAppend: PathToProp,
): Pointer<unknown> {
  let p: unknown = base
  for (const k of toAppend) {
    p = (p as Record<string, unknown>)[k]
  }
  return p as Pointer<unknown>
}
