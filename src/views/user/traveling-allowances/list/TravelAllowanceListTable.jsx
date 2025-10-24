'use client'

import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import { useParams } from 'next/navigation'

import { useSession } from 'next-auth/react'

import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import { CardContent, Checkbox } from '@mui/material'

import { getLocalizedUrl } from '@/utils/i18n'
import tableStyles from '@core/styles/table.module.css'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomTextField from '@/@core/components/mui/TextField'
import CustomIconButton from '@/@core/components/mui/IconButton'
import ConfirmDialog from '@/components/ConfirmDialog'

const TravelAllowanceListTable = () => {
  const { lang: locale } = useParams()
  const { data: session } = useSession()
  const [data, setData] = useState([])
  const [month, setMonth] = useState(new Date())
  const [selectedIds, setSelectedIds] = useState([])
  const [openConfirm, setOpenConfirm] = useState(false)

  const token = session?.user?.token

  // 🔹 Fetch Data
  const fetchData = async (date) => {
    if (!token) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/traveling-allowances${
          date
            ? `?month=${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`
            : ''
        }`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      const jsonData = await response.json()

      setData(jsonData.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setData([])
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  // 🔹 Month change
  const handleMonthChange = async (date) => {
    setMonth(date)
    await fetchData(date)
  }

  // 🔹 Handle row selection toggle
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const isSelected = (id) => selectedIds.includes(id)

  // 🔹 Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error('No records selected.')

      return
    }

    setOpenConfirm(true)
  }

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/traveling-allowances/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedIds })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || 'Failed to delete selected allowances.')

        throw new Error(data?.message || 'Failed to delete')
      }

      toast.success(data?.message || 'Selected travel allowances deleted successfully.')
      setSelectedIds([])
      fetchData(month)
    } catch (error) {

      // console.error('Error deleting traveling allowance:', error)
      // toast.error('Failed to delete selected allowances.')

      throw error
    }

    setOpenConfirm(false)
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Travel Allowances'
          className='pbe-4 flex-wrap gap-2'
          action={
            <div className='flex justify-end flex-col items-start md:flex-row md:items-center gap-4'>
              <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
                <Link href={getLocalizedUrl('/traveling-allowances/add', locale)}>
                  <Button
                    variant='contained'
                    startIcon={<i className='tabler-plus' />}
                    className='max-sm:is-full'
                  >
                    Add New
                  </Button>
                </Link>
                <Button
                  variant='contained'
                  color='error'
                  startIcon={<i className='tabler-trash' />}
                  onClick={handleBulkDelete}
                  disabled={selectedIds.length === 0}
                >
                  Delete
                </Button>
              </div>
            </div>
          }
        />

        <CardContent>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <AppReactDatepicker
                selected={month}
                id='select-month'
                showMonthYearPicker
                dateFormat='MMM, yyyy'
                maxDate={new Date()}
                onChange={async (date) => await handleMonthChange(date)}
                customInput={<CustomTextField label='Select Month' fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <div className='overflow-x-auto'>
                <table className={tableStyles.table}>
                  <thead>
                    <tr>
                      <th rowSpan={2} className='border'>Sr No.</th>
                      <th rowSpan={2} className='border'>Month & Date</th>
                      <th rowSpan={2} className='border'>Train No.</th>
                      <th colSpan={2} className='border'>Station</th>
                      <th colSpan={2} className='border'>Time</th>
                      <th rowSpan={2} className='border'>Created Date</th>
                      <th rowSpan={2} className='border'>
                        <Checkbox
                          checked={
                            data
                              .flatMap((d) => d.travel_data)
                              .filter((r) => new Date(r.from_date) >= new Date(new Date().setDate(new Date().getDate() - 40))) // ✅ only last 40 days
                              .every((r) => selectedIds.includes(r.id)) &&
                            selectedIds.length > 0
                          }
                          indeterminate={
                            selectedIds.length > 0 &&
                            !data
                              .flatMap((d) => d.travel_data)
                              .filter((r) => new Date(r.from_date) >= new Date(new Date().setDate(new Date().getDate() - 40))) // ✅ only last 40 days
                              .every((r) => selectedIds.includes(r.id))
                          }
                          onChange={(e) => {
                            const recentIds = data
                              .flatMap((d) => d.travel_data)
                              .filter((r) => new Date(r.from_date) >= new Date(new Date().setDate(new Date().getDate() - 40))) // ✅ only last 40 days
                              .map((r) => r.id)

                            if (e.target.checked) {
                              setSelectedIds(recentIds)
                            } else {
                              setSelectedIds([])
                            }
                          }}
                        />
                        Action
                      </th>
                    </tr>
                    <tr>
                      <th className='border'>From Station</th>
                      <th className='border'>To Station</th>
                      <th className='border'>Left</th>
                      <th className='border'>Arrived Date Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.length > 0 &&
                      data.map((travel, index) => (
                        <React.Fragment key={`group-${index}`}>
                          <tr>
                            <td
                              className='border text-center'
                              rowSpan={travel.travel_data.length + 1}
                            >
                              {index + 1}.
                            </td>
                            <td
                              className='border text-center'
                              rowSpan={travel.travel_data.length + 1}
                            >
                              {new Date(travel.from_date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                          </tr>

                          {travel.travel_data.map((report) => (
                            <tr key={`report-${report?.id}`}>
                              <td className='border text-center'>
                                {report?.train?.train_no}
                              </td>
                              <td className='border text-center'>
                                {report?.from_station?.station_name}
                              </td>
                              <td className='border text-center'>
                                {report?.to_station?.station_name}
                              </td>
                              <td className='border text-center'>
                                {new Date(report?.from_date).toLocaleString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false
                                })}
                              </td>
                              <td className='border text-center'>
                                {new Date(report?.arrived_date).toLocaleString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false
                                })}
                              </td>
                              <td className='border text-center'>
                                {new Date(report?.created_at).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className='border text-center'>
                                {
                                  new Date(report?.from_date) >= new Date(new Date().setDate(new Date().getDate() - 40)) && (
                                    <Checkbox
                                      checked={isSelected(report?.id)}
                                      onChange={() => toggleSelect(report?.id)}
                                    />
                                  )
                                }

                                <Link
                                  href={getLocalizedUrl(
                                    `/traveling-allowances/${report?.id}/edit`,
                                    locale
                                  )}
                                >
                                  <CustomIconButton
                                    variant='tonal'
                                    color='primary'
                                    size='small'
                                  >
                                    <i className='tabler-edit' />
                                  </CustomIconButton>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={openConfirm}
        setOpen={setOpenConfirm}
        title='Delete Traveling Allowances?'
        message='Are you sure you want to delete the selected records?'
        confirmText='Yes, Delete'
        cancelText='Cancel'
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default TravelAllowanceListTable


// 'use client'

// // React Imports
// import React, { useEffect, useState } from 'react'

// // Next Imports
// import Link from 'next/link'
// import { useParams } from 'next/navigation'

// // MUI Imports
// import Card from '@mui/material/Card'
// import CardHeader from '@mui/material/CardHeader'
// import Button from '@mui/material/Button'
// import Grid from '@mui/material/Grid2'

// import { toast } from 'react-toastify'

// import { useSession } from 'next-auth/react'

// import { CardContent } from '@mui/material'

// // Util Imports
// import { getLocalizedUrl } from '@/utils/i18n'

// // Style Imports
// import tableStyles from '@core/styles/table.module.css'
// import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
// import CustomTextField from '@/@core/components/mui/TextField'
// import CustomIconButton from '@/@core/components/mui/IconButton'
// import ConfirmDialog from '@/components/ConfirmDialog'

// const TravelAllowanceListTable = () => {

//   // Hooks
//   const { lang: locale } = useParams()
//   const { data: session } = useSession()
//   const [data, setData] = useState([]);
//   const [month, setMonth] = useState(new Date())
//   const [openConfirm, setOpenConfirm] = useState(false)

//   const token = session?.user?.token

//   const fetchData = async (date) => {
//     // const token = await getCookie('token');

//     if(!token) return

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/traveling-allowances${date ? `?month=${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}` : ''}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const jsonData = await response.json();

//       console.log('jsonData', jsonData);

//       // if(response.status === 401) {
//       //   router.push('/not-authorized');
//       // }

//       setData(jsonData.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setData(null);
//     }
//   };

//   useEffect(() => {


//     fetchData();

//   }, [token])

//   useEffect(() => {
//     // Ensure DOM is painted before showing toasts
//     const runAfterMount = () => {
//       const success = sessionStorage.getItem('success');
//       const error = sessionStorage.getItem('error');

//       if (success) {
//         toast.success(success);
//         sessionStorage.removeItem('success');
//       }

//       if (error) {
//         toast.error(error);
//         sessionStorage.removeItem('error');
//       }
//     };

//     // Run after paint
//     requestAnimationFrame(() => {
//       setTimeout(runAfterMount, 0);
//     });
//   }, []);

//   const handleMonthChange = async (date) => {

//     setMonth(date);

//     await fetchData(date);

//   }

//   const handleDelete = async (id) => {

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/traveling-allowances/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const jsonData = await response.json();

//       if(response.ok){
//         toast.success('Traveling Allowance deleted successfully.');
//         // Refresh data
//         await fetchData(month);
//       } else {
//         toast.error( jsonData?.message || 'Failed to delete traveling allowance.');
//       }
//     } catch (error) {
//       console.error('Error deleting traveling allowance:', error);
//       toast.error('Error deleting traveling allowance.');
//     }
//   }

//   return (
//     <>
//       <Card>
//         <CardHeader title='Travel Allowances' className='pbe-4 flex-wrap gap-2' action={
//           <div className='flex justify-end flex-col items-start md:flex-row md:items-center gap-4'>
//             <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
//               <Link href={getLocalizedUrl('/traveling-allowances/add', locale)}>
//                 <Button
//                   variant='contained'
//                   startIcon={<i className='tabler-plus' />}
//                   className='max-sm:is-full'
//                 >
//                   Add New
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         } />
//         <CardContent>
//           <Grid container spacing={6}>
//             <Grid size={{ xs: 12, sm: 4 }}>
//               <AppReactDatepicker
//                 selected={month}
//                 id='select-month'
//                 showMonthYearPicker
//                 dateFormat='MMM, yyyy'
//                 onChange={async (date) => await handleMonthChange(date)}
//                 customInput={<CustomTextField label='Select Month' fullWidth />}
//               />
//             </Grid>
//             <Grid size={{ xs: 12 }}>
//               <div className='overflow-x-auto'>
//                 <table className={tableStyles.table}>
//                   <thead>
//                     <tr>
//                       <th rowSpan={2} className='border'>Sr No.</th>
//                       <th rowSpan={2} className='border'>Month & Date</th>
//                       <th rowSpan={2} className='border'>Train No.</th>
//                       <th colSpan={2} className='border'>Station</th>
//                       <th colSpan={2} className='border'>Time</th>
//                       <th rowSpan={2} className='border'>Created Date</th>
//                       <th rowSpan={2} className='border'>Action</th>
//                     </tr>
//                     <tr>
//                       <th className='border'>From Station</th>
//                       <th className='border'>To Station</th>
//                       <th className='border'>Left</th>
//                       <th className='border'>Arrived Date Time</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data.length > 0 && data.map((travel, index) => (
//                       <React.Fragment key={`group-${index}`}>
//                         <tr>
//                           <td className='border' rowSpan={travel.travel_data.length + 1}>{index + 1}.</td>
//                           <td className='border' rowSpan={travel.travel_data.length + 1}>{ new Date(travel.from_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
//                         </tr>
//                         {travel.travel_data.map((report) => (
//                           <tr key={`report-${report?.id}`}>
//                             <td className='border'>{report?.train?.train_no}</td>
//                             <td className='border'>{report?.from_station?.station_name}</td>
//                             <td className='border'>{report?.to_station?.station_name}</td>
//                             <td className='border'>
//                               { new Date(report?.from_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, {new Date(report?.from_date).getFullYear()} {new Date(report?.from_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
//                             </td>
//                             <td className='border'>
//                             { new Date(report?.arrived_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, {new Date(report?.arrived_date).getFullYear()} {new Date(report?.arrived_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
//                             </td>
//                             <td className='border'>{ new Date(report?.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
//                             <td className='border'>
//                               <Link href={getLocalizedUrl(`/traveling-allowances/${report?.id}/edit`, locale)}>
//                                 <CustomIconButton variant='tonal' color='primary' size='small'><i className='tabler-edit' /></CustomIconButton>
//                               </Link>
//                               <CustomIconButton variant='tonal' color='error' size='small' onClick={() => setOpenConfirm(true)}><i className='tabler-trash' /></CustomIconButton>
//                             </td>
//                           </tr>
//                         ))}
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>
//       <ConfirmDialog
//         open={openConfirm}
//         setOpen={setOpenConfirm}
//         title="Delete Traveling Allowance?"
//         message={`Are you sure you want to delete?`}
//         confirmText="Yes, Delete"
//         cancelText="Cancel"
//         successMessage="Deleted successfully!"
//         cancelMessage="Deletion cancelled."
//         onConfirm={() => handleDelete(4)}
//       />
//     </>
//   )
// }

// export default TravelAllowanceListTable
