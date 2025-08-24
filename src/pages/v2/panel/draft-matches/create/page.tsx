import { RealtimeMatch } from '@/models'
import { V2Match } from '@/pages/v2/models/V2Match.model'
import V2MatchForm from '@/pages/v2/widgets/V2MatchForm'
import { useFirebaseDatabase } from '@/providers/firebaseDatabase.provider'
import { getRandomId } from '@/utils/string.util'

import { useCallback } from 'react'
import { useLocation } from 'wouter'

const defaultValues = {
  name: '新的對局',
  nameAlt: '新的對局',
  rulesetId: 'hkleague-4p',
  players: [
    {
      namePrimary: '玩家甲',
      nameSecondary: '初段',
      nameThird: 'A',
      colorPrimary: '#4269f5',
      colorSecondary: '#4269f5',
      imagePortraitUrl: '',
      imageLogoUrl: '',
      imageRiichiUrl: '',
    },
    {
      namePrimary: '玩家乙',
      nameSecondary: '初段',
      nameThird: 'B',
      colorPrimary: '#e01616',
      colorSecondary: '#e01616',
      imagePortraitUrl: '',
      imageLogoUrl: '',
      imageRiichiUrl: '',
    },
    {
      namePrimary: '玩家丙',
      nameSecondary: '初段',
      nameThird: 'C',
      colorPrimary: '#078700',
      colorSecondary: '#078700',
      imagePortraitUrl: '',
      imageLogoUrl: '',
      imageRiichiUrl: '',
    },
    {
      namePrimary: '玩家丁',
      nameSecondary: '初段',
      nameThird: 'D',
      colorPrimary: '#6000c7',
      colorSecondary: '#6000c7',
      imagePortraitUrl: '',
      imageLogoUrl: '',
      imageRiichiUrl: '',
    },
  ],
}

export default function V2PanelDraftMatchCreatePage() {
  const fb = useFirebaseDatabase()

  const [, navigate] = useLocation()

  const handleSubmit = useCallback(
    async (newMatch: V2Match) => {
      const newMatchId = getRandomId()

      const newDraftMatch: RealtimeMatch = {
        code: newMatchId,
        name: newMatch.data.name.official.primary,
        nameDisplay: (newMatch.data.name.display ?? newMatch.data.name.official)
          .primary,
        databaseId: newMatchId,
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

      await fb.set(`draft-matches/${newDraftMatch.code}`, newDraftMatch)

      navigate('~/panel')
    },
    [fb, navigate]
  )

  return (
    <>
      <section className="container mx-6 my-4">
        <V2MatchForm defaultValues={defaultValues} onSubmit={handleSubmit} />
      </section>
    </>
  )
}
