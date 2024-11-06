import type { NavigationMenuItem } from '@nuxt/ui';

export interface TabbedNavigationPageItem extends NavigationMenuItem {
  controls: 'both' | 'next-only' | 'previous-only' | 'none',
}