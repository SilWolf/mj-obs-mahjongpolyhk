'use client'

import { MouseEvent, PropsWithChildren, useCallback, useEffect } from 'react'
import { CurrentTournamentIdContext } from '../hooks/useCurrentTournament'
import useAllTournaments from '../hooks/useAllTournaments'
import { useLocalStorage } from 'react-use'
import CurrentLiveMatchWidget from '../widgets/CurrentLiveMatchWidget'
import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import GlobeIcon from '@/components/icons/GlobeIcon'
import {
  useTournamentByCurrentRoute,
  useTournaments,
} from '@/resources/tournaments/hook'
import {
  Avatar,
  Button,
  ConfigProvider,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Popover,
  QRCode,
  theme,
  Typography,
} from 'antd'
import { GlobalOutlined, QrcodeOutlined } from '@ant-design/icons'

export default function V2PanelLayout({ children }: PropsWithChildren) {
  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken()

  const params = useParams<{ tournamentId: string }>()
  const { data: tournament } = useTournamentByCurrentRoute()

  const { t, i18n } = useTranslation()

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        components: {
          Layout: {
            headerPadding: '0 24px',
            headerBg: colorBgContainer,
            siderBg: colorBgContainer,
            triggerBg: colorBgContainer,
            triggerColor: colorText,
          },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Sider width="240px" collapsible>
          <div className="p-4 w-full text-lg text-center">
            {t('layout.menu.appName')}
          </div>

          <div className="px-4 py-2">
            <CurrentLiveMatchWidget />
          </div>
          <Menu
            defaultSelectedKeys={['matchups']}
            items={[
              {
                key: 'matchups',
                label: (
                  <Link to={`/admin/tournaments/${params.tournamentId}`}>
                    {t('layout.menu.matches')}
                  </Link>
                ),
              },
              {
                key: 'matchupControl',
                label: (
                  <Flex align="center">
                    <Flex flex={1}>
                      <Link to="/admin/obs/match-control">
                        {t('layout.menu.matchControl')}
                      </Link>
                    </Flex>
                    <Flex>
                      <Popover
                        content={
                          <QRCode
                            value={`${location.origin}/admin/obs/match-control`}
                          />
                        }
                      >
                        <Button type="text" icon={<QrcodeOutlined />} />
                      </Popover>
                    </Flex>
                  </Flex>
                ),
              },
              {
                key: 'obsSetup',
                label: (
                  <Link
                    to={`/admin/tournaments/${params.tournamentId}/obs-setup`}
                  >
                    {t('layout.menu.obsSetup')}
                  </Link>
                ),
              },
            ]}
          />
        </Layout.Sider>
        <Layout>
          <Layout.Header>
            <Flex justify="space-between" align="center">
              <div>
                {tournament && (
                  <Link to={`/admin/tournaments/${params.tournamentId}`}>
                    <div className="flex gap-x-2 items-center">
                      <Avatar
                        shape="square"
                        src={tournament.logoImageUrl}
                        size={32}
                      />
                      <Typography.Text style={{ marginBottom: 0 }}>
                        {tournament.name}
                      </Typography.Text>
                    </div>
                  </Link>
                )}
              </div>
              <div>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'zhTW',
                        onClick: () => i18n.changeLanguage('zhTW'),
                        label: '繁體中文',
                      },
                      {
                        key: 'zhCN',
                        onClick: () => i18n.changeLanguage('zhCN'),
                        label: '简体中文',
                      },
                      {
                        key: 'en',
                        onClick: () => i18n.changeLanguage('en'),
                        label: 'English',
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Button icon={<GlobalOutlined />} type="text" size="large" />
                </Dropdown>
              </div>
            </Flex>
          </Layout.Header>
          <Layout.Content>{children}</Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
