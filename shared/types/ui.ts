import type { NavigationMenuItem } from '@nuxt/ui';
import type { RouteLocationNormalizedLoadedGeneric } from '#vue-router'

export interface TabbedNavigationPageItem extends NavigationMenuItem {
  controls: 'both' | 'next-only' | 'previous-only' | 'none',
}

export interface CreateFlowProps {
  items: TabbedNavigationPageItem[],
  index: number,
  'page-key': (route: RouteLocationNormalizedLoadedGeneric) => string,
  onNext?: () => void,
  onPrevious?: () => void,
}