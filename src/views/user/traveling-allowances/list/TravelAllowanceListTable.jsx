'use client'

// React Imports
import React, { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'

import { toast } from 'react-toastify'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import { getCookie } from '@/utils/cookies'

const TravelAllowanceListTable = () => {

  // Hooks
  const { lang: locale } = useParams()
  const [data, setData] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      const token = await getCookie('token');

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/traveling-allowances`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.value}`
          }
        });

        const jsonData = await response.json();

        console.log('jsonData', jsonData);

        // if(response.status === 401) {
        //   router.push('/not-authorized');
        // }

        setData(jsonData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData(null);
      }
    };

    fetchData();

  }, [])

  useEffect(() => {
    // Ensure DOM is painted before showing toasts
    const runAfterMount = () => {
      const success = sessionStorage.getItem('success');
      const error = sessionStorage.getItem('error');

      if (success) {
        toast.success(success);
        sessionStorage.removeItem('success');
      }

      if (error) {
        toast.error(error);
        sessionStorage.removeItem('error');
      }
    };

    // Run after paint
    requestAnimationFrame(() => {
      setTimeout(runAfterMount, 0);
    });
  }, []);

  return (
    <>
      <Card>
        <CardHeader title='Travel Allowances' className='pbe-4 flex-wrap gap-2' action={
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
            </div>
          </div>
        } />
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th rowSpan={2} className='border-ie'>Sr No.</th>
                <th rowSpan={2} className='border-ie'>Month & Date</th>
                <th rowSpan={2} className='border-ie'>Train No.</th>
                <th colSpan={2} className='border'>Station</th>
                <th colSpan={2} className='border'>Time</th>
                <th rowSpan={2} className='border-is'>Created Date</th>
              </tr>
              <tr>
                <th className='border-ie'>From Station</th>
                <th className='border-ie'>To Station</th>
                <th className='border-ie'>Left</th>
                <th className='border-ie'>Arrived Date Time</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 && data.map((travel, index) => (
                <React.Fragment key={`group-${index}`}>
                  <tr>
                    <td className='border-is' rowSpan={travel.travel_data.length + 1}>{index + 1}.</td>
                    <td className='border-is' rowSpan={travel.travel_data.length + 1}>{ new Date(travel.from_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  </tr>
                  {travel.travel_data.map((report) => (
                    <tr key={`report-${report.id}`}>
                      <td className='border-is'>{report.train.train_no}</td>
                      <td className='border-is'>{report.from_station.station_name}</td>
                      <td className='border-is'>{report.to_station.station_name}</td>
                      <td className='border-is'>
                        { new Date(report.from_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, {new Date(report.from_date).getFullYear()} {new Date(report.from_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                      </td>
                      <td className='border-is'>
                      { new Date(report.arrived_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, {new Date(report.arrived_date).getFullYear()} {new Date(report.arrived_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                      </td>
                      <td className='border-is'>{ new Date(report.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default TravelAllowanceListTable
