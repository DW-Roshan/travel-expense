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
import { Controller, useForm } from 'react-hook-form'


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

const FormUserAdd = () => {
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

  useEffect(() => {

    const fetchData = async () => {
      const token = await getCookie('token');

      console.log("token", token.value);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/add`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.value}`
          }
        });
        const jsonData = await response.json();

        console.log("jsonData", jsonData);
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
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

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = async (data) => {

    const token = await getCookie('token');



    if(token){

      console.log(token.value);


      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/store`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      console.log("result", result);
      console.log('Submitted:', data)
    }
  }

  const password = watch('password')

  return (
    <Card>
      <CardHeader title='Add User' />
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Grid container spacing={6}>

            {/* ==================== 1. Account Details ==================== */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" className="font-medium">1. Account Details</Typography>
            </Grid>

            {/* Username */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="username" control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field }) => (
                  <CustomTextField fullWidth label={<>Username <span className='text-error'>*</span></>} placeholder="johnDoe"
                    required={false}
                    error={!!errors.username} helperText={errors.username?.message} {...field} />
                )} />
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="email" control={control}
                rules={{
                  required: 'This field is required.',
                  pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email' }
                }}
                render={({ field }) => (
                  <CustomTextField fullWidth required={false} label={<>Primary Email <span className='text-error'>*</span></>} type="email"
                    error={!!errors.email} helperText={errors.email?.message} {...field} />
                )} />
            </Grid>

            {/* Password */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="password" control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field }) => (
                  <CustomTextField fullWidth label={<>Password <span className='text-error'>*</span></>} required={false} placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    error={!!errors.password} helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(p => !p)}>
                            <i className={showPassword ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    {...field} />
                )} />
            </Grid>

            {/* Confirm Password */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="password_confirmation" control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value === password || 'Passwords do not match'
                }}
                render={({ field }) => (
                  <CustomTextField fullWidth label={<>Confirm Password <span className='text-error'>*</span></>} placeholder="••••••••"
                    type={showConfirmPassword ? 'text' : 'password'}
                    error={!!errors.password_confirmation} helperText={errors.password_confirmation?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(p => !p)}>
                            <i className={showConfirmPassword ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    {...field} />
                )} />
            </Grid>

            {/* ==================== 2. Personal Info ==================== */}
            <Grid size={{ xs: 12 }}><Divider /></Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" className="font-medium">2. Personal Info</Typography>
            </Grid>

            {/* First & Last Name */}
            {[
              ['firstName', 'First Name', 'John', true],
              ['lastName', 'Last Name', 'Doe', true]
            ].map(([name, label, placeholder, required]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={name}>
                <Controller name={name} control={control}
                  rules={{ required: 'This field is required.' }}
                  render={({ field }) => (
                    <CustomTextField fullWidth label={<>{ label } {required && <span className='text-error'>*</span> }</>} placeholder={placeholder}
                      error={!!errors[name]} helperText={errors[name]?.message} {...field} />
                  )} />
              </Grid>
            ))}

            {/* Date of Birth */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="dateOfBirth" control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field }) => (
                  <AppReactDatepicker
                    selected={field.value} onChange={field.onChange}
                    showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                    placeholderText="YYYY/MM/DD"
                    customInput={
                      <CustomTextField fullWidth label={<>{`Date of Birth`} {<span className='text-error'>*</span> }</>}
                        error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message} />
                    }
                  />
                )} />
            </Grid>

            {/* Gender */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl error={!!errors.gender}>
                <FormLabel>Gender</FormLabel>
                <Controller name="gender" control={control}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="m" control={<Radio />} label="Male" />
                      <FormControlLabel value="f" control={<Radio />} label="Female" />
                      <FormControlLabel value="o" control={<Radio />} label="Other" />
                    </RadioGroup>
                  )} />
              </FormControl>
            </Grid>

            {/* Father Name & PF No */}
            {[
              ['fatherName', 'Father Name'],
              ['pfNo', 'PF No.']
            ].map(([name, label]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={name}>
                <Controller name={name} control={control}
                  render={({ field }) => (
                    <CustomTextField fullWidth label={label}
                      error={!!errors[name]} helperText={errors[name]?.message} {...field} />
                  )} />
              </Grid>
            ))}

            {/* ==================== 3. Employment Info ==================== */}
            <Grid size={{ xs: 12 }}><Divider /></Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" className="font-medium">3. Employment Info</Typography>
            </Grid>

            {/* Date of Joining + Login Valid */}
            {[
              ['dateOfJoining', 'Date of Joining', true],
              ['loginValidUpto', 'Login Valid Up To', true]
            ].map(([name, label, required = false]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={name}>
                <Controller name={name} control={control}
                  rules={{ required: 'This field is required.' }}
                  render={({ field }) => (
                    <AppReactDatepicker
                      selected={field.value} onChange={field.onChange}
                      showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                      placeholderText="YYYY/MM/DD"
                      customInput={
                        <CustomTextField fullWidth label={<>{ label } {required && <span className='text-error'>*</span> }</>}
                          error={!!errors[name]} helperText={errors[name]?.message} />
                      }
                    />
                  )} />
              </Grid>
            ))}

            {/* Branch / Division / Designation / Station */}
            {[
              ['branch', 'Branch', data?.branches, 'branch_name', true],
              ['division', 'Division', data?.divisions, 'division_name', true],
              ['designation', 'Designation', data?.designations, 'designation_name', true],
              ['station', 'Choose Station Head Quarter', data?.stations, 'station_name', true]
            ].map(([name, label, options, key, required = false]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={name}>
                <Controller name={name} control={control}
                  rules={{ required: 'This field is required.' }}
                  render={({ field }) => (
                    <CustomTextField select fullWidth label={<>{ label } {required && <span className='text-error'>*</span> }</>}
                      SelectProps={{ MenuProps }}
                      error={!!errors[name]} helperText={errors[name]?.message} {...field}>
                      {options?.length > 0
                        ? options.map((o, i) => <MenuItem key={i} value={o.id}>{o[key]}</MenuItem>)
                        : <MenuItem value="">No Data</MenuItem>}
                    </CustomTextField>
                  )} />
              </Grid>
            ))}

            {/* ==================== 4. Contact Info ==================== */}
            <Grid size={{ xs: 12 }}><Divider /></Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" className="font-medium">4. Contact Info</Typography>
            </Grid>

            {/* Phone + Checking Authority */}
            {[
              ['phoneNumber', 'Mobile No.', 'number', true],
              ['checkingAuthority', 'Checking Authority No']
            ].map(([name, label, type = 'text', required = false]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={name}>
                <Controller name={name} control={control}
                  rules={{required: required && 'This field is required.'}}
                  render={({ field }) => (
                    <CustomTextField fullWidth label={<>{label} {required && <span className='text-error'>*</span> }</>} type={type}
                      error={!!errors[name]} helperText={errors[name]?.message} {...field} />
                  )} />
              </Grid>
            ))}

            {/* ==================== 5. Salary & Incentives ==================== */}
            <Grid size={{ xs: 12 }}><Divider /></Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" className="font-medium">5. Salary & Incentives</Typography>
            </Grid>

            {[
              ['firstClassDutyPassNo', '1st Class Duty Pass No.'],
              ['taSrNo', 'Ta Sr No.'],
              ['incentiveAmt', 'Incentive Amt', 'number'],
              ['incentivePercentage', 'Incentive Percentage %', 'number'],
              ['payBand', 'Pay Band', 'number', true],
              ['gPay', 'G Pay', 'number', true]
            ].map(([name, label, type = 'text', required = false]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={name}>
                <Controller name={name} control={control}
                  rules={{ required: required && 'This field is required.' }}
                  render={({ field }) => (
                    <CustomTextField fullWidth label={<>{label} {required && <span className='text-error'>*</span> }</>} type={type}
                      error={!!errors[name]} helperText={errors[name]?.message} {...field} />
                  )} />
              </Grid>
            ))}

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

export default FormUserAdd
