import { supabase } from './supabase'

const BUCKET_NAME = 'case-thumbnails'

export const getCaseThumbnailUrlViaAPI = (thumbnailPath: string) => {
  if (!thumbnailPath || thumbnailPath.trim() === '') {
    return '/imgs/bg/OBJ02.png'
  }

  if (thumbnailPath.startsWith('http')) {
    return thumbnailPath
  }

  const cleanPath = thumbnailPath.startsWith('/') ? thumbnailPath.slice(1) : thumbnailPath

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(cleanPath)

  return data.publicUrl || '/imgs/bg/OBJ02.png'
}
