import { Dialog, Grid, Typography, Button } from "@mui/material";
import { useState } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { UseMutationResult } from "react-query";

const CreateBikeDialog: React.FC<{
  createBikeMutation: UseMutationResult;
  open: boolean;
  setOpen: (val: boolean) => void;
}> = ({ createBikeMutation, open, setOpen }) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      maxWidth="sm"
    >
      <Grid container display="flex" justifyContent="center">
        <FormContainer
          onSuccess={(data) => {
            createBikeMutation.mutate(data);
            setOpen(false);
            window.alert("Successfully created the bike!");
          }}
        >
          <Grid
            container
            item
            flexDirection="column"
            display="flex"
            justifyContent="space-between"
            padding={2}
          >
            <Grid item textAlign="start">
              <Typography variant="h6">New Bike</Typography>
            </Grid>
            <Grid paddingTop={1} container item>
              <Grid item py={1} xs={12}>
                <TextFieldElement
                  size="small"
                  fullWidth
                  name="bikeModel"
                  label="Model"
                  required
                />
              </Grid>
              <Grid item py={1} xs={12}>
                <TextFieldElement
                  size="small"
                  fullWidth
                  name="location"
                  label="Location"
                  required
                />
              </Grid>
              <Grid item xs={12} py={1}>
                <TextFieldElement
                  size="small"
                  name="color"
                  label="Color"
                  required
                />
              </Grid>
              <Grid item xs={6} py={1}>
                <TextFieldElement
                  size="small"
                  name="price"
                  label="Price ($)"
                  type="number"
                  required
                />
              </Grid>
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
              <Button type="submit" variant="contained">
                OKAY
              </Button>
            </Grid>
          </Grid>
        </FormContainer>
      </Grid>
    </Dialog>
  );
};

export default CreateBikeDialog;
