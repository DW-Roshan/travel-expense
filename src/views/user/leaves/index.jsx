// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import LeavesTable from './LeavesTable'

const LeavesList = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <LeavesTable />
      </Grid>
    </Grid>
  )
}

export default LeavesList
