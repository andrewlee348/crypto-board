import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Link,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { tokens } from "../../theme";

const validationSchema = Yup.object({
  api_key: Yup.string().required("API Key is required"),
  api_secret: Yup.string().required("API Secret Key is required"),
});

function MyForm() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const formik = useFormik({
    initialValues: {
      api_key: "",
      api_secret: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Make a POST request to your Flask backend
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          console.log(user.uid);
          const request = {
            uid: user.uid,
            api_key: values.api_key,
            api_secret: values.api_secret,
          };
          await axios.post("https://crypto-board-1-399420.uc.r.appspot.com//update_user", request);
        } else {
          console.log("Error: Not logged in");
        }

        // Clear the form
        formik.resetForm();
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  return (
    <Box m="20px">
      <Header
        title="Kraken API Setup"
        subtitle="Enter your Kraken API Keys Below"
      />
      <Typography variant="h5" fontWeight="bold" sx={{ m: "10px 0 0 0" }}>
        Follow this{" "}
        <Link
          href="https://github.com/andrewlee348/crypto-board"
          target="_blank"
          variant="h5"
          fontWeight="bold"
          rel="noopener noreferrer"
          color={colors.grey[100]}
          underline="hover" // Add this property to show underline on hover
        >
          guide
        </Link>{" "}
        to set up your Kraken API keys and view your Kraken Portfolio
        <Link to={`https://github.com/andrewlee348/crypto-board`}>this</Link>
      </Typography>
      <Box mt="15px">
        <form onSubmit={formik.handleSubmit}>
          {" "}
          {/* Add form onSubmit here */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="text"
                label="API Key"
                id="api_key"
                name="api_key"
                value={formik.values.api_key}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                variant="filled"
              />
              {formik.touched.api_key && formik.errors.api_key ? (
                <div>{formik.errors.api_key}</div>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="text"
                label="API Secret Key"
                id="api_secret"
                name="api_secret"
                value={formik.values.api_secret}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                variant="filled"
              />
              {formik.touched.api_secret && formik.errors.api_secret ? (
                <div>{formik.errors.api_secret}</div>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" color="secondary" variant="contained">
                Submit API Keys
              </Button>
            </Grid>
          </Grid>
        </form>
        {""}
      </Box>
    </Box>
  );
}

export default MyForm;
