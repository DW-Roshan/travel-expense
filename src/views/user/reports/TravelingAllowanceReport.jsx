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

const TravelingAllowanceReport = () => {

  const { data: session } = useSession()
  const token = session?.user?.token

  const [data, setData] = useState([]);
  const [user, setUser] = useState();
  const [totalAmount, setTotalAmount] = useState();
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
        setTotalAmount(jsonData.total_amount);
        setData(jsonData.data);
        setUser(jsonData.user);
      } else {
        setData([]);
        setUser();
      }

      console.log('jsonData', jsonData);

      // if(response.status === 401) {
      //   router.push('/not-authorized');
      // }

      // setData(jsonData.data);

    } catch (error) {
      console.error('Error fetching data:', error);

      setData([]);
      setUser();
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

    window.print();

    return
    
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

    doc.save(`TA ${month.toLocaleString('en-US', { month: 'short', year: '2-digit' }).toUpperCase()} ${userName}.pdf`)

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
              <div className='overflow-x-auto print-area'>
                <div className='relative'>
                  <div className='absolute left-0 right-0'>
                    <div className='flex justify-between'>
                      <div className='flex gap-10'>
                        <div>उ. रे./N.R</div>
                        <div>
                          <img src='/images/logos/IRCTC-logo.png' width='50' height='50' />
                        </div>
                      </div>
                      <div className=''>
                        <div>जी. ए. 31/ एस. आर . सी ./ जी.-1677</div>
                        <div><strong className='flex justify-end text-end'>G.A 31/S.R.C/G-1677<br />जी. 6/G-6</strong></div>
                      </div>
                    </div>
                  </div>
                  <div className='text-center'>यात्रा भत्ता विवरण</div>
                  <div className='text-center mb-6'><strong>TRAVELLING ALLOWANCE JOURNAL</strong></div>
                </div>
                <div className='ta-detail'>
                  Branch <strong className='underline'> {user?.branch?.branch_name} </strong> Division <strong className='underline'>{user?.division.division_name}</strong> Hd. Qrs . <strong className='underline'>{user?.station_head_quarter?.station_name}</strong> Journal of duties performed by
                  Sh. <strong className='underline'>{ user?.first_name +" "+ user?.last_name}</strong> S/o <strong className='underline'>{user?.father_name}</strong> For which allowance for <strong className='underline uppercase'>{format(month, 'MMM-yyyy')}</strong> is claimed
                  P.F. No. <strong className='underline'>{user?.pf_no}</strong> Designation <strong className='underline'>{user?.designation?.designation_name}</strong> Pay Band <strong className='underline'>{user?.pay_band}</strong> G.Pay <strong className='underline'>{user?.g_pay}</strong> Pay <strong className='underline'>{user?.pay || "-"}.</strong>
                  DOB <strong className='underline'>{user?.date_of_birth && format(user.date_of_birth, 'dd-MM-yyyy')}</strong> DOA <strong className='underline'>{user?.date_of_joining && format(user.date_of_joining, 'dd-MM-yyyy')}</strong> Checking Authority No. <strong className='underline'>{user?.authority_no}</strong> Valid upto <strong className='underline'>{user?.expiry_date && format(user.expiry_date, 'dd-MM-yyyy')}.</strong>
                  1st class duty card pass No. <strong className='underline'>{user?.first_class_duty_pass_no}</strong> Valid upto <strong className='underline'> 09-09-2025 </strong>TA list Sr. No. <strong className='underline'>{user?.ta_sr_no}.</strong>
                </div>
                <table ref={tableRef} className={` table-auto w-full border-collapse text-center`}>
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
                        // const hours = travel?.hrs_out_of_hq || "0";
                        // let percentage = "0%";
                        // let amount = "0";

                        // if (hours > "12:00") {
                        //   percentage = "100%";
                        //   amount = "1000 "+ hours;
                        // } else if (hours > "06:00") {
                        //   percentage = "70%";
                        //   amount = "700 " + hours;
                        // } else if (hours > "0") {
                        //   percentage = "30%";
                        //   amount = "300";
                        // }

                        if(travel?.is_in_month){

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
                              <td className="border pli-2 plb-0.5">{travel?.percentage}%</td>
                              <td className="border pli-2 plb-0.5">{travel?.amount?.rs}</td>
                              <td className="border pli-2 plb-0.5">{travel?.amount?.p}</td>
                              {index === 0 && (
                                <td rowSpan={19} className={`repeat-on-each-page rotate-text border pli-2 plb-0.5 [writing-mode:vertical-lr] [text-orientation:mixed]`} style={{ writingMode: 'vertical-lr' }}>
                                  Check Tickets in Running Train
                                </td>
                              )}
                              {index === 19 && (
                                <td rowSpan={7} className={`repeat-on-each-page rotate-text border pli-2 plb-0.5 [writing-mode:vertical-lr] [text-orientation:mixed]`} style={{ writingMode: 'vertical-lr' }}>
                                  Check Tickets in Running Train
                                </td>
                              )}
                            </tr>
                          );
                        }

                      })}
                      {data?.length > 0 ?
                        <tr>
                          <td className='border'></td>
                          <td className='border'></td>
                          <td className='border'></td>
                          <td className='border'></td>
                          <td className='border'></td>
                          <td className='border'></td>
                          <td className='border'></td>
                          <td className='border'><strong>TOTAL</strong></td>
                          <td className='border'><strong>{totalAmount && parseInt(totalAmount)}</strong></td>
                          <td className='border'><strong>{totalAmount && +(totalAmount - Math.floor(totalAmount)).toFixed(2)}</strong></td>
                        </tr>
                        :
                        <tr>
                          <td colSpan={11} className='border'>No Data Found</td>
                        </tr>
                      }

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
