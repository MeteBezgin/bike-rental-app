import { Dialog, Grid, Typography, Button } from "@mui/material";
import { useState } from "react";
import {
  FormContainer,
  TextFieldElement,
  SelectElement,
} from "react-hook-form-mui";
import { UseMutationResult } from "react-query";
import { User } from "../types";

const EditUserDialog: React.FC<{
  updateUserMutation: UseMutationResult;
  open: boolean;
  setOpen: (val: boolean) => void;
  data: {
    _id: string;
    name: string;
    role: string;
    avatar: string;
    email: string;
  };
}> = ({ updateUserMutation, open, setOpen, data }) => {
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
          defaultValues={data}
          onSuccess={(data) => {
            updateUserMutation.mutate(data);
            setOpen(false);
            window.alert("Successfully edited the user!");
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
              <Typography variant="h6">Edit User</Typography>
            </Grid>
            <Grid paddingTop={1} container item>
              <Grid item py={1} xs={12}>
                <TextFieldElement
                  size="small"
                  fullWidth
                  name="name"
                  label="Name"
                  required
                />
              </Grid>
              <Grid item py={1} xs={12}>
                <TextFieldElement
                  size="small"
                  fullWidth
                  name="email"
                  label="Email"
                  required
                />
              </Grid>
              <Grid
                container
                item
                xs={12}
                py={1}
                display="flex"
                justifyContent={"space-between"}
              >
                <Grid item xs={5}>
                  <TextFieldElement
                    size="small"
                    name="avatar"
                    label="Avatar"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={5}>
                  <SelectElement
                    size="small"
                    name="role"
                    label="Role"
                    fullWidth
                    options={[
                      {
                        id: "USER",
                        label: "USER",
                      },
                      {
                        id: "MANAGER",
                        label: "MANAGER",
                      },
                    ]}
                  />
                </Grid>
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
              <Button type="submit" variant="text">
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

export default EditUserDialog;
