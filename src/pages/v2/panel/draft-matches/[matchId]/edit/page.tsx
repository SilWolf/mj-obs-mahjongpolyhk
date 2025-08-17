import useDraftMatch from '@/hooks/useDraftMatch'
import { RealtimeMatch } from '@/models'
import { V2Match } from '@/pages/v2/models/V2Match.model'
import V2MatchForm from '@/pages/v2/widgets/V2MatchForm'

import { useCallback, useMemo } from 'react'
import { useLocation, useParams } from 'wouter'

export default function V2PanelMatchDraftByIdEditPage() {
  const { matchId } = useParams<{ matchId: string }>()
  const { data: draftMatch, update: updateDraftMatch } = useDraftMatch(matchId)

  const [, navigate] = useLocation()

  const handleSubmit = useCallback(
    (newMatch: V2Match) => {
      const newRtMatch: RealtimeMatch = {
        code: matchId,
        name: newMatch.data.name.official.primary,
        nameDisplay: (newMatch.data.name.display ?? newMatch.data.name.official)
          .primary,
        databaseId: matchId,
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

      updateDraftMatch(newRtMatch)

      navigate('~/panel')

      return newRtMatch
    },
    [matchId, navigate, updateDraftMatch]
  )

  const defaultValues = useMemo(() => {
    if (!draftMatch) {
      return undefined
    }

    return {
      name: draftMatch.name,
      nameAlt: draftMatch.nameDisplay || '',
      rulesetId: 'hkleague-4p',
      players: [
        draftMatch.players[0],
        draftMatch.players[1],
        draftMatch.players[2],
        draftMatch.players[3],
      ].map((player) => ({
        namePrimary: player.primaryName,
        nameSecondary: player.secondaryName ?? '',
        nameThird: player.nickname ?? '',
        colorPrimary: player.color,
        colorSecondary: player.color,
        imagePortraitUrl: player.propicUrl ?? '',
        imageLogoUrl: player.logoUrl ?? '',
        imageRiichiUrl: player.largeLogoUrl ?? '',
      })),
    }
  }, [draftMatch])

  if (!draftMatch) {
    return <></>
  }

  return (
    <>
      <section className="container mx-6 my-4">
        <V2MatchForm defaultValues={defaultValues} onSubmit={handleSubmit} />
      </section>
    </>
  )
}
