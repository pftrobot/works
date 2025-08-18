import { supabase } from 'lib/supabase'
import { TimelineItem } from 'types'

import AboutMain from 'components/about/AboutMain'

async function fetchTimeline(): Promise<TimelineItem[]> {
  const { data, error } = await supabase
    .from('timeline')
    .select('*')
    .order('year', { ascending: false })

  if (error) {
    console.error('Fetch Error:: Timeline List:: ', error)
    throw error
  }
  return data ?? []
}

export const revalidate = 3600 // 1h

export default async function AboutPage() {
  const timelines = await fetchTimeline()
  return <AboutMain timelines={timelines} />
}
