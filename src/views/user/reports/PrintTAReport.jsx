'use client'


// React Imports
import React from 'react'


// Style Imports
import { format } from 'date-fns'

const PrintTravelingAllowanceReport = ({ table }) => {


  return (
    <>
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



              if (travel?.is_in_month) {

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
                      <td rowSpan={data?.length + 1} className={`rotate-text border pli-2 plb-0.5 [writing-mode:vertical-lr] [text-orientation:mixed]`} style={{ writingMode: 'vertical-lr' }}>
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

    </>
  )

}

export default PrintTravelingAllowanceReport
