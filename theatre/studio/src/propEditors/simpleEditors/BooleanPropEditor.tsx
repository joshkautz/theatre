import type {PropTypeConfig_Boolean} from '@tomorrowevening/theatre-core/propTypes'
import React, {useCallback} from 'react'
import styled from 'styled-components'
import type {ISimplePropEditorReactProps} from './ISimplePropEditorReactProps'

const Container = styled.div<{isChecked: boolean}>`
  height: 28px;
  width: 28px;
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
    margin-left: -3px;
    margin-top: -8px;
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
      editingTools.permanentlySetValue(e.target.checked)
    },
    [editingTools],
  )

  const stopPropagation = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <Container
      isChecked={value}
      className={value ? 'checked' : ''}
      onPointerDown={stopPropagation}
      onMouseDown={stopPropagation}
      onDragStart={stopPropagation}
    >
      <Input checked={value} onChange={onChange} />
      <FillIndicator isChecked={value} />
    </Container>
  )
}

export default BooleanPropEditor
