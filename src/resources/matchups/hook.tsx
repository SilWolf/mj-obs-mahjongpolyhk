import { useQuery } from '@tanstack/react-query'
import { matchupService } from './api'
import { useParams } from 'react-router'

export const useMatchups = (params: { tournamentId: string }) =>
  useQuery({
    queryKey: ['tournaments', params, 'matchups'],
    queryFn: () => matchupService.getManyByTournamentId(params.tournamentId),
    enabled: !!params.tournamentId,
  })

export const usePendingMatchups = (params: { tournamentId: string }) =>
  useQuery({
    queryKey: ['tournaments', params, 'matchups', 'pending'],
    queryFn: () =>
      matchupService.getManyByTournamentId(params.tournamentId, {
        pending: true,
      }),
    enabled: !!params.tournamentId,
  })

export const useMatchup = (params: { matchupId: string }) =>
  useQuery({
    queryKey: ['matchups', params],
    queryFn: () => matchupService.getOne(params.matchupId),
    enabled: !!params.matchupId,
  })

export const useMatchupByCurrentRoute = () => {
  const params = useParams<{ matchupId: string }>()

  return useQuery({
    queryKey: ['matchups', params],
    queryFn: () => matchupService.getOne(params.matchupId!),
    enabled: !!params.matchupId,
  })
}
