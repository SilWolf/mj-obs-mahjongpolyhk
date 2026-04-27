import { q, runQuery, urlFor } from '@/sanity'
import * as z from 'zod'
import { IMatchup, IMatchupPlayer } from './entity'

const playerFragment = q.fragmentForType<'player'>().project((sub) => ({
  _id: true,
  name: true,
  designation: true,
  nickname: true,
  color: sub.field('color.hex'),
  image: sub.field('image.asset').field(
    '_ref',
    z
      .string()
      .nullish()
      .transform((assetId) =>
        urlFor(assetId, {
          mode: 'cover',
          width: 720,
          height: 1000,
        })
      )
  ),
  riichiImage: sub.field('riichiImage.asset').field(
    '_ref',
    z
      .string()
      .nullish()
      .transform((assetId) =>
        urlFor(assetId, {
          mode: 'cover',
          width: 800,
          height: 800,
        })
      )
  ),
}))

const teamFragment = q.fragmentForType<'team'>().project((sub) => ({
  _id: true,
  name: true,
  color: sub.field('color.hex'),
  image: sub.field('image.asset').field(
    '_ref',
    z
      .string()
      .nullish()
      .transform((assetId) =>
        urlFor(assetId, {
          mode: 'cover',
          width: 800,
          height: 800,
        })
      )
  ),
  riichiImage: sub.field('riichiImage.asset').field(
    '_ref',
    z
      .string()
      .nullish()
      .transform((assetId) =>
        urlFor(assetId, {
          mode: 'cover',
          width: 800,
          height: 800,
        })
      )
  ),
}))

const tournamentTeamFragment = q
  .fragmentForType<'tournament-team'>()
  .project((sub) => ({
    _id: true,
    name: true,
    color: sub.field('color.hex'),
    image: sub.field('image.asset').field(
      '_ref',
      z
        .string()
        .nullish()
        .transform((assetId) =>
          urlFor(assetId, {
            mode: 'cover',
            width: 800,
            height: 800,
          })
        )
    ),
    riichiImage: sub.field('riichiImage.asset').field(
      '_ref',
      z
        .string()
        .nullish()
        .transform((assetId) =>
          urlFor(assetId, {
            mode: 'cover',
            width: 800,
            height: 800,
          })
        )
    ),
    team: sub.field('team').deref().project(teamFragment),
  }))

const tournamentPlayerFragment = q
  .fragmentForType<'tournament-player'>()
  .project((sub) => ({
    _id: true,
    name: true,
    designation: true,
    nickname: true,
    color: sub.field('color.hex'),
    image: sub.field('image.asset').field(
      '_ref',
      z
        .string()
        .nullish()
        .transform((assetId) =>
          urlFor(assetId, {
            mode: 'cover',
            width: 720,
            height: 1000,
          })
        )
    ),
    riichiImage: sub.field('riichiImage.asset').field(
      '_ref',
      z
        .string()
        .nullish()
        .transform((assetId) =>
          urlFor(assetId, {
            mode: 'cover',
            width: 800,
            height: 800,
          })
        )
    ),
    player: sub.field('player').deref().project(playerFragment),
    tournamentTeam: sub
      .field('tournamentTeam')
      .deref()
      .project(tournamentTeamFragment)
      .nullable(true),
  }))

const tournamentFragment = q.fragmentForType<'tournament'>().project((sub) => ({
  _id: true,
  name: true,
  image: sub.field('image.asset').field(
    '_ref',
    z
      .string()
      .nullish()
      .transform((assetId) =>
        urlFor(assetId, {
          mode: 'cover',
          width: 800,
          height: 800,
        })
      )
  ),
  participantType: true,
  participantColor: sub.field('participantColor.hex'),
  participantRiichiImage: sub.field('participantRiichiImage.asset').field(
    '_ref',
    z
      .string()
      .nullish()
      .transform((assetId) =>
        urlFor(assetId, {
          mode: 'cover',
          width: 800,
          height: 800,
        })
      )
  ),
}))

const matchupFragment = q.fragmentForType<'matchup'>().project((sub) => ({
  _id: true,
  name: true,
  tournament: sub.field('tournament').deref().project(tournamentFragment),
  players: sub.field('players[]').deref().project(tournamentPlayerFragment),
  startAt: true,
  roundsCount: sub.raw('count(result.rounds)', z.number().nullable()),
  _createdAt: true,
  _updatedAt: true,
}))

