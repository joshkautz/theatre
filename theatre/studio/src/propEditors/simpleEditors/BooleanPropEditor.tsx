import type {PropTypeConfig_Boolean} from '@tomorrowevening/theatre-core/propTypes'
import React, {useCallback, useEffect, useRef} from 'react'
import styled from 'styled-components'
import type {ISimplePropEditorReactProps} from './ISimplePropEditorReactProps'

const Container = styled.div<{isChecked: boolean}>`
  height: 100%;
  width: 24px;
  flex-shrink: 0;
  position: relative;
  z-index: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  &:after {
    position: absolute;
    inset: 1px;
    display: block;
    content: ' ';
    background-color: transparent;
    border: 1px solid
      ${({isChecked}) => (isChecked ? 'transparent' : '#00000059')};
    z-index: -2;
    box-sizing: border-box;
    border-radius: 1px;
  }

  &:hover {
    &:after {
      background-color: #10101042;
      border-color: #00000059;
    }
  }
`

const FillIndicator = styled.div<{isChecked: boolean}>`
  position: absolute;
  inset: 3px;
  transform: scale(${({isChecked}) => (isChecked ? 1 : 0)});
  transform-origin: center;
  background-color: #2d5561;
  z-index: -1;
  border-radius: 2px;
  pointer-events: none;
  transition: transform 0.1s ease-out;

  ${Container}:hover & {
    background-color: #338198;
  }
`

const Input = styled.input.attrs({type: 'checkbox'})`
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
  background: transparent;
  border: 1px solid transparent;
  outline: none;
  cursor: pointer;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  position: relative;

  &:checked::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 12px;
    left: 50%;
    top: 50%;
    margin-left: -4px;
    margin-top: -9px;
    border: solid rgba(255, 255, 255, 0.9);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`

function BooleanPropEditor({
  editingTools,
  value,
}: ISimplePropEditorReactProps<PropTypeConfig_Boolean>) {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked
      // Create a scrub so the change is undoable via Ctrl+Z.
      // permanentlySetValue alone uses a transaction which is not undoable.
      editingTools.temporarilySetValue(newValue)
      editingTools.permanentlySetValue(newValue)
      // Blur so the checkbox doesn't capture Ctrl+Z (the browser's native
      // input undo) — let it propagate to Theatre.js's undo handler instead.
      e.target.blur()
    },
    [editingTools],
  )

  const containerRef = useRef<HTMLDivElement>(null)

  // Use a native mousedown listener to stop the event before it reaches
  // the parent row's useDrag handler (which also uses a native listener).
  // React synthetic events fire too late to prevent this.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: MouseEvent) => {
      e.stopPropagation()
    }
    el.addEventListener('mousedown', handler)
    return () => el.removeEventListener('mousedown', handler)
  }, [])

  return (
    <Container
      ref={containerRef}
      isChecked={value}
      className={value ? 'checked' : ''}
    >
      <Input checked={value} onChange={onChange} />
      <FillIndicator isChecked={value} />
    </Container>
  )
}

export default BooleanPropEditor
