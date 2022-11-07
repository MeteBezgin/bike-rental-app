import axios from "axios";
import _ from "lodash";

export const fetchBikeData = async () => {
  const data: any = await axios.get("/api/bikes").then((res) => {
    return res.data;
  });

  return data;
};

export const createBike = async (data: any) => {
  return axios.post("/api/bikes", data);
};

export const updateBike = async (data: any) => {
  return axios.patch(`/api/bikes/${data._id}`, _.omit(data, "_id"));
};

export const rentABike = async (data: any) => {
  return axios.post(`/api/bikes/rental`, data);
};

export const deleteBike = async (data: any) => {
  return axios.post("/api/bikes/delete", data);
};

export const deleteBikeRental = async (data: any) => {
  return axios.post("/api/bikes/rental/delete", data);
};

export const rateBike = async (data: any) => {
  return axios.post("/api/bikes/rental/rate", data);
};

export const fetchBikeRentals = async (data: any) => {
  return axios.get(`/api/bikes/rental/${data}`).then((resp) => {
    return resp.data;
  });
};
