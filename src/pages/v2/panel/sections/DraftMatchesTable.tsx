import useDraftMatches from '@/hooks/useDraftMatches'
import { Link, useParams } from 'react-router'
import { RealtimePlayer } from '@/models'
import { Avatar, Button, Table, Typography } from 'antd'
import { useMatchups } from '@/resources/matchups/hook'
import { IMatchupPlayer } from '@/resources/matchups/entity'
import { VideoCameraOutlined } from '@ant-design/icons'

const renderMatchupPlayer = (player: IMatchupPlayer) => {
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
        src={player.logoImageUrl}
        style={{ backgroundColor: player.color }}
      />
      <Avatar
        shape="square"
        size={32}
        src={player.portraitImageUrl}
        style={{ backgroundColor: player.color }}
      />
      <div>
        <p className="font-bold">{player.name}</p>
        <p className="text-sm">{player.secondaryName}</p>
        <p className="text-xs">{player.thirdName}</p>
      </div>
    </div>
  )
}

export default function DraftMatchesTable() {
  const params = useParams<{ tournamentId: string }>()
  const { data: matchups, isLoading } = useMatchups({
    tournamentId: params.tournamentId!,
  })

  console.log(matchups)

  return (
    <>
      <Table
        loading={isLoading}
        dataSource={matchups}
        columns={[
          {
            title: '對局',
            dataIndex: 'name',
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
            title: '操作',
            dataIndex: ['database', '_id'],
            render: (id) => {
              return (
                <>
                  <Button
                    size="small"
                    variant="outlined"
                    color="green"
                    icon={<VideoCameraOutlined />}
                  >
                    進行直播
                  </Button>
                </>
              )
            },
          },
        ]}
      ></Table>
    </>
  )
}
