// Third-party Imports
import { getServerSession } from 'next-auth'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'
import { getCookie } from '@/utils/cookies'

export default async function AuthGuard({ children, locale }) {
  const session = await getCookie('token');

  console.log("session", session);

  return <>{session ? children : <AuthRedirect lang={locale} />}</>
}
