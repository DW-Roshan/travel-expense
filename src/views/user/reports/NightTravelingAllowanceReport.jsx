'use client'


// React Imports
import React, { useEffect, useRef, useState } from 'react'

// Next Imports

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'

import { toast } from 'react-toastify'

// Util Imports
// import { getLocalizedUrl } from '@/utils/i18n'

import { useSession } from 'next-auth/react'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { CardContent } from '@mui/material'

// Style Imports
import { format } from 'date-fns'

import CustomTextField from '@/@core/components/mui/TextField'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const NightTravelingAllowanceReport = () => {

  const { data: session } = useSession()
  const token = session?.user?.token

  const [data, setData] = useState([]);
  const [totalHours, setTotalHours] = useState();
  const [month, setMonth] = useState(new Date())
  const tableRef = useRef(null);

  const fetchData = async (date) => {
    // const token = await getCookie('token');

    if(!token) return

    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nda${date ? `?month=${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}` : ''}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const jsonData = await response.json();

      if (response.status === 200) {
        setTotalHours(jsonData.total_hours);
        setData(jsonData.data);
      } else {
        setData([]);
      }

      console.log('jsonData', jsonData);

      // if(response.status === 401) {
      //   router.push('/not-authorized');
      // }

      // setData(jsonData.data);

    } catch (error) {
      console.error('Error fetching data:', error);

      setData([]);
    }
  };

  useEffect(() => {


    fetchData();

  }, [token])

  const handleMonthChange = async (date) => {

    setMonth(date);

    await fetchData(date);

  }

  const exportTableToPDF = () => {
    const doc = new jsPDF()

    autoTable(doc, {
      html: tableRef.current,
      startY: 25,
      useCss: true,
      styles: {
        lineColor: [0,0,0]
      }
    })

    // // Prepare table rows
    // const tableRows = data.length > 0 ? data.map(travel => {
    //   return [
    //     travel.date,
    //     travel.type === 'travel' ? travel.trains : '',
    //     travel.type === 'leave' ? travel.leave_purpose : (travel.stations || '')
    //   ]
    // }) : [['No Data', '', '']]

    // // Add table to PDF
    // autoTable(doc, {
    //   head: [['Date', 'Train No.', 'From / Purpose']],
    //   body: tableRows,
    //   startY: 25
    // })

    const userName = session?.user?.name

    doc.save(`NDA ${month.toLocaleString('en-US', { month: 'short', year: '2-digit' }).toUpperCase()} ${userName}.pdf`)

    toast.success('Report Downloaded successfully.')
  }

  return (
    <>
      <Card>

        <CardHeader title='Traveling Allowance Journal' className='pbe-4 flex-wrap gap-2' action={
          <div className='flex justify-end flex-col items-start md:flex-row md:items-center gap-4'>
            <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
              <Button
                variant='contained'
                startIcon={<i className='tabler-upload' />}
                className='max-sm:is-full'
                disabled={!Array.isArray(data) || data.length === 0}
                onClick={exportTableToPDF}
              >
                Export to PDF
              </Button>
            </div>
          </div>
        } />
        <CardContent>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <AppReactDatepicker
                selected={month}
                id='select-month'
                showMonthYearPicker
                dateFormat='MMM, yyyy'
                onChange={async (date) => await handleMonthChange(date)}
                customInput={<CustomTextField label='Select Month' fullWidth />}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <div className='overflow-x-auto'>
                <table ref={tableRef} className={` table-auto w-full border-collapse text-center`}>
                  <thead>
                    <tr>
                      <th rowSpan={2} className="border p-2">Month & Date</th>
                      <th rowSpan={2} className="border p-2">Train No.</th>
                      <th colSpan={2} className="border p-2">Station</th>
                      <th colSpan={2} className="border p-2">Night Shift Employed</th>
                      <th colSpan={2} className="border p-2">Signing</th>
                      <th colSpan={2} className="border p-2">Night Duty Perfomed</th>
                      <th rowSpan={2} className="border p-2">Total Hrs.</th>
                      <th rowSpan={2} className="border p-2">Wted Hrs.</th>
                    </tr>
                    <tr>
                      <th className="border p-2">From</th>
                      <th className="border p-2">To</th>
                      <th className="border p-2">Bkd Dep</th>
                      <th className="border p-2">Arrived</th>
                      <th className="border p-2">On</th>
                      <th className="border p-2">Off</th>
                      <th className="border p-2">From</th>
                      <th className="border p-2">To</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data?.length > 0 && data?.map((report, index) => (
                      <tr key={index}>
                        <td className="border pli-2 plb-0.5">{report?.date}</td>
                        <td className="border pli-2 plb-0.5">{report?.train_no}</td>
                        <td className="border pli-2 plb-0.5">{report?.from_station}</td>
                        <td className="border pli-2 plb-0.5">{report?.to_station}</td>
                        <td className="border pli-2 plb-0.5">{report?.shift_employed_from}</td>
                        <td className="border pli-2 plb-0.5">{report?.shift_employed_to}</td>
                        <td className="border pli-2 plb-0.5">{report?.adjusted_sign_on}</td>
                        <td className="border pli-2 plb-0.5">{report?.adjusted_sign_off}</td>
                        <td className="border pli-2 plb-0.5">{report?.night_duty_from}</td>
                        <td className="border pli-2 plb-0.5">{report?.night_duty_to} {report?.next_day ? <><br />{report?.next_day}</> : null}</td>
                        <td className="border pli-2 plb-0.5">{report?.total_hours}</td>
                        <td className="border pli-2 plb-0.5">{report?.weighted_hrs}</td>
                      </tr>
                    ))}
                    {data?.length > 0 ?
                      <tr>
                        <td className='border'></td>
                        <td className='border'></td>
                        <td className='border'></td>
                        <td className='border'></td>
                        <td className='border'></td>
                        <td className='border'></td>
                        <td className='border'></td>
                        <td className='border'></td>
                        <td className='border' colSpan={2}><strong>TOTAL</strong></td>
                        <td className='border'><strong>{totalHours}</strong></td>
                        <td className='border'></td>
                      </tr>
                      :
                      <tr>
                        <td colSpan={12} className='border'>No Data Found</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )

}

export default NightTravelingAllowanceReport
