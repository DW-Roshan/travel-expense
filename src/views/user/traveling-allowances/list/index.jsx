// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import TravelAllowanceListTable from './TravelAllowanceListTable'

const TravelAllowanceList = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <TravelAllowanceListTable />
      </Grid>
    </Grid>
  )
}

export default TravelAllowanceList
