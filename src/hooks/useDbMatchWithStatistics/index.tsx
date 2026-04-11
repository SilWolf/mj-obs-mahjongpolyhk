import { apiGetMatchByIdWithStatistics } from '@/helpers/sanity.helper'
import { useQuery } from '@tanstack/react-query'

const useDbMatchWithStatistics = (matchId: string | null | undefined) =>
  useQuery({
    queryKey: ['matches', matchId],
    queryFn: async () => apiGetMatchByIdWithStatistics(matchId!),
    enabled: !!matchId,
  })

export default useDbMatchWithStatistics
