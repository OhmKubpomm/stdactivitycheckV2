'use client'
import React from 'react'
import ButtonLoad from '@/components/globals/ButtonLoad'
import useCustomRouter from '@/hooks/useCustomRouter'

import { Input, Space } from 'antd';
const Searchform = () => {
    const {pushQuery,query} = useCustomRouter();

    async function Handlesearch(formData){
        const search = formData.get('search')   
        pushQuery({search, page:1})
    }
  return (
    <div>
        <form action={Handlesearch}>
            <Input  type="search" name="search" placeholder="Search.." defaultValue={query.search || ''} style={{ width: '20%' }} allowClear/>
            
            <ButtonLoad value="search" className="px-4 py-2 glass-button hover:text-blue-800"/>
        </form>
        </div>
  )
}

export default Searchform