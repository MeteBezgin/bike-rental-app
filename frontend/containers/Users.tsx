import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Dialog,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient, useQuery } from "react-query";
import useAuth from "../hooks/useAuth";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_TableInstance,
} from "material-react-table";
import { useMemo } from "react";
import { useState } from "react";
import EditUserDialog from "../components/EditUserDialog";
import { Role, User } from "../types";
import Image from "next/image";
import _, { create } from "lodash";
import DeleteUserDialog from "../components/DeleteUserDialog";
import CreateUserDialog from "../components/CreateUserDialog";

const Users: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editUserDialog, setEditUserDialog] = useState<boolean>(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState<boolean>(false);
  const [createUserDialog, setCreateUserDialog] = useState<boolean>(false);
  const [toBeDeleted, setToBeDeleted] = useState<{ _id: string }[] | []>([]);
  const [tableObject, setTableObject] = useState<MRT_TableInstance<User>>();
  const [rowData, setRowData] = useState({
    _id: "",
    name: "",
    role: "",
    avatar: "",
    email: "",
  });

  const fetchUserData = async () => {
    const data: any = await axios.get("/api/users/all").then((res) => {
      return res.data || [];
    });
    return data;
  };

  const createUser = async (data: any) => {
    return axios.post(`/api/users/add`, data);
  };

  const editUser = async (data: any) => {
    return axios.patch(`/api/users/${data._id}`, _.omit(data, "_id"));
  };

  const deleteUser = async (data: any) => {
    return axios.post(`/api/users/delete`, data);
  };

  const { data, error, isLoading, isError, isFetching } = useQuery(
    ["userListData"],
    async () => await fetchUserData(),
    {}
  );

  const createUserMutation = useMutation(createUser, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["userListData"]);
    },
    onError: (err: AxiosError) => {
      window.alert(`Creating a user failed with err: ${err}`);
    },
  });

  const updateUserMutation = useMutation(editUser, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["userListData"]);
    },
    onError: (err: AxiosError) => {
      window.alert(`Editing a user failed with err: ${err}`);
    },
  });

  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["userListData"]);
      window.alert("Successfully deleted the user!");
    },
    onError: (err: AxiosError) => {
      window.alert(`Editing a user failed with err: ${err}`);
    },
  });

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name", //normal accessorKey
        header: "Name",
      },
      {
        accessorKey: "avatar", //access nested data with dot notation
        header: "Avatar",
        Cell: ({ cell }) => (
          <Image
            alt={cell.id + "img"}
            height={"48px"}
            width={"48px"}
            src={cell.getValue<string>()}
          />
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
      },
    ],
    []
  );

  return (
    <Container component="main" maxWidth="xl">
      <Grid container xs={12}>
        <Grid
          container
          item
          display={"flex"}
          justifyContent="space-between"
          flexDirection={"row"}
        >
          <Typography variant="h4">User List</Typography>
          <Button
            startIcon={<Add />}
            onClick={() => {
              setCreateUserDialog(true);
            }}
            variant="contained"
          >
            Add a User
          </Button>
        </Grid>
        <EditUserDialog
          open={editUserDialog}
          setOpen={setEditUserDialog}
          updateUserMutation={updateUserMutation}
          data={rowData}
        />
        <DeleteUserDialog
          open={deleteUserDialog}
          setOpen={setDeleteUserDialog}
          deleteUserMutation={deleteUserMutation}
          usersToDelete={toBeDeleted}
          tableObject={tableObject}
        />
        <CreateUserDialog
          open={createUserDialog}
          setOpen={setCreateUserDialog}
          createUserMutation={createUserMutation}
        />
        <Grid container pt={8} px={6} item xs={12}>
          <MaterialReactTable
            muiTablePaperProps={{
              sx: {
                minWidth: "100%",
              },
            }}
            enableRowActions
            enableRowSelection={user.role === "MANAGER" ?? false}
            renderDetailPanel={({ row }) => (
              <Grid container xs={10} flexDirection={"column"} display={"flex"}>
                {(() => {
                  let rentals = row.original.details
                    .map((detail) => {
                      return detail.rentals;
                    })
                    .flat(1);

                  return rentals.map((rental) => (
                    <Grid
                      key={rental._id}
                      item
                      display={"inline-list-item"}
                      justifyContent={"space-between"}
                      flexDirection="row"
                    >
                      <Typography> - Bike Model: {rental.bikeModel}</Typography>
                      <Typography>
                        Start Date: {new Date(rental.start).toDateString()}
                      </Typography>
                      <Typography>
                        End Date: {new Date(rental.end).toDateString()}
                      </Typography>
                    </Grid>
                  ));
                })()}
              </Grid>
            )}
            renderTopToolbarCustomActions={({ table }) => {
              if (user.role === "MANAGER") {
                const handleDelete = () => {
                  let deleteArray = table
                    .getSelectedRowModel()
                    .flatRows.map((row) => {
                      return {
                        _id: row.original._id,
                      };
                    });
                  setToBeDeleted(deleteArray);
                  setDeleteUserDialog(true);
                  setTableObject(table);
                };

                return (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Button
                      color="error"
                      disabled={
                        table.getSelectedRowModel().flatRows.length === 0
                      }
                      onClick={handleDelete}
                      variant="contained"
                    >
                      Delete
                    </Button>
                  </div>
                );
              } else return <></>;
            }}
            renderRowActions={({ row }) => {
              return (
                <>
                  <IconButton
                    onClick={() => {
                      setRowData(row.original);
                      setEditUserDialog(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </>
              );
            }}
            positionActionsColumn="last"
            data={data || []}
            columns={columns}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Users;
