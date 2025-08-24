import InputColor from '@/components/v2/inputs/InputColor'
import { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRandomId } from '@/utils/string.util'
import useAllRulesets from '../../hooks/useAllRulesets'
import useRuleset from '../../hooks/useRuleset'
import { V2Match } from '../../models/V2Match.model'
import PlayerCard from '../../obs/scenes/realtime/byTheme/GuoShiWuShuang/components/PlayerCard'

const positionNames = ['東家', '南家', '西家', '北家']

const formSchema = zod.object({
  name: zod.string({ required_error: '必須填寫對局名稱。' }),
  nameAlt: zod.string().optional(),
  rulesetId: zod.string({ required_error: '必須選擇其中一套規則。' }),
  players: zod.array(
    zod.object({
      namePrimary: zod.string({ required_error: '玩家必須有名稱' }),
      nameSecondary: zod.string(),
      nameThird: zod.string(),
      colorPrimary: zod
        .string({ required_error: '玩家必須有主要顏色' })
        .regex(/^#[0-9A-F]{6}$/i, '顏色必須是 #ABCDEF 格式。'),
      colorSecondary: zod
        .string()
        .regex(/^#[0-9A-F]{6}$/i, '顏色必須是 #ABCDEF 格式。'),
      imagePortraitUrl: zod.string().optional(),
      imageLogoUrl: zod.string().optional(),
      imagePortraitAltUrl: zod.string().optional(),
      imageRiichiUrl: zod.string().optional(),
    })
  ),
})

type FormProps = zod.infer<typeof formSchema>

export default function V2MatchForm({
  onSubmit,
  defaultValues,
  autoSubmit,
}: {
  onSubmit: (newMatch: V2Match) => void
  defaultValues?: FormProps | undefined
  autoSubmit?: boolean
}) {
  const { data: rulesets = [] } = useAllRulesets()

  const {
    control,
    register,
    handleSubmit: handleRHFSubmit,
    reset,
    formState,
  } = useForm<FormProps>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const watchedRulesetId = useWatch({ name: 'rulesetId', control })
  const { data: watchedRuleset } = useRuleset(watchedRulesetId)

  const watchedPlayers = useWatch({ name: 'players', control })

  const handleClickSwap = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!watchedRuleset) {
        return
      }

      const leftIndex = parseInt(
        e.currentTarget.getAttribute('data-player-index') as string
      )
      if (typeof leftIndex !== 'number') {
        return
      }

      const rightIndex =
        (leftIndex + 1 + watchedRuleset.data.playerCount) %
        watchedRuleset.data.playerCount

      reset((prev) => {
        const newPlayers = [...prev.players]
        ;[newPlayers[leftIndex], newPlayers[rightIndex]] = [
          newPlayers[rightIndex],
          newPlayers[leftIndex],
        ]

        return {
          ...prev,
          players: newPlayers,
        }
      })
    },
    [reset, watchedRuleset]
  )

  const handleSubmit = useMemo(
    () =>
      handleRHFSubmit(
        (values) => {
          onSubmit({
            schemaVersion: 'v20250403',
            code: getRandomId(),
            data: {
              name: {
                official: {
                  primary: values.name,
                },
                display: {
                  primary: values.nameAlt || values.name,
                },
              },
              remark: '',
              players: values.players.map((player) => ({
                id: '',
                name: {
                  display: {
                    primary: player.namePrimary,
                    secondary: player.nameSecondary,
                    third: player.nameThird,
                  },
                  official: {
                    primary: player.namePrimary,
                    secondary: player.nameSecondary,
                    third: player.nameThird,
                  },
                },
                color: {
                  primary: player.colorPrimary,
                  secondary: player.colorPrimary,
                },
                image: {
                  portrait: player.imagePortraitUrl
                    ? {
                        default: {
                          url: player.imagePortraitUrl,
                        },
                      }
                    : undefined,
                  portraitAlt: player.imagePortraitAltUrl
                    ? {
                        default: {
                          url: player.imagePortraitAltUrl,
                        },
                      }
                    : undefined,
                  logo: player.imageLogoUrl
                    ? {
                        default: {
                          url: player.imageLogoUrl,
                        },
                      }
                    : undefined,
                  riichi: player.imageRiichiUrl
                    ? {
                        default: {
                          url: player.imageRiichiUrl,
                        },
                      }
                    : undefined,
                },
              })),
              rulesetRef: values.rulesetId,
            },
            metadata: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          } satisfies V2Match)
        },
        (error) => {
          console.log(error)
        }
      ),
    [handleRHFSubmit, onSubmit]
  )

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  useEffect(() => {
    if (autoSubmit && handleSubmit) {
      handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSubmit])

  if (rulesets.length === 0) {
    return <div>讀取中…</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="bg-base-200 input input-xl input-ghost w-full"
        placeholder="對局名稱"
        {...register('name')}
      />

      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        <div>
          <label className="fieldset-label">直播顯示名稱</label>
          <fieldset className="fieldset">
            <input
              type="text"
              className="input w-full"
              placeholder="直播顯示名稱"
              {...register('nameAlt')}
            />
            <p className="fieldset-label text-error">
              {formState.errors['nameAlt']?.message}
            </p>
          </fieldset>
        </div>
        <div>
          <label className="fieldset-label">規則</label>
          <fieldset className="fieldset">
            <select className="select w-full" {...register('rulesetId')}>
              {rulesets.map((ruleset) => (
                <option value={ruleset.id}>
                  {ruleset.metadata.name.display}
                </option>
              ))}
            </select>
            <p className="fieldset-label text-error">
              {formState.errors['rulesetId']?.message}
            </p>
          </fieldset>
        </div>
        <div>
          <label className="fieldset-label">佈局風格</label>
          <p className="leading-10">默認：國士無雙</p>
        </div>
      </div>

      <div className="divider"></div>

      <h4>玩家</h4>
      <div>
        {new Array(watchedRuleset?.data.playerCount)
          .fill(undefined)
          .map((_, index) => (
            <div key={index}>
              <fieldset
                className="relative fieldset border-2 border-base-300 px-4 pb-4 rounded-box"
                style={{
                  borderColor: watchedPlayers?.[index]?.colorPrimary,
                  backgroundColor: `${watchedPlayers?.[index]?.colorPrimary}20`,
                }}
              >
                <legend className="fieldset-legend">
                  {positionNames[index]}
                </legend>

                <div className="flex gap-4">
                  <div>
                    <label className="fieldset-label">預覽</label>
                    {watchedPlayers?.[index] && (
                      <div>
                        <div key={index} className="w-full text-[64px]">
                          <PlayerCard
                            score={watchedRuleset?.data.startingPoint ?? 0}
                            player={{
                              primaryName: watchedPlayers[index].namePrimary!,
                              secondaryName:
                                watchedPlayers[index].nameSecondary!,
                              nickname: watchedPlayers[index].nameThird!,
                              color: watchedPlayers[index].colorPrimary!,
                              propicUrl:
                                watchedPlayers[index].imagePortraitUrl!,
                              logoUrl: watchedPlayers[index].imageLogoUrl!,
                              largeLogoUrl:
                                watchedPlayers[index].imageRiichiUrl!,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="fieldset-label">名稱</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="玩家名稱"
                      {...register(`players.${index}.namePrimary`)}
                    />
                    <p className="fieldset-label text-error">
                      {
                        formState.errors['players']?.[index]?.['namePrimary']
                          ?.message
                      }
                    </p>

                    <label className="fieldset-label">稱號</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="玩家名稱"
                      {...register(`players.${index}.nameSecondary`)}
                    />
                    <p className="fieldset-label text-error">
                      {
                        formState.errors['players']?.[index]?.['nameSecondary']
                          ?.message
                      }
                    </p>

                    <label className="fieldset-label">暱稱</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="玩家名稱"
                      {...register(`players.${index}.nameThird`)}
                    />
                    <p className="fieldset-label text-error">
                      {
                        formState.errors['players']?.[index]?.['nameThird']
                          ?.message
                      }
                    </p>
                  </div>

                  <div>
                    <label className="fieldset-label">顏色</label>
                    <Controller
                      control={control}
                      name={`players.${index}.colorPrimary`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <InputColor
                          onChange={onChange} // send value to hook form
                          onBlur={onBlur} // notify when input is touched/blur
                          value={value}
                        />
                      )}
                    />
                    <p className="fieldset-label text-error">
                      {
                        formState.errors['players']?.[index]?.['colorPrimary']
                          ?.message
                      }
                    </p>
                  </div>
                  {/* 
                <label className="fieldset-label">次顏色</label>
                <Controller
                  control={control}
                  name={`players.${index}.colorSecondary`}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputColor
                      onChange={onChange} // send value to hook form
                      onBlur={onBlur} // notify when input is touched/blur
                      value={value}
                    />
                  )}
                />
                <p className="fieldset-label text-error">
                  {
                    formState.errors['players']?.[index]?.['colorSecondary']
                      ?.message
                  }
                </p> */}

                  <div>
                    <label className="fieldset-label">圖片</label>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="https://....png"
                      {...register(`players.${index}.imagePortraitUrl`)}
                    />
                    <p className="fieldset-label text-error">
                      {
                        formState.errors['players']?.[index]?.[
                          'imagePortraitUrl'
                        ]?.message
                      }
                    </p>

                    <label className="fieldset-label">隊伍圖片</label>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="https://....png"
                      {...register(`players.${index}.imageLogoUrl`)}
                    />
                    <p className="fieldset-label text-error">
                      {
                        formState.errors['players']?.[index]?.['imageLogoUrl']
                          ?.message
                      }
                    </p>

                    <label className="fieldset-label">立直圖片</label>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="https://....png"
                      {...register(`players.${index}.imageRiichiUrl`)}
                    />
                    <p className="fieldset-label text-error">
                      {
                        formState.errors['players']?.[index]?.['imageRiichiUrl']
                          ?.message
                      }
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="z-10 absolute btn rounded-full -bottom-8 left-24 shadow bg-base-100"
                  onClick={handleClickSwap}
                  data-player-index={index}
                >
                  <i className="bi bi-arrow-up-down"></i> 調位
                </button>
              </fieldset>
            </div>
          ))}
      </div>
      <div className="text-center mt-8 space-x-8">
        {/* <button
          type="button"
          onClick={handleClickReset}
          className="btn btn-lg btn-ghost"
        >
          重置
        </button> */}
        <button type="submit" className="btn btn-primary btn-lg">
          儲存
        </button>
      </div>
    </form>
  )
}
