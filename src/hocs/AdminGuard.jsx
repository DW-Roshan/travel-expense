import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth';

import { authOptions } from '@/libs/auth';

// Third-party Imports
import { getCookie } from '@/utils/cookies'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

import { getLocalizedUrl } from '@/utils/i18n';

export default async function AdminGuard({ children, locale }) {
  const session = await getServerSession(authOptions)
  const userType = session.user.userType;

  // console.log('session', session);

  if(userType !== 'A') {
    redirect(`/not-authorized`);
  }

  return <>{session ? children : <AuthRedirect lang={locale} />}</>
}
