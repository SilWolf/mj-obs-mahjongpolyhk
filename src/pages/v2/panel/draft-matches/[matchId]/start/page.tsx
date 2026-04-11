import { generateMatchRoundCode } from '@/helpers/mahjong.helper'
import useDraftMatch from '@/hooks/useDraftMatch'
import { RealtimeMatch, RealtimeMatchRound, RealtimePlayer } from '@/models'
import useObsRoom from '@/pages/v2/hooks/useObsRoom'
import { useFirebaseDatabase } from '@/providers/firebaseDatabase.provider'
import { getRandomId } from '@/utils/string.util'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'

function RealtimePlayerMiniCard({ player }: { player: RealtimePlayer }) {
  return (
    <div className="flex gap-1 items-center">
      <div
        className="h-10 aspect-square p-1"
        style={{ backgroundColor: player.color }}
      >
        <img src={player.logoUrl || 'null'} className="aspect-square" alt="" />
      </div>
      <img
        src={player.propicUrl || 'null'}
        className="h-10 aspect-[18/25]"
        alt=""
      />
      <div>
        <p className="font-bold">{player.primaryName}</p>
        <p className="text-sm">{player.secondaryName}</p>
        <p className="text-xs">{player.nickname}</p>
      </div>
    </div>
  )
}

export default function V2PanelMatchDraftByIdStartPage() {
  const fb = useFirebaseDatabase()
  const { update: updateObsRoom } = useObsRoom()

  const { matchId } = useParams<{ matchId: string }>()
  const { data: draftMatch } = useDraftMatch(matchId)

  const navigate = useNavigate()

  const handleClickStart = useCallback(async () => {
    if (!draftMatch) {
      return
    }
    if (!confirm('修改資料會很麻煩，確定資料都正確了嗎？要開始對局了嗎？')) {
      return
    }

    const newMatchCode = getRandomId()

    const newRTMatch: RealtimeMatch = {
      ...draftMatch,
      code: newMatchCode,
    }

    await fb.set(`matches/${newRTMatch.code}`, newRTMatch)

    const startingScore = 25000

    const matchRound: RealtimeMatchRound = {
      matchId: newRTMatch.code,
      code: generateMatchRoundCode(newRTMatch.code, 1, 0),
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
      tournamentId: newRTMatch.databaseTournamentId ?? '',
      matchId: newRTMatch.code,
      themeId: newRTMatch.themeRef || 'default',
    })
    navigate('~/panel/obs/match-control')
  }, [draftMatch, fb, navigate, updateObsRoom])

  if (!draftMatch) {
    return <p>找不到草稿</p>
  }

  return (
    <div className="container mx-auto max-w-(--breakpoint-md) py-16">
      <div className="space-y-6">
        <div className="bg-red-500 p-4 text-white space-y-2">
          <div className="text-center text-6xl">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <p className="text-center text-xl">
            這是開始直播前的最後機會，請檢查以下內容是否完全正確。
            <br />
            一旦對局開始，要修改內容就很麻煩。
            <br />
          </p>
        </div>

        <h4 className="text-3xl">
          <span className="text-neutral-600">對局名稱:</span>{' '}
          <span className="font-bold">{draftMatch.name}</span>
        </h4>

        <div className="grid grid-cols-10 gap-x-2">
          <div className="col-span-4 col-start-4">
            <div className="text-[48px]">
              <RealtimePlayerMiniCard player={draftMatch.players[2]} />
            </div>
            <p className="text-center text-4xl">西</p>
          </div>
          <div className="col-span-4 col-start-1 flex items-center gap-x-2">
            <div className="flex-1 text-[48px]">
              <RealtimePlayerMiniCard player={draftMatch.players[3]} />
            </div>
            <div className="shrink-0 text-4xl">北</div>
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-4 flex items-center gap-x-2">
            <div className="shrink-0 text-4xl">南</div>
            <div className="flex-1 text-[48px]">
              <RealtimePlayerMiniCard player={draftMatch.players[1]} />
            </div>
          </div>
          <div className="col-span-4 col-start-4">
            <p className="text-center text-4xl">東</p>
            <div className="text-[48px]">
              <RealtimePlayerMiniCard player={draftMatch.players[0]} />
            </div>
          </div>
        </div>

        <div className="pt-8">
          <button
            className="btn btn-success btn-xl w-full animate-pulse"
            onClick={handleClickStart}
          >
            確認以上內容無誤，開始對局
          </button>
        </div>
      </div>
    </div>
  )
}
