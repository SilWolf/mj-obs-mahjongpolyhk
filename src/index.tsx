import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { Redirect, Route, Switch } from 'wouter'
import './index.css'
import FirebaseDatabaseProvider from './providers/firebaseDatabase.provider'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast, ToastContainer } from 'react-toastify'

import ConfirmDialogProvider from './components/ConfirmDialog/provider'

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
          <Switch>
            {/* Pages for v2 site */}
            <Route path="/panel" nest>
              <V2PanelLayout>
                <Route path="/" component={V2PanelPage} />

                <Route
                  path="/matches/createFromCache"
                  component={V2PanelMatchCreateFromCachePage}
                />

                <Route
                  path="/matches/:matchId/edit"
                  component={V2PanelMatchesByIdEditPage}
                />

                <Route
                  path="/matches/:matchId/nameplate"
                  component={V2PanelMatchesByIdNameplatePage}
                />

                <Route
                  path="/obs/match-control"
                  component={V2PanelObsMatchControlPage}
                />
                <Route
                  path="/obs/scene-control"
                  component={V2PanelObsSceneControlPage}
                />
                <Route path="/realtime" nest>
                  <Route
                    path="/matches"
                    component={V2PanelRealtimeMatchesPage}
                  />
                  <Route path="/matches/:matchId" nest>
                    <Route
                      path="/detail"
                      component={V2PanelRealtimeMatchDetailPage}
                    />
                  </Route>
                </Route>
              </V2PanelLayout>
            </Route>

            <Route path="/obs/scene" nest>
              <Route path="/master" component={V2ObsSceneMasterPage} />
            </Route>

            <Route>
              <Redirect to="/panel" />
            </Route>
          </Switch>
        </ConfirmDialogProvider>
      </FirebaseDatabaseProvider>
    </QueryClientProvider>
    <ToastContainer />
  </React.StrictMode>
)
