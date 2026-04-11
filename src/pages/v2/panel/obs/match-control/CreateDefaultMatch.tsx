import { generateMatchRoundCode } from '@/helpers/mahjong.helper'
import { RealtimeMatch, RealtimeMatchRound } from '@/models'
import useObsRoom from '@/pages/v2/hooks/useObsRoom'
import { useFirebaseDatabase } from '@/providers/firebaseDatabase.provider'
import { getRandomId } from '@/utils/string.util'
import { useEffect } from 'react'

const defaultPlayers = [
  {
    name: '玩家甲',
    color: '#35356e',
  },
  {
    name: '玩家乙',
    color: '#753831',
  },
  {
    name: '玩家丙',
    color: '#5d5e0f',
  },
  {
    name: '玩家丁',
    color: '#136317',
  },
]

export default function CreateDefaultMatch() {
  const fb = useFirebaseDatabase()

  const { update: updateObsRoom, actions: obsRoomActions } = useObsRoom()

  useEffect(() => {
    const fn = async () => {
      const newMatchCode = getRandomId()

      const newRTMatch: RealtimeMatch = {
        code: newMatchCode,
        name: '範例對局',
        nameDisplay: '範例對局',
        remark: '',
        createdAt: new Date().toISOString(),
        createdBy: 'Dicky',
        updatedAt: new Date().toISOString(),
        updatedBy: 'Dicky',
        rulesetRef: 'hkleague-4p',
        themeRef: 'default',
        setting: {
          startingScore: '25000',
          isManganRoundUp: '1',
          yakuMax: '12',
          yakumanMax: '13',
        },
        players: {
          '0': {
            primaryName: defaultPlayers[0].name,
            secondaryName: defaultPlayers[0].name ?? '',
            nickname: defaultPlayers[0].name ?? '',
            color: defaultPlayers[0].color,
            logoUrl: '',
            propicUrl: '',
            largeLogoUrl: '',
          },
          '1': {
            primaryName: defaultPlayers[1].name,
            secondaryName: defaultPlayers[1].name ?? '',
            nickname: defaultPlayers[1].name ?? '',
            color: defaultPlayers[1].color,
            logoUrl: '',
            propicUrl: '',
            largeLogoUrl: '',
          },
          '2': {
            primaryName: defaultPlayers[2].name,
            secondaryName: defaultPlayers[2].name ?? '',
            nickname: defaultPlayers[2].name ?? '',
            color: defaultPlayers[2].color,
            logoUrl: '',
            propicUrl: '',
            largeLogoUrl: '',
          },
          '3': {
            primaryName: defaultPlayers[3].name,
            secondaryName: defaultPlayers[3].name ?? '',
            nickname: defaultPlayers[3].name ?? '',
            color: defaultPlayers[3].color,
            logoUrl: '',
            propicUrl: '',
            largeLogoUrl: '',
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
        tournamentId: '',
        matchId: newRTMatch.code,
        themeId: 'default',
      })
    }

    fn()
  }, [fb, obsRoomActions, updateObsRoom])

  return <></>
}
