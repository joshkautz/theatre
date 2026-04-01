[@tomorrowevening/theatre-dataverse](../README.md) / prism

# Namespace: prism

Creates a prism from the passed function that adds all prisms referenced
in it as dependencies, and reruns the function when these change.

**`Param`**

The function to rerun when the prisms referenced in it change.

## Table of contents

### Variables

- [effect](prism.md#effect)
- [ensurePrism](prism.md#ensureprism)
- [inPrism](prism.md#inprism)
- [memo](prism.md#memo)
- [ref](prism.md#ref)
- [scope](prism.md#scope)
- [source](prism.md#source)
- [state](prism.md#state)
- [sub](prism.md#sub)

## Variables

### effect

• **effect**: (`key`: `string`, `cb`: () => () => `void`, `deps?`: `unknown`[]) => `void`

#### Type declaration

▸ (`key`, `cb`, `deps?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `cb` | () => () => `void` |
| `deps?` | `unknown`[] |

##### Returns

`void`

#### Defined in

[prism/prism.ts:892](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/prism.ts#L892)

___

### ensurePrism

• **ensurePrism**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[prism/prism.ts:894](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/prism.ts#L894)

___

### inPrism

• **inPrism**: () => `boolean`

#### Type declaration

▸ (): `boolean`

##### Returns

`boolean`

#### Defined in

[prism/prism.ts:898](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/prism.ts#L898)

___

### memo

• **memo**: <T\>(`key`: `string`, `fn`: () => `T`, `deps`: `undefined` \| `unknown`[] \| readonly `unknown`[]) => `T`

#### Type declaration

▸ <`T`\>(`key`, `fn`, `deps`): `T`

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `fn` | () => `T` |
| `deps` | `undefined` \| `unknown`[] \| readonly `unknown`[] |

##### Returns

`T`

#### Defined in

[prism/prism.ts:893](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/prism.ts#L893)

___

### ref

• **ref**: <T\>(`key`: `string`, `initialValue`: `T`) => [`IRef`](../README.md#iref)<`T`\>

#### Type declaration

▸ <`T`\>(`key`, `initialValue`): [`IRef`](../README.md#iref)<`T`\>

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `initialValue` | `T` |

##### Returns

[`IRef`](../README.md#iref)<`T`\>

#### Defined in

[prism/prism.ts:891](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/prism.ts#L891)

___

### scope

• **scope**: <T\>(`key`: `string`, `fn`: () => `T`) => `T`

#### Type declaration

▸ <`T`\>(`key`, `fn`): `T`

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `fn` | () => `T` |

##### Returns

`T`

#### Defined in

[prism/prism.ts:896](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/prism.ts#L896)

___

### source

• **source**: <V\>(`subscribe`: (`fn`: (`val`: `V`) => `void`) => [`VoidFn`](../README.md#voidfn), `getValue`: () => `V`) => `V`

#### Type declaration

▸ <`V`\>(`subscribe`, `getValue`): `V`

##### Type parameters

| Name |
| :------ |
| `V` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `subscribe` | (`fn`: (`val`: `V`) => `void`) => [`VoidFn`](../README.md#voidfn) |
| `getValue` | () => `V` |

##### Returns

`V`

#### Defined in

[prism/prism.ts:899](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/prism.ts#L899)

___

### state

• **state**: <T\>(`key`: `string`, `initialValue`: `T`) => [`T`, (`val`: `T`) => `void`]

#### Type declaration

▸ <`T`\>(`key`, `initialValue`): [`T`, (`val`: `T`) => `void`]

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `initialValue` | `T` |

##### Returns

[`T`, (`val`: `T`) => `void`]

#### Defined in

[prism/prism.ts:895](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/prism.ts#L895)

___

### sub

• **sub**: <T\>(`key`: `string`, `fn`: () => `T`, `deps`: `undefined` \| `unknown`[]) => `T`

#### Type declaration

▸ <`T`\>(`key`, `fn`, `deps`): `T`

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `fn` | () => `T` |
| `deps` | `undefined` \| `unknown`[] |

##### Returns

`T`

#### Defined in

[prism/prism.ts:897](https://github.com/theatre-js/theatre/blob/main/packages/dataverse/src/prism/prism.ts#L897)
