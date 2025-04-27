'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { FormControl, FormControlLabel, FormLabel, Menu, Radio, RadioGroup, Select } from '@mui/material'
import { getCookie } from '@/utils/cookies'
import { MenuProps } from '@/configs/customDataConfig'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

import {
    TextField,
    InputLabel,
    Box,
  } from '@mui/material';
import classNames from 'classnames'

const defaultValues = {
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  dateOfJoining: null,
  gender: 'm',
  pfNo: '',
  fatherName: '',
  firstClassDutyPassNo: '',
  branch: '',
  division: '',
  designation: '',
  station: '',
  phoneNumber: '',
  checkingAuthority: '',
  loginValidUpto: null,
  taSrNo: '',
  incentiveAmt: '',
  incentivePercentage: '',
  payBand: '',
  gPay: ''
}


const trainOptions = [
    { value: '02411', label: '02411' },
    { value: '04032', label: '04032' },
    { value: '12723', label: '12723' },
    { value: '13256', label: '13256' },
    { value: '19308', label: '19308' },
  ];
  
  const stationOptions = [
    { value: '1', label: 'A N Dev Nagar' },
    { value: '2', label: 'Abhaipur' },
    { value: '3', label: 'Abhayapuri Asam' },
    { value: '4', label: 'Abohar' },
    { value: '5', label: 'Abu Road' },
    { value: '6', label: 'Achalda' },
    { value: '7', label: 'Achhnera Junction' },
    { value: '8', label: 'Adas Road' },
  ];
  
  const timeOptions = Array.from({ length: 10 }, (_, i) => {
    const mins = (i * 5).toString().padStart(2, '0');
    return `00:${mins}:00`;
  });

const FormTravelingAllowanceAdd = () => {
  // States
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    isPasswordShown: false,
    confirmPassword: '',
    isConfirmPasswordShown: false,
    firstName: '',
    lastName: '',
    country: '',
    pfNo: '',
    branch: '',
    division: '',
    designation: '',
    station: '',
    checkingAuthority: '',
    taSrNo: '',
    incentiveAmt: '',
    incentivePercentage: '',
    payBand: '',
    gPay: '',
    firstClassDutyPassNo: '',
    fatherName: '',
    language: [],
    date: null,
    phoneNumber: ''
  })

  const [data, setData] = useState();

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter();

  useEffect(() => {

    const fetchData = async () => {
      const token = await getCookie('token');

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user/add`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.value}`
          }
        });
        const jsonData = await response.json();

        // if(response.status === 401) {
        //   router.push('/not-authorized');
        // }

        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData(null);
      }
    };

    fetchData();

  }, []);

  const handleClickShowPassword = () => setFormData(show => ({ ...show, isPasswordShown: !show.isPasswordShown }))

  const handleClickShowConfirmPassword = () =>
    setFormData(show => ({ ...show, isConfirmPasswordShown: !show.isConfirmPasswordShown }))

  const handleReset = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      isPasswordShown: false,
      confirmPassword: '',
      isConfirmPasswordShown: false,
      firstName: '',
      lastName: '',
      country: '',
      pfNo: '',
      gender: '',
      branch: '',
      division: '',
      designation: '',
      station: '',
      checkingAuthority: '',
      taSrNo: '',
      incentiveAmt: '',
      incentivePercentage: '',
      payBand: '',
      gPay: '',
      firstClassDutyPassNo: '',
      fatherName: '',
      language: [],
      dateOfBirth: null,
      dateOfJoining: null,
      loginValidUpto: null,
      phoneNumber: ''
    })
  }

//   const {
//     control,
//     handleSubmit,
//     reset,
//     setError,
//     watch,
//     formState: { errors }
//   } = useForm({ defaultValues })

//   const onSubmit = async (data) => {

//     const token = await getCookie('token');

//     if(token){

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user/store`, {
//         method: 'post',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token.value}`
//         },
//         body: JSON.stringify(data)
//       });

//       const result = await res.json();

//       if(res.ok){

//         sessionStorage.setItem('success', result.message);

//         router.push('/admin/user/list');

//         reset();


//       } else if(res.status == 422) {

//         // Laravel returns validation errors in the `errors` object
//         Object.entries(result.errors).forEach(([field, messages]) => {
//           setError(field, {
//             type: 'manual',
//             message: messages[0], // Use the first error message for each field
//           });
//         });

//       } else {
//         sessionStorage.setItem('error', result.message);

//         router.push('/admin/user/list');

//       }
//     }
//   }

