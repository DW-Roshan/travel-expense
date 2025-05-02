// Third-party Imports
import { getCookie } from '@/utils/cookies'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

// import { redirect } from 'next/navigation';

export default async function AuthGuard({ children, locale }) {
  const session = await getCookie('token');



  return <>{session ? children : <AuthRedirect lang={locale} />}</>
}
