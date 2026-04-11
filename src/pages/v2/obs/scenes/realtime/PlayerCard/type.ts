import { IMatchupPlayer } from '@/resources/matchups/entity'
import { HTMLAttributes } from 'react'

export type PlayerCardBaseProps = HTMLAttributes<HTMLDivElement> & {
  score: number
  scoreChanges?: number[] | undefined
  point?: number
  ranking?: number
  isEast?: boolean
  isFuriten?: boolean
  isRiichi?: boolean
  isYellowCarded?: boolean
  isRedCarded?: boolean
  isRonDisallowed?: boolean
  animated?: boolean
  waitingTiles?: string[]
  waitingTileRemain?: number | null | undefined
  reveals?: string[]
  showPointAndRanking?: boolean | null

  player: IMatchupPlayer
}
