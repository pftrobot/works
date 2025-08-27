import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MedalType } from 'types'

export type MedalItem = {
  id: string
  type: MedalType
  source_id?: string | number | null
  route?: string | null
  egg_id?: string | null
  award_code?: string | null
  amount: number
  awarded_at: string
}

export const medalsKeys = {
  all: ['medals'] as const,
}

async function fetchMedalsApi() {
  const res = await fetch('/api/medals', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch medals')
  return (await res.json()) as { items: MedalItem[]; count: number }
}

async function postMedalApi(args: {
  type: MedalType
  sourceId?: string | number
  amount?: number
}) {
  const res = await fetch('/api/medals', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ type: args.type, sourceId: args.sourceId ?? null, amount: args.amount }),
  })
  if (!res.ok) throw new Error('Failed to add medal')
  return res.json() as Promise<{ ok: boolean }>
}

/**
 * React Query Hooks
 * */
export function useMedals() {
  return useQuery({
    queryKey: medalsKeys.all,
    queryFn: fetchMedalsApi,
  })
}

export function useAddMedal() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: postMedalApi,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: medalsKeys.all })
    },
  })
}
