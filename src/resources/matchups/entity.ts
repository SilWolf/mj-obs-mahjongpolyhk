import { Match } from '@/sanity/sanity.types'

export type IDBMatchup = Match

export type IMatchup = {
  name?: string | null
  players: IMatchupPlayer[]
  startAt?: string | null
  ruleset: { key: 'hkleague-4p' }
  theme: { key: 'default' }
  database?: {
    _id: string
  }
}

export type IMatchupPlayer = {
  _id: string
  teamId?: string | null
  color: string
  secondaryColor?: string | null
  name?: string | null
  secondaryName?: string | null
  thirdName?: string | null
  portraitImageUrl?: string | null
  portraitAltImageUrl?: string | null
  fullBodyImageUrl?: string | null
  fullBodyAltImageUrl?: string | null
  riichiImageUrl?: string | null
  logoImageUrl?: string | null
}
