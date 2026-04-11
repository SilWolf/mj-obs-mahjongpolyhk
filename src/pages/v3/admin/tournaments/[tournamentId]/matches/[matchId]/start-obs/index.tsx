import { generateMatchRoundCode } from '@/helpers/mahjong.helper'
import { RealtimeMatch, RealtimeMatchRound } from '@/models'
import useObsRoom from '@/pages/v2/hooks/useObsRoom'
import PlayerCard from '@/pages/v2/obs/scenes/realtime/byTheme/default/components/PlayerCard'
import { useFirebaseDatabase } from '@/providers/firebaseDatabase.provider'
import { IMatchupPlayer } from '@/resources/matchups/entity'
import { useMatchupByCurrentRoute } from '@/resources/matchups/hook'
import { getTimestampId } from '@/utils/string.util'
import { CheckOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  Result,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd'
import { useCallback } from 'react'
import { data, useNavigate } from 'react-router'

const PlayerCardAlt = ({ player }: { player: IMatchupPlayer }) => {
  return (
    <PlayerCard
      score={30000}
      player={{
        primaryName: player.name ?? '',
        secondaryName: player.secondaryName ?? '',
        nickname: player.thirdName ?? '',
        color: player.color,
        logoUrl: player.logoImageUrl ?? '',
        propicUrl: player.portraitImageUrl ?? '',
        largeLogoUrl: player.logoImageUrl ?? '',
      }}
    />
  )
}

export default function MatchStartObsPage() {
  const navigate = useNavigate()

  const fb = useFirebaseDatabase()
  const { update: updateObsRoom } = useObsRoom()

  const { data: matchup, isLoading } = useMatchupByCurrentRoute()

  const handleSubmit = useCallback(async () => {
    if (!matchup) {
      return
    }

    const newRTMatchupCode = `mu-${getTimestampId()}`

    const newRTMatchup: RealtimeMatch = {
      code: newRTMatchupCode,
      name: matchup.name ?? '',
      nameDisplay: matchup.name ?? '',
      remark: '',
      createdAt: new Date().toISOString(),
      createdBy: 'Dicky',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Dicky',
      rulesetRef: matchup.ruleset.key,
      themeRef: matchup.theme.key,
      setting: {
        startingScore: '30000',
        isManganRoundUp: '1',
        yakuMax: '12',
        yakumanMax: '13',
      },
      players: matchup.players.map((player) => ({
        primaryName: player.name ?? '',
        secondaryName: player.secondaryName ?? '',
        nickname: player.thirdName ?? '',
        color: player.color ?? '',
        logoUrl: player.logoImageUrl ?? '',
        propicUrl: player.portraitImageUrl ?? '',
        largeLogoUrl: player.logoImageUrl ?? '',
      })),
      activeResultDetail: null,
      database: {
        _id: matchup.database?._id!,
        tournamentId: matchup.database?.tournamentId!,
      },
    }

    await fb.set(`matches/${newRTMatchupCode}`, newRTMatchup)

    const startingScore = 30000

    const matchRound: RealtimeMatchRound = {
      matchId: newRTMatchup.code,
      code: generateMatchRoundCode(newRTMatchup.code, 1, 0),
      roundCount: 1,
      extendedRoundCount: 0,
      cumulatedThousands: 0,
      nextRoundCumulatedThousands: 0,
      resultType: 0,
      nextRoundType: 0,
      playerResults: {
        '0': {
          beforeScore: startingScore,
          afterScore: startingScore,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
          detail: {
            han: 1,
            fu: 30,
            yakumanCount: 0,
            dora: 0,
            redDora: 0,
            innerDora: 0,
            yakus: [],
            raw: {},
            isRevealed: false,
            isRiichied: false,
          },
        },
        '1': {
          beforeScore: startingScore,
          afterScore: startingScore,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
          detail: {
            han: 1,
            fu: 30,
            yakumanCount: 0,
            dora: 0,
            redDora: 0,
            innerDora: 0,
            yakus: [],
            raw: {},
            isRevealed: false,
            isRiichied: false,
          },
        },
        '2': {
          beforeScore: startingScore,
          afterScore: startingScore,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
          detail: {
            han: 1,
            fu: 30,
            yakumanCount: 0,
            dora: 0,
            redDora: 0,
            innerDora: 0,
            yakus: [],
            raw: {},
            isRevealed: false,
            isRiichied: false,
          },
        },
        '3': {
          beforeScore: startingScore,
          afterScore: startingScore,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
          detail: {
            han: 1,
            fu: 30,
            yakumanCount: 0,
            dora: 0,
            redDora: 0,
            innerDora: 0,
            yakus: [],
            raw: {},
            isRevealed: false,
            isRiichied: false,
          },
        },
      },
      doras: [],
    }

    await fb.push(`matchRounds`, matchRound)
    await updateObsRoom({
      matchId: newRTMatchupCode,
    })

    navigate('../../..')
    window.open('/admin/obs/match-control')
  }, [matchup, data, fb, updateObsRoom, navigate])

  if (isLoading) {
    return <Spin />
  }

  if (!matchup) {
    return <Result status="404" title="找不到對局" />
  }

  return (
    <section className="max-w-[700px] mx-auto my-16">
      <Space vertical size={16}>
        <Alert title="請再確認一次內容及選手正確。" type="error" />

        <Card className="shadow">
          <Typography.Title level={3}>{matchup.name}</Typography.Title>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="text-5xl relative pb-10 pr-10">
                <PlayerCardAlt player={matchup.players[0]} />
                <p className="absolute bottom-0 right-0">東</p>
              </div>
            </Col>
            <Col span={12}>
              <div className="text-5xl relative pb-10 pl-10">
                <PlayerCardAlt player={matchup.players[3]} />
                <p className="absolute bottom-0 left-0">北</p>
              </div>
            </Col>
            <Col span={12}>
              <div className="text-5xl relative pt-10 pr-10">
                <PlayerCardAlt player={matchup.players[1]} />
                <p className="absolute top-0 right-0">南</p>
              </div>
            </Col>
            <Col span={12}>
              <div className="text-5xl relative pt-10 pl-10">
                <PlayerCardAlt player={matchup.players[2]} />
                <p className="absolute top-0 left-0">西</p>
              </div>
            </Col>
          </Row>
        </Card>

        <div className="text-center">
          <Button
            size="large"
            variant="solid"
            color="green"
            icon={<CheckOutlined />}
            onClick={handleSubmit}
          >
            以上資料正確，開始直播
          </Button>
        </div>
      </Space>
    </section>
  )
}
