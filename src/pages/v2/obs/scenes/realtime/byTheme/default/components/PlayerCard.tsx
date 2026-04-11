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

  const hslColor = useMemo(() => hexToHsl(player.color), [player.color])

  console.log(hslColor)

  return (
    <div className="w-[400px] h-[200px] relative">
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
          borderBottom: isRiichi ? `6px solid ${player.color}` : '',
          animationDuration: '4s',
        }}
      />
      <img
        className="absolute left-0 bottom-0 w-[33%] rounded-bl-[30%]"
        src="https://cdn.sanity.io/images/0a9a4r26/production/31ab48d53a61100eb50f74a755f66db412b88f6c-360x500.png?auto=format&fit=max&q=75&w=360"
        alt=""
      />
      <div
        className="absolute -bottom-[3%] right-[2.5%] w-[60%] text-right font-kanit text-[0.75em]"
        style={{
          textShadow:
            '#00000048 2px 2px 3px, #00000048 -2px -2px 3px, #00000048 -2px 2px 3px, #00000048 2px -2px 3px, #00000048 0 0 6px',
        }}
      >
        <MJAmountSpan animated value={storedScore} />
      </div>
      <div
        className="absolute bottom-[37%] right-[3%] w-[60%] text-right text-[0.4em]"
        style={{
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

      {isEast && (
        <div className="absolute -bottom-[12px] left-0 right-0 h-1 rounded-full bg-red-500" />
      )}
    </div>
  )

  return (
    <div
      className="relative min-w-[5.35em] mx-auto [&_.hide-if-changing]:transition-opacity data-[score-changing='1']:[&_.hide-if-changing]:opacity-0 overflow-visible"
      data-score-changing={isScoreChanging ? '1' : '0'}
    >
      <div className="absolute top-[0.05em] bottom-[0.15em] -left-[0.1em] -right-[0.1em] rounded-[0.1em] overflow-hidden -z-50">
        {isYellowCarded && (
          <div className="absolute top-0 left-0 w-[200%] aspect-square animate-[yellowPenaltyAni_8s_ease-in-out_1]"></div>
        )}
        {isRedCarded && (
          <div className="absolute top-0 left-0 w-[200%] aspect-square animate-[redPenaltyAni_8s_ease-in-out_1]"></div>
        )}
      </div>
      {isYellowCarded && (
        <div className="absolute -top-[0.4em] left-0 h-[0.5em] w-[0.37em] bg-[#ffe100] rounded-[0.05em]"></div>
      )}
      {isRedCarded && (
        <div className="absolute -top-[0.4em] left-[0.45em] h-[0.5em] w-[0.37em] bg-[#ff1900] rounded-[0.05em]"></div>
      )}

      <div className="absolute bottom-full left-0 right-0">
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

      <div className="flex items-end pt-2">
        <div className="shrink-0 w-[1.83em] h-full relative -bottom-[0.085em] -left-[0.085em]">
          <div
            className="absolute w-full h-full bg-[#d1b571] overflow-hidden rounded-[0.1em]"
            style={{ opacity: isRiichi ? 1 : 0 }}
          >
            <div className="origin-bottom w-[200%] h-[100%] bg-[#d1291d] animate-[riichi_8s_ease-in-out_infinite]" />
          </div>

          <div className="relative z-10 w-full aspect-90/125 p-[0.085em]">
            <div
              className="w-full h-full bg-white rounded-[0.08em] overflow-hidden"
              style={{
                background: `linear-gradient(180deg, ${player.color}, ${lightenedColor})`,
              }}
            >
              {player.logoUrl && (
                <div className="absolute inset-[0.085em] overflow-hidden">
                  <img
                    className="absolute max-w-[none] h-[2.2em] w-[2.2em] opacity-30 animate-[scrollFromRightToLeft_12s_linear_infinite]"
                    src={player.logoUrl}
                    alt={player.primaryName}
                  />
                </div>
              )}
              {player.propicUrl && (
                <img
                  className="relative z-10 w-full h-full rounded-[0.08em]"
                  src={player.propicUrl}
                  alt={player.primaryName}
                />
              )}
              {player.nickname && (
                <div className="absolute bottom-[0.085em] left-[0.085em] right-[0.085em] rounded-b-[0.08em] bg-[linear-gradient(to_top,#00000060,#00000050_70%,transparent)] text-white z-20">
                  <p className="text-center text-[0.25em] font-semibold pb-[0.25em] pt-[0.5em]">
                    {player.nickname}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-y-[0.125em] items-start justify-end">
          <div className="flex gap-[0.125em] relative self-stretch">
            <div className="absolute inset-0 flex items-end">
              <div
                className="text-center bg-red-600 text-[0.3em] flex gap-x-[0.2em] px-[1em] opacity-0 transition-opacity hide-if-changing cursor-pointer"
                style={{
                  opacity: isRonDisallowed ? 1 : 0,
                }}
              >
                <i className="bi bi-ban"></i> 和了禁止
              </div>
            </div>
            <div
              className="relative rounded-r-[.125em] bg-black/50 data-[furiten=true]:bg-red-500/25 overflow-hidden origin-left"
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
              <div
                className="text-[0.25em] pl-2 bg-red-600/50 overflow-hidden h-0 data-[furiten=true]:h-[1.5em] transition-[height] duration-1000"
                data-furiten={isFuriten}
              >
                <i className="bi bi-exclamation-diamond"></i> 振聽
              </div>
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
          </div>
          <div
            className={`relative w-full text-left bg-white px-[0.1em] pb-[0.05em] pt-[0.08em] ${className}`}
            {...props}
            style={{
              background: `linear-gradient(260deg, transparent, transparent 22px, ${lightenedColor} 23px, ${player.color} 100%`,
              textShadow:
                '#00000048 2px 2px 3px, #00000048 -2px -2px 3px, #00000048 -2px 2px 3px, #00000048 2px -2px 3px, #00000048 0 0 6px',
            }}
          >
            <div className="flex flex-col justify-center gap-y-[0.075em] mt-[0.04em]">
              <div className="text-[0.1875em] ml-[0.1em] leading-none text-white hide-if-changing font-semibold whitespace-nowrap">
                {player.secondaryName || '　'}
              </div>
              <div
                className="text-[0.3125em] ml-[0.1em] leading-none text-white hide-if-changing font-semibold whitespace-nowrap"
                style={{
                  transformOrigin: 'left',
                  transform:
                    (player.primaryName || '').length >= 17
                      ? 'scaleX(0.9)'
                      : 'scaleX(1)',
                }}
              >
                {player.primaryName}
              </div>
            </div>

            {storedScoreChanges && (
              <div className="absolute bottom-[2.75em] pr-[0.125em] left-0 text-[0.5625em] leading-none animate-[drop_3s_ease-in-out] font-numeric">
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

            <div className="relative mt-[0.12em] mb-[0.03em]">
              <p
                className="relative text-[0.5625em] flex-1 leading-none text-white font-numeric"
                style={{
                  transition: 'opacity 1s, bottom 1s',
                  opacity: showPointAndRanking ? 0 : 1,
                  bottom: showPointAndRanking ? '1em' : 0,
                }}
              >
                <MJAmountSpan animated value={storedScore} />
              </p>
              <p
                className="absolute left-0 right-[0.25em] text-[0.5625em] flex-1 leading-none text-white font-numeric"
                style={{
                  transition: 'opacity 1s, bottom 1s',
                  opacity: showPointAndRanking ? 1 : 0,
                  bottom: showPointAndRanking ? 0 : '-1em',
                }}
              >
                {renderPoint(point)}
                <span className="text-[0.8em]">pt</span>

                <span className="absolute right-0 bottom-0 text-[0.75em]">
                  {renderRanking(ranking)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`mt-[0.2em] h-[0.075em] rounded-full ${
          isEast && 'bg-red-500'
        }`}
      />
    </div>
  )
}
