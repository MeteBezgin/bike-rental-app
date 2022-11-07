import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Redirect from "../../components/Redirect";
import Users from "../../containers/Users";
import useAuth from "../../hooks/useAuth";
import styles from "../styles/Home.module.css";

const UsersPage: NextPage = () => {
  const { user } = useAuth();

  return <>{user.role === "MANAGER" ? <Users /> : <Redirect to="/bikes" />}</>;
};

export default UsersPage;
