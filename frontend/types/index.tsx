import { AxiosError } from "axios";

export enum Role {
  MANAGER = "MANAGER",
  USER = "USER",
}

export interface User {
  _id: string;
  name: string;
  role: Role;
  avatar: string;
  email: string;
  details: {
    _id: string;
    rentals: RentalInfo[];
  }[];
}

export interface RentalsType {
  start: string;
  end: string;
  user: string;
  price: number;
  name: string;
  _id: string;
}

export interface RentalInfo {
  start: Date;
  end: Date;
  bikeModel: string;
  location: string;
  price: number;
  _id: string;
  bikeId: string;
  rating: number;
  name: string;
}

export interface Bike {
  _id: string;
  bikeModel: string;
  location: string;
  price: number;
  color: string;
  rating: number;
  rentals: RentalsType[];
}

export type AuthContextType = {
  user: User | null;
  login: (loginData: LoginData) => Promise<void>;
  register: (registerData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: AxiosError | null;
} | null;

export interface RegisterData {
  name: string;
  role: Role;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginData {
  email: string;
  password: string;
}
