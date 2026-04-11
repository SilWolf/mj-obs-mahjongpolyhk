import PlayerCard from '@/pages/v2/obs/scenes/realtime/byTheme/default/components/PlayerCard'
import { useMatchupByCurrentRoute } from '@/resources/matchups/hook'
import { CheckOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  Result,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd'

export default function MatchStartObsPage() {
  const { data: matchup, isLoading } = useMatchupByCurrentRoute()

  if (isLoading) {
    return <Spin />
  }

  if (!matchup) {
    return <Result status="404" title="找不到對局" />
  }

  return (
    <section className="max-w-[700px] mx-auto my-16">
      <Space vertical size={16}>
        <Alert title="請再確認一次內容及選手正確。" type="error" />

        <Card className="shadow">
          <Typography.Title level={3}>{matchup.name}</Typography.Title>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="text-5xl relative pb-10 pr-10">
                <PlayerCard score={25000} player={matchup.players[0]} />
                <p className="absolute bottom-0 right-0">東</p>
              </div>
            </Col>
            <Col span={12}>
              <div className="text-5xl relative pb-10 pl-10">
                <PlayerCard score={25000} player={matchup.players[3]} />
                <p className="absolute bottom-0 left-0">北</p>
              </div>
            </Col>
            <Col span={12}>
              <div className="text-5xl relative pt-10 pr-10">
                <PlayerCard score={25000} player={matchup.players[1]} />
                <p className="absolute top-0 right-0">南</p>
              </div>
            </Col>
            <Col span={12}>
              <div className="text-5xl relative pt-10 pl-10">
                <PlayerCard score={25000} player={matchup.players[2]} />
                <p className="absolute top-0 left-0">西</p>
              </div>
            </Col>
          </Row>
        </Card>

        <div className="text-center">
          <Button
            size="large"
            variant="solid"
            color="green"
            icon={<CheckOutlined />}
          >
            以上資料正確，開始直播
          </Button>
        </div>
      </Space>
    </section>
  )
}
