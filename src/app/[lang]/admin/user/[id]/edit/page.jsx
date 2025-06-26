import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

// MUI Imports
import Grid from '@mui/material/Grid2'

import { authOptions } from "@/libs/auth";

// Component Imports
import FormUserAdd from '@/views/admin/user/add/FormUserAdd'

import { getLocalizedUrl } from "@/utils/i18n";

const fetchData = async (id, lang) => {

  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user/${id}/edit`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = await res.json();

  if (!res.ok) {

    redirect(getLocalizedUrl('/jobs/list', lang));
  }

  return data;

}

const EditUserPage = async (props) => {
  const params = await props.params;
  const lang = params.lang;
  const id = params.id
  const data = await fetchData(id, lang);

  // console.log("edit data:", data);

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <FormUserAdd userId={id} userData={data?.user} allData={data?.data} />
      </Grid>
    </Grid>
  )

  // return <FormAddEditJob jobId={id} skillsData={data?.skills} industries={data?.industries} departments={data?.departments} jobData={data?.job} locations={data?.locations}/>
}

export default EditUserPage
