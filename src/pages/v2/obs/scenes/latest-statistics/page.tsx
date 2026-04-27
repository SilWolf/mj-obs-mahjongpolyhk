import { lazy } from 'react'

const PageOfDefaultTheme = lazy(() => import('./byTheme/default/page'))

type Props = {
  themeId?: string | null
  params: { tournamentId: string }
  forwardFlag?: number
  resetFlag?: number
  auto?: boolean
  minute?: number
  refetchFlag?: number
}

export default function V2ObsSceneOfLatestStatistics({
  themeId = 'default',
  ...otherProps
}: Props) {
  return <PageOfDefaultTheme {...otherProps} />
}
