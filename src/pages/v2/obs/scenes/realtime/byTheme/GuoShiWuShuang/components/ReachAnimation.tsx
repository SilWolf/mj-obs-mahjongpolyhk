import { RealtimePlayer } from '@/models'

import styles from './index.module.css'

export default function MJReachAnimationDiv({
  active,
  color = '#000000',
  largeLogoUrl,
}: {
  largeLogoUrl: RealtimePlayer['largeLogoUrl']
  color: string | null
  active: boolean
}) {
  return (
    <>
      <img src="/images/score-thousand.png" className="w-0 h-0 opacity-0" />

      {active && (
        <div className={styles['reach-animation']}>
          <div
            className="reach-background"
            style={{
              background: `linear-gradient(to bottom, transparent, ${color}80 40%, ${color}80 60%, transparent)`,
            }}
          ></div>
          <div
            className="reach-animation-logo"
            style={{ backgroundImage: `url("${largeLogoUrl}")` }}
          ></div>
          <div
            className="reach-animation-bar"
            style={{ backgroundImage: 'url("/images/score-thousand.png")' }}
          ></div>

          <div className="reach-characters">
            <div className="reach-character rii">立</div>
            <div className="reach-character chi">直</div>
          </div>
        </div>
      )}
    </>
  )
}
