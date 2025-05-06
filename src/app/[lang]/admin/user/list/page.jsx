// Component Imports
import UserList from '@views/apps/user/list'

// Data Imports
// import { getUserData, getUserDataL } from '@/app/server/actions'
import { getCookie } from '@/utils/cookies'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */
const getUserData = async () => {
  // Vars
  try {
    const token = await getCookie('token');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // Timeout after 15 seconds

    const res = await fetch(`${process.env.API_URL}/admin/users`, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      }
    })

    const users = await res.json();

    return users;

  } catch (error) {
    console.error('Error fetching user data:', error);

    return [];
  }
}

const UserListApp = async () => {

  // Vars
  const userData = await getUserData()

  return <UserList />
}

export default UserListApp
