# $FixMe Type Cleanup Plan

## Overview

The Theatre.js codebase uses `$FixMe` (aliased to `any`) as a marker for types that should eventually be replaced with proper TypeScript types. There are currently 95 code-level usages across 44 files. This plan organizes the cleanup into phases by difficulty and risk, with specific replacement types for each occurrence.

The goal is to eliminate all `$FixMe` usages, replacing them with either proper types or `$IntentionalAny` where `any` is genuinely the correct choice.

## Phase 1: Easy Fixes (26 instances, low risk)

These are straightforward replacements with well-known types. No behavioral changes, no risk of breakage.

### 1a. Event Listener Casts (6 instances)

**Files:** `useDrag.ts`, `useRequestContextMenu.ts`

The pattern: `addEventListener('event', handler as $FixMe)` where the handler has a known signature.

| File | Lines | Replacement |
|------|-------|-------------|
| `theatre/studio/src/uiComponents/useDrag.ts` | 343, 344, 348, 349 | `as EventListener` |
| `theatre/studio/src/uiComponents/useRequestContextMenu.ts` | 30, 32 | `as EventListener` |

### 1b. React ChangeEvent (2 instances)

**Files:** `FilePropEditor.tsx`, `ImagePropEditor.tsx`

| File | Lines | Replacement |
|------|-------|-------------|
| `theatre/studio/src/propEditors/simpleEditors/FilePropEditor.tsx` | 109 | `React.ChangeEvent<HTMLInputElement>` |
| `theatre/studio/src/propEditors/simpleEditors/ImagePropEditor.tsx` | 118 | `React.ChangeEvent<HTMLInputElement>` |

### 1c. React Refs and forwardRef Parameters (6 instances)

**Files:** `ToolbarIconButton.tsx`, `BaseMenu.tsx`

| File | Lines | Replacement |
|------|-------|-------------|
| `theatre/studio/src/toolbars/ToolbarIconButton.tsx` | 71 (props) | `React.ButtonHTMLAttributes<HTMLButtonElement> & {title?: string}` |
| `theatre/studio/src/toolbars/ToolbarIconButton.tsx` | 71 (ref) | `React.Ref<HTMLButtonElement>` |
| `theatre/studio/src/uiComponents/simpleContextMenu/ContextMenu/BaseMenu.tsx` | 46 | `React.Ref<HTMLUListElement>` |
| `theatre/studio/src/uiComponents/simpleContextMenu/ContextMenu/BaseMenu.tsx` | 49 | `React.Ref<HTMLUListElement>` |

### 1d. Window Property Access (1 instance)

**File:** `theatre/studio/src/index.ts`

| File | Lines | Replacement |
|------|-------|-------------|
| `theatre/studio/src/index.ts` | 31 | `(window as Record<string, unknown>)` |

### 1e. Simple Object/Array Types (4 instances)

| File | Lines | Replacement |
|------|-------|-------------|
| `packages/dataverse/src/prism/prism.test.ts` | 24 | `Array<unknown>` |
| `packages/dataverse-experiments/src/derivations/prism/prism.test.ts` | 21 | `Array<unknown>` |
| `theatre/core/src/propTypes/index.ts` | 119 | `Record<string, unknown>` |
| `theatre/shared/src/utils/removePathFromObject.ts` | 43 | `parent[key as string]` |

### 1f. Pointer Casts in Transactions (4 instances)

**File:** `createTransactionPrivateApi.ts`

| File | Lines | Replacement |
|------|-------|-------------|
| `theatre/studio/src/StudioStore/createTransactionPrivateApi.ts` | 87, 225 | `Pointer<unknown>` |
| `theatre/studio/src/StudioStore/createTransactionPrivateApi.ts` | 134, 244 | `SequenceTrackId \| undefined` |

## Phase 2: Medium Fixes (55 instances, moderate risk)

These require understanding the data flow to choose the right type. May need generic type parameters or utility types.

### 2a. Serializable Value Casts (8 instances)

Replace `$FixMe` with `SerializableValue` or `SerializableMap` where values flow through Theatre.js serialization.

| File | Lines | Replacement |
|------|-------|-------------|
| `Scrub.ts` | 177, 196 | `Pointer<SerializableValue>` |
| `createTransactionPrivateApi.ts` | 146, 153 | `SerializableValue` |
| `DetailCompoundPropEditor.tsx` | 189, 262, 284 | `Pointer<SerializableValue>` |
| `SheetObject.ts` | 210, 222 | `SerializableMap` (line 222 can remove double cast entirely) |

### 2b. Pointer Root Self-Reference (3 instances)

`Atom.ts` and `PointerProxy.ts` cast `this` to `$FixMe` when creating a pointer with `this` as root. This is a structural typing limitation.

| File | Lines | Replacement |
|------|-------|-------------|
| `packages/dataverse/src/Atom.ts` | 113 | Change to `$IntentionalAny` (self-reference typing limitation) |
| `packages/dataverse/src/PointerProxy.ts` | 36 | Change to `$IntentionalAny` |
| `packages/dataverse-experiments/src/Atom.ts` | 104 | Change to `$IntentionalAny` |

### 2c. updateDeep Function Signatures (9 instances across 3 files)

Three copies of `updateDeep` exist with identical `$FixMe` parameters. All should use generics.

