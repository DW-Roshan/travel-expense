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
import { Chip, FormControl, FormControlLabel, FormHelperText, FormLabel, Menu, Radio, RadioGroup, Select } from '@mui/material'
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/traveling-allowances/add`, {
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

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      journeys: [
        {
          departureDate: '',
          trainId: '',
          departureTime: '',
          arrivedDate: '',
          arrivedTime: '',
          fromStation: '',
          toStation: '',
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
    <Card className='overflow-visible'>
      <CardHeader title='Add Traveling Allowance' />
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Grid container>
            <Grid size={{ xs: 12 }}>
              {fields.map((item, index) => {
                const fromStation = watch(`journeys[${index}].fromStation`);
                const toStation = watch(`journeys[${index}].toStation`);
                return (
                  <div
                    key={index}
                    className={classNames('repeater-item flex relative mbe-4 border rounded')}
                  >
                    <Grid container spacing={5} className='flex-1 m-0 p-5'>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller
                          name={`journeys[${index}].trainId`}
                          control={control}
                          rules={{ required: 'This field is required.' }}
                          render={({ field }) => (
                            <CustomTextField
                              select
                              fullWidth
                              label={<>Train No. {<span className='text-error'>*</span> }</>}
                              {...field}
                              error={Boolean(errors?.journeys?.[index]?.trainId)}
                              helperText={errors?.journeys?.[index]?.trainId?.message}
                              SelectProps={{ MenuProps }}
                            >
                              {data?.trains && data.trains.length ? data.trains.map((train) => (
                                <MenuItem key={train.id} value={train.id}>
                                  {train.train_no}
                                </MenuItem>
                              )) :(
                                <MenuItem>No records found</MenuItem>
                              )}
                            </CustomTextField>
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller
                          name={`journeys[${index}].fromStation`}
                          control={control}
                          rules={{ required: 'This field is required.' }}
                          render={({ field }) => (
                            <CustomTextField
                              select
                              fullWidth
                              label={<>Form Station {<span className='text-error'>*</span> }</>}
                              {...field}
                              SelectProps={{ MenuProps }}
                              helperText={errors?.journeys?.[index]?.fromStation?.message}
                              error={Boolean(errors?.journeys?.[index]?.fromStation)}
                            >
                              {data?.stations && data?.stations.length > 0 ? data?.stations.filter((station) => station.id !== toStation).map((station) => (
                                <MenuItem key={station.id} value={station.id}>
                                  <div className='w-full flex justify-between gap-1'>
                                    {station.station_name}
                                    <Chip label={station.station_code} size='small' variant='tonal' color='success' />
                                  </div>
                                </MenuItem>
                              )) : (
                                <MenuItem>No records found</MenuItem>
                              )}
                            </CustomTextField>
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller
                          name={`journeys[${index}].toStation`}
                          control={control}
                          rules={{ required: 'This field is required.' }}
                          render={({ field }) => (
                            <CustomTextField
                              select
                              fullWidth
                              label={<>To Station {<span className='text-error'>*</span> }</>}
                              {...field}
                              SelectProps={{ MenuProps }}
                              helperText={errors?.journeys?.[index]?.toStation?.message}
                              error={Boolean(errors?.journeys?.[index]?.toStation)}
                            >
                              {data?.stations && data?.stations.length > 0 ? data?.stations.filter((station) => station.id !== fromStation).map((station) => (
                                <MenuItem key={station.id} value={station.id}>
                                  <div className='w-full flex justify-between gap-1'>
                                    {station.station_name}
                                    <Chip label={station.station_code} size='small' variant='tonal' color='success' />
                                  </div>
                                </MenuItem>
                              )) : (
                                <MenuItem>No records found</MenuItem>
                              )}
                            </CustomTextField>
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Controller name={`journeys[${index}].departureDate`} control={control}
                          rules={{
                            required: 'This field is required.',
                            validate: (_, allValues) => {

                              if (index === 0) return true; // Skip first item

                              const currentDeparture = allValues?.journeys?.[index]?.departureDate;
                              const currentLeftTime = allValues?.journeys?.[index]?.departureTime;

                              const prevArrival = allValues?.journeys?.[index - 1]?.arrivedDate;
                              const prevArrivedTime = allValues?.journeys?.[index - 1]?.arrivedTime;

                              if (!currentDeparture || !prevArrival ) return true;

                              return new Date(currentDeparture) > new Date(prevArrival) || 'Departure Time must be greater then previous Arrival Time.';
                            }
                          }}
                          render={({ field }) => (
                            <AppReactDatepicker
                              selected={field.value} onChange={field.onChange}
                              showYearDropdown showMonthDropdown showTimeSelect dateFormat="yyyy/MM/dd HH:mm" timeFormat="HH:mm"
                              placeholderText="YYYY/MM/DD HH:mm"
                              // maxDate={new Date()}
                              customInput={
                                <CustomTextField
                                  {...field}
                                  label={<>Departure Date and Time {<span className='text-error'>*</span> }</>}
                                  fullWidth
                                  required
                                  helperText={errors?.journeys?.[index]?.departureDate?.message}
                                  error={Boolean(errors?.journeys?.[index]?.departureDate)}
                                />
                              }
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Controller
                          name={`journeys[${index}].arrivedDate`}
                          rules={{ 
                            required: 'This field is required.',
                            validate: (_, allValues) => {
                              const arrival = allValues?.journeys?.[index]?.arrivedDate;
                              const departure = allValues?.journeys?.[index]?.departureDate;
                            
                              if (!arrival || !departure) return true;
                            
                              return new Date(arrival) > new Date(departure) || 'Arrival time must be greater then departure time.';
                            }
                            
                          }}
                          control={control}
                          render={({ field }) => (
                            <AppReactDatepicker
                              selected={field.value} onChange={field.onChange}
                              showYearDropdown showMonthDropdown showTimeSelect dateFormat="yyyy/MM/dd HH:mm" timeFormat="HH:mm"
                              placeholderText="YYYY/MM/DD HH:mm"
                              maxDate={new Date()}
                              customInput={
                                <CustomTextField
                                  {...field}
                                  label={<>Arrived Date and Time {<span className='text-error'>*</span> }</>}
                                  fullWidth
                                  required
                                  helperText={errors?.journeys?.[index]?.arrivedDate?.message}
                                  error={Boolean(errors?.journeys?.[index]?.arrivedDate)}
                                />
                              }
                            />
                          )}
                        />
                      </Grid>
                      {/* <Grid size={{ xs: 12, sm: 3 }}>
                        <Controller
                          name={`journeys[${index}].departureTime`}
                          rules={{
                            required: 'This field is required.',
                            validate: (_, allValues) => {

                              if (index === 0) return true; // Skip first item

                              const currentFromDate = allValues?.journeys?.[index]?.departureDate;
                              const currentLeftTime = allValues?.journeys?.[index]?.departureTime;

                              const prevArrivedDate = allValues?.journeys?.[index - 1]?.arrivedDate;
                              const prevArrivedTime = allValues?.journeys?.[index - 1]?.arrivedTime;

                              if (!currentFromDate || !currentLeftTime || !prevArrivedDate || !prevArrivedTime) return true;

                              const currentDeparture = new Date(currentFromDate);
                              const currentTime = new Date(currentLeftTime);
                              currentDeparture.setHours(currentTime.getHours(), currentTime.getMinutes());

                              const previousArrival = new Date(prevArrivedDate);
                              const prevTime = new Date(prevArrivedTime);
                              previousArrival.setHours(prevTime.getHours(), prevTime.getMinutes());

                              return currentDeparture > previousArrival || 'Departure Time must be greater then previous Arrival Time.';
                            }
                          }}
                          control={control}
                          render={({ field }) => (
                            <AppReactDatepicker
                              selected={field.value} onChange={field.onChange}
                              showTimeSelect
                              timeIntervals={5}
                              showTimeSelectOnly
                              dateFormat='h:mm aa'
                              placeholderText="h:mm aa"
                              customInput={
                                <TextField
                                  {...field}
                                  label={<>Departure Time {<span className='text-error'>*</span> }</>}
                                  fullWidth
                                  required
                                />
                              }
                            />
                          )}
                        />
                      </Grid> */}
                      {/* <Grid size={{ xs: 12, sm: 3 }}>
                        <Controller
                          name={`journeys[${index}].arrivedTime`}
                          control={control}
                          render={({ field }) => (
                            <AppReactDatepicker
                            selected={field.value} onChange={field.onChange}
                            showTimeSelect
                            timeIntervals={5}
                            showTimeSelectOnly
                            dateFormat='h:mm aa'
                            placeholderText="h:mm aa"
                            customInput={
                              <TextField
                                {...field}
                                label={<>Arrived Time {<span className='text-error'>*</span> }</>}
                                fullWidth
                                required
                              />
                            }
                          />
                          )}
                        />
                      </Grid> */}
                    </Grid>
                    {index !== 0 && (
                      <div className='flex flex-col justify-start border-is'>
                        <IconButton size='small' color='error' onClick={() => remove(index)}>
                          <i className='tabler-x text-2xl' />
                        </IconButton>
                      </div>
                    )}
                  </div>
                )
              })}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                size='small'
                variant="tonal"
                color="primary"
                onClick={() =>
                append({
                  departureDate: '',
                  trainId: '',
                  departureTime: '',
                  arrivedDate: '',
                  arrivedTime: '',
                  fromStation: '',
                  toStation: '',
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
