import { q, runQuery, urlFor } from '@/sanity'
import * as z from 'zod'
import { IMatchup, IMatchupPlayer } from './entity'
import { getLightColorOfColor } from '@/utils/string.util'

const playerProject = q.fragmentForType<'player'>().project((playerRef) => ({
  _id: z.string(),
  name: z.string().nullish(),
  nickname: z.string().nullish(),
  designation: z.string().nullish(),
  introduction: z.string().nullish(),
  portraitImage: playerRef.field('portraitImage.asset').field(
    '_ref',
    z
      .string()
      .nullish()
      .transform((assetId) =>
        urlFor(assetId, { mode: 'cover', width: 720, height: 1000 })
      )
  ),
  portraitAltImage: playerRef.field('portraitAltImage.asset').field(
    '_ref',
    z
      .string()
      .nullish()
      .transform((assetId) =>
        urlFor(assetId, { mode: 'cover', width: 720, height: 1000 })
      )
  ),
  fullBodyImage: playerRef.field('fullBodyImage.asset').field(
    '_ref',
    z
      .string()
      .nullish()
      .transform((assetId) =>
        urlFor(assetId, { mode: 'contain', height: 1200 })
      )
  ),
  fullBodyAltImage: playerRef.field('fullBodyAltImage.asset').field(
    '_ref',
    z
      .string()
      .nullish()
      .transform((assetId) =>
        urlFor(assetId, { mode: 'contain', height: 1200 })
      )
  ),
  riichiImage: playerRef.field('riichiImage.asset').field(
    '_ref',
    z
      .string()
      .nullish()
      .transform((assetId) =>
        urlFor(assetId, { mode: 'cover', width: 800, height: 800 })
      )
  ),
}))

const teamProject = q.fragmentForType<'team'>().project((teamRef) => ({
  _id: z.string(),
  name: z.string().nullish(),
  secondaryName: z.string().nullish(),
  thirdName: z.string().nullish(),
  preferredName: z.string().nullish(),
  squareLogoImage: teamRef.field('squareLogoImage.asset').field(
    '_ref',
    z
      .string()
      .nullish()
      .transform((assetId) => urlFor(assetId, { width: 1000, height: 1000 }))
  ),
  color: teamRef.field('color.hex', z.string().nullish()),
  introduction: z.string().nullish(),
}))

