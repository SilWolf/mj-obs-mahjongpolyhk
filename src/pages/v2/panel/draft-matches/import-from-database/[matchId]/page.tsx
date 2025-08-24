import { RealtimeMatch } from '@/models'
import useCurrentTournament from '@/pages/v2/hooks/useCurrentTournament'
import { V2Match } from '@/pages/v2/models/V2Match.model'
import { apiGetMatchById } from '@/pages/v2/services/match.service'
import V2MatchForm from '@/pages/v2/widgets/V2MatchForm'
import { useFirebaseDatabase } from '@/providers/firebaseDatabase.provider'
import { getRandomId } from '@/utils/string.util'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useLocation, useParams } from 'wouter'

export default function V2PanelMatchesByIdEditPage() {
  const fb = useFirebaseDatabase()
  const { matchId } = useParams<{ matchId: string }>()
  const [, navigate] = useLocation()

  const { data } = useCurrentTournament()

  const { data: match } = useQuery({
    queryKey: ['v2-matches', matchId],
    queryFn: ({ queryKey }) => apiGetMatchById(queryKey[1]),
  })

  const handleSubmit = useCallback(
    async (newMatch: V2Match) => {
      if (!match) {
        return
      }
      if (!data) {
        return
      }

      const newMatchCode = getRandomId()

      const newDraftMatch: RealtimeMatch = {
        code: newMatchCode,
        name: newMatch.data.name.official.primary,
        nameDisplay: (newMatch.data.name.display ?? newMatch.data.name.official)
          .primary,
        databaseId: matchId,
        databaseTournamentId: match.data.tournamentId,
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
    [fb, match, matchId, navigate, data]
  )

  const defaultValues = useMemo(() => {
    if (!match) {
      return undefined
    }
    if (!data) {
      return undefined
    }

    return {
      name: match.data.name.official.primary,
      nameAlt: match.data.name.display?.primary || '',
      rulesetId: match.data.rulesetRef,
      players: [
        data.playersMap[match.data.players[0].id] ?? match.data.players[0],
        data.playersMap[match.data.players[1].id] ?? match.data.players[1],
        data.playersMap[match.data.players[2].id] ?? match.data.players[2],
        data.playersMap[match.data.players[3].id] ?? match.data.players[3],
      ].map((player) => ({
        namePrimary: player.name.display.primary,
        nameSecondary: player.name.display.secondary ?? '',
        nameThird: player.name.display.third ?? '',
        colorPrimary: player.color.primary,
        colorSecondary: player.color.secondary ?? player.color.primary,
        imagePortraitUrl: player.image.portrait?.default.url,
        imageLogoUrl: player.image.logo?.default.url,
        imageRiichiUrl:
          player.image.riichi?.default.url ?? player.image.logo?.default.url,
      })),
    }
  }, [match, data])

  if (!match) {
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