| File | Lines | Replacement |
|------|-------|-------------|
| `packages/dataverse/src/utils/updateDeep.ts` | 13, 15, 16 | Generic `<S>(s: S, ..., reducer: (value: unknown) => unknown): S` |
| `packages/dataverse-experiments/src/utils/updateDeep.ts` | 13, 15, 16 | Same |
| `theatre/shared/src/utils/updateDeep.ts` | 23, 25, 26 | Same |

### 2d. Component Casts (2 instances)

| File | Lines | Replacement |
|------|-------|-------------|
| `renderInPortalInContext.tsx` | 63 | `React.ComponentType<Record<string, unknown>>` |
| `derive-utils.tsx` | 103 | `React.ComponentType<Record<string, unknown>>` |

### 2e. Canvas Context Cast (1 instance)

| File | Lines | Replacement |
|------|-------|-------------|
| `SequenceDataViewer.tsx` | 65 | `CanvasRenderingContext2D` |

### 2f. Redux/State Management (4 instances)

| File | Lines | Replacement |
|------|-------|-------------|
| `withHistory.ts` | 91 | Change to `$IntentionalAny` (Redux payload is intentionally untyped) |
| `withBatchActions.ts` | 18 | Change to `$IntentionalAny` or `Array<unknown>` with runtime check |
| `configureStore.ts` | 12 | `Record<string, unknown>` |

### 2g. R3F editable Props (8 instances)

`additionalProps` and `objRef` appear 4 times each in `editable.tsx`. These are user-facing props with dynamic types.

| Prop | Current | Replacement |
|------|---------|-------------|
| `additionalProps` | `$FixMe` | `Record<string, unknown>` or change to `$IntentionalAny` (user provides arbitrary Theatre.js prop configs) |
| `objRef` | `$FixMe` | `React.Ref<unknown> \| ((obj: ISheetObject) => void)` or change to `$IntentionalAny` |

### 2h. StateConflictRow Refs (2 instances)

| File | Lines | Replacement |
|------|-------|-------------|
| `StateConflictRow.tsx` | 120, 127 | Determine the code editor component type and use proper ref |

### 2i. dataverse-experiments (2 instances)

| File | Lines | Replacement |
|------|-------|-------------|
| `Atom.ts` | 131 | `path: (string \| number)[], val: unknown` |
| `EventEmitter.ts` | 5 | Generic: `type Listener<T = unknown> = (v: T) => void` |

## Phase 3: Hard Fixes (14 instances, high risk)

These involve deeply generic code where the type is determined at runtime. Many should be changed to `$IntentionalAny` rather than attempting a concrete type.

### 3a. Dynamic Prop Config Types (8 instances)

Sheet objects and compound props have types determined at runtime by the user's prop config. These cannot be statically typed without major API changes.

| File | Lines | Recommendation |
|------|-------|---------------|
| `ExtensionPaneWrapper.tsx` | 32, 138 | Change to `$IntentionalAny` |
| `layout/tree.ts` | 496 | Change to `$IntentionalAny` |
| `ObjectDetails.tsx` | 54 | Change to `$IntentionalAny` |
| `TheatreSheetObject.ts` | 141, 160 | Change to `$IntentionalAny` |
| `getPropDefaultsOfSheetObject.ts` | 55 | Change to `$IntentionalAny` |

### 3b. Complex Generic Returns (3 instances)

| File | Lines | Recommendation |
|------|-------|---------------|
| `SheetObject.ts` | 323 | Change to `$IntentionalAny` |
| `SheetObjectTemplate.ts` | 302 | Change to `$IntentionalAny` |
| `flatMap.ts` | 126 | Change to `$IntentionalAny` |

### 3c. R3F Sheet Object (1 instance)

| File | Lines | Recommendation |
|------|-------|---------------|
| `editable.tsx` | 89 | Change to `$IntentionalAny` (dynamic prop config) |

### 3d. WeakMap Key (1 instance)

| File | Lines | Recommendation |
|------|-------|---------------|
| `TheatreSheet.ts` | 205 | `object` type or change to `$IntentionalAny` |

## Implementation Strategy

### Branching

Create a feature branch `fix/remove-fixme-types` from `main`. Make one commit per phase (or per sub-phase for larger groups).

### Testing

After each phase:
```
yarn run typecheck    # must pass with zero errors
yarn run lint:all     # must pass with zero errors/warnings
yarn test             # must pass with zero failures
```

### Commit Convention

```
fix(studio): replace $FixMe with proper types for event listeners
fix(core): replace $FixMe with SerializableValue for prop casts
refactor(dataverse): add generic parameters to updateDeep
fix(r3f): replace $FixMe with $IntentionalAny for runtime-typed props
```

### Expected Outcome

After all three phases:
- 0 remaining `$FixMe` usages in code (only the type alias definitions remain, unused)
- ~26 instances replaced with proper concrete types (Phase 1)
- ~41 instances replaced with proper types or narrower types (Phase 2)
- ~14 instances changed to `$IntentionalAny` with justification (Phase 3)
- The `$FixMe` type alias can then be deprecated or removed entirely

## Risk Assessment

| Phase | Risk | Mitigation |
|-------|------|------------|
| Phase 1 | Very Low | All replacements are well-known standard types |
| Phase 2 | Low-Medium | Use `unknown` over concrete types when uncertain; test thoroughly |
| Phase 3 | Low | Most are just renaming `$FixMe` to `$IntentionalAny` with documentation |
