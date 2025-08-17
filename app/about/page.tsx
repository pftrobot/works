import { supabase } from 'lib/supabase'
import { TimelineItem } from '@/types/about'

import AboutMain from 'components/about/AboutMain'

const fetchTimeline = async (): Promise<TimelineItem[]> => {
  const { data, error } = await supabase
    .from('timeline')
    .select('*')
    .order('year', { ascending: false })

  if (error) {
    console.error('Supabase Error:: fetching timeline data:: ', error)
    throw error
  }
  return data ?? []
}

export const revalidate = 3600 // 1h

export default async function AboutPage() {
  const timelines = await fetchTimeline()
  return <AboutMain timelines={timelines} />
}
