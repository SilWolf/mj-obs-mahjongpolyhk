import { lazy } from 'react'
import { PlayerCardBaseProps } from './type'

const PlayerCardOfDefaultTheme = lazy(
  () => import('../byTheme/default/components/PlayerCard')
)

type Props = PlayerCardBaseProps & {
  themeId: string
}

export default function PlayerCardByTheme({ themeId, ...otherProps }: Props) {
  return <PlayerCardOfDefaultTheme {...otherProps} />
}
