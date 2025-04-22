const customVerticalMenuData = dictionary => [
    
  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].dashboard,
    icon: 'tabler-smart-home',
    href: '/dashboards/crm'
  },
  {
    label: dictionary['navigation'].user,
    icon: 'tabler-user',
    children: [
        {
        label: dictionary['navigation'].list,
        icon: 'tabler-circle',
        href: '/user/list'
        },
        {
        label: dictionary['navigation'].add,
        icon: 'tabler-circle',
        href: '/user/add'
        }
    ]
  }
]

export default customVerticalMenuData
