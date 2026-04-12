import useRealtimeMatches from '@/hooks/useRealtimeMatches'
import { RealtimePlayer } from '@/models'
import { renderDate } from '@/utils/string.util'
import { EyeOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Alert, Avatar, Button, Flex, Table, Typography } from 'antd'
import { Link } from 'react-router'

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

export default function TournamentEndedMatchups() {
  const { rtMatches } = useRealtimeMatches()

  return (
    <div className="mx-6 my-6 space-y-6">
      <div>
        <Alert
          type="info"
          title="以下對局記錄會隨時刪除，如有必要，請盡快上傳成績"
        />
      </div>
      <div>
        <Table
          dataSource={rtMatches}
          columns={[
            {
              title: '時間',
              dataIndex: 'createdAt',
              render: renderDate,
            },
            {
              title: '東家',
              dataIndex: ['players', 0],
              render: renderMatchupPlayer,
            },
            {
              title: '南家',
              dataIndex: ['players', 1],
              render: renderMatchupPlayer,
            },
            {
              title: '西家',
              dataIndex: ['players', 2],
              render: renderMatchupPlayer,
            },
            {
              title: '北家',
              dataIndex: ['players', 3],
              render: renderMatchupPlayer,
            },
            {
              title: '總局數',
              dataIndex: ['rounds', 'length'],
              width: 80,
            },
            {
              title: '操作',
              dataIndex: ['database', '_id'],
              width: '240px',
              render: (id) => {
                return (
                  <Flex wrap="wrap" gap={4}>
                    <Link to={`./matchups/${id}/start-obs`}>
                      <Button
                        size="small"
                        variant="outlined"
                        icon={<EyeOutlined />}
                      >
                        查看
                      </Button>
                    </Link>
                  </Flex>
                )
              },
            },
          ]}
        ></Table>
      </div>
    </div>
  )
}
