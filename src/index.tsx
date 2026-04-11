import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router'

import './index.css'
import FirebaseDatabaseProvider from './providers/firebaseDatabase.provider'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast, ToastContainer } from 'react-toastify'

import ConfirmDialogProvider from './components/ConfirmDialog/provider'

import './i18n'
import V3AdminPage from './pages/v3/admin'
import { Result } from 'antd'
import MatchStartObsPage from './pages/v3/admin/tournaments/[tournamentId]/matches/[matchId]/start-obs'

const V2PanelLayout = lazy(
  () => import('./pages/v2/layouts/V2PanelLayout.layout')
)
const V2PanelPage = lazy(() => import('./pages/v2/panel/page'))
const V2PanelMatchesByIdEditPage = lazy(
  () => import('./pages/v2/panel/matches/[matchId]/edit/page')
)
const V2PanelMatchesByIdNameplatePage = lazy(
  () => import('./pages/v2/panel/matches/[matchId]/nameplate/page')
)
const V2PanelMatchCreateFromCachePage = lazy(
  () => import('./pages/v2/panel/matches/createFromCache/page')
)

const V2PanelObsSetupPage = lazy(
  () => import('./pages/v2/panel/wiki/setup-obs/page')
)

const V2PanelObsMatchControlPage = lazy(
  () => import('./pages/v2/panel/obs/match-control/page')
)
const V2PanelObsSceneControlPage = lazy(
  () => import('./pages/v2/panel/obs/scene-control/page')
)

const V2PanelRealtimeMatchesPage = lazy(
  () => import('./pages/v2/panel/realtime/matches/page')
)

const V2PanelRealtimeMatchDetailPage = lazy(
  () => import('./pages/v2/panel/realtime/matches/:matchId/detail/page')
)

const V2PanelDraftMatchesCreatePage = lazy(
  () => import('./pages/v2/panel/draft-matches/create/page')
)

const V2PanelDraftMatchesImportFromDatabasePage = lazy(
  () =>
    import('./pages/v2/panel/draft-matches/import-from-database/[matchId]/page')
)

const V2PanelDraftMatchEditPage = lazy(
  () => import('./pages/v2/panel/draft-matches/[matchId]/edit/page')
)

const V2PanelDraftMatchCopyPage = lazy(
  () => import('./pages/v2/panel/draft-matches/[matchId]/copy/page')
)

const V2PanelDraftMatchStartPage = lazy(
  () => import('./pages/v2/panel/draft-matches/[matchId]/start/page')
)

const V2PanelDraftMatchNameplatePage = lazy(
  () => import('./pages/v2/panel/draft-matches/[matchId]/nameplate/page')
)

const V2ObsSceneMasterPage = lazy(
  () => import('./pages/v2/obs/scenes/master/page')
)

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      staleTime: Infinity,
      throwOnError(error) {
        toast.error((error as Error)?.message ?? '未知錯誤')
        return false
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <FirebaseDatabaseProvider>
        <ConfirmDialogProvider>
          <BrowserRouter>
            <Routes>
              {/* Pages for v2 site */}
              <Route path="/admin">
                <Route index element={<V3AdminPage />} />

                <Route
                  path="tournaments/:tournamentId"
                  element={
                    <V2PanelLayout>
                      <Outlet />
                    </V2PanelLayout>
                  }
                >
                  <Route index element={<V2PanelPage />} />

                  <Route path="matchups">
                    <Route path=":matchupId">
                      <Route
                        path="edit"
                        element={<V2PanelMatchesByIdEditPage />}
                      />

                      <Route path="start-obs" element={<MatchStartObsPage />} />
                    </Route>

                    <Route
                      path="createFromCache"
                      element={<V2PanelMatchCreateFromCachePage />}
                    />
                  </Route>
                </Route>

                <Route
                  path="tournaments/:tournamentId/matchups/:matchupId/nameplates"
                  element={<V2PanelMatchesByIdNameplatePage />}
                />

                <Route path="obs">
                  <Route
                    path="match-control"
                    element={<V2PanelObsMatchControlPage />}
                  />
                  <Route
                    path="scene-control"
                    element={<V2PanelObsSceneControlPage />}
                  />
                  <Route path="setup" element={<V2PanelObsSetupPage />} />
                </Route>
              </Route>

              <Route path="/public">
                <Route path="obs/scene">
                  <Route path="master" element={<V2ObsSceneMasterPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/admin" />} />
            </Routes>
          </BrowserRouter>
        </ConfirmDialogProvider>
      </FirebaseDatabaseProvider>
    </QueryClientProvider>
    <ToastContainer />
  </React.StrictMode>
)
