import useDraftMatches from '@/hooks/useDraftMatches'
import { Link } from 'wouter'
import { RealtimePlayer } from '@/models'

function DraftMatchPlayerMiniCard({ player }: { player: RealtimePlayer }) {
  return (
    <div className="flex gap-1 items-center">
      <div
        className="h-10 aspect-square p-1"
        style={{ backgroundColor: player.color }}
      >
        <img src={player.logoUrl || 'null'} className="aspect-square" alt="" />
      </div>
      <img
        src={player.propicUrl || 'null'}
        className="h-10 aspect-[18/25]"
        alt=""
      />
      <div>
        <p className="font-bold">{player.primaryName}</p>
        <p className="text-sm">{player.secondaryName}</p>
        <p className="text-xs">{player.nickname}</p>
      </div>
    </div>
  )
}

export default function DraftMatchesTable() {
  const { draftMatches = [] } = useDraftMatches()

  return (
    <table className="table w-full">
      {/* head */}
      <thead>
        <tr>
          <th>對局</th>
          <th className="w-1/5">東</th>
          <th className="w-1/5">南</th>
          <th className="w-1/5">西</th>
          <th className="w-1/5">北</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {draftMatches.map((draftMatch) => (
          <tr key={draftMatch.code}>
            <th>
              <div>{draftMatch.name}</div>
            </th>
            <td>
              <DraftMatchPlayerMiniCard player={draftMatch.players[0]} />
            </td>
            <td>
              <DraftMatchPlayerMiniCard player={draftMatch.players[1]} />
            </td>
            <td>
              <DraftMatchPlayerMiniCard player={draftMatch.players[2]} />
            </td>
            <td>
              <DraftMatchPlayerMiniCard player={draftMatch.players[3]} />
            </td>
            <td className="whitespace-nowrap">
              <div className="space-x-4">
                <Link
                  href={`/draft-matches/${draftMatch._id}/edit`}
                  className="text-primary"
                >
                  編輯
                </Link>
                <Link
                  href={`/draft-matches/${draftMatch._id}/copy`}
                  className="text-primary"
                >
                  複製
                </Link>
                <Link
                  href={`/draft-matches/${draftMatch._id}/nameplate`}
                  className="text-primary"
                  target="_blank"
                >
                  名牌
                </Link>
              </div>
              <div>
                <Link
                  href={`/draft-matches/${draftMatch._id}/start`}
                  className="text-success"
                >
                  開始直播
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