//   const password = watch('password')

  const { control, handleSubmit } = useForm({
    defaultValues: {
      journeys: [
        {
          fromDate: '',
          trainId: '',
          leftTime: '',
          arrivedDate: '',
          arrivedTime: '',
          fromStation: '',
          toStation: '',
          objectOfJourney: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'journeys',
  });

  const onSubmit = (data) => {
    console.log('Form Data:', data);
  };

  return (
    <Card>
      <CardHeader title='Add Traveling Allowance' />
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              {fields.map((item, index) => (
                <div
                  key={index}
                  className={classNames('repeater-item flex relative mbe-4 border rounded')}
                >
                {/* <Box key={item.id} sx={{ border: '1px solid #ccc', p: 2, mb: 3, borderRadius: 2 }}> */}
                  <Grid container spacing={2} className='flex-1 m-0 p-5'>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Controller name={`journeys[${index}].fromDate`} control={control}
                          rules={{ required: 'This field is required.' }}
                          render={({ field }) => (
                            <AppReactDatepicker
                              selected={field.value} onChange={field.onChange}
                              showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                              placeholderText="YYYY/MM/DD"
                              customInput={
                                <TextField
                                  {...field}
                                  label={<>Departure Date {<span className='text-error'>*</span> }</>}
                                  fullWidth
                                  required
                                />
                              }
                            />
                          )} 
                        />
                      </Grid>

                      {/* <Grid size={{ xs: 12, sm: 3 }}>
                        <Controller
                          name={`journeys[${index}].fromDate`}
                          control={control}
                          render={({ field }) => (
                          <TextField
                              {...field}
                              label="From Date"
                              type="date"
                              fullWidth
                              required
                          />
                          )}
                        />
                      </Grid> */}

                      <Grid size={{ xs: 12, sm: 3 }}>
                      <Controller
                          name={`journeys[${index}].trainId`}
                          control={control}
                          render={({ field }) => (
                          <FormControl fullWidth required>
                              <InputLabel>Train No.</InputLabel>
                              <Select {...field} label="Train No.">
                              {trainOptions.map((train) => (
                                  <MenuItem key={train.value} value={train.value}>
                                  {train.label}
                                  </MenuItem>
                              ))}
                              </Select>
                          </FormControl>
                          )}
                      />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 3 }}>
                      <Controller
                          name={`journeys[${index}].leftTime`}
                          control={control}
                          render={({ field }) => (
                          <FormControl fullWidth required>
                              <InputLabel>Left Time</InputLabel>
                              <Select {...field} label="Left Time">
                              {timeOptions.map((time) => (
                                  <MenuItem key={time} value={time}>
                                  {time}
                                  </MenuItem>
                              ))}
                              </Select>
                          </FormControl>
                          )}
                      />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 3 }}>
                      <Controller
                          name={`journeys[${index}].arrivedDate`}
                          control={control}
                          render={({ field }) => (
                          <TextField
                              {...field}
                              label="Arrived Date"
                              type="date"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              required
                          />
                          )}
                      />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 3 }}>
                      <Controller
                          name={`journeys[${index}].arrivedTime`}
                          control={control}
                          render={({ field }) => (
                          <FormControl fullWidth required>
                              <InputLabel>Arrived Time</InputLabel>
                              <Select {...field} label="Arrived Time">
                              {timeOptions.map((time) => (
                                  <MenuItem key={time} value={time}>
                                  {time}
                                  </MenuItem>
                              ))}
                              </Select>
                          </FormControl>
                          )}
                      />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 3 }}>
                      <Controller
                          name={`journeys[${index}].fromStation`}
                          control={control}
                          render={({ field }) => (
                          <FormControl fullWidth required>
                              <InputLabel>From Station</InputLabel>
                              <Select {...field} label="From Station">
                              {stationOptions.map((station) => (
                                  <MenuItem key={station.value} value={station.value}>
                                  {station.label}
                                  </MenuItem>
                              ))}
                              </Select>
                          </FormControl>
                          )}
                      />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 3 }}>
                      <Controller
                          name={`journeys[${index}].toStation`}
                          control={control}
                          render={({ field }) => (
                          <FormControl fullWidth required>
                              <InputLabel>To Station</InputLabel>
                              <Select {...field} label="To Station">
                              {stationOptions.map((station) => (
                                  <MenuItem key={station.value} value={station.value}>
                                  {station.label}
                                  </MenuItem>
                              ))}
                              </Select>
                          </FormControl>
                          )}
                      />
                      </Grid>

                      {/* <Grid size={{ xs: 12 }}>
                      <Controller
                          name={`journeys[${index}].objectOfJourney`}
                          control={control}
                          render={({ field }) => (
                          <TextField
                              {...field}
                              label="Object Of Journey"
                              fullWidth
                              multiline
                              rows={2}
                          />
                          )}
                      />
                      </Grid> */}
                      
                      
                      {/* <Grid size={{ xs: 12 }}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => remove(index)}
                        >
                            Delete
                        </Button>
                      </Grid> */}
                  </Grid>
                  <div className='flex flex-col justify-start border-is'>
                    <IconButton size='small' onClick={() => remove(index)}>
                      <i className='tabler-x text-2xl text-actionActive' />
                    </IconButton>
                  </div>
                {/* </Box> */}
              </div>
            ))}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                  append({
                      fromDate: '',
                      trainId: '',
                      leftTime: '',
                      arrivedDate: '',
                      arrivedTime: '',
                      fromStation: '',
                      toStation: '',
                      objectOfJourney: '',
                  })
                  }
              >
                  Add More
              </Button>
            </Grid>


          </Grid>
        </CardContent>

        <Divider />

        <CardActions>
          <Button type="submit" variant="contained">Submit</Button>
          <Button type="button" variant="tonal" color="secondary" onClick={() => reset()}>
            Reset
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default FormTravelingAllowanceAdd
