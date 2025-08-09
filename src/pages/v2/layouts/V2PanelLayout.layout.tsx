'use client'

import { PropsWithChildren, useEffect } from 'react'
import { CurrentTournamentIdContext } from '../hooks/useCurrentTournament'
import useAllTournaments from '../hooks/useAllTournaments'
import { useLocalStorage } from 'react-use'
import CurrentLiveMatchWidget from '../widgets/CurrentLiveMatchWidget'
import { Link } from 'wouter'

export default function V2PanelLayout({ children }: PropsWithChildren) {
  const { data: allTournaments = [] } = useAllTournaments()
  const [currentTournamentId, setCurrentTournamentId] = useLocalStorage(
    'v2-current-tournament-id',
    ''
  )

  useEffect(() => {
    if (!currentTournamentId && allTournaments[0]) {
      setCurrentTournamentId(allTournaments[0].id)
    }
  }, [allTournaments, currentTournamentId, setCurrentTournamentId])

  return (
    <CurrentTournamentIdContext.Provider value={currentTournamentId!}>
      <div className="drawer lg:drawer-open">
        <input id="layout-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <main>{children}</main>
        </div>
        <div className="drawer-side  border-r-1 bg-base-100 border-base-300">
          <div className="w-60 p-2">
            <label
              htmlFor="layout-drawer"
              className="btn btn-ghost rounded-full text-lg drawer-button lg:hidden"
            >
              <i className="bi bi-list"></i>
            </label>
            <div className="p-4 w-full text-lg text-center">日麻直播系統</div>

            <h5 className="text-sm font-bold px-4">OBS 控制</h5>

            <div className="px-4 py-2">
              <CurrentLiveMatchWidget />
            </div>

            <ul className="menu bg-base-100 text-base-content min-h-full p-4 w-full">
              {/* Sidebar content here */}
              <li>
                <Link href="/obs/match-control">分數控制台</Link>
              </li>
              <li>
                <Link href="/obs/setup">設置 OBS</Link>
              </li>
              {/* <li>
                <Link href="/obs/scene-control">多合一場景控制台</Link>
              </li> */}
            </ul>

            <div className="divider"></div>

            <h5 className="text-sm font-bold px-4">暫存資料庫</h5>

            <ul className="menu bg-base-100 text-base-content min-h-full p-4 w-full">
              <li>
                <Link href="/realtime/matches">已結束賽事</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </CurrentTournamentIdContext.Provider>
  )
}
