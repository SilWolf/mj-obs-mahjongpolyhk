import { useMemo } from 'react'
import { RealtimeMatch } from '../../models'
import { useFirebaseDatabaseByKey } from '../../providers/firebaseDatabase.provider'

export default function useDraftMatches() {
  const { data: draftMatchesMap } = useFirebaseDatabaseByKey<
    Record<string, RealtimeMatch>,
    Record<string, RealtimeMatch>,
    Partial<Record<string, RealtimeMatch>>
  >(`/draft-matches`, {
    order: {
      byChild: 'createdAt',
    },
    filter: {
      limitToLast: 10,
    },
  })

  const draftMatches = useMemo(
    () =>
      Object.entries(draftMatchesMap ?? {})
        .map(([key, value]) => ({
          ...value,
          databaseId: value.databaseId || key,
          _id: key,
        }))
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)),
    [draftMatchesMap]
  )

  return { draftMatches }
}
