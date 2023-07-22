'use client'

import { Button as MuiButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect } from 'react';




const page: React.FC = () => {
  

  useEffect(() => {
    document.title = "404 Error";
  }, [])

  // Define animation variants
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.5 } }
  }
  return (
    <motion.div
    className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100"
    variants={variants} // apply the variants
    initial="hidden" // initial state
    animate="visible" // animate to this state
  >
       <motion.h1
        className="text-6xl font-bold text-red-600 cursor-pointer" // add cursor-pointer for hover effect
        initial={{ y: -200 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        whileHover={{ scale: 1.1 }} // add whileHover prop for hover animation
      >
        404
      </motion.h1>

      <motion.h2
        className="mt-4 text-xl text-gray-700"
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
      >
        มีข้อผิดพลาดเกี่ยวกับเว็บไซต์ กรุณาทำรายการใหม่
      </motion.h2>
   
      <MuiButton
        className="mt-8 custom-button"
        variant="contained"
        onClick={() => window.history.back()}
      >
        Go Back
      </MuiButton>
    </motion.div>
  )
}

export default page;
