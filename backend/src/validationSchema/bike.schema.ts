import { object, string, ref, boolean, number, array } from "yup";

const common = {
  body: object({
    bikeModel: string().required(),
    location: string().required(),
    color: string().required(),
    price: number().required(),
  }),
};

export const getBikeSchema = object({
  params: object({
    _id: string().required(),
  }),
});

export const createBikeSchema = object({
  ...common,
});

export const updateBikeSchema = object({
  params: object({
    _id: string().required(),
  }),
  ...common,
});

export const deleteBikeSchema = object({
  body: array().of(
    object({
      _id: string(),
    })
  ),
});
