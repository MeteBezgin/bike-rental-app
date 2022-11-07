import { Dialog, Grid, Typography, Button, Box, Select } from "@mui/material";
import { useState } from "react";
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
} from "react-hook-form-mui";
import { UseMutationResult } from "react-query";
import _ from "lodash";

const CreateUserDialog: React.FC<{
  createUserMutation: UseMutationResult;
  open: boolean;
  setOpen: (val: boolean) => void;
}> = ({ createUserMutation, open, setOpen }) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      maxWidth="sm"
    >
      <Grid container padding={2} display="flex" justifyContent="center">
        <FormContainer
          onSuccess={(data) => {
            data.name = `${data.firstName} ${data.lastName}`;
            createUserMutation.mutate(_.omit(data, ["firstName", "lastName"]));
            setOpen(false);
            window.alert("Successfully created the user!");
          }}
        >
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextFieldElement
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextFieldElement
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldElement
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldElement
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldElement
                  required
                  fullWidth
                  name="passwordConfirm"
                  label="Confirm Password"
                  type="password"
                  id="passwordConfirm"
                />
              </Grid>
              <Grid item xs={12}>
                <SelectElement
                  required
                  fullWidth
                  name="role"
                  label="Role"
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create
            </Button>
          </Box>
        </FormContainer>
      </Grid>
    </Dialog>
  );
};

export default CreateUserDialog;
