import { verifyWithCredentials } from "@/actions/authActions";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button as MuiButton, Box, Typography, Container } from "@mui/material";
import Link from "next/link";
interface VerifyPageProps {
  searchParams: {
    token: string;
  };
}

const VerifyPage = async ({ searchParams: { token } }: VerifyPageProps) => {
  const res = await verifyWithCredentials(token);

  return (
    <>
      <Container>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CheckCircleIcon color="success" style={{ fontSize: 100 }} />
          <Typography variant="h4" component="div" gutterBottom>
            {res?.msg}
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            Your account has been verified. You can now access all the features
            of our application.
          </Typography>
          <MuiButton className="custom-button mt-8" variant="contained">
            <Link href="/">Go to Home</Link>
          </MuiButton>
        </Box>
      </Container>
    </>
  );
};

export default VerifyPage;
