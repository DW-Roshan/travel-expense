// React Imports
import { useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

import { toast } from 'react-toastify'

import { useSession } from 'next-auth/react'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Vars

const AddEditLeaveDrawer = props => {
  // Props
  const { open, handleClose, editLeaveData, removeDates, fetchData } = props

  // States
  const {data: session} = useSession()
  const token = session?.user?.token;

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    setValue,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      leavePurpose: '',
      fromDate: '',
      toDate: '',
    }
  })

  useEffect(() => {
    if (editLeaveData) {
      setValue('leavePurpose', editLeaveData.leave_purpose)
      setValue('fromDate', editLeaveData.from_date)
      setValue('toDate', editLeaveData.to_date)
    } else {
      resetForm()
    }
  }, [editLeaveData])

  const onSubmit = async (data) => {

    // const token = await getCookie('token');

    if(token){

      try {

        if(editLeaveData && editLeaveData.id){

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaves/${editLeaveData.id}`, {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              leavePurpose: data.leavePurpose,
              fromDate: new Date(data.fromDate).toISOString(),
              toDate: new Date(data.toDate).toISOString()
            })
          })

          const result = await response.json();

          if( response.status === 200 ){

            toast.success('Leave updated successfully.')

            fetchData()
          } else if(response.status == 422) {

            // Laravel returns validation errors in the `errors` object
            Object.entries(result.errors).forEach(([field, messages]) => {
              setError(field, {
                type: 'custom',
                message: messages[0], // Use the first error message for each field
              });
            });

            return;

          } else {
            toast.error(result.message);
          }

        } else {

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaves/store`, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              leavePurpose: data.leavePurpose,
              fromDate: new Date(data.fromDate).toISOString(),
              toDate: new Date(data.toDate).toISOString()
            })
          });

          const result = await response.json();

          if( response.status === 200 ){

            toast.success('Leave added successfully.')

            fetchData()
          } else if(response.status == 422) {

            // Laravel returns validation errors in the `errors` object
            Object.entries(result.errors).forEach(([field, messages]) => {
              setError(field, {
                type: 'custom',
                message: messages[0], // Use the first error message for each field
              });
            });

            return;

          } else {
            toast.error(result.message);
          }

        }

      } catch (error) {
        console.error('Error submitting form:', error);

        toast.error('An error occurred while submitting the form. Please try again later.');

      }
    }

    handleClose()
    resetForm({ leavePurpose: '', fromDate: '', toDate: '' })
  }

  const handleReset = () => {
    handleClose()
    resetForm({ leavePurpose: '', fromDate: '', toDate: '' })
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Add New Leave</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
          <Controller
            name='leavePurpose'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                id='select-leave'
                label='Leave Purpose'
                {...field}
                {...(errors.leavePurpose && { error: true, helperText: 'This field is required.' })}
              >
                <MenuItem value=''>Select</MenuItem>
                <MenuItem value='Rest'>Rest</MenuItem>
                <MenuItem value='CL'>CL</MenuItem>
                <MenuItem value='CR'>CR</MenuItem>
                <MenuItem value='Leave'>Leave</MenuItem>
              </CustomTextField>
            )}
          />
          <Controller
            name='fromDate'
            rules={{
              required: 'This field is required.'
            }}
            control={control}
            render={({ field }) => (
              <AppReactDatepicker
                selected={field.value} onChange={field.onChange}
                showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                placeholderText="YYYY/MM/DD"
                excludeDates={removeDates}
                maxDate={new Date()}
                customInput={
                  <CustomTextField
                    {...field}
                    label={<>From Date {<span className='text-error'>*</span> }</>}
                    fullWidth
                    required={true}
                    helperText={errors?.fromDate?.message}
                    error={Boolean(errors?.fromDate)}
                  />
                }
              />
            )}
          />
          <Controller
            name='toDate'
            rules={{
              required: 'This field is required.'
            }}
            control={control}
            render={({ field }) => (
              <AppReactDatepicker
                selected={field.value} onChange={field.onChange}
                showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                placeholderText="YYYY/MM/DD"
                excludeDates={removeDates}
                maxDate={new Date()}
                customInput={
                  <CustomTextField
                    {...field}
                    label={<>To Date {<span className='text-error'>*</span> }</>}
                    fullWidth
                    required={true}
                    helperText={errors?.toDate?.message}
                    error={Boolean(errors?.toDate)}
                  />
                }
              />
            )}
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Submit
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddEditLeaveDrawer
