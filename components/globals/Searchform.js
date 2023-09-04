'use client'
import React from 'react'
import ButtonLoad from '@/components/globals/ButtonLoad'
import useCustomRouter from '@/hooks/useCustomRouter'

const Searchform = () => {
    const {pushQuery,query} = useCustomRouter();

    async function Handlesearch(formData){
        const search = formData.get('search')   
        pushQuery({search})
    }
  return (
    <div>
        <form action={Handlesearch}>
            <input type="search" name="search" placeholder="Search.." defaultValue={query.search || ''}/>
            <ButtonLoad value="search"/>
        </form>
        </div>
  )
}

export default Searchform