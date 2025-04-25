// Third-party Imports
import { getCookie } from '@/utils/cookies'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'
import { redirect } from 'next/navigation'

export default async function UserGuard({ children, locale }) {
  const session = await getCookie('token');

  const isUser = await fetch(`${process.env.API_URL}/session`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.value}`
    }
  });

  if(isUser.status === 401) {
    redirect(`/not-authorized`);
  }

  return <>{session ? children : <AuthRedirect lang={locale} />}</>
}
