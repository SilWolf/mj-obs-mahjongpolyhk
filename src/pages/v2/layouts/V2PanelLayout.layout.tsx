'use client'

import { MouseEvent, PropsWithChildren, useCallback, useEffect } from 'react'
import { CurrentTournamentIdContext } from '../hooks/useCurrentTournament'
import useAllTournaments from '../hooks/useAllTournaments'
import { useLocalStorage } from 'react-use'
import CurrentLiveMatchWidget from '../widgets/CurrentLiveMatchWidget'
import { Link } from 'wouter'
import { useTranslation } from 'react-i18next'
import GlobeIcon from '@/components/icons/GlobeIcon'

export default function V2PanelLayout({ children }: PropsWithChildren) {
  const { data: allTournaments = [] } = useAllTournaments()
  const [currentTournamentId, setCurrentTournamentId] = useLocalStorage(
    'v2-current-tournament-id',
    ''
  )

  const { t, i18n } = useTranslation()

  const handleClickChangeLanguage = useCallback(
    (e: MouseEvent) => {
      i18n.changeLanguage(
        e.currentTarget.getAttribute('data-language') as string
      )
    },
    [i18n]
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
          <div className="navbar bg-base-100 w-full border-b-1 border-base-300 print:hidden">
            <div>
              {/* Page content here */}
              <label
                htmlFor="layout-drawer"
                className="btn btn-ghost rounded-full text-lg drawer-button lg:hidden"
              >
                <i className="bi bi-list"></i>
              </label>
            </div>

            <div className="mx-2 flex-1 px-2 flex gap-x-2 items-center">
              {/* <div className="flex gap-x-2 items-center">
                <img
                  src={currentTournament?.image.logo?.default.url}
                  className="w-8 h-8"
                />
                <span>{currentTournament?.name}</span>
              </div>
              <div>
                {allTournaments.length > 1 && (
                  <button
                    onClick={() => openDialog('tournament-selector-dialog')}
                    className="btn btn-xs btn-ghost text-primary"
                  >
                    切換
                  </button>
                )}
              </div> */}
            </div>

            <div>
              <button
                className="btn btn-ghost text-lg"
                popoverTarget="i18n-dropdown"
                style={
                  {
                    anchorName: '--anchor-i18n-dropdown',
                  } as React.CSSProperties
                }
              >
                <GlobeIcon />
              </button>

              <ul
                className="dropdown dropdown-end menu rounded-box bg-base-100 shadow-sm"
                popover="auto"
                id="i18n-dropdown"
                style={
                  {
                    positionAnchor: '--anchor-i18n-dropdown',
                  } as React.CSSProperties
                }
              >
                <li>
                  <button
                    className="btn btn-ghost"
                    onClick={handleClickChangeLanguage}
                    data-language="zhTW"
                  >
                    繁體中文
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-ghost"
                    onClick={handleClickChangeLanguage}
                    data-language="zhCN"
                  >
                    简体中文
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-ghost"
                    onClick={handleClickChangeLanguage}
                    data-language="en"
                  >
                    English
                  </button>
                </li>
              </ul>
            </div>
          </div>
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
            <div className="p-4 w-full text-lg text-center">
              {t('layout.menu.appName')}
            </div>

            <h5 className="text-sm font-bold px-4">
              {t('layout.menu.obsControl')}
            </h5>

            <div className="px-4 py-2">
              <CurrentLiveMatchWidget />
            </div>

            <ul className="menu bg-base-100 text-base-content min-h-full p-4 w-full">
              {/* Sidebar content here */}
              <li>
                <Link href="~/panel">{t('layout.menu.matches')}</Link>
              </li>
              <li>
                <Link href="/obs/match-control">
                  {t('layout.menu.matchControl')}
                </Link>
              </li>
              <li>
                <Link href="/obs/setup">{t('layout.menu.obsSetup')}</Link>
              </li>
              {/* <li>
                <Link href="/obs/scene-control">多合一場景控制台</Link>
              </li> */}
            </ul>

            <div className="divider"></div>

            <h5 className="text-sm font-bold px-4">
              {t('layout.menu.obsTempDB')}
            </h5>

            <ul className="menu bg-base-100 text-base-content min-h-full p-4 w-full">
              <li>
                <Link href="/realtime/matches">
                  {t('layout.menu.completedMatches')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </CurrentTournamentIdContext.Provider>
  )
}
