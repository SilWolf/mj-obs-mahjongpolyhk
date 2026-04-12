import { q, runQuery, urlFor } from '@/sanity'
import * as z from 'zod'
import { V2Match } from '../models/V2Match.model'
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

export const apiGetMatchById = async (matchId: string) => {
  const query = q.star
    .filterByType('match')
    .filterRaw(`_id == "${matchId}"`)
    .order('startAt asc')
    .slice(0, 1)
    .project((sub) => ({
      _id: z.string(),
      name: z.string().nullish(),
      nameAlt: z.string().nullish(),
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
      playerEastTeam: sub.field('playerEastTeam').deref().project(teamProject),
      playerSouthTeam: sub
        .field('playerSouthTeam')
        .deref()
        .project(teamProject),
      playerWestTeam: sub.field('playerWestTeam').deref().project(teamProject),
      playerNorthTeam: sub
        .field('playerNorthTeam')
        .deref()
        .project(teamProject),
      _createdAt: true,
      _updatedAt: true,
      tournament: true,
    }))

  return runQuery(query).then((matches) => {
    if (matches.length === 0) {
      throw new Error('找不到賽事')
    }

    const formatPlayer = (
      player: (typeof matches)[number]['playerEast'],
      team: (typeof matches)[number]['playerEastTeam']
    ) => ({
      id: player?._id ?? '',
      teamId: team?._id ?? '',
      color: {
        primary: team?.color ?? '#FFFF00',
        secondary: getLightColorOfColor(team?.color ?? '#FFFF00'),
      },
      name: {
        official: {
          primary: player?.name ?? '',
          secondary: player?.designation ?? '',
          third: player?.nickname ?? '',
        },
        display: {
          primary: player?.name ?? '',
          secondary: team?.preferredName ?? '',
          third: player?.nickname ?? '',
        },
      },
      image: {
        portrait: {
          default: {
            url: player?.portraitImage ?? '',
          },
        },
        logo: {
          default: {
            url: team?.squareLogoImage ?? '',
          },
        },
      },
    })

    return {
      schemaVersion: '2',
      code: matches[0]._id,
      data: {
        tournamentId: matches[0].tournament?._ref,
        name: {
          official: { primary: matches[0].name ?? '' },
          display: matches[0].nameAlt ? { primary: matches[0].nameAlt } : null,
        },
        players: [
          formatPlayer(matches[0].playerEast, matches[0].playerEastTeam),
          formatPlayer(matches[0].playerSouth, matches[0].playerSouthTeam),
          formatPlayer(matches[0].playerWest, matches[0].playerWestTeam),
          formatPlayer(matches[0].playerNorth, matches[0].playerNorthTeam),
        ],
        rulesetRef: 'hkleague-4p',
        themeRef: 'default',
      },
      metadata: {
        createdAt: matches[0]._createdAt,
        updatedAt: matches[0]._updatedAt,
      },
    } satisfies V2Match
  })
}
