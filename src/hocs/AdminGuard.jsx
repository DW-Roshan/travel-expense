// Third-party Imports
import { getCookie } from '@/utils/cookies'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'
import { redirect } from 'next/navigation'
import { getLocalizedUrl } from '@/utils/i18n';

export default async function AdminGuard({ children, locale }) {
  const session = await getCookie('token');
  const user = await fetch(`${process.env.API_URL}/user`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.value}`
    }
  }).then(res => res.json());

  if(user.user_type == 'U'){
    
    return redirect(getLocalizedUrl('/dashboard', locale));
  }
  
  const isAdmin = await fetch(`${process.env.API_URL}/admin/session`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.value}`
    }
  });

  if(isAdmin.status === 401) {
    redirect(`/not-authorized`);
  }

  return <>{session ? children : <AuthRedirect lang={locale} />}</>
}
