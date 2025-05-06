// Component Imports
import TravelAllowanceList from '@/views/user/traveling-allowances/list';

// Data Imports
import { getCookie } from '@/utils/cookies'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */
const getTravelData = async () => {
  // Vars

  const token = await getCookie('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/traveling-allowances`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }

  return res.json()
}

const TravelingAllowancesList = async () => {

  // Vars
  // const data = await getTravelData()

  return <TravelAllowanceList />
}

export default TravelingAllowancesList
