'use client'
import { getLoggedInUser } from '@/server-actions/users';
import React from 'react'
import { Iuser } from '@/interfaces';
import LogoutButton from '@/components/functional/logout-button';
import usersGlobalStore, { IUsersGlobalStore } from '@/store/users-store';


 function adminProfile() {
  
  const {user} = usersGlobalStore() as IUsersGlobalStore;
  


  return (
    <div className="flex flex-col gap-5">
      <h1> Admin Dashbaord Page</h1>
      <h1>Name:{ user?.name}</h1>
      <h1>role:{ user?.role}</h1>
      <h1>Email: {user?.email}</h1>
      
    </div>
  )
}

export default adminProfile