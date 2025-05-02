import { redirect } from 'next/navigation'

// Third-party Imports
import { getCookie } from '@/utils/cookies'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

import { getLocalizedUrl } from '@/utils/i18n';

export default async function UserGuard({ children, locale }) {
  const session = await getCookie('token');
  
  const user = await fetch(`${process.env.API_URL}/user`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.value}`
    }
  }).then(res => res.json());

  if(user.user_type == 'A'){

    return redirect(getLocalizedUrl('/admin/dashboard', locale));
  }

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
