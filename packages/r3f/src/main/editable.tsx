import type {ComponentProps, ComponentType, Ref} from 'react'
import {useMemo, useState} from 'react'
import React, {forwardRef, useEffect, useLayoutEffect, useRef} from 'react'
import {allRegisteredObjects, editorStore} from './store'
import {mergeRefs} from 'react-merge-refs'
import useInvalidate from './useInvalidate'
import {useCurrentSheet} from './SheetProvider'
import defaultEditableFactoryConfig from './defaultEditableFactoryConfig'
import type {EditableFactoryConfig} from './editableFactoryConfigUtils'
import {makeStoreKey} from './utils'
import type {$FixMe, $IntentionalAny} from '../types'
import type {ISheetObject} from '@tomorrowevening/theatre-core'
import {notify, types} from '@tomorrowevening/theatre-core'
import {useCurrentRafDriver} from './RafDriverProvider'

const createEditable = <Keys extends keyof JSX.IntrinsicElements>(
  config: EditableFactoryConfig,
) => {
  const editable = <
    T extends ComponentType<any> | keyof JSX.IntrinsicElements | 'primitive',
    U extends Keys,
  >(
    Component: T,
    type: T extends 'primitive' ? null : U,
  ): React.ForwardRefExoticComponent<
    Omit<ComponentProps<T>, 'visible'> & {
      theatreKey: string
      visible?: boolean | 'editor'
      additionalProps?: $FixMe
      objRef?: $FixMe
      hiddenProps?: string[]
    } & (T extends 'primitive' ? {editableType: U} : {})
  > => {
    type Props = Omit<ComponentProps<T>, 'visible'> & {
      theatreKey: string
      visible?: boolean | 'editor'
      additionalProps?: $FixMe
      objRef?: $FixMe
      /** Prop keys to hide from Theatre.js Studio UI (e.g., ['rotation', 'scale']). Props remain keyframeable. */
      hiddenProps?: string[]
    } & (T extends 'primitive'
        ? {
            editableType: U
          }
        : {})

    if (Component !== 'primitive' && !type) {
      throw new Error(
        `You must provide the type of the component you're creating an editable for. For example: editable(MyComponent, 'mesh').`,
      )
    }

    // TODO: detect if `editable()` is being called in the body of a react component, which is a common
    // mistake. If it is, throw an error.

    // Cast needed because forwardRef's PropsWithoutRef<Props> creates an
    // unresolvable conditional type when Props contains generics. The explicit
    // return type annotation on this function ensures correct declaration emit.
    return forwardRef(((
      {
        theatreKey,
        visible,
        editableType,
        additionalProps,
        objRef,
        hiddenProps,
        ...props
      }: Props,
      ref: Ref<unknown>,
    ) => {
      //region Runtime type checks
      if (typeof theatreKey !== 'string') {
        throw new Error(
          `No valid theatreKey was provided to the editable component. theatreKey must be a string. Received: ${theatreKey}`,
        )
      }

      if (Component === 'primitive' && !editableType) {
        throw new Error(
          `When using the primitive component, you must provide the editableType prop. Received: ${editableType}`,
        )
      }
      //endregion

      const actualType = type ?? editableType

      const objectRef = useRef<JSX.IntrinsicElements[U]>()

      const sheet = useCurrentSheet()!
      const rafDriver = useCurrentRafDriver()

      const [sheetObject, setSheetObject] = useState<
        undefined | ISheetObject<$FixMe>
      >(undefined)

      const storeKey = useMemo(
        () =>
          makeStoreKey({
            ...sheet.address,
            objectKey: theatreKey as $IntentionalAny,
          }),
        [sheet, theatreKey],
      )

      const invalidate = useInvalidate()

      // warn about cameras in r3f
      useEffect(() => {
        if (
          Component === 'perspectiveCamera' ||
          Component === 'orthographicCamera'
        ) {
          const dreiComponent =
            Component.charAt(0).toUpperCase() + Component.slice(1)

          notify.warning(
            `Possibly incorrect use of <e.${Component} />`,
            `You seem to have declared the camera "${theatreKey}" simply as \`<e.${Component} ... />\`. This alone won't make r3f use it for rendering.

The easiest way to create a custom animatable \`${dreiComponent}\` is to import it from \`@react-three/drei\`, and make it editable.
\`\`\`
import {${dreiComponent}} from '@react-three/drei'

const EditableCamera =
  editable(${dreiComponent}, '${Component}')
\`\`\`
Then you can use it in your JSX like any other editable component. Note the makeDefault prop exposed by drei, which makes r3f use it for rendering.
\`\`\`
<EditableCamera
  theatreKey="${theatreKey}"
  makeDefault
>
\`\`\`
`,
          )
        }
      }, [Component, theatreKey])

      // create sheet object and add editable to store
      useLayoutEffect(() => {
        if (!sheet) return

        const allProps = Object.assign(
          {
            ...additionalProps,
          },
          // @ts-ignore
          ...Object.values(config[actualType].props).map(
            // @ts-ignore
            (value) => value.type,
          ),
        )

        // Mark specified props as hidden from Studio UI
        if (hiddenProps) {
          for (const key of hiddenProps) {
            if (!(key in allProps)) continue
            const prop = allProps[key]
            if (
              typeof prop === 'object' &&
              prop !== null &&
              'deserializeAndSanitize' in prop
            ) {
              // Longhand prop type — clone with hidden flag
              allProps[key] = {...prop, hidden: true}
            } else if (typeof prop === 'object' && prop !== null) {
              // Shorthand compound (e.g., {x: types.number(...), y: types.number(...)})
              allProps[key] = types.compound(prop as $FixMe, {hidden: true})
            }
          }
        }

        if (sheetObject) {
          sheet.object(theatreKey, allProps, {reconfigure: true})
          return
        } else {
          const sheetObject = sheet.object(theatreKey, allProps)
          allRegisteredObjects.add(sheetObject)
          setSheetObject(sheetObject)

          if (objRef)
            typeof objRef === 'function'
              ? objRef(sheetObject)
              : (objRef.current = sheetObject)

          editorStore.getState().addEditable(storeKey, {
            type: actualType,
            sheetObject,
            visibleOnlyInEditor: visible === 'editor',
            // @ts-ignore
            objectConfig: config[actualType],
          })
        }
      }, [sheet, storeKey, additionalProps, hiddenProps])

      // store initial values of props
      useLayoutEffect(() => {
        if (!sheetObject) return
        sheetObject!.initialValue = Object.fromEntries(
          // @ts-ignore
          Object.entries(config[actualType].props).map(
            // @ts-ignore
            ([key, value]) => [key, value.parse(props)],
          ),
        )
      }, [
        sheetObject,
        // @ts-ignore
        ...Object.keys(config[actualType].props).map(
          // @ts-ignore
          (key) => props[key],
        ),
      ])

      // subscribe to prop changes from theatre
      useLayoutEffect(() => {
        if (!sheetObject) return

        const object = objectRef.current!

        const setFromTheatre = (newValues: any) => {
          // @ts-ignore
          Object.entries(config[actualType].props).forEach(
            // @ts-ignore
            ([key, value]) => value.apply(newValues[key], object),
          )
          // @ts-ignore
          config[actualType].updateObject?.(object)
          invalidate()
        }

        setFromTheatre(sheetObject.value)

        const unsubscribe = sheetObject.onValuesChange(
          setFromTheatre,
          rafDriver,
        )

        return () => {
          unsubscribe()
          sheetObject.sheet.detachObject(theatreKey)
          allRegisteredObjects.delete(sheetObject)
          editorStore.getState().removeEditable(storeKey)
        }
      }, [sheetObject, rafDriver])

      return (
        // @ts-ignore
        <Component
          ref={mergeRefs([objectRef, ref])}
          {...props}
          visible={visible !== 'editor' && visible}
          userData={{
            __editable: true,
            __storeKey: storeKey,
          }}
        />
      )
    }) as $FixMe) as $FixMe
  }

  const extensions = {
    ...Object.fromEntries(
      Object.keys(config).map((key) => [
        key,
        // @ts-ignore
        editable(key, key),
      ]),
    ),
    primitive: editable('primitive', null),
  } as unknown as {
    [Property in Keys]: React.ForwardRefExoticComponent<
      Omit<JSX.IntrinsicElements[Property], 'visible'> & {
        theatreKey: string
        visible?: boolean | 'editor'
        additionalProps?: $FixMe
        objRef?: $FixMe
        // not exactly sure how to get the type of the threejs object itself
        ref?: Ref<unknown>
      }
    >
  } & {
    primitive: React.ForwardRefExoticComponent<
      {
        object: any
        theatreKey: string
        visible?: boolean | 'editor'
        additionalProps?: $FixMe
        objRef?: $FixMe
        editableType: keyof JSX.IntrinsicElements
        // not exactly sure how to get the type of the threejs object itself
        ref?: Ref<unknown>
      } & {
        // Have to reproduce the primitive component's props here because we need to
        // lift this index type here to the outside to make auto-complete work
        [props: string]: any
      }
    >
  }

  return Object.assign(editable, extensions)
}

const editable = createEditable<keyof typeof defaultEditableFactoryConfig>(
  defaultEditableFactoryConfig,
)

export default editable