export const matchupService = {
  getOne: async (matchupId: string): Promise<IMatchup> => {
    const query = q.star
      .filterByType('match')
      .filterRaw(`_id == "${matchupId}"`)
      .slice(0)
      .project((sub) => ({
        _id: z.string(),
        name: z.string().nullish(),
        nameAlt: z.string().nullish(),
        startAt: true,
        tournament: sub
          .field('tournament')
          .deref()
          .project(() => ({
            _id: z.string(),
          })),
        playerEast: sub
          .field('playerEast')
          .deref()
          .project(playerProject)
          .nullable(true),
        playerSouth: sub
          .field('playerSouth')
          .deref()
          .project(playerProject)
          .nullable(true),
        playerWest: sub
          .field('playerWest')
          .deref()
          .project(playerProject)
          .nullable(true),
        playerNorth: sub
          .field('playerNorth')
          .deref()
          .project(playerProject)
          .nullable(true),
        playerEastTeam: sub
          .field('playerEastTeam')
          .deref()
          .project(teamProject),
        playerSouthTeam: sub
          .field('playerSouthTeam')
          .deref()
          .project(teamProject),
        playerWestTeam: sub
          .field('playerWestTeam')
          .deref()
          .project(teamProject),
        playerNorthTeam: sub
          .field('playerNorthTeam')
          .deref()
          .project(teamProject),
        roundsCount: sub.raw('count(rounds)', z.number().nullable()),
        _createdAt: true,
        _updatedAt: true,
      }))

    return runQuery(query).then((matchup) => {
      if (!matchup) {
        throw new Error(`Matchup not found (id = ${matchupId})`)
      }

      const formatPlayer = (
        player: (typeof matchup)['playerEast'],
        team: (typeof matchup)['playerEastTeam']
      ): IMatchupPlayer => ({
        _id: player?._id ?? '',
        teamId: team?._id ?? '',
        name: player?.name ?? '',
        secondaryName: team?.preferredName ?? player?.designation,
        thirdName: player?.nickname,
        color: team?.color ?? '#FFFF00',
        secondaryColor: getLightColorOfColor(team?.color ?? '#FFFF00'),
        portraitImageUrl: player?.portraitImage,
        portraitAltImageUrl: player?.portraitAltImage,
        fullBodyImageUrl: player?.fullBodyImage,
        fullBodyAltImageUrl: player?.fullBodyAltImage,
        riichiImageUrl: player?.riichiImage,
        logoImageUrl: team?.squareLogoImage,
      })

      return {
        name: matchup.name,
        players: [
          formatPlayer(matchup.playerEast, matchup.playerEastTeam),
          formatPlayer(matchup.playerSouth, matchup.playerSouthTeam),
          formatPlayer(matchup.playerWest, matchup.playerWestTeam),
          formatPlayer(matchup.playerNorth, matchup.playerNorthTeam),
        ],
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
    options?: { recent?: boolean }
  ): Promise<IMatchup[]> => {
    const query = q.star
      .filterByType('match')
      .filterRaw(
        `tournament._ref == "${tournamentId}"` +
          (options?.recent ? ' && !defined(resultUploadedAt)' : '')
      )
      .order('startAt asc')
      .slice(0, 10)
      .project((sub) => ({
        _id: z.string(),
        name: z.string().nullish(),
        nameAlt: z.string().nullish(),
        startAt: true,
        playerEast: sub
          .field('playerEast')
          .deref()
          .project(playerProject)
          .nullable(true),
        playerSouth: sub
          .field('playerSouth')
          .deref()
          .project(playerProject)
          .nullable(true),
        playerWest: sub
          .field('playerWest')
          .deref()
          .project(playerProject)
          .nullable(true),
        playerNorth: sub
          .field('playerNorth')
          .deref()
          .project(playerProject)
          .nullable(true),
        playerEastTeam: sub
          .field('playerEastTeam')
          .deref()
          .project(teamProject),
        playerSouthTeam: sub
          .field('playerSouthTeam')
          .deref()
          .project(teamProject),
        playerWestTeam: sub
          .field('playerWestTeam')
          .deref()
          .project(teamProject),
        playerNorthTeam: sub
          .field('playerNorthTeam')
          .deref()
          .project(teamProject),
        roundsCount: sub.raw('count(rounds)', z.number().nullable()),
        _createdAt: true,
        _updatedAt: true,
      }))

    return runQuery(query).then((matchupes) => {
      const formatPlayer = (
        player: (typeof matchupes)[number]['playerEast'],
        team: (typeof matchupes)[number]['playerEastTeam']
      ): IMatchupPlayer => ({
        _id: player?._id ?? '',
        teamId: team?._id ?? '',
        name: player?.name ?? '',
        secondaryName: team?.preferredName ?? player?.designation,
        thirdName: player?.nickname,
        color: team?.color ?? '#FFFF00',
        secondaryColor: getLightColorOfColor(team?.color ?? '#FFFF00'),
        portraitImageUrl: player?.portraitImage,
        portraitAltImageUrl: player?.portraitAltImage,
        fullBodyImageUrl: player?.fullBodyImage,
        fullBodyAltImageUrl: player?.fullBodyAltImage,
        riichiImageUrl: player?.riichiImage,
        logoImageUrl: team?.squareLogoImage,
      })

      return matchupes.map((matchup) => {
        return {
          name: matchup.name,
          players: [
            formatPlayer(matchup.playerEast, matchup.playerEastTeam),
            formatPlayer(matchup.playerSouth, matchup.playerSouthTeam),
            formatPlayer(matchup.playerWest, matchup.playerWestTeam),
            formatPlayer(matchup.playerNorth, matchup.playerNorthTeam),
          ],
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
    })
  },

  getManyPendingByTournamentId: async (
    tournamentId: string,
    options?: { recent?: boolean }
  ): Promise<IMatchup[]> => {
    const query = q.star
      .filterByType('match')
      .filterRaw(
        `tournament._ref == "${tournamentId}" && !defined(count(rounds))` +
          (options?.recent ? ' && !defined(resultUploadedAt)' : '')
      )
      .order('startAt asc')
      .slice(0, 10)
      .project((sub) => ({
        _id: z.string(),
        name: z.string().nullish(),
        nameAlt: z.string().nullish(),
        startAt: true,
        playerEast: sub
          .field('playerEast')
          .deref()
          .project(playerProject)
          .nullable(true),
        playerSouth: sub
          .field('playerSouth')
          .deref()
          .project(playerProject)
          .nullable(true),
        playerWest: sub
          .field('playerWest')
          .deref()
          .project(playerProject)
          .nullable(true),
        playerNorth: sub
          .field('playerNorth')
          .deref()
          .project(playerProject)
          .nullable(true),
        playerEastTeam: sub
          .field('playerEastTeam')
          .deref()
          .project(teamProject),
        playerSouthTeam: sub
          .field('playerSouthTeam')
          .deref()
          .project(teamProject),
        playerWestTeam: sub
          .field('playerWestTeam')
          .deref()
          .project(teamProject),
        playerNorthTeam: sub
          .field('playerNorthTeam')
          .deref()
          .project(teamProject),
        roundsCount: sub.raw('count(rounds)', z.number().nullable()),
        _createdAt: true,
        _updatedAt: true,
      }))

    return runQuery(query).then((matchupes) => {
      const formatPlayer = (
        player: (typeof matchupes)[number]['playerEast'],
        team: (typeof matchupes)[number]['playerEastTeam']
      ): IMatchupPlayer => ({
        _id: player?._id ?? '',
        teamId: team?._id ?? '',
        name: player?.name ?? '',
        secondaryName: team?.preferredName ?? player?.designation,
        thirdName: player?.nickname,
        color: team?.color ?? '#FFFF00',
        secondaryColor: getLightColorOfColor(team?.color ?? '#FFFF00'),
        portraitImageUrl: player?.portraitImage,
        portraitAltImageUrl: player?.portraitAltImage,
        fullBodyImageUrl: player?.fullBodyImage,
        fullBodyAltImageUrl: player?.fullBodyAltImage,
        riichiImageUrl: player?.riichiImage,
        logoImageUrl: team?.squareLogoImage,
      })

      return matchupes.map((matchup) => {
        return {
          name: matchup.name,
          players: [
            formatPlayer(matchup.playerEast, matchup.playerEastTeam),
            formatPlayer(matchup.playerSouth, matchup.playerSouthTeam),
            formatPlayer(matchup.playerWest, matchup.playerWestTeam),
            formatPlayer(matchup.playerNorth, matchup.playerNorthTeam),
          ],
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
    })
  },
}
