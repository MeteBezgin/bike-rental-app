import { Dialog, Grid, Typography, Button } from "@mui/material";
import { useState } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { UseMutationResult } from "react-query";
import { RentalsType } from "../types";

const CancelRentalDialog: React.FC<{
  deleteBikeRentalMutation: UseMutationResult;
  open: boolean;
  setOpen: (val: boolean) => void;
  data: {
    bikeId: string;
    rentalId: string;
  };
}> = ({ deleteBikeRentalMutation, open, setOpen, data }) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      maxWidth="sm"
    >
      <Grid container padding={2} display="flex" justifyContent="center">
        <Grid container padding={2} item display="flex" justifyContent="center">
          <Grid item>
            <Typography variant="h6">
              Are you sure you want to cancel your rental?
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          item
          padding={2}
          paddingTop={0}
          flexDirection="row"
          display="flex"
          justifyContent="flex-end"
        >
          <Grid item>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              variant="text"
            >
              CANCEL
            </Button>
          </Grid>
          <Grid item paddingLeft={1}>
            <Button
              type="submit"
              onClick={() => {
                deleteBikeRentalMutation.mutate(data);
                setOpen(false);
              }}
              variant="contained"
            >
              OKAY
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default CancelRentalDialog;
