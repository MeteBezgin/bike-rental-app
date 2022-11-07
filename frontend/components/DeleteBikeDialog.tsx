import { Dialog, Grid, Typography, Button } from "@mui/material";
import { useState } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { UseMutationResult } from "react-query";

const DeleteBikeDialog: React.FC<{
  deleteBikeMutation: UseMutationResult;
  open: boolean;
  setOpen: (val: boolean) => void;
  data: { _id: string }[] | [];
  tableObject: any;
}> = ({ deleteBikeMutation, open, setOpen, data, tableObject }) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      maxWidth="sm"
    >
      <Grid container display="flex" justifyContent="center">
        <Grid padding={2} container item display="flex" justifyContent="center">
          <Grid item>
            <Typography variant="h6">
              {data.length === 1
                ? "Are you sure you want to delete this bike?"
                : `Are you sure you want to delete all ${data.length} bikes?`}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          item
          padding={2}
          paddingTop={2}
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
                deleteBikeMutation.mutate(data);
                setOpen(false);
                tableObject.resetRowSelection();
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

export default DeleteBikeDialog;
