import { useQuery } from '@tanstack/react-query'
import { tournamentService } from './api'
import { useParams } from 'react-router'

export const useTournaments = () =>
  useQuery({
    queryKey: ['tournaments'],
    queryFn: tournamentService.getMany,
  })

export const useTournamentByCurrentRoute = () => {
  const params = useParams<{ tournamentId: string }>()

  return useQuery({
    queryKey: ['tournaments', params],
    queryFn: () => tournamentService.getOne(params.tournamentId!),
    enabled: !!params.tournamentId,
  })
}
