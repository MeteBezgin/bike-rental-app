import {
  Dialog,
  Grid,
  Typography,
  Button,
  Box,
  TextField,
  Divider,
  Theme,
  InputAdornment,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { Moment } from "moment";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { UseMutationResult } from "react-query";
import { DateRangePicker, DateRange } from "@mui/x-date-pickers-pro";
import _ from "lodash";
import React from "react";
import { Bike } from "../types";
import { checkDates, getDatesInRange } from "../helpers";
import { DateRange as DateRangeIcon } from "@mui/icons-material";

const RentBikeDialog: React.FC<{
  rentBikeMutation: UseMutationResult;
  open: boolean;
  setOpen: (val: boolean) => void;
  data: Partial<Bike>;
  userId: string;
  userName: string;
}> = ({ rentBikeMutation, open, setOpen, data, userId, userName }) => {
  const [dateValue, setDateValue] = useState<DateRange<Moment>>([null, null]);
  let rentedDates = data.rentals
    ?.map(({ start, end }) => {
      return getDatesInRange(new Date(start), new Date(end));
    })
    .flat(Infinity);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      PaperProps={{
        sx: {
          width: "30%",
          minHeight: "400px",
        },
      }}
    >
      <Grid
        container
        xs={12}
        padding={2}
        display="flex"
        justifyContent="center"
        minHeight={"100%"}
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
            <Typography variant="h6">Rent Bike</Typography>
          </Grid>
          <Grid
            paddingTop={1}
            container
            item
            display={"flex"}
            flexDirection="row"
            justifyContent={"space-between"}
          >
            <Grid item>
              <DateRangePicker
                value={dateValue}
                disableHighlightToday
                shouldDisableDate={(day) => {
                  if (rentedDates) {
                    return (
                      rentedDates.includes(
                        day.toDate().toISOString().split("T")[0]
                      ) ?? false
                    );
                  } else return false;
                }}
                onChange={(newValue) => {
                  if (newValue[0] && newValue[1]) {
                    let checkedArray = data.rentals?.map(({ start, end }) => {
                      return checkDates(
                        newValue.map((d) => d!.toDate()),
                        [new Date(start), new Date(end)]
                      );
                    });
                    if (checkedArray!.every((e) => e)) {
                      setDateValue(newValue);
                    } else {
                      setDateValue([null, null]);
                      window.alert(
                        "Some of those dates are full. Please chose another."
                      );
                    }
                  } else setDateValue(newValue);
                }}
                disablePast
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <TextField
                      sx={{
                        marginRight: 2,
                      }}
                      InputProps={{
                        disableUnderline: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <DateRangeIcon />
                          </InputAdornment>
                        ),
                      }}
                      {...startProps}
                    />

                    <TextField
                      InputProps={{
                        disableUnderline: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <DateRangeIcon />
                          </InputAdornment>
                        ),
                      }}
                      {...endProps}
                    />
                  </React.Fragment>
                )}
              />
            </Grid>
            <Grid item></Grid>
          </Grid>
        </Grid>
        <Grid
          container
          item
          padding={1}
          paddingTop={0}
          flexDirection="row"
          display={"flex"}
        >
          <Grid
            container
            alignItems={"center"}
            item
            xs={12}
            display="flex"
            flexDirection={"row"}
          >
            <Grid item paddingLeft={2}>
              <Typography paddingRight={1} variant="body1" fontWeight={"600"}>
                Model:
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">{data.bikeModel}</Typography>
            </Grid>
          </Grid>
          <Grid container alignItems={"center"} item xs={12}>
            <Grid item paddingLeft={2}>
              <Typography paddingRight={1} variant="body1" fontWeight={"600"}>
                Location:
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">{data.location}</Typography>
            </Grid>
          </Grid>
          <Grid container alignItems={"center"} item xs={12}>
            <Grid item paddingLeft={2}>
              <Typography paddingRight={1} variant="body1" fontWeight={"600"}>
                Price:
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">{data.price}$ / daily </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          item
          padding={2}
          paddingTop={2}
          flexDirection="row"
          display="flex"
        >
          <Grid
            container
            paddingX={1}
            alignItems="center"
            item
            justifyContent={"space-between"}
          >
            <Grid item>
              <Typography variant="body1" fontWeight={"600"}>
                Bike Rent Cost
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                {(() => {
                  if (dateValue[1] && dateValue[0] && data.price) {
                    return data.price * dateValue[1].diff(dateValue[0], "days");
                  }
                  return 0;
                })()}
                $
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            item
            alignItems={"center"}
            paddingX={1}
            justifyContent={"space-between"}
          >
            <Grid item>
              <Typography variant="body1" fontWeight={"600"}>
                Rent Service Fee
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">5$</Typography>
            </Grid>
          </Grid>
          <Divider
            sx={{
              minWidth: "100%",
            }}
          />
          <Grid
            container
            item
            paddingX={1}
            paddingTop={1}
            justifyContent={"space-between"}
          >
            <Grid item>
              <Typography variant="h6" fontWeight={"800"}>
                Total Cost
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                {(() => {
                  if (dateValue[1] && dateValue[0] && data.price) {
                    return (
                      data.price * dateValue[1].diff(dateValue[0], "days") + 5
                    );
                  }
                  return 5;
                })()}
                $
              </Typography>
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
            <Button
              onClick={() => {
                if (dateValue[0] && dateValue[1]) {
                  let newData = {
                    user: userId,
                    bikeId: data._id,
                    start: dateValue[0]?.toDate(),
                    end: dateValue[1]?.toDate(),
                    price: data.price,
                    name: userName,
                  };
                  rentBikeMutation.mutate(newData);
                  setOpen(false);
                }
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

export default RentBikeDialog;
