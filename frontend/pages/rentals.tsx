import * as React from "react";
import { NextPage } from "next";
import Rentals from "../containers/Rentals";
import useAuth from "../hooks/useAuth";
import Redirect from "../components/Redirect";

const RentalsPage: NextPage = () => {
  const { user } = useAuth();

  return user.role === "MANAGER" ? <Redirect to="/bikes" /> : <Rentals />;
};

export default RentalsPage;
