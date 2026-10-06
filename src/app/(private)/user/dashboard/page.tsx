import { getLoggedInUser } from '@/server-actions/users';
import React from 'react'
import { Iuser } from '@/interfaces';
import LogoutButton from '@/components/functional/logout-button';


async function userProfile() {
    const userResponse = await getLoggedInUser();
    if (!userResponse.success){
      return "unauthorised";
    }

    const user: Iuser = userResponse.data;


  return (
    <div className="flex flex-col gap-5">
      <h1>User Dashbaord Page</h1>
      <h1>Name:{ user.name}</h1>
      <h1>role:{ user.role}</h1>
      <h1>Email: {user.email}</h1>
     
    </div>
  )
}

export default userProfile 