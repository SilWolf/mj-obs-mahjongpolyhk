import { q, runQuery, urlFor } from '@/sanity'
import * as z from 'zod'
import { ITournament } from './entity'

export const tournamentService = {
  getOne: async (tournamentId: string): Promise<ITournament> => {
    const query = q.star
      .filterByType('matchTournament')
      .filterRaw(`_id == "${tournamentId}"`)
      .order('_createdAt desc')
      .slice(0)
      .project((sub) => ({
        _id: z.string(),
        name: z.string().nullish(),
        logoUrl: sub.field('logo.asset').field(
          '_ref',
          z
            .string()
            .nullish()
            .transform((assetId) =>
              urlFor(assetId, { width: 1000, height: 1000 })
            )
        ),
        rulesetId: z.string().nullish(),
        themeId: z.string().nullish(),
      }))

    return runQuery(query).then((tournament) => {
      if (!tournament) {
        throw new Error(`Tournament not found (id = ${tournament})`)
      }

      return {
        _id: tournament._id,
        name: tournament.name ?? '(未命名的聯賽)',
        logoImageUrl: tournament.logoUrl,
        rulesetId: tournament.rulesetId ?? 'hkleague-4p',
        themeId: tournament.themeId ?? 'default',
      }
    })
  },

  getMany: async (): Promise<ITournament[]> => {
    const query = q.star
      .filterByType('matchTournament')
      .order('_createdAt desc')
      .slice(0, 10)
      .project((sub) => ({
        _id: z.string(),
        name: z.string().nullish(),
        logoUrl: sub.field('logo.asset').field(
          '_ref',
          z
            .string()
            .nullish()
            .transform((assetId) =>
              urlFor(assetId, { width: 1000, height: 1000 })
            )
        ),
        rulesetId: z.string().nullish(),
        themeId: z.string().nullish(),
      }))

    return runQuery(query).then((tournaments) =>
      tournaments.map(
        (item) =>
          ({
            _id: item._id,
            name: item.name ?? '(未命名的聯賽)',
            logoImageUrl: item.logoUrl,
            rulesetId: item.rulesetId ?? 'hkleague-4p',
            themeId: item.themeId ?? 'default',
          }) satisfies ITournament
      )
    )
  },
}
