import MJMatchHistoryTable from '@/components/MJMatchHistoryTable'
import { convertMatchToExportedMatch } from '@/helpers/mahjong.helper'
import useRealtimeMatch from '@/hooks/useRealtimeMatch'
import useRealtimeMatches from '@/hooks/useRealtimeMatches'
import { RealtimePlayer } from '@/models'
import { useMatchup, useMatchupByCurrentRoute } from '@/resources/matchups/hook'
import { renderDate } from '@/utils/string.util'
import {
  CheckOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  VideoCameraOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import {
  Alert,
  App,
  Avatar,
  Button,
  Card,
  Descriptions,
  Flex,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd'
import { useCallback, useMemo } from 'react'
import { Link, useParams } from 'react-router'

const renderMatchupPlayer = (player: RealtimePlayer) => {
  if (!player) {
    return (
      <Typography.Text disabled italic>
        [空]
      </Typography.Text>
    )
  }

  return (
    <div className="flex gap-1 items-center">
      <Avatar
        shape="square"
        size={32}
        src={player.logoUrl}
        style={{ backgroundColor: player.color }}
      />
      <Avatar
        shape="square"
        size={32}
        src={player.propicUrl}
        style={{ backgroundColor: player.color }}
      />
      <div>
        <p className="font-bold">{player.primaryName}</p>
        <p className="text-sm">{player.secondaryName}</p>
        <p className="text-xs">{player.nickname}</p>
      </div>
    </div>
  )
}

export default function TournamentEndedMatchupById() {
  const { modal, notification } = App.useApp()

  const params = useParams<{ endedMatchupId: string }>()
  const { rtMatch, rtMatchRounds } = useRealtimeMatch(params.endedMatchupId)
  const {
    data: dbMatchup,
    isLoading: isLoadingDbMatchup,
    refetch: refetchDBMatchup,
  } = useMatchup({
    matchupId: rtMatch?.database._id!,
  })

  const syncStatus = useMemo(() => {
    if (!dbMatchup) {
      return 'notfound'
    }
    if (
      typeof dbMatchup.roundsCount === 'undefined' ||
      !dbMatchup.roundsCount
    ) {
      return 'notsynced'
    }

    return 'synced'
  }, [dbMatchup])

  const handleClickUploadResult = useCallback(() => {
    if (!rtMatch || !rtMatchRounds) {
      return
    }

    modal.confirm({
      title: '確定上傳成績？',
      content: '請確定成績正確再上傳。如果你要做賽後報告，請在報告之後再上傳。',
      onOk: async () => {
        const exportedMatch = {
          _id: rtMatch.database._id,
          ...convertMatchToExportedMatch(Object.values(rtMatchRounds)),
        }

        try {
          await fetch(import.meta.env.VITE_UPLOAD_RESULT_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(exportedMatch),
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          })
        } catch (e: any) {
          notification.error({ title: e.message })
          return false
        }

        notification.success({ title: '上傳完畢，請在資料庫上查看。' })
        refetchDBMatchup()
        return true
      },
    })
  }, [rtMatch, rtMatchRounds])

  if (!rtMatch) {
    return <Spin />
  }

  return (
    <div className="m-6">
      <Space vertical>
        <Card title="對局資訊">
          <Descriptions
            items={[
              {
                label: '對局名稱',
                children: rtMatch.name,
              },
              {
                label: '創建時間',
                children: renderDate(rtMatch.createdAt),
              },
              {
                label: '局數',
                children: Object.values(rtMatchRounds ?? {}).length,
              },
              {
                label: '東家',
                children: renderMatchupPlayer(rtMatch.players[0]),
              },
              {
                label: '南家',
                children: renderMatchupPlayer(rtMatch.players[1]),
              },
              {
                label: '西家',
                children: renderMatchupPlayer(rtMatch.players[2]),
              },
              {
                label: '北家',
                children: renderMatchupPlayer(rtMatch.players[3]),
              },
              ...(rtMatch.database._id
                ? [
                    {
                      label: '資料庫 ID',
                      children: rtMatch.database._id,
                      span: 2,
                    },
                    {
                      label: '對局結果同步狀況',
                      children: (
                        <Spin spinning={isLoadingDbMatchup}>
                          {syncStatus === 'notfound' ? (
                            <Tag
                              color="red"
                              variant="outlined"
                              icon={<QuestionCircleOutlined />}
                            >
                              找不到對局
                            </Tag>
                          ) : syncStatus === 'notsynced' ? (
                            <Tag
                              color="warning"
                              variant="outlined"
                              icon={<WarningOutlined />}
                            >
                              未上傳成績
                            </Tag>
                          ) : (
                            <Tag
                              color="success"
                              variant="outlined"
                              icon={<CheckOutlined />}
                            >
                              已上傳成績
                            </Tag>
                          )}
                          {}
                        </Spin>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </Card>

        <Card
          title="對局結果"
          extra={[
            <Button
              disabled={syncStatus === 'notfound'}
              type={syncStatus === 'synced' ? 'default' : 'primary'}
              onClick={handleClickUploadResult}
              icon={<UploadOutlined />}
            >
              上傳成績
            </Button>,
          ]}
        >
          <MJMatchHistoryTable
            players={rtMatch.players}
            matchRounds={rtMatchRounds}
            className="w-full table-auto"
          />
        </Card>
      </Space>
    </div>
  )
}
