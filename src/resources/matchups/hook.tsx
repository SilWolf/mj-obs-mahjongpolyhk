import { useQuery } from '@tanstack/react-query'
import { matchupService } from './api'

export const useMatchups = (params: { tournamentId: string }) =>
  useQuery({
    queryKey: ['tournaments', params, 'matchups'],
    queryFn: () => matchupService.getManyByTournamentId(params.tournamentId),
    enabled: !!params.tournamentId,
  })
