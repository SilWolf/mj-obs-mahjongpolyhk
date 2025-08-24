import Sketch from '@uiw/react-color-sketch'
import { ColorResult } from '@uiw/color-convert'
import { useCallback } from 'react'

type InputColorProps = {
  value: string
  onChange?: (newColor: string) => void
  onBlur?: () => void
}

const presetColors = [
  {
    color: '#4269F5',
  },
  {
    color: '#E01616',
  },
  {
    color: '#078700',
  },
  {
    color: '#F19F00',
  },
]

function InputColor({ value, onChange, onBlur }: InputColorProps) {
  const handleChange = useCallback(
    (newColorResult: ColorResult) => {
      onChange?.(newColorResult.hex)
    },
    [onChange]
  )

  return (
    <Sketch
      disableAlpha
      onChange={handleChange}
      onBlur={onBlur}
      color={value}
      presetColors={presetColors}
    />
  )
}

export default InputColor
