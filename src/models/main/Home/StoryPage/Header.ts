export interface HeaderNavItemValue {
  id: string;
  title: string;
  slug: string;
}

export interface HeaderNavItemSelectedItem {
  relationTo: string;
  value: HeaderNavItemValue;
}

export interface HeaderNavItem {
  id: string;
  label: string;
  linkType: 'internal' | 'custom';
  openInNewTab: boolean | null;
  contentSource: string | null;
  contentSourceSlug: string | null;
  fullPath: string | null;
  customUrl: string | null;
  selectedItem: HeaderNavItemSelectedItem | null;
}

export interface HeaderResponse {
  Header: {
    updatedAt: string;
    createdAt: string;
    navItems: HeaderNavItem[];
  };
}
