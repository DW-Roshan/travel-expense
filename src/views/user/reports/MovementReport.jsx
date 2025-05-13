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

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import { getCookie } from '@/utils/cookies'

import { CardContent } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useSession } from 'next-auth/react'

const MovementReport = () => {

  const { data: session } = useSession()
  const token = session?.user?.token

  const [data, setData] = useState([]);
  const [month, setMonth] = useState(new Date())
  const tableRef = useRef(null);

  const fetchData = async (date) => {
    // const token = await getCookie('token');

    if(!token) return

    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movement-reports${date ? `?month=${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}` : ''}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const jsonData = await response.json();

      if (response.status === 200) {
        setData(jsonData.summary);
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

    const userName = "John Doe"

    doc.save(`MR ${month.toLocaleString('en-US', { month: 'short', year: '2-digit' }).toUpperCase()} ${userName}.pdf`)

    toast.success('Report Downloaded successfully.')
  }

  return (
    <>
      <Card>

        <CardHeader title='Movement Report' className='pbe-4 flex-wrap gap-2' action={
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
                <table ref={tableRef} className={`${tableStyles.table} text-center`}>
                  <thead>
                    <tr>
                      <th colSpan={4} className='border text-center text-[15px]'>MOVEMENT REPORT FOR THE MONTH OF {String(month.toLocaleDateString('en-US', { month: 'long'})).toUpperCase()} {month.toLocaleDateString('en-us', {year: 'numeric' })}</th>
                    </tr>
                    <tr>
                      <th rowSpan={2} className='border text-center uppercase'>DATE</th>
                      <th rowSpan={2} className='border text-center'>TRAIN NO.</th>
                      <th colSpan={2} className='border text-center'>STATION</th>
                    </tr>
                    <tr>
                      <th className='border text-center'>FROM</th>
                      <th className='border text-center'>TO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? data.map((travel, index) => (
                      <tr key={index}>
                        <td className='border'>{travel.date}</td>
                        <td className='border'>{travel.type == 'travel' && travel.trains}</td>
                        <td className='border' colSpan={2}>{travel.type == 'leave' ? travel.leave_purpose.toUpperCase() : travel.stations}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className='border'>No Data</td>
                      </tr>
                    )}
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

export default MovementReport
