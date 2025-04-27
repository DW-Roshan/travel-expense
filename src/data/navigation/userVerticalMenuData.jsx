const userVerticalMenuData = dictionary => [

  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].dashboard,
    icon: 'tabler-smart-home',
    href: '/dashboard'
  },
  {
    label: 'Traveling Allowances',
    icon: 'tabler-user',
    children: [
      {
        label: dictionary['navigation'].list,
        icon: 'tabler-circle',
        href: '/traveling-allowances/list'
      },
      {
        label: dictionary['navigation'].add,
        icon: 'tabler-circle',
        href: '/traveling-allowances/add'
      }
    ]
  }
]

export default userVerticalMenuData
