import { useQueryClient } from '@tanstack/react-query'
import { medalsKeys } from 'utils/medalUtils'
import { claimEggMedal, claimSpecialMedal } from 'actions/egg'

export function useEasterEggHandlers(
  pathname: string,
  setModalMsg: (msg: React.ReactNode) => void,
  setModalOpen: (open: boolean) => void,
) {
  const queryClient = useQueryClient()

  async function award(
    kind: 'medal' | 'special10',
    opts: { eggId?: string; fieldId?: string; awardCode?: string } = {},
  ): Promise<{ ok: boolean; awarded: boolean; amount: number }> {
    const result =
      kind === 'medal'
        ? await claimEggMedal(pathname, opts.eggId!, 1)
        : await claimSpecialMedal(pathname, opts.awardCode!)

    if (result.ok && result.awarded) {
      await queryClient.invalidateQueries({ queryKey: medalsKeys.all })
    }

    return {
      ok: result.ok,
      awarded: result.awarded ?? false,
      amount: result.amount ?? 0,
    }
  }

  function notify(lines: string[]) {
    const text = lines[Math.floor(Math.random() * lines.length)]
    setModalMsg(text)
    setModalOpen(true)
  }

  return {
    award,
    notify,
  }
}
