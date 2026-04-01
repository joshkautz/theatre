@tomorrowevening/theatre-dataverse

# @tomorrowevening/theatre-dataverse

The animation-optimized FRP library powering the internals of Theatre.js.

## Table of contents

### Namespaces

- [prism](modules/prism.md)

### Classes

- [Atom](classes/Atom.md)
- [PointerProxy](classes/PointerProxy.md)
- [Ticker](classes/Ticker.md)

### Interfaces

- [PointerToPrismProvider](interfaces/PointerToPrismProvider.md)
- [Prism](interfaces/Prism-1.md)

### Type Aliases

- [ICallback](README.md#icallback)
- [IPrismFn](README.md#iprismfn)
- [IRef](README.md#iref)
- [PathToProp](README.md#pathtoprop)
- [Pointer](README.md#pointer)
- [PointerInner](README.md#pointerinner)
- [PointerMeta](README.md#pointermeta)
- [PointerType](README.md#pointertype)
- [UnindexablePointer](README.md#unindexablepointer)
- [UnindexableTypesForPointer](README.md#unindexabletypesforpointer)
- [VoidFn](README.md#voidfn)

### Functions

- [getPointerParts](README.md#getpointerparts)
- [isPointer](README.md#ispointer)
- [isPrism](README.md#isprism)
- [iterateAndCountTicks](README.md#iterateandcountticks)
- [iterateOver](README.md#iterateover)
- [pointer](README.md#pointer-1)
- [pointerToPrism](README.md#pointertoprism)
- [prism](README.md#prism)
- [val](README.md#val)

## Type Aliases

### ICallback

Ƭ **ICallback**: (`t`: `number`) => `void`

#### Type declaration

▸ (`t`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `t` | `number` |

##### Returns

`void`

#### Defined in

[Ticker.ts:1](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/Ticker.ts#L1)

___

### IPrismFn

Ƭ **IPrismFn**: `Object`

#### Call signature

▸ <`T`\>(`fn`): [`Prism`](interfaces/Prism-1.md)<`T`\>

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | () => `T` |

##### Returns

[`Prism`](interfaces/Prism-1.md)<`T`\>

#### Type declaration

| Name | Type |
| :------ | :------ |
| `effect` | (`key`: `string`, `cb`: () => () => `void`, `deps?`: `unknown`[]) => `void` |
| `ensurePrism` | () => `void` |
| `inPrism` | () => `boolean` |
| `memo` | <T\>(`key`: `string`, `fn`: () => `T`, `deps`: `undefined` \| `unknown`[] \| readonly `unknown`[]) => `T` |
| `ref` | <T\>(`key`: `string`, `initialValue`: `T`) => [`IRef`](README.md#iref)<`T`\> |
| `scope` | <T\>(`key`: `string`, `fn`: () => `T`) => `T` |
| `source` | <V\>(`subscribe`: (`fn`: (`val`: `V`) => `void`) => [`VoidFn`](README.md#voidfn), `getValue`: () => `V`) => `V` |
| `state` | <T\>(`key`: `string`, `initialValue`: `T`) => [`T`, (`val`: `T`) => `void`] |
| `sub` | <T\>(`key`: `string`, `fn`: () => `T`, `deps`: `undefined` \| `unknown`[]) => `T` |

#### Defined in

[prism/prism.ts:816](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/prism.ts#L816)

___

### IRef

Ƭ **IRef**<`T`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `current` | `T` |

#### Defined in

[prism/prism.ts:551](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/prism.ts#L551)

___

### PathToProp

Ƭ **PathToProp**: (`string` \| `number`)[]

#### Defined in

[pointer.ts:3](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/pointer.ts#L3)

___

### Pointer

Ƭ **Pointer**<`O`\>: [`PointerType`](README.md#pointertype)<`O`\> & [`PointerInner`](README.md#pointerinner)<`Exclude`<`O`, `undefined`\>, `undefined` extends `O` ? `undefined` : `never`\>

The type of [Atom](classes/Atom.md) pointers. See [pointer()](README.md#pointer-1) for an
explanation of pointers.

**`See`**

Atom

#### Type parameters

| Name |
| :------ |
| `O` |

#### Defined in

[pointer.ts:64](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/pointer.ts#L64)

___

### PointerInner

Ƭ **PointerInner**<`O`, `Optional`\>: `O` extends [`UnindexableTypesForPointer`](README.md#unindexabletypesforpointer) ? [`UnindexablePointer`](README.md#unindexablepointer) : `unknown` extends `O` ? [`UnindexablePointer`](README.md#unindexablepointer) : `O` extends infer T[] ? [`Pointer`](README.md#pointer)<`T`\>[] : `O` extends {} ? { [K in keyof O]-?: Pointer<O[K] \| Optional\> } : [`UnindexablePointer`](README.md#unindexablepointer)

#### Type parameters

| Name |
| :------ |
| `O` |
| `Optional` |

#### Defined in

[pointer.ts:72](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/pointer.ts#L72)

___

### PointerMeta

Ƭ **PointerMeta**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `path` | (`string` \| `number`)[] |
| `root` | {} |

#### Defined in

[pointer.ts:5](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/pointer.ts#L5)

___

### PointerType

Ƭ **PointerType**<`O`\>: `Object`

A wrapper type for the type a `Pointer` points to.

#### Type parameters

| Name |
| :------ |
| `O` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `$$__pointer_type` | `O` | Only accessible via the type system. This is a helper for getting the underlying pointer type via the type space. |

#### Defined in

[pointer.ts:35](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/pointer.ts#L35)

___

### UnindexablePointer

Ƭ **UnindexablePointer**: { [K in string]: Pointer<undefined\> }

#### Defined in

[pointer.ts:22](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/pointer.ts#L22)

___

### UnindexableTypesForPointer

Ƭ **UnindexableTypesForPointer**: `number` \| `string` \| `boolean` \| ``null`` \| `void` \| `undefined` \| `Function`

#### Defined in

[pointer.ts:13](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/pointer.ts#L13)

___

### VoidFn

Ƭ **VoidFn**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[types.ts:6](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/types.ts#L6)

## Functions

### getPointerParts

▸ **getPointerParts**<`_`\>(`p`): `Object`

Returns the root object and the path of the pointer.

#### Type parameters

| Name |
| :------ |
| `_` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `p` | [`Pointer`](README.md#pointer)<`_`\> | The pointer. |

#### Returns

`Object`

An object with two properties: `root`-the root object or the pointer, and `path`-the path of the pointer. `path` is an array of the property-chain.

| Name | Type |
| :------ | :------ |
| `path` | [`PathToProp`](README.md#pathtoprop) |
| `root` | {} |

**`Example`**

```ts
const {root, path} = getPointerParts(pointer)
```

#### Defined in

[pointer.ts:136](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/pointer.ts#L136)

___

### isPointer

▸ **isPointer**(`p`): p is Pointer<unknown\>

Returns whether `p` is a pointer.

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `unknown` |

#### Returns

p is Pointer<unknown\>

#### Defined in

[pointer.ts:187](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/pointer.ts#L187)

___

### isPrism

▸ **isPrism**(`d`): d is Prism<unknown\>

Returns whether `d` is a prism.

#### Parameters

| Name | Type |
| :------ | :------ |
| `d` | `any` |

#### Returns

d is Prism<unknown\>

#### Defined in

[prism/Interface.ts:66](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/Interface.ts#L66)

___

### iterateAndCountTicks

▸ **iterateAndCountTicks**<`V`\>(`pointerOrPrism`): `Generator`<{ `ticks`: `number` ; `value`: `V`  }, `void`, `void`\>

#### Type parameters

| Name |
| :------ |
| `V` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `pointerOrPrism` | [`Prism`](interfaces/Prism-1.md)<`V`\> \| [`Pointer`](README.md#pointer)<`V`\> |

#### Returns

`Generator`<{ `ticks`: `number` ; `value`: `V`  }, `void`, `void`\>

#### Defined in

[prism/iterateAndCountTicks.ts:7](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/iterateAndCountTicks.ts#L7)

___

### iterateOver

▸ **iterateOver**<`V`\>(`pointerOrPrism`): `Generator`<`V`, `void`, `void`\>

#### Type parameters

| Name |
| :------ |
| `V` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `pointerOrPrism` | [`Prism`](interfaces/Prism-1.md)<`V`\> \| [`Pointer`](README.md#pointer)<`V`\> |

#### Returns

`Generator`<`V`, `void`, `void`\>

#### Defined in

[prism/iterateOver.ts:8](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/iterateOver.ts#L8)

___

### pointer

▸ **pointer**<`O`\>(`args`): [`Pointer`](README.md#pointer)<`O`\>

Creates a pointer to a (nested) property of an [Atom](classes/Atom.md).

#### Type parameters

| Name | Description |
| :------ | :------ |
| `O` | The type of the value being pointed to. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `Object` | The pointer parameters. |
| `args.path?` | (`string` \| `number`)[] | - |
| `args.root` | `Object` | - |

#### Returns

[`Pointer`](README.md#pointer)<`O`\>

**`Example`**

```ts
// Here, sum is a prism that updates whenever the a or b prop of someAtom does.
const sum = prism(() => {
  return val(pointer({root: someAtom, path: ['a']})) + val(pointer({root: someAtom, path: ['b']}));
});

// Note, atoms have a convenience Atom.pointer property that points to the root,
// which you would normally use in this situation.
const sum = prism(() => {
  return val(someAtom.pointer.a) + val(someAtom.pointer.b);
});
```

#### Defined in

[pointer.ts:172](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/pointer.ts#L172)

___

### pointerToPrism

▸ **pointerToPrism**<`P`\>(`pointer`): [`Prism`](interfaces/Prism-1.md)<`P` extends [`PointerType`](README.md#pointertype)<`T`\> ? `T` : `void`\>

Returns a prism of the value at the provided pointer. Prisms are
cached per pointer.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends [`PointerType`](README.md#pointertype)<`any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pointer` | `P` | The pointer to return the prism at. |

#### Returns

[`Prism`](interfaces/Prism-1.md)<`P` extends [`PointerType`](README.md#pointertype)<`T`\> ? `T` : `void`\>

#### Defined in

[pointerToPrism.ts:41](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/pointerToPrism.ts#L41)

___

### prism

▸ **prism**<`T`\>(`fn`): [`Prism`](interfaces/Prism-1.md)<`T`\>

Creates a prism from the passed function that adds all prisms referenced
in it as dependencies, and reruns the function when these change.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | () => `T` | The function to rerun when the prisms referenced in it change. |

#### Returns

[`Prism`](interfaces/Prism-1.md)<`T`\>

#### Defined in

[prism/prism.ts:817](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/prism.ts#L817)

___

### val

▸ **val**<`P`\>(`input`): `P` extends [`PointerType`](README.md#pointertype)<`T`\> ? `T` : `P` extends [`Prism`](interfaces/Prism-1.md)<`T`\> ? `T` : `P` extends `undefined` \| ``null`` ? `P` : `unknown`

Convenience function that returns a plain value from its argument, whether it
is a pointer, a prism or a plain value itself.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends `undefined` \| ``null`` \| [`Prism`](interfaces/Prism-1.md)<`any`\> \| [`PointerType`](README.md#pointertype)<`any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `P` | The argument to return a value from. |

#### Returns

`P` extends [`PointerType`](README.md#pointertype)<`T`\> ? `T` : `P` extends [`Prism`](interfaces/Prism-1.md)<`T`\> ? `T` : `P` extends `undefined` \| ``null`` ? `P` : `unknown`

#### Defined in

[val.ts:19](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/val.ts#L19)
