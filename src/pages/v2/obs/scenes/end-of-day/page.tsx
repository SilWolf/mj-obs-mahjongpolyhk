import { lazy } from 'react'

const PageOfDefaultTheme = lazy(() => import('./byTheme/default/page'))

type Props = {
  themeId?: string | null
}

export default function V2ObsSceneOfIntroductionForMatch({
  themeId = 'default',
}: Props) {
  return <PageOfDefaultTheme />
}
