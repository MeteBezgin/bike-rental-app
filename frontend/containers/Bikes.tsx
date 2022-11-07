import React from "react";
import _ from "lodash";
import { Add, Cancel, Close, Delete, Done, Edit } from "@mui/icons-material";
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
import { DateRangePicker, DateRange } from "@mui/x-date-pickers-pro";
import useAuth from "../hooks/useAuth";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_TableInstance,
} from "material-react-table";
import { useMemo } from "react";
import { useState } from "react";
import { Moment } from "moment";
import moment from "moment";
import CreateBikeDialog from "../components/CreateBikeDialog";
import EditBikeDialog from "../components/EditBikeDialog";
import RentBikeDialog from "../components/RentBikeDialog";
import { Bike, RentalsType } from "../types";
import DeleteBikeDialog from "../components/DeleteBikeDialog";
import { SetStateAction } from "react";
import { checkDates, getAllDaysInMonth, getDaysInRange } from "../helpers";
import {
  fetchBikeData,
  createBike,
  updateBike,
  deleteBike,
  rentABike,
} from "../queries";

const Bikes: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [createBikeDialog, setCreateBikeDialog] = useState<boolean>(false);
  const [editBikeDialog, setEditBikeDialog] = useState<boolean>(false);
  const [rentDialog, setRentDialog] = useState<boolean>(false);
  const [deleteBikeDialog, setDeleteBikeDialog] = useState<boolean>(false);
  const [toBeDeleted, setToBeDeleted] = useState<{ _id: string }[] | []>([]);
  const [tableObject, setTableObject] = useState<MRT_TableInstance<Bike>>();
  const [rowData, setRowData] = useState<Partial<Bike>>({
    _id: "",
    rating: 0,
    price: 0,
    bikeModel: "",
    color: "",
    location: "",
    rentals: [
      {
        start: "",
        end: "",
        user: "",
        price: 0,
        _id: "",
        name: "",
      },
    ],
  });

  const { data, error, isLoading, isError, isFetching } = useQuery(
    ["homepageBikeData"],
    async () => await fetchBikeData(),
    {}
  );

  const createBikeMutation = useMutation(createBike, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["homepageBikeData"]);
    },
    onError: (err: AxiosError) => {
      window.alert(`Creating a bike failed with err: ${err}`);
    },
  });

  const updateBikeMutation = useMutation(updateBike, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["homepageBikeData"]);
    },
    onError: (err: AxiosError) => {
      window.alert(`Updating a bike failed with err: ${err}`);
    },
  });

  const rentABikeMutation = useMutation(rentABike, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["homepageBikeData"]);
      window.alert("Successfully rented the bike!");
    },
    onError: (err: AxiosError) => {
      window.alert(`Renting a bike failed with err: ${err}`);
    },
  });

  const deleteBikeMutation = useMutation(deleteBike, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["homepageBikeData"]);
      window.alert("Successfully deleted the bike!");
    },
    onError: (err: AxiosError) => {
      window.alert(`Deleting a bike failed with err: ${err}`);
    },
  });

  const columns = useMemo<MRT_ColumnDef<Bike>[]>(
    () => [
      {
        accessorKey: "bikeModel",
        header: "Brand/Model",
      },
      {
        accessorKey: "color",
        header: "Color",
      },
      {
        accessorKey: "location",
        header: "Location",
      },
      {
        accessorKey: "rating",
        header: "Rating",
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        filterVariant: "range",
        Cell: ({ cell }) => (
          <>
            {cell.getValue<number>()
              ? cell.getValue<number>().toFixed()
                ? cell.getValue<number>().toFixed(2)
                : cell.getValue<number>()
              : "Not rated"}
          </>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        filterVariant: "range",
        Cell: ({ cell }) => <>{cell.getValue<number>()}$ / daily</>,
      },
      {
        accessorKey: "rentals",
        enableHiding: true,
        header: `Rentable (${moment().format("MMMM")})`,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        Filter: ({ column, header, table }) => {
          const [dateFilter, setDateFilter] = useState<DateRange<Moment>>([
            null,
            null,
          ]);
          return (
            <Grid container>
              <DateRangePicker
                value={dateFilter}
                disableHighlightToday
                disablePast
                onChange={(newValue) => {
                  setDateFilter(newValue);
                  column.setFilterValue(newValue);
                }}
                renderInput={(startProps, endProps) => (
                  <Grid container>
                    <TextField
                      size="small"
                      sx={{
                        marginRight: 2,
                      }}
                      {...startProps}
                    />

                    <TextField size="small" {...endProps} />
                  </Grid>
                )}
              />
              <Button
                onClick={() => {
                  column.setFilterValue(undefined);
                  setDateFilter([null, null]);
                }}
              >
                Clear Filter
              </Button>
            </Grid>
          );
        },
        filterFn: (row, id, filterValue: Moment[]) => {
          if (filterValue[0] && filterValue[1]) {
            let checkedArray = row.original.rentals.map(({ start, end }) => {
              return checkDates(
                filterValue.map((d) => d.toDate()),
                [new Date(start), new Date(end)]
              );
            });
            return checkedArray.every((e) => e) ?? false;
          }
          return true;
        },
        Cell: ({ cell }) => {
          return (
            <>
              {(() => {
                let dates = getDaysInRange(
                  new Date(new Date().setHours(0, 0, 0, 0)),
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    0
                  )
                );
                let rentedDates = cell
                  .getValue<RentalsType[]>()
                  .map(({ start, end }) => {
                    return getDaysInRange(new Date(start), new Date(end));
                  });
                let freeDates = dates.filter((date) => {
                  return !rentedDates.flat(Infinity).includes(date)
                    ? true
                    : false;
                });
                if (freeDates.length !== 0) {
                  return <Done />;
                } else {
                  return <Cancel />;
                }
              })()}
            </>
          );
        },
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
          alignItems={"center"}
        >
          <Typography
            variant="h4"
            paddingLeft={user.role === "MANAGER" ? 0 : 6}
          >
            Bike List
          </Typography>
          <Button
            sx={{
              display: user.role === "MANAGER" ? "inline-flex" : "none",
            }}
            startIcon={<Add />}
            onClick={() => {
              setCreateBikeDialog(true);
            }}
            variant="contained"
          >
            Add a Bike
          </Button>
        </Grid>
        {createBikeDialog && (
          <CreateBikeDialog
            open={createBikeDialog}
            setOpen={setCreateBikeDialog}
            createBikeMutation={createBikeMutation}
          />
        )}
        {editBikeDialog && (
          <EditBikeDialog
            open={editBikeDialog}
            setOpen={setEditBikeDialog}
            updateBikeMutation={updateBikeMutation}
            data={rowData}
          />
        )}
        {rentDialog && (
          <RentBikeDialog
            open={rentDialog}
            rentBikeMutation={rentABikeMutation}
            setOpen={setRentDialog}
            data={rowData}
            userId={user._id}
            userName={user.name}
          />
        )}
        {deleteBikeDialog && (
          <DeleteBikeDialog
            open={deleteBikeDialog}
            setOpen={setDeleteBikeDialog}
            deleteBikeMutation={deleteBikeMutation}
            data={toBeDeleted}
            tableObject={tableObject}
          />
        )}
        <Grid container pt={8} px={6} item xs={12}>
          <MaterialReactTable
            muiTablePaperProps={{
              sx: {
                minWidth: "100%",
                marginBottom: 10,
              },
            }}
            enableRowActions
            enableRowSelection={user.role === "MANAGER" ?? false}
            enableSelectAll={false}
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
                  setDeleteBikeDialog(true);
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
              } else return <div></div>;
            }}
            renderRowActions={({ row }) => {
              return (
                <>
                  {user.role === "MANAGER" ? (
                    <IconButton
                      onClick={() => {
                        setRowData(
                          _.omit(row.original, ["_v", "createdAt", "updatedAt"])
                        );
                        setEditBikeDialog(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={async () => {
                        setRowData(
                          _.omit(row.original, ["_v", "createdAt", "updatedAt"])
                        );
                        setRentDialog(true);
                      }}
                    >
                      Rent
                    </Button>
                  )}
                </>
              );
            }}
            renderDetailPanel={({ row }) => (
              <Grid container xs={10} flexDirection={"column"} display={"flex"}>
                {row.original.rentals.map((rental) => {
                  return (
                    <Grid
                      key={rental._id}
                      container
                      item
                      display={"inline-list-item"}
                      justifyContent={"space-between"}
                      flexDirection="row"
                    >
                      <Typography>
                        {" "}
                        {"- Rented User's Name"}: {rental.name}
                      </Typography>
                      <Typography>
                        Start Date: {new Date(rental.start).toDateString()}
                      </Typography>
                      <Typography>
                        End Date: {new Date(rental.end).toDateString()}
                      </Typography>
                    </Grid>
                  );
                })}
              </Grid>
            )}
            positionActionsColumn="last"
            data={data ?? []}
            columns={columns}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Bikes;
