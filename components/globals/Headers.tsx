
'use server'
import { getServerSession } from 'next-auth'
import * as React from 'react';
import { authOptions} from '@/app/api/auth/[...nextauth]/route'


import SignIn from '../auth/SignIn';
import Link from 'next/link';
import SignOut from '../auth/SignOut';

import { AppBar, Toolbar, IconButton, Button, Box, Typography } from '@mui/material';
import Themebutton from './Themebutton';
import Usernavbar from '../profile/Usernavbar';



const Headers =  async() => {
  const session = await getServerSession(authOptions);

  return (
    
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
        <Link href="/" >
            <Button color="primary" sx={{
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              color: 'white',
            }
          }}>StdActivitycheck</Button>
          </Link>
         
        </Typography>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {session ? (
            <>
          
              <Link href="/profile/client" >
                <Button color="primary">Profile Client</Button>
              </Link>
              <Link href="/profile/server" >
                <Button color="primary">Profile Server</Button>
              </Link>
              <Link href="/dashboard" >
                <Button color="primary">Dashboard</Button>
              </Link>
              <Link href="/dashboard/cruduser" >
                <Button color="primary">crud</Button>
              </Link>
              <SignOut />
            </>
          ) : null}
        </Box>
        {!session && (
 
          <Link href="/signin" >
            <Button variant="outlined" color="secondary">
              Sign In
            </Button>
          </Link>
          
        )}
      </Toolbar>
    </AppBar>
 
  )

  }
  


export default Headers