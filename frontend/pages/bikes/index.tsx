import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Bikes from "../../containers/Bikes";
import styles from "../styles/Home.module.css";

const BikesPage: NextPage = () => {
  return <Bikes />;
};

export default BikesPage;
