export interface TimelineItem {
  id: number
  year: number
  text: string
}

export interface SkillItem {
  label: string
  logo?: string
  highlight?: boolean
}

export interface TechItem {
  category: string
  items: SkillItem[]
}
