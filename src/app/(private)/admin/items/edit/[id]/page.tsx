import PageTitle from '@/components/ui/page-title';
import { Button } from '@base-ui/react';
import Link from 'next/link';
import React from 'react'
import ItemForm from '../../_components/item-form';
import { getItemById } from '@/server-actions/items';
import InfoMessage from '@/components/functional/info-message';

interface EditItemPageProps{
  params: Promise<{
    id: number;

  }>
}

async function EditItemsPage( {params} : EditItemPageProps) {
  const {id} = await params;
  const response = await getItemById(id);
  if(!response.success){
    return <InfoMessage message={response.message}/>
  }

  return (
   <div>
      <PageTitle title="Add Item" />
      <ItemForm formType="edit"
      initialValues={response.data}
      />
    </div>
  )
}

export default EditItemsPage
