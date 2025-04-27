const customVerticalMenuData = dictionary => [

  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].dashboard,
    icon: 'tabler-smart-home',
    href: '/admin/dashboard'
  },
  {
    label: dictionary['navigation'].user,
    icon: 'tabler-user',
    children: [
        {
        label: dictionary['navigation'].list,
        icon: 'tabler-circle',
        href: '/admin/user/list'
        },
        {
        label: dictionary['navigation'].add,
        icon: 'tabler-circle',
        href: '/admin/user/add'
        }
    ]
  }
]

export default customVerticalMenuData
