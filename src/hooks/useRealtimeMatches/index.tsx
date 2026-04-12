import { useMemo } from 'react'
import { RealtimeMatch, RealtimeMatchRound } from '../../models'
import { useFirebaseDatabaseByKey } from '../../providers/firebaseDatabase.provider'

export default function useRealtimeMatches() {
  const { data: rtMatchesMap } = useFirebaseDatabaseByKey<
    Record<string, RealtimeMatch>,
    Record<string, RealtimeMatch>,
    Partial<Record<string, RealtimeMatch>>
  >(`/matches`, {
    order: {
      byChild: 'createdAt',
    },
    filter: {
      limitToLast: 10,
    },
  })

  const { data: rtMatchRoundsMap } = useFirebaseDatabaseByKey<
    Record<string, RealtimeMatchRound>,
    Record<string, RealtimeMatchRound>,
    Partial<Record<string, RealtimeMatchRound>>
  >(`/matchRounds`, {
    order: {
      byChild: 'createdAt',
    },
    filter: {
      limitToLast: 150,
    },
  })

  const rtMatches = useMemo(() => {
    const rawRounds = Object.values(rtMatchRoundsMap ?? {})

    return Object.entries(rtMatchesMap ?? {})
      .map(([key, value]) => ({
        ...value,
        databaseId: value.databaseId || key,
        _id: key,
        rounds: rawRounds.filter((round) => round.matchId === key),
      }))
      .filter(({ rounds }) => rounds.length > 5)
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
  }, [rtMatchesMap])

  return { rtMatches }
}