export const matchupService = {
  getOne: async (matchupId: string): Promise<IMatchup> => {
    const query = q.star
      .filterByType('matchup')
      .filterBy(`_id == "${matchupId}"`)
      .slice(0)
      .project(matchupFragment)

    return runQuery(query).then((matchup) => {
      if (!matchup) {
        throw new Error(`Matchup not found (id = ${matchupId})`)
      }

      const formatPlayer = (
        tp: NonNullable<(typeof matchup)['players']>[number]
      ): IMatchupPlayer => {
        return {
          _id: tp._id,
          color:
            tp.color ??
            tp.tournamentTeam?.color ??
            tp.tournamentTeam?.team?.color ??
            matchup.tournament?.participantColor ??
            tp.player?.color ??
            '#FFFFFF',

          name: tp.name ?? tp.player?.name,
          secondaryName:
            tp.designation ??
            tp.tournamentTeam?.name ??
            tp.tournamentTeam?.team?.name ??
            tp.player?.designation,
          thirdName: tp.nickname ?? tp.player?.nickname,

          portraitImageUrl: tp.image ?? tp.player?.image,
          riichiImageUrl:
            tp.riichiImage ??
            tp.tournamentTeam?.riichiImage ??
            tp.tournamentTeam?.team?.riichiImage ??
            matchup.tournament?.participantRiichiImage ??
            tp.player?.riichiImage,
          logoImageUrl:
            tp.tournamentTeam?.image ??
            tp.tournamentTeam?.team?.image ??
            matchup.tournament?.participantRiichiImage ??
            matchup.tournament?.image,
        }
      }

      return {
        name: matchup.name,
        players: matchup.players?.map(formatPlayer) ?? [],
        startAt: matchup.startAt,
        ruleset: { key: 'hkleague-4p' },
        theme: { key: 'default' },
        database: {
          _id: matchup._id,
          tournamentId: matchup.tournament?._id!,
        },
        roundsCount: matchup.roundsCount,
      }
    })
  },

  getManyByTournamentId: async (
    tournamentId: string,
    options?: {
      pending?: boolean
      offset?: number
      limit?: number
    }
  ): Promise<IMatchup[]> => {
    let query = q.star
      .filterByType('matchup')
      .filterRaw(`tournament._ref == "${tournamentId}"`)

    if (options?.pending) {
      query = query.filterRaw('!defined(result)')
    }

    const sliceStart = options?.offset ?? 0
    const sliceEnd = sliceStart + (options?.limit ?? 10)

    query = query.order('startAt asc').slice(sliceStart, sliceEnd)

    const queryProjected = query.project(matchupFragment)

    const matchups = await runQuery(queryProjected)
    if (matchups.length <= 0) {
      return []
    }

    const tournament = matchups[0].tournament

    const formatPlayer = (
      tp: NonNullable<(typeof matchups)[number]['players']>[number]
    ): IMatchupPlayer => {
      return {
        _id: tp._id,
        color:
          tp.color ??
          tp.tournamentTeam?.color ??
          tp.tournamentTeam?.team?.color ??
          tournament?.participantColor ??
          tp.player?.color ??
          '#FFFFFF',

        name: tp.name ?? tp.player?.name,
        secondaryName:
          tp.designation ??
          tp.tournamentTeam?.name ??
          tp.tournamentTeam?.team?.name ??
          tp.player?.designation,
        thirdName: tp.nickname ?? tp.player?.nickname,

        portraitImageUrl: tp.image ?? tp.player?.image,
        riichiImageUrl:
          tp.riichiImage ??
          tp.tournamentTeam?.riichiImage ??
          tp.tournamentTeam?.team?.riichiImage ??
          tournament?.participantRiichiImage ??
          tp.player?.riichiImage,
        logoImageUrl:
          tp.tournamentTeam?.image ??
          tp.tournamentTeam?.team?.image ??
          tournament?.participantRiichiImage ??
          tournament?.image,
      }
    }

    return matchups.map((matchup) => {
      return {
        name: matchup.name,
        players: matchup.players?.map(formatPlayer) ?? [],
        startAt: matchup.startAt,
        ruleset: { key: 'hkleague-4p' },
        theme: { key: 'default' },
        database: {
          _id: matchup._id,
          tournamentId,
        },
        roundsCount: matchup.roundsCount,
      } satisfies IMatchup
    })
  },
}
