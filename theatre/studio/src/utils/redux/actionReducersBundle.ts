import type {IUtilContext} from '@tomorrowevening/theatre-shared/logger'
import type {
  $IntentionalAny,
  GenericAction,
} from '@tomorrowevening/theatre-shared/utils/types'
import mapValues from 'lodash-es/mapValues'

/**
 * [This is why you use twitter](https://twitter.com/ae_play/status/1323597147758043137)
 */
export type PayloadTypeOfReducer<
  Fn extends (
    s: $IntentionalAny,
    action: {type: string; payload: $IntentionalAny},
  ) => $IntentionalAny,
> = Parameters<Fn>[1]['payload']

const actionReducersBundle =
  <State>(ctx: IUtilContext) =>
  <Reducers extends Record<string, (s: State, action: GenericAction) => void>>(
    reducers: Reducers,
  ) => {
    type Actions = {
      [K in keyof Reducers]: (payload: PayloadTypeOfReducer<Reducers[K]>) => {
        type: K
        payload: PayloadTypeOfReducer<Reducers[K]>
      }
    }

    const actions: Actions = mapValues(reducers, (_, actionType) => {
      return (payload: unknown) => ({type: actionType, payload})
    }) as unknown as Actions

    const reducer = (prevState: State, action: GenericAction) => {
      const {type} = action
      const innerReducer = (
        reducers as Record<
          string,
          (s: State, action: GenericAction) => State | void
        >
      )[type]
      if (!innerReducer) {
        ctx.logger.error(`Unkown action type '${type}'`)
        return prevState
      }
      const result = innerReducer(prevState, action)

      return (result ?? prevState) as State
    }

    return {actions, reducer}
  }

export default actionReducersBundle
