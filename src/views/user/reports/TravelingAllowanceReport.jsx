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
import tableStyles from '@core/styles/table.module.css'

import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { format } from 'date-fns'

const TravelingAllowanceReport = () => {

  const { data: session } = useSession()
  const token = session?.user?.token

  const [data, setData] = useState([]);
  const [month, setMonth] = useState(new Date())
  const tableRef = useRef(null);

  const fetchData = async (date) => {
    // const token = await getCookie('token');

    if(!token) return

    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ta${date ? `?month=${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}` : ''}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const jsonData = await response.json();

      if (response.status === 200) {
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

    const userName = "John Doe"

    doc.save(`MR ${month.toLocaleString('en-US', { month: 'short', year: '2-digit' }).toUpperCase()} ${userName}.pdf`)

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
                <table className={` table-auto w-full border-collapse text-center`}>
                  <thead>
                    <tr>
                      {/* <th rowSpan={2} className="border p-2">Sr No.</th> */}
                      <th rowSpan={2} className="border p-2">Month & Date</th>
                      <th rowSpan={2} className="border p-2">Train No.</th>
                      <th colSpan={2} className="border p-2">Station</th>
                      <th colSpan={2} className="border p-2">Time</th>
                      {/* <th rowSpan={2} className="border p-is">Created Date</th> */}
                      <th rowSpan={2} className="border p-2">Hrs. Out of H.Q.</th>
                      <th rowSpan={2} className="border p-2">%AGE</th>
                      <th colSpan={2} className="border p-2">Amount</th>
                      <th rowSpan={2} className="border p-2">Object of journey</th>
                    </tr>
                    <tr>
                      <th className="border p-2">From</th>
                      <th className="border p-2">To</th>
                      <th className="border p-2">Dep</th>
                      <th className="border p-2">Arrived</th>
                      <th className="border p-2">Rs.</th>
                      <th className="border p-2">P.</th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* {data?.length > 0 && data?.map((travel, index) => (
                      <React.Fragment key={`group-${index}`}>
                        {travel.travel_data.map((report, i) => (
                          <tr key={`report-${report?.id}`}>
                            {i === 0 && (
                              <>
                                <td rowSpan={travel.travel_data.length} className="border-is">{index + 1}.</td>
                                <td rowSpan={travel.travel_data.length} className="border-is">
                                  {format(travel?.from_date, 'dd-MM-yyy')}
                                </td>
                              </>
                            )}
                            <td className="border-is">{report?.train?.train_no}</td>
                            <td className="border-is">{new Date(report?.from_date).toDateString() === new Date(travel?.from_date).toDateString() ? (report?.from_station?.station_code) : '-----'}</td>
                            <td className="border-is">{new Date(report?.arrived_date).toDateString() === new Date(travel?.from_date).toDateString() ? (report?.to_station?.station_code) : '-----'}</td>
                            <td className="border-is">
                              {format(report?.from_date, 'dd-MM-yyy') === format(travel?.from_date, 'dd-MM-yyy') ? (
                                <>
                                {format(report?.from_date, 'H:mm')}
                                </>
                              ) : (
                                '-----'
                              )}
                            </td>

                            <td className="border-is">
                              {new Date(report?.arrived_date).toDateString() === new Date(travel?.from_date).toDateString() ? (
                                <>
                                {format(report?.arrived_date, 'H:mm')}
                                </>
                              ) : (
                                '-----'
                              )}
                            </td>
                            {i === 0 && (<>
                              <td rowSpan={travel.travel_data.length} className="border">
                                {travel?.hrs_out_of_hq}
                              </td>
                              <td rowSpan={travel.travel_data.length} className="border">
                                {travel?.hrs_out_of_hq > "12:00" ? '100%' : (travel?.hrs_out_of_hq > "6:00" || travel?.hrs_out_of_hq <= "12:00"  ? '70%' : (travel?.hrs_out_of_hq <= "6:00" ? '30%' : '0%'))}
                              </td>
                              <td rowSpan={travel.travel_data.length} className="border">
                                {travel?.hrs_out_of_hq > "12:00" ? '100%' : (travel?.hrs_out_of_hq > "6:00" || travel?.hrs_out_of_hq <= "12:00"  ? '70%' : (travel?.hrs_out_of_hq <= "6:00" ? '30%' : '0%'))}
                              </td>
                              <td rowSpan={travel.travel_data.length} className="border">
                                0
                              </td>
                            </>)}
                            {index == 0 && (
                              <td rowSpan={data.length}  className="border">
                                Check Tickets in Running Train ({data?.length})
                              </td>
                            )}
                          </tr>
                        ))} 
                        <tr>
                          <td className="border-is">{index + 1}.</td>
                          <td className="border-is">
                            {format(travel?.from_date, 'dd-MM-yyy')}
                          </td>
                          <td className="border-is">
                            {travel?.travel_data?.map((report, i) => (
                              <span key={i}>
                                {report?.train?.train_no}
                                <br />
                              </span>
                            ) )}
                          </td>
                          <td className="border-is">
                            {travel?.travel_data?.map((report, i) => (
                              <span key={i}>
                                {format(report?.from_date, 'dd-MM-yyy') === format(travel?.from_date, 'dd-MM-yyy') ? (
                                  <>
                                  {report?.from_station?.station_code}
                                  </>
                                ) : (
                                  '-----'
                                )}
                                <br />
                              </span>
                            ) )}
                          </td>
                          <td className="border">
                            {travel?.travel_data?.map((report, i) => (
                              <span key={i}>
                                {format(report?.arrived_date, 'dd-MM-yyy') === format(travel?.from_date, 'dd-MM-yyy') ? (
                                  <>
                                  {report?.to_station?.station_code}
                                  </>
                                ) : (
                                  '-----'
                                )}
                                <br />
                              </span>
                            ) )}
                          </td>
                          <td className="border">
                            {travel?.travel_data?.map((report, i) => (
                              <span key={i}>
                                {format(report?.from_date, 'dd-MM-yyy') === format(travel?.from_date, 'dd-MM-yyy') ? (
                                  <>
                                  {format(report?.from_date, 'H:mm')}
                                  </>
                                ) : (
                                  '-----'
                                )}
                                <br />
                              </span>
                            ) )}
                          </td>
                          <td className="border">
                            {travel?.travel_data?.map((report, i) => (
                              <span key={i}>
                                {format(report?.arrived_date, 'dd-MM-yyy') === format(travel?.from_date, 'dd-MM-yyy') ? (
                                  <>
                                  {format(report?.arrived_date, 'H:mm')}
                                  </>
                                ) : (
                                  '-----'
                                )}
                                <br />
                              </span>
                            ) )}
                          </td>
                          <td className='border'>
                            {travel?.hrs_out_of_hq}
                          </td>
                          <td className='border'>
                            {travel?.hrs_out_of_hq > "12:00" ? '100%' : (travel?.hrs_out_of_hq > "6:00" || travel?.hrs_out_of_hq <= "12:00"  ? '70%' : (travel?.hrs_out_of_hq <= "6:00" ? '30%' : '0%'))}
                          </td>
                          <td className='border'>
                            {travel?.hrs_out_of_hq > "12:00" ? '1000' : (travel?.hrs_out_of_hq > "6:00" || travel?.hrs_out_of_hq <= "12:00"  ? '700' : (travel?.hrs_out_of_hq <= "6:00" ? '300' : '0'))}
                          </td>
                          <td className='border'>
                            0
                          </td>
                          {index == 0 && (
                          <td rowSpan={data?.length} className='border [writing-mode:sideways-lr]'>
                            Check Tickets in Running Train {travel?.length}
                          </td>
                          )}
                        </tr>
                      </React.Fragment>
                    ))}
                      */}
                      {data?.length > 0 && data.map((travel, index) => {
                        const fromDateStr = format(travel?.from_date, 'dd-MM-yyyy');

                        // Helper: Format each field for all travel_data
                        const trainNos = travel?.travel_data?.map((r, i) => (
                          <span key={`train-${i}`}>{r?.train?.train_no}<br /></span>
                        ));

                        const fromStations = travel?.travel_data?.map((r, i) => (
                          <span key={`from-${i}`}>
                            {format(r?.from_date, 'dd-MM-yyyy') === fromDateStr ? r?.from_station?.station_code : '-----'}
                            <br />
                          </span>
                        ));

                        const toStations = travel?.travel_data?.map((r, i) => (
                          <span key={`to-${i}`}>
                            {format(r?.arrived_date, 'dd-MM-yyyy') === fromDateStr ? r?.to_station?.station_code : '-----'}
                            <br />
                          </span>
                        ));

                        const depTimes = travel?.travel_data?.map((r, i) => (
                          <span key={`dep-${i}`}>
                            {format(r?.from_date, 'dd-MM-yyyy') === fromDateStr ? format(r?.from_date, 'H:mm') : '-----'}
                            <br />
                          </span>
                        ));

                        const arrTimes = travel?.travel_data?.map((r, i) => (
                          <span key={`arr-${i}`}>
                            {format(r?.arrived_date, 'dd-MM-yyyy') === fromDateStr ? format(r?.arrived_date, 'H:mm') : '-----'}
                            <br />
                          </span>
                        ));

                        // Determine %AGE and amount
                        const hours = travel?.hrs_out_of_hq || "0";
                        let percentage = "0%";
                        let amount = "0";

                        if (hours > "12:00") {
                          percentage = "100%";
                          amount = "1000 "+ hours;
                        } else if (hours > "06:00") {
                          percentage = "70%";
                          amount = "700 " + hours;
                        } else if (hours > "0") {
                          percentage = "30%";
                          amount = "300";
                        }

                        return (
                          <tr key={index}>
                            {/* <td className="border pli-2 plb-0.5">{index + 1}.</td> */}
                            <td className="border pli-2 plb-0.5">{fromDateStr}</td>
                            <td className="border pli-2 plb-0.5">{trainNos}</td>
                            <td className="border pli-2 plb-0.5">{fromStations}</td>
                            <td className="border pli-2 plb-0.5">{toStations}</td>
                            <td className="border pli-2 plb-0.5">{depTimes}</td>
                            <td className="border pli-2 plb-0.5">{arrTimes}</td>
                            <td className="border pli-2 plb-0.5">{travel?.hrs_out_of_hq}</td>
                            <td className="border pli-2 plb-0.5">{percentage}</td>
                            <td className="border pli-2 plb-0.5">{amount}</td>
                            <td className="border pli-2 plb-0.5">0</td>
                            {index === 0 && (
                              <td rowSpan={data?.length} className={`border pli-2 plb-0.5 [writing-mode:sideways-lr] [text-orientation:mixed]`}>
                                Check Tickets in Running Train
                              </td>
                            )}
                          </tr>
                        );
                      })}

                  </tbody>
                </table>

              </div>
            </Grid>
            {/* <Grid size={{ xs: 12 }}>
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
                    {data?.length > 0 ? data?.map((travel, index) => (
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
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>
    </>
  )

}

export default TravelingAllowanceReport
