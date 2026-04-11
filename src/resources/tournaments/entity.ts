import { MatchTournament } from '@/sanity/sanity.types'

export type IDBTournament = MatchTournament

export type ITournament = {
  _id: string
  name: string
  logoImageUrl?: string | null
  rulesetId: string
  themeId: string
}
