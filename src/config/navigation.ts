export interface NavItem {
  to: string
  key: string
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', key: 'nav.home' },
  { to: '/destinations', key: 'nav.destinations' },
]
