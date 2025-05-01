// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import TravelAllowanceListTable from './TravelAllowanceListTable'

const TravelAllowanceList = ({ allowanceData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <TravelAllowanceListTable tableData={allowanceData} />
      </Grid>
    </Grid>
  )
}

export default TravelAllowanceList
