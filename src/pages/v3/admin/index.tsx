import { useTournaments } from '@/resources/tournaments/hook'
import { Avatar, Card, List, Skeleton, Table } from 'antd'
import { Link } from 'react-router'

export default function V3AdminPage() {
  const { data: tournaments, isLoading } = useTournaments()

  return (
    <Card style={{ maxWidth: 360, margin: 'auto', marginTop: 120 }}>
      <List
        loading={isLoading}
        itemLayout="horizontal"
        dataSource={tournaments}
        renderItem={(tournament) => (
          <List.Item
            actions={[
              <Link to={`/admin/tournaments/${tournament._id}`}>選擇</Link>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={tournament.logoImageUrl ?? ''} />}
              title={tournament.name}
            />
          </List.Item>
        )}
      />
    </Card>
  )
}
