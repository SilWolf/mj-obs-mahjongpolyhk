import { RealtimeMatch } from '../../models'
import { useFirebaseDatabaseByKey } from '../../providers/firebaseDatabase.provider'

const useDraftMatch = (matchId: string | null | undefined) => {
  return useFirebaseDatabaseByKey<
    RealtimeMatch,
    RealtimeMatch,
    Partial<RealtimeMatch>
  >(`/draft-matches/${matchId}`)
}

export default useDraftMatch
