import { Button, Container, Grid, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import CancelRentalDialog from "../components/CancelRentalDialog";
import { useMutation, useQueryClient, useQuery } from "react-query";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import useAuth from "../hooks/useAuth";
import axios, { AxiosError } from "axios";
import { RentalInfo, RentalsType } from "../types";
import { deleteBikeRental, rateBike, fetchBikeRentals } from "../queries";
import RateBikeDialog from "../components/RateBikeDialog";

const Rentals: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cancelRentalDialog, setCancelRentalDialog] = useState(false);
  const [rateBikeDialog, setRateBikeDialog] = useState(false);
  const [rowData, setRowData] = useState<{
    bikeId: string;
    rentalId: string;
  }>({
    bikeId: "",
    rentalId: "",
  });

  const deleteBikeRentalMutation = useMutation(deleteBikeRental, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["rentalData"]);
      window.alert("Successfully deleted the bike rental!");
    },
    onError: (err: AxiosError) => {
      window.alert(`Deleting the bike rental failed with err: ${err}`);
    },
  });

  const rateBikeMutation = useMutation(rateBike, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["rentalData"]);
      window.alert("Successfully rated the bike!");
    },
    onError: (err: AxiosError) => {
      window.alert(`Deleting the bike rental failed with err: ${err}`);
    },
  });

  const { data, error, isLoading, isError, isFetching } = useQuery(
    ["rentalData"],
    async () => await fetchBikeRentals(user._id),
    {}
  );

  const columns = useMemo<MRT_ColumnDef<RentalInfo>[]>(
    () => [
      {
        accessorKey: "bikeModel",
        header: "Bike Model",
      },
      {
        accessorKey: "location",
        header: "Location",
      },
      {
        accessorKey: "start",
        header: "Start Date",
        Cell: ({ cell }) => (
          <>{new Date(cell.getValue<Date>()).toDateString()}</>
        ),
      },
      {
        accessorKey: "end",
        header: "End Date",
        Cell: ({ cell }) => (
          <>{new Date(cell.getValue<Date>()).toDateString()}</>
        ),
      },
      {
        accessorFn: (originalRow) =>
          originalRow.price *
            ((new Date(originalRow.end).getTime() -
              new Date(originalRow.start).getTime()) /
              (1000 * 3600 * 24)) +
          5,
        header: "Total rental cost",
        Cell: ({ cell }) => <>{cell.getValue<number>()}$</>,
      },
      {
        accessorKey: "rating",
        header: "Rating",
        Cell: ({ cell }) => <>{cell.getValue<number>() ?? "Not rated yet"}</>,
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
          justifyContent="flex-start"
          flexDirection={"row"}
          alignItems={"center"}
        >
          <Typography paddingLeft={6} variant="h4">
            Rental History
          </Typography>
        </Grid>
        {cancelRentalDialog && (
          <CancelRentalDialog
            open={cancelRentalDialog}
            setOpen={setCancelRentalDialog}
            deleteBikeRentalMutation={deleteBikeRentalMutation}
            data={rowData}
          />
        )}
        {rateBikeDialog && (
          <RateBikeDialog
            open={rateBikeDialog}
            setOpen={setRateBikeDialog}
            rateBikeMutation={rateBikeMutation}
            data={rowData}
          />
        )}

        <Grid container pt={8} px={10} item xs={12}>
          <MaterialReactTable
            data={data || []}
            enableRowActions
            muiTablePaperProps={{
              sx: {
                minWidth: "100%",
                marginBottom: 10,
              },
            }}
            columns={columns}
            renderRowActions={({ row }) => {
              return (
                <>
                  <Button
                    variant="contained"
                    onClick={() => {
                      let rentalData = {
                        bikeId: row.original.bikeId,
                        rentalId: row.original._id,
                      };
                      setRowData(rentalData);
                      setRateBikeDialog(true);
                    }}
                  >
                    Rate
                  </Button>
                  <Button
                    variant="contained"
                    disabled={
                      new Date() < new Date(row.original.start) ? false : true
                    }
                    sx={{
                      backgroundColor: "red",
                      "&:hover": {
                        backgroundColor: "red",
                      },
                    }}
                    onClick={() => {
                      let rentalData = {
                        bikeId: row.original.bikeId,
                        rentalId: row.original._id,
                      };
                      setRowData(rentalData);
                      setCancelRentalDialog(true);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              );
            }}
            positionActionsColumn="last"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Rentals;
