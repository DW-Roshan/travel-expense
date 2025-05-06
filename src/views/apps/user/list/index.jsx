// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UserListTable from './UserListTable'
import UserListCards from './UserListCards'

const UserList = () => {
  return (
    <Grid container spacing={6}>
      {/* <Grid size={{ xs: 12 }}>
        <UserListCards />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <UserListTable />
      </Grid>
    </Grid>
  )
}

export default UserList
