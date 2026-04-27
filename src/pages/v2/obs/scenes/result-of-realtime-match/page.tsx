import { lazy } from 'react'

const PageOfDefaultTheme = lazy(() => import('./byTheme/default/page'))

type Props = {
  themeId?: string | null
  params: { matchId: string }
  forwardFlag?: number
  resetFlag?: number
  disableClick?: boolean
}

export default function V2ObsSceneOfResultForRealtimeMatch({
  themeId = 'default',
  ...otherProps
}: Props) {
  return <PageOfDefaultTheme {...otherProps} />
}
