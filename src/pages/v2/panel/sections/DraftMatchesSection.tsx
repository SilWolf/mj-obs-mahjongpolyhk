import { useCallback } from 'react'
import MatchesFromDatabaseDialog, {
  openMatchesFromDatabaseDialog,
} from './MatchesFromDatabaseDialog'
import DraftMatchesTable from './DraftMatchesTable'
import { Link } from 'wouter'

export default function DraftMatchesSection() {
  const handleClickOpenImportDialog = useCallback(() => {
    openMatchesFromDatabaseDialog()
  }, [])

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-2xl">對局</h2>
        <div className="space-x-2">
          <Link href="/draft-matches/create">
            <button className="btn btn-success">建立對局草稿</button>
          </Link>
          <button
            className="btn btn-outline"
            onClick={handleClickOpenImportDialog}
          >
            <i className="bi bi-cloud-download"></i> 從資料庫導入
          </button>
        </div>
      </div>

      <DraftMatchesTable />

      <MatchesFromDatabaseDialog />
    </>
  )
}
