# $IntentionalAny Cleanup Plan

## Overview

The Theatre.js codebase has 409 `$IntentionalAny` usages across 7 packages. This plan categorizes each into CAN_FIX (proper type exists), CAN_NARROW (can use `unknown` or narrower type), or TRULY_INTENTIONAL (TypeScript can't express the pattern).

## Summary

| Category | Count | Percentage |
|----------|-------|-----------|
| CAN_FIX | ~96 | 23% |
| CAN_NARROW | ~88 | 22% |
| TRULY_INTENTIONAL | ~100 | 24% |
| Imports/Definitions | ~125 | 31% |

After cleanup:
- ~96 instances get proper concrete types
- ~88 instances narrow from `any` to `unknown` or more specific types
- ~100 instances remain as `$IntentionalAny` with documented justification
- ~125 import statements update to match

## Top Priority Fixes (Low Risk, High Impact)

### 1. Unnecessary Double Casts (~20 instances)
Pattern: `as $IntentionalAny as TargetType` where single cast works.

Files: `prism.ts`, `Atom.ts`, `Sequence.ts`, `SheetObject.ts`, `configureStore.ts`, `tree.ts`, `css.tsx`

Fix: Remove intermediate `$IntentionalAny` cast, keep only the target type cast.

### 2. React Ref Casts (~15 instances)
Pattern: `ref={someRef as $IntentionalAny}` where the element type is known.

Files: `Playhead.tsx`, `FocusRangeZone.tsx`, `FocusRangeThumb.tsx`, `FocusRangeStrip.tsx`, `BasicPopover.tsx`, `MoreMenu.tsx`, `ExtensionFlyoutMenu.tsx`, `GlobalToolbar.tsx`, `StateConflictRow.tsx`

Fix: `ref={someRef as React.RefObject<HTMLDivElement>}` (or appropriate element type)

### 3. `useRefAndState(null as $IntentionalAny)` (~5 instances)
Pattern: Initial value for ref hook cast to any.

Files: `DopesheetSplitter.tsx`, `PanelResizeHandle.tsx`, `PanelDragZone.tsx`, `UIRoot.tsx`

Fix: `useRefAndState<HTMLDivElement>(null)` — if the hook accepts null, remove cast entirely.

### 4. `createContext(null as $IntentionalAny)` (~4 instances)
Pattern: React context initialized with null cast to any.

Files: `PointerEventsHandler.tsx`, `BasePanel.tsx`, `FrameStampPositionProvider.tsx`, `PointerCapturing.tsx`

Fix: Type the context properly with `| null` union and handle null at consumption.

### 5. Empty Object Initialization (~5 instances)
Pattern: `const obj: $IntentionalAny = {}`

Files: `derive-utils.tsx`, `createTransactionPrivateApi.ts`, `minimalOverride.ts`

Fix: `Record<string, unknown>` or `Partial<T>`

### 6. `isPointer(p: $IntentionalAny)` (~2 instances)
Pattern: Type guard accepts any.

Files: `pointer.ts`, `dataverse-experiments/Atom.ts`

Fix: `isPointer(p: unknown)` — type guards should accept `unknown`.

### 7. Nominal Type Casts (~8 instances)
Pattern: `someId as $IntentionalAny` where it should cast to the nominal type directly.

Files: `SubSequenceRow.tsx`, `Sequence.ts`

Fix: `someId as SheetId` or `someId as SequenceSubSequenceId` directly.

## Medium Priority (CAN_NARROW)

### 8. Generic Constraints `extends $IntentionalAny` (~15 instances)
Pattern: `<T extends $IntentionalAny>` in generic type parameters.

Files: `actionCreator.ts`, `pointerFriendlySelector.ts`, `subPrism.ts`, `minimalOverride.ts`

Fix: `<T extends unknown>` or just `<T>` (unconstrained generic).

### 9. `Pointer<$IntentionalAny>` and `Prism<$IntentionalAny>` (~25 instances)
Pattern: Generic parameter for pointers/prisms set to any.

Fix: Use `Pointer<unknown>` or `Prism<unknown>` where the value type is irrelevant.

Note: Some of these are TRULY_INTENTIONAL where the dependency system needs covariant `any` — document those.

### 10. `PropTypeConfig_Compound<$IntentionalAny>` (~8 instances)
Pattern: Compound prop config with unknown nested structure.

Files: `tree.ts`, `createTransactionPrivateApi.ts`, `getPropDefaultsOfSheetObject.ts`, `forEachDeep.ts`

Fix: `PropTypeConfig_Compound<Record<string, PropTypeConfig>>` or keep as `$IntentionalAny` with documentation.

### 11. Redux Action Payloads (~6 instances)
Files: `actionReducersBundle.ts`, `actionCreator.ts`, `withHistory.ts`, `withBatchActions.ts`

Fix: Extract proper payload types from reducer signatures. Some may remain `unknown`.

### 12. `deps: $IntentionalAny[]` (~6 instances)
Pattern: Dependency arrays in prism functions.

Files: `prism.ts`, `subPrism.ts`

Fix: `deps: unknown[]` or `deps: ReadonlyArray<unknown>`

## Low Priority / TRULY_INTENTIONAL

### 13. Phantom Types (`valueType: null as $IntentionalAny`) (~5 instances)
Pattern: Phantom type fields used only for TypeScript type inference.

Files: `propTypes/index.ts`

Status: TRULY_INTENTIONAL — phantom types require `any` for the null assertion pattern.

### 14. `pointerToPrism` Return Casts (~10 instances)
Pattern: `as $IntentionalAny as Prism<V>` in pointerToPrism implementations.

Files: `Sequence.ts`, `SheetObject.ts`

Status: TRULY_INTENTIONAL — TypeScript cannot verify the relationship between pointer path and return type at compile time (would require dependent types).

### 15. Reactive System Dependencies (~20 instances)
Pattern: `Set<Prism<$IntentionalAny>>`, `IDependent = (msg: Prism<$IntentionalAny>) => void`

Files: `prism.ts`, `discoveryMechanism.ts`, `AbstractDerivation.ts`

Status: TRULY_INTENTIONAL — the dependency tracking system must handle prisms of heterogeneous value types in a single collection. TypeScript's variance system cannot express this without `any`.

### 16. Conditional Type Extraction (`infer` with `$IntentionalAny`) (~3 instances)
Pattern: `PropConfig extends IBasePropType<$IntentionalAny, $IntentionalAny, infer T>`

Files: `propTypes/utils.ts`

Status: TRULY_INTENTIONAL — TypeScript's `infer` keyword requires concrete types for the non-inferred parameters. `any` is the only way to express "match any type here."

### 17. Test Utilities (`_any: $IntentionalAny = null`) (~3 instances)
Files: `typeTestUtils.ts`, `pointer.typeTest.ts`

Status: TRULY_INTENTIONAL — test utilities that intentionally provide `any`-typed values for type testing.

### 18. `UnindexablePointer` Mapped Type (~2 instances)
Pattern: `[K in $IntentionalAny]: Pointer<undefined>`

Files: `pointer.ts`

Status: TRULY_INTENTIONAL — this creates a catch-all index signature for types that can't be indexed. TypeScript requires `any` for this mapped type pattern.

## Implementation Strategy

### Phase 1: Zero-Risk Quick Wins
- Remove unnecessary double casts (item 1)
- Fix React ref casts (item 2)
- Fix useRefAndState initialization (item 3)
- Fix createContext initialization (item 4)
- Fix isPointer parameter types (item 6)
- Fix nominal type casts (item 7)

Estimated: ~55 instances, very low risk

### Phase 2: Narrowing to `unknown`
- Generic constraints (item 8)
- Pointer/Prism generics (item 9)
- Dependency arrays (item 12)
- Empty object initialization (item 5)

Estimated: ~55 instances, low risk

### Phase 3: Structural Typing Improvements
- PropTypeConfig generics (item 10)
- Redux action types (item 11)
- Component and render types

Estimated: ~30 instances, moderate risk

### Phase 4: Document Remaining
- Add JSDoc to all TRULY_INTENTIONAL usages explaining why
- Consider creating a lint rule that flags new `$IntentionalAny` without justification

Estimated: ~100 instances documented

## Verification

After each phase:
```
yarn run typecheck    # zero errors
yarn run lint:all     # zero errors
yarn test             # 228 passed
```
