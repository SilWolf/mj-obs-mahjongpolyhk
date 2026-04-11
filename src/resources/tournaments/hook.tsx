import { useQuery } from '@tanstack/react-query'
import { tournamentService } from './api'

export const useTournaments = () =>
  useQuery({
    queryKey: ['tournaments'],
    queryFn: tournamentService.getMany,
  })
