// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import FormTravelingAllowanceAdd from '@/views/user/traveling-allowances/add/FormTravelingAllowanceAdd'

const EditAllowance = ({ params }) => {

  const { id } = params;

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <FormTravelingAllowanceAdd id={id} />
      </Grid>
    </Grid>
  )
}

export default EditAllowance
