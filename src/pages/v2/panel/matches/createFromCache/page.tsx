import { generateMatchRoundCode } from '@/helpers/mahjong.helper'
import { RealtimeMatch, RealtimeMatchRound } from '@/models'
import useCurrentTournament from '@/pages/v2/hooks/useCurrentTournament'
import useObsRoom from '@/pages/v2/hooks/useObsRoom'
import { V2Match } from '@/pages/v2/models/V2Match.model'
import V2MatchForm from '@/pages/v2/widgets/V2MatchForm'
import { useFirebaseDatabase } from '@/providers/firebaseDatabase.provider'
import { getRandomId } from '@/utils/string.util'
import { useCallback, useMemo } from 'react'
import { useLocalStorage } from 'react-use'
import { useLocation } from 'wouter'

export default function V2PanelMatchesByIdEditPage() {
  const fb = useFirebaseDatabase()
  const { update: updateObsRoom } = useObsRoom()
  const [, navigate] = useLocation()

  const [cachedRealtimeMatch] = useLocalStorage<RealtimeMatch>(
    'cachedRealtimeMatch'
  )

  const { data: currentTournament } = useCurrentTournament()

  const handleSubmit = useCallback(
    async (newMatch: V2Match) => {
      if (!confirm('確定資料都正確了嗎？要開始對局了嗎？')) {
        return
      }

      const newMatchCode = getRandomId()

      const newRTMatch: RealtimeMatch = {
        code: newMatchCode,
        name: newMatch.data.name.official.primary,
        nameDisplay: (newMatch.data.name.display ?? newMatch.data.name.official)
          .primary,
        databaseId: 'abc',
        remark: '',
        createdAt: new Date().toISOString(),
        createdBy: 'Dicky',
        updatedAt: new Date().toISOString(),
        updatedBy: 'Dicky',
        setting: {
          startingScore: '25000',
          isManganRoundUp: '1',
          yakuMax: '12',
          yakumanMax: '13',
        },
        players: {
          '0': {
            primaryName: newMatch.data.players[0].name.display.primary,
            secondaryName:
              newMatch.data.players[0].name.display.secondary ?? '',
            nickname: newMatch.data.players[0].name.display.third ?? '',
            color: newMatch.data.players[0].color.primary,
            logoUrl: newMatch.data.players[0].image.logo?.default.url ?? '',
            propicUrl:
              newMatch.data.players[0].image.portrait?.default.url ?? '',
            largeLogoUrl:
              newMatch.data.players[0].image.riichi?.default.url ??
              newMatch.data.players[0].image.logo?.default.url ??
              '',
          },
          '1': {
            primaryName: newMatch.data.players[1].name.display.primary,
            secondaryName:
              newMatch.data.players[1].name.display.secondary ?? '',
            nickname: newMatch.data.players[1].name.display.third ?? '',
            color: newMatch.data.players[1].color.primary,
            logoUrl: newMatch.data.players[1].image.logo?.default.url ?? '',
            propicUrl:
              newMatch.data.players[1].image.portrait?.default.url ?? '',
            largeLogoUrl:
              newMatch.data.players[1].image.riichi?.default.url ??
              newMatch.data.players[1].image.logo?.default.url ??
              '',
          },
          '2': {
            primaryName: newMatch.data.players[2].name.display.primary,
            secondaryName:
              newMatch.data.players[2].name.display.secondary ?? '',
            nickname: newMatch.data.players[2].name.display.third ?? '',
            color: newMatch.data.players[2].color.primary,
            logoUrl: newMatch.data.players[2].image.logo?.default.url ?? '',
            propicUrl:
              newMatch.data.players[2].image.portrait?.default.url ?? '',
            largeLogoUrl:
              newMatch.data.players[2].image.riichi?.default.url ??
              newMatch.data.players[2].image.logo?.default.url ??
              '',
          },
          '3': {
            primaryName: newMatch.data.players[3].name.display.primary,
            secondaryName:
              newMatch.data.players[3].name.display.secondary ?? '',
            nickname: newMatch.data.players[3].name.display.third ?? '',
            color: newMatch.data.players[3].color.primary,
            logoUrl: newMatch.data.players[3].image.logo?.default.url ?? '',
            propicUrl:
              newMatch.data.players[3].image.portrait?.default.url ?? '',
            largeLogoUrl:
              newMatch.data.players[3].image.riichi?.default.url ??
              newMatch.data.players[3].image.logo?.default.url ??
              '',
          },
        },
        activeResultDetail: null,
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
        tournamentId: currentTournament?.tournament.id ?? null,
        matchId: newRTMatch.code,
        themeId: 'default',
      })
      navigate('/obs/match-control')
    },
    [currentTournament?.tournament.id, fb, navigate, updateObsRoom]
  )

  const defaultValues = useMemo(() => {
    if (!cachedRealtimeMatch) {
      return undefined
    }

    return {
      name: cachedRealtimeMatch.name,
      nameAlt: cachedRealtimeMatch.nameDisplay,
      rulesetId: 'hkleague-4p',
      players: [
        cachedRealtimeMatch.players[0],
        cachedRealtimeMatch.players[1],
        cachedRealtimeMatch.players[2],
        cachedRealtimeMatch.players[3],
      ].map((player) => ({
        namePrimary: player.primaryName,
        nameSecondary: player.secondaryName ?? '',
        nameThird: player.nickname,
        colorPrimary: player.color,
        colorSecondary: player.color,
        imagePortraitUrl: player.propicUrl ?? '',
        imageLogoUrl: player.logoUrl ?? '',
        imageRiichiUrl: player.largeLogoUrl ?? '',
      })),
    }
  }, [cachedRealtimeMatch])

  if (!cachedRealtimeMatch) {
    return <></>
  }

  return (
    <>
      <section className="container mx-auto p-8">
        <V2MatchForm defaultValues={defaultValues} onSubmit={handleSubmit} />
      </section>
    </>
  )
}
