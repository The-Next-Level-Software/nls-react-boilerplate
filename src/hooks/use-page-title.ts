import { useEffect } from 'react'
import { useConfig } from '@/store/config.store'

/** Sets `document.title` from `brand.titleTemplate`, e.g. "Users · Acme Admin". */
export function usePageTitle(title?: string) {
  const { name, titleTemplate } = useConfig().brand
  useEffect(() => {
    document.title = title ? titleTemplate.replace('{page}', title).replace('{app}', name) : name
  }, [title, name, titleTemplate])
}
