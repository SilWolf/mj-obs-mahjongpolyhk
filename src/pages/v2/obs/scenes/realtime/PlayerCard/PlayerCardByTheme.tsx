import { lazy } from 'react'
import { PlayerCardBaseProps } from './type'

const PlayerCardOfDefaultTheme = lazy(
  () => import('../byTheme/default/components/PlayerCard')
)
const PlayerCardOfSakuraTheme = lazy(
  () => import('../byTheme/sakura/components/PlayerCard')
)
const PlayerCardOfGuoShiWuShuangTheme = lazy(
  () => import('../byTheme/GuoShiWuShuang/components/PlayerCard')
)

type Props = PlayerCardBaseProps & {
  themeId: string
}

export default function PlayerCardByTheme({ themeId, ...otherProps }: Props) {
  switch (themeId) {
    case 'sakura': {
      return <PlayerCardOfSakuraTheme {...otherProps} />
    }
    case 'GuoShiWuShuang': {
      return <PlayerCardOfGuoShiWuShuangTheme {...otherProps} />
    }
  }

  return <PlayerCardOfDefaultTheme {...otherProps} />
}
