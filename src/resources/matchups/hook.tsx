import { useQuery } from '@tanstack/react-query'
import { matchupService } from './api'
import { useParams } from 'react-router'

export const useMatchups = (params: { tournamentId: string }) =>
  useQuery({
    queryKey: ['tournaments', params, 'matchups'],
    queryFn: () => matchupService.getManyByTournamentId(params.tournamentId),
    enabled: !!params.tournamentId,
  })

export const useMatchupByCurrentRoute = () => {
  const params = useParams<{ matchupId: string }>()

  return useQuery({
    queryKey: ['matchups', params],
    queryFn: () => matchupService.getOne(params.matchupId!),
    enabled: !!params.matchupId,
  })
}
