import { apiGetMatchByIdWithStatistics } from '@/helpers/sanity.helper'
import { useQuery } from '@tanstack/react-query'

const useDbMatchWithStatistics = (matchId: string | null | undefined) =>
  useQuery({
    queryKey: ['matches', matchId],
    queryFn: async ({ queryKey }) => apiGetMatchByIdWithStatistics(queryKey[1]),
    enabled: !!matchId,
  })

export default useDbMatchWithStatistics
