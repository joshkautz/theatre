import {isPlainObject} from 'lodash-es'

/**
 * Like JSON.stringify, but sorts the keys of objects so the stringified value
 * remains stable if the keys are set in different order.
 *
 * Credit: https://github.com/tannerlinsley/react-query/blob/1896ca27abf46d14df7c6f463d98eb285b8d9492/src/core/utils.ts#L301
 */
export default function stableValueHash(value: unknown): string {
  return JSON.stringify(deepSortValue(value))
}

function deepSortValue(val: unknown): unknown {
  if (isPlainObject(val)) {
    const obj = val as Record<string, unknown>
    return Object.keys(obj)
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        result[key] = deepSortValue(obj[key])
        return result
      }, {})
  }
  return Array.isArray(val) ? val.map(deepSortValue) : val
}
