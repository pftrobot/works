import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Database {
  public: {
    Tables: {
      cases: {
        Row: {
          id: number
          slug: string
          title: string
          subtitle: string
          summary: string
          description: string
          tech: string[]
          quiz: {
            question: string
            options: string[]
            answer: number
          }
          thumbnail: string
          link: string | null
          created_at: string
        }
        Insert: {
          id?: number
          slug: string
          title: string
          subtitle: string
          summary: string
          description: string
          tech: string[]
          quiz: {
            question: string
            options: string[]
            answer: number
          }
          thumbnail: string
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          slug?: string
          title?: string
          subtitle?: string
          summary?: string
          description?: string
          tech?: string[]
          quiz?: {
            question: string
            options: string[]
            answer: number
          }
          thumbnail?: string
          link?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type CaseMeta = Database['public']['Tables']['cases']['Row']
