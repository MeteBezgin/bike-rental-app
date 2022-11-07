import type { AppProps } from "next/app";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "../context/AuthContext";
import React from "react";
import NoSsr from "@mui/base/NoSsr";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterMoment } from "@mui/x-date-pickers-pro/AdapterMoment";

function MyApp({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = "http://localhost:3001";
  const theme = createTheme();

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <NoSsr>
      <LocalizationProvider
        dateAdapter={AdapterMoment}
        localeText={{ start: "mm/dd/yyyy", end: "mm/dd/yyyy" }}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </NoSsr>
  );
}

export default MyApp;
