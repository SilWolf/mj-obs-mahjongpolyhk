import { q, runQuery, urlFor } from '@/sanity'
import * as z from 'zod'
import { ITournament } from './entity'

export const tournamentService = {
  getOne: async (tournamentId: string): Promise<ITournament> => {
    const query = q.star
      .filterByType('tournament')
      .filterRaw(`_id == "${tournamentId}"`)
      .order('_updatedAt desc')
      .slice(0)
      .project((sub) => ({
        _id: true,
        name: true,
        logoUrl: sub.field('image.asset').field(
          '_ref',
          z
            .string()
            .nullish()
            .transform((assetId) =>
              urlFor(assetId, { width: 1000, height: 1000 })
            )
        ),
      }))

    return runQuery(query).then((tournament) => {
      if (!tournament) {
        throw new Error(`Tournament not found (id = ${tournament})`)
      }

      return {
        _id: tournament._id,
        name: tournament.name ?? '(未命名的聯賽)',
        logoImageUrl: tournament.logoUrl,
        rulesetId: 'hkleague-4p',
        themeId: 'default',
      }
    })
  },

  getMany: async (): Promise<ITournament[]> => {
    const query = q.star
      .filterByType('tournament')
      .order('_updatedAt desc')
      .slice(0, 10)
      .project((sub) => ({
        _id: true,
        name: true,
        logoUrl: sub.field('image.asset').field(
          '_ref',
          z
            .string()
            .nullish()
            .transform((assetId) =>
              urlFor(assetId, { width: 1000, height: 1000 })
            )
        ),
      }))

    return runQuery(query).then((tournaments) =>
      tournaments.map(
        (item) =>
          ({
            _id: item._id,
            name: item.name ?? '(未命名的聯賽)',
            logoImageUrl: item.logoUrl,
            rulesetId: 'hkleague-4p',
            themeId: 'default',
          }) satisfies ITournament
      )
    )
  },
}
