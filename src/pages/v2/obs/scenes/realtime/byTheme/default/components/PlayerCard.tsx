import MJAmountSpan from '@/components/MJAmountSpan'
import React, { useEffect, useMemo, useState } from 'react'
import {
  getLightColorOfColor,
  renderPoint,
  renderRanking,
} from '@/utils/string.util'

import styles from './index.module.css'
import MJTileCombinationDiv from '@/components/MJTileCombinationDiv'
import useDebounce from '@/hooks/useDebounce'
import MJTileV2Div from '@/components/MJTileV2Div'
import { PlayerCardBaseProps } from '../../../PlayerCard/type'

import BgImage from './assets/bg.webp'
import BgRiichiImage from './assets/bg-riichi2.webp'
import { hexToHsl } from '@/utils/color.util'

type Props = PlayerCardBaseProps

export default function PlayerCard({
  score,
  scoreChanges,
  point,
  ranking,
  isEast,
  isRiichi,
  isFuriten,
  isYellowCarded,
  isRedCarded,
  isRonDisallowed,
  waitingTiles,
  waitingTileRemain,
  reveals,
  showPointAndRanking,
  className,

  player,
  ...props
}: Props) {
  const [storedScore, setStoredScore] = useState<number>(score)
  const [storedScoreChanges, setStoredScoreChanges] = useState<
    number[] | null | undefined
  >(null)
  const debouncedWaitingTileRemain = useDebounce(waitingTileRemain, 800)

  const lightenedColor = useMemo(
    () => getLightColorOfColor(player.color ?? '#000000'),
    [player.color]
  )

  const isScoreChanging = useMemo(
    () => !!storedScoreChanges,
    [storedScoreChanges]
  )

  useEffect(() => {
    if (score !== storedScore) {
      setStoredScoreChanges(scoreChanges)

      setTimeout(() => {
        setStoredScore(score)
      }, 2550)

      setTimeout(() => {
        setStoredScoreChanges(null)
      }, 3000)
    }
  }, [score, scoreChanges, storedScore])

  return (
    <div className="w-[5.6em] h-[2.5em] relative text-white">
      <div
        className="absolute bottom-0 right-0 w-[67%] h-[35%]"
        style={{
          backgroundColor: player.color,
          opacity: isRiichi ? 0.65 : 0.5,
          borderTopLeftRadius: 40,
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[67%] h-[35%] animate-pulse"
        style={{
          borderBottom: isRiichi ? `0.1em solid ${player.color}` : '',
          animationDuration: '4s',
        }}
      />
      <img
        className="absolute left-0 bottom-0 w-[33%] rounded-bl-[30%]"
        src={player.propicUrl ?? ''}
        alt=""
      />
      <div
        className="absolute -bottom-[4%] right-[2.5%] w-[60%] text-right font-kanit text-[0.75em] transition-[opacity,transform] duration-700"
        style={{
          opacity: !showPointAndRanking ? 1 : 0,
          transform: !showPointAndRanking ? 'translateY(0)' : 'translateY(1em)',
          textShadow:
            '#00000048 2px 2px 3px, #00000048 -2px -2px 3px, #00000048 -2px 2px 3px, #00000048 2px -2px 3px, #00000048 0 0 6px',
        }}
      >
        <MJAmountSpan animated value={storedScore} />
      </div>
      <div
        className="absolute -bottom-[3%] right-[2.5%] w-[60%] text-right font-kanit text-[0.75em] transition-opacity duration-700"
        style={{
          opacity: showPointAndRanking ? 1 : 0,
          textShadow:
            '#00000048 2px 2px 3px, #00000048 -2px -2px 3px, #00000048 -2px 2px 3px, #00000048 2px -2px 3px, #00000048 0 0 6px',
        }}
      >
        {renderPoint(point)}
      </div>
      <div
        className="absolute bottom-[1%] right-[2.5%] w-[60%] text-left font-kanit text-[0.5em] transition-opacity duration-700"
        style={{
          opacity: showPointAndRanking ? 1 : 0,
          textShadow:
            '#00000048 2px 2px 3px, #00000048 -2px -2px 3px, #00000048 -2px 2px 3px, #00000048 2px -2px 3px, #00000048 0 0 6px',
        }}
      >
        {renderRanking(ranking)}
      </div>
      <div
        className="absolute bottom-[37%] right-[3%] w-[60%] text-right text-[0.4em] transition-opacity"
        style={{
          opacity: storedScoreChanges ? 0 : 1,
          textShadow:
            '#00000048 2px 2px 3px, #00000048 -2px -2px 3px, #00000048 -2px 2px 3px, #00000048 2px -2px 3px, #00000048 0 0 6px',
        }}
      >
        {player.primaryName}
      </div>

      <div
        className="absolute right-0 bottom-[60%] rounded-r-[.125em] bg-black/50 data-[furiten=true]:bg-red-500/25 overflow-hidden origin-right"
        style={{
          transform:
            waitingTiles && waitingTiles.length > 0
              ? 'scale(100%, 100%)'
              : 'scale(0, 100%)',
          opacity: waitingTiles && waitingTiles.length > 0 ? 1 : 0,
          transition: 'transform 1s, opacity 1s, background-color 1s',
        }}
        data-has-waiting-tiles={waitingTiles && waitingTiles.length > 0}
        data-furiten={isFuriten}
      >
        <div className="text-[0.5em] flex gap-x-[0.2em] p-[0.2em] pl-[0.2em] pr-[0.2em]">
          <div className="flex-1 leading-none flex flex-wrap gap-[0.1em] text-[0.85em]">
            {waitingTiles?.map((tile) => (
              <div
                key={tile}
                className="animate-[fadeInFromLeft_1s_ease-in-out]"
              >
                <MJTileV2Div value={tile} />
              </div>
            ))}
          </div>
          <div className="bg-[#FFFFFF] w-[4px]" />
          <div className="text-[#FFFFFF] text-[0.4em] leading-[1.3em] flex items-center">
            {typeof debouncedWaitingTileRemain === 'number' ? (
              <div className="text-center">
                <p
                  className="pt-[0.1em] font-numeric"
                  style={{
                    fontSize:
                      debouncedWaitingTileRemain > 9 ? '1.8em' : '2.2em',
                    opacity: debouncedWaitingTileRemain === 0 ? 0.5 : 1,
                  }}
                >
                  {debouncedWaitingTileRemain}
                </p>
              </div>
            ) : (
              <>
                待<br />牌
              </>
            )}
          </div>
        </div>
      </div>

      <div className="absolute -top-[16%] left-0 right-0">
        <div
          className="relative bg-black/50 rounded-[.125em] opacity-0 transition-opacity data-[has-reveals=true]:opacity-100 hide-if-changing overflow-visible origin-left"
          style={{
            transform:
              reveals && reveals.length > 0
                ? 'scale(100%, 100%)'
                : 'scale(0, 100%)',
            transition: 'transform 1s',
          }}
          data-has-reveals={reveals && reveals.length > 0}
        >
          <div className="flex flex-row-reverse items-end justify-end flex-wrap text-[0.28em] gap-x-2 p-2">
            {reveals?.map((reveal, rI) => (
              <div key={rI} className={styles['sakura-review-block']}>
                <div>
                  <MJTileCombinationDiv value={reveal} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {storedScoreChanges && (
        <div
          className="absolute text-right w-[60%] text-[0.75em] bottom-[40%] right-[2.5%] leading-none animate-[drop_3s_ease-in-out] font-kanit"
          style={{
            textShadow:
              '#00000048 2px 2px 3px, #00000048 -2px -2px 3px, #00000048 -2px 2px 3px, #00000048 2px -2px 3px, #00000048 0 0 6px',
          }}
        >
          {storedScoreChanges.map((scoreChange) => (
            <div>
              <MJAmountSpan
                signed
                value={scoreChange}
                positiveClassName="text-[#09eb09]"
                negativeClassName="text-[#eb0000]"
              />
            </div>
          ))}
        </div>
      )}

      {isEast && (
        <div className="absolute -bottom-[8%] left-[10%] right-0 h-1 rounded-full bg-red-500" />
      )}
    </div>
  )
}
