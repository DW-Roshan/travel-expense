// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import FormTravelingAllowanceAdd from '@/views/user/traveling-allowances/add/page'

const AddUser = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <FormTravelingAllowanceAdd />
      </Grid>
    </Grid>
  )
}

export default AddUser
