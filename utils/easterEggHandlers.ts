import { useQueryClient } from '@tanstack/react-query'
import { useEggStore } from 'stores/easterEggStore'
import { medalsKeys } from 'utils/medalUtils'

export function useEasterEggHandlers(
  pathname: string,
  setModalMsg: (msg: React.ReactNode) => void,
  setModalOpen: (open: boolean) => void,
) {
  const queryClient = useQueryClient()
  const collectEgg = useEggStore((s) => s.collectEgg)

  async function award(
    kind: 'medal' | 'special10',
    opts: { eggId?: string; awardCode?: string } = {},
  ): Promise<{ ok: boolean; awarded: boolean; amount: number }> {
    const payload =
      kind === 'medal'
        ? { kind, route: pathname, eggId: opts.eggId }
        : { kind, route: pathname, awardCode: opts.awardCode! }

    const res = await fetch('/api/egg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    const json = await res.json().catch(() => ({}))
    const ok = !!json?.ok
    if (ok) {
      queryClient.invalidateQueries({ queryKey: medalsKeys.all })
    }
    return { ok, awarded: !!json?.awarded, amount: json?.amount ?? 0 }
  }

  function notify(lines: string[]) {
    const text = lines[Math.floor(Math.random() * lines.length)]
    setModalMsg(text)
    setModalOpen(true)
  }

  return {
    award,
    notify,
    collectEgg,
  }
}
