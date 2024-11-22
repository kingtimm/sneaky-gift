import type { NavigationMenuItem } from '#ui/types';
import type { RouteLocationNormalizedLoadedGeneric } from '#vue-router'

export interface TabbedNavigationPageItem extends NavigationMenuItem {
  controls: 'both' | 'next-only' | 'previous-only' | 'none',
}

export interface CreateFlowProps {
  items: TabbedNavigationPageItem[],
  index: number,
  pageKey: (route: RouteLocationNormalizedLoadedGeneric) => string,
  onNext?: () => void,
  onPrevious?: () => void,
}
