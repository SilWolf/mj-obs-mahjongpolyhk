import React, { useEffect, useMemo } from 'react'
import ControlPage from '@/pages/match/[id]/control/index.page'
import useObsRoom from '@/pages/v2/hooks/useObsRoom'
import CreateDefaultMatch from './CreateDefaultMatch'

export default function V2PanelObsMatchControlPage() {
  const { data: obsRoom, isFetching: isFetchingObsRoom } = useObsRoom()
  const obsPageParams = useMemo(
    () => ({
      matchId: obsRoom?.activeMatch?.id ?? (obsRoom?.matchId as string),
    }),
    [obsRoom?.activeMatch?.id, obsRoom?.matchId]
  )

  useEffect(() => {
    if (isFetchingObsRoom) {
      return
    }

    if (obsPageParams?.matchId) {
      return
    }
  }, [isFetchingObsRoom, obsPageParams?.matchId])

  if (isFetchingObsRoom) {
    return <>讀取中…</>
  }

  if (!obsPageParams?.matchId) {
    return (
      <>
        <p>創建預設對局中…</p>
        <CreateDefaultMatch />
      </>
    )
  }

  return <ControlPage params={obsPageParams} />
}
