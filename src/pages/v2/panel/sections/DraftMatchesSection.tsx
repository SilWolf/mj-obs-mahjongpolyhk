import { useCallback } from 'react'
import DraftMatchesTable from './DraftMatchesTable'
import { Link } from 'react-router'
import useCurrentTournament from '../../hooks/useCurrentTournament'

export default function DraftMatchesSection() {
  const { data: currentTournament } = useCurrentTournament()

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-2xl">對局</h2>
        <div className="space-x-2">
          <Link to="/draft-matches/create">
            <button className="btn btn-success">建立對局草稿</button>
          </Link>
        </div>
      </div>

      <DraftMatchesTable />
    </>
  )
}
