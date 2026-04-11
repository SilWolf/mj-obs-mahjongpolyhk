import { useCallback } from 'react'
import DraftMatchesTable from './DraftMatchesTable'
import { Link } from 'react-router'
import useCurrentTournament from '../../hooks/useCurrentTournament'
import { Button, Space } from 'antd'
import { ExportOutlined, ReloadOutlined } from '@ant-design/icons'

export default function DraftMatchesSection() {
  const { data: currentTournament } = useCurrentTournament()

  return (
    <>
      <DraftMatchesTable />
    </>
  )
}
