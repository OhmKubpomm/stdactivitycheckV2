import React from 'react'
import Image from 'next/image'


const Photocard = ({url, onClick}) => {

  return (
    <div><Image src={url} alt='image' width={100} height={100} priority/>

    <button onClick={onClick}>Delete</button>
    </div>
  )
}

export default Photocard