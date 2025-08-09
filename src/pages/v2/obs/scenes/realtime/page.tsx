import { lazy } from 'react'

const PageOfDefaultTheme = lazy(() => import('./byTheme/default/page'))
const PageOfSakuraTheme = lazy(() => import('./byTheme/sakura/page'))
const PageOfGuoShiWuShuangTheme = lazy(
  () => import('./byTheme/GuoShiWuShuang/page')
)

type Props = {
  themeId?: string | null
  params: { matchId: string }
}

export default function V2ObsSceneOfIntroductionForMatch({
  themeId = 'default',
  ...otherProps
}: Props) {
  switch (themeId) {
    case 'sakura': {
      return <PageOfSakuraTheme {...otherProps} />
    }
    case 'GuoShiWuShuang': {
      return <PageOfGuoShiWuShuangTheme {...otherProps} />
    }
  }

  return <PageOfDefaultTheme {...otherProps} />
}
