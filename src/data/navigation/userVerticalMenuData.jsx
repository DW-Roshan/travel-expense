const userVerticalMenuData = dictionary => [

  // This is how you will normally render submenu
  {
    label: 'Dashboard',
    icon: 'tabler-smart-home',
    href: '/dashboard'
  },
  {
    label: 'Traveling Allowances',
    icon: 'tabler-user',
    children: [
      {
        label: 'List',
        icon: 'tabler-circle',
        href: '/traveling-allowances/list'
      },
      {
        label: 'Add',
        icon: 'tabler-circle',
        href: '/traveling-allowances/add'
      }
    ]
  },
  {
    label: 'Reports',
    icon: 'tabler-report',
    children: [
      {
        label: 'Movement Report (MR)',
        icon: 'tabler-circle',
        href: '/reports/movement-report'
      },
      {
        label: 'Night Allowance Journal (NDA)',
        icon: 'tabler-circle',
        href: '/reports/night-allowance-journal'
      },
      {
        label: 'Traveling Allowance Journal (TA)',
        icon: 'tabler-circle',
        href: '/reports/traveling-allowance-journal'
      }
    ]
  }
]

export default userVerticalMenuData
