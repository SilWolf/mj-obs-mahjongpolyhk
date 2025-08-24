import { Dialog, openDialog } from '@/components/Dialog'
import { useQuery } from '@tanstack/react-query'
import { apiQueryMatchesByTournamentId } from '../../services/match.service'
import { V2MatchPlayer } from '../../models/V2Match.model'
import { renderDate } from '@/utils/string.util'
import useCurrentTournament from '../../hooks/useCurrentTournament'
import { Link } from 'wouter'

const dialogId = 'matches-from-database-dialog'

function PlayerMiniCard({ player }: { player: V2MatchPlayer }) {
  return (
    <div className="flex gap-1 items-center">
      <div
        className="h-10 aspect-square p-1"
        style={{ backgroundColor: player.color.primary }}
      >
        <img
          src={player.image.logo?.default.url}
          className="aspect-square"
          alt=""
        />
      </div>
      <img
        src={player.image.portrait?.default.url}
        className="h-10 aspect-[18/25]"
        alt=""
      />
      <div>
        <p className="font-bold">{player.name.display.primary}</p>
        <p className="text-sm">{player.name.display.secondary}</p>
        <p className="text-xs">{player.name.display.third}</p>
      </div>
    </div>
  )
}

export const openMatchesFromDatabaseDialog = () => {
  openDialog(dialogId)
}

export default function MatchesFromDatabaseDialog() {
  const { data } = useCurrentTournament()
  const { data: matches = [], refetch: refetchMatchesFromDatabase } = useQuery({
    queryKey: ['v2-tournaments', data?.tournament.id, 'matches'],
    queryFn: ({ queryKey }) =>
      apiQueryMatchesByTournamentId(queryKey[1]!, { recent: true }),
    enabled: false,
  })

  if (!data) {
    return <></>
  }

  return (
    <Dialog
      id={dialogId}
      className="max-w-6xl"
      onOpen={refetchMatchesFromDatabase}
    >
      <h2 className="text-2xl mb-4">從資料庫導入</h2>
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>對局</th>
            <th>東</th>
            <th>南</th>
            <th>西</th>
            <th>北</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {matches.map((match) => (
            <tr key={match.code}>
              <th>
                <p>{match.data.name.official.primary}</p>
                <p className="font-normal opacity-50">
                  {renderDate(match.data.startAt)}
                </p>
              </th>
              <td>
                <PlayerMiniCard
                  player={
                    data.playersMap[match.data.players[0].id] ??
                    match.data.players[0]
                  }
                />
              </td>
              <td>
                <PlayerMiniCard
                  player={
                    data.playersMap[match.data.players[1].id] ??
                    match.data.players[1]
                  }
                />
              </td>
              <td>
                <PlayerMiniCard
                  player={
                    data.playersMap[match.data.players[2].id] ??
                    match.data.players[2]
                  }
                />
              </td>
              <td>
                <PlayerMiniCard
                  player={
                    data.playersMap[match.data.players[3].id] ??
                    match.data.players[3]
                  }
                />
              </td>
              <td>
                <Link
                  href={`/draft-matches/import-from-database/${match.code}`}
                  className="text-success"
                >
                  <button className="btn w-16">導入</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Dialog>
  )
}
