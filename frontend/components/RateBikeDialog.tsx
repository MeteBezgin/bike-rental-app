import {
  Dialog,
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { UseMutationResult } from "react-query";
import { RentalsType } from "../types";

const RateBikeDialog: React.FC<{
  rateBikeMutation: UseMutationResult;
  open: boolean;
  setOpen: (val: boolean) => void;
  data: {
    bikeId: string;
    rentalId: string;
  };
}> = ({ rateBikeMutation, open, setOpen, data }) => {
  const [rating, setRating] = useState<number>(0);

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
              We hope you enjoyed your rental period. You can select your rating
              below and rate the bike.
            </Typography>
          </Grid>
          <Grid item padding={2}>
            <Select
              value={rating}
              onChange={(e) => {
                setRating(parseInt(e.target.value as string));
              }}
              sx={{
                minWidth: "4vw",
              }}
            >
              <MenuItem value={"1"}>1</MenuItem>
              <MenuItem value={"2"}>2</MenuItem>
              <MenuItem value={"3"}>3</MenuItem>
              <MenuItem value={"4"}>4</MenuItem>
              <MenuItem value={"5"}>5</MenuItem>
            </Select>
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
                rateBikeMutation.mutate({
                  ...data,
                  rating,
                });
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

export default RateBikeDialog;
