export type Entry = {
  id: number | string;
  description: string;
  city: string;
  district: string;
  number?: string;
  createdAt: string;
  numbersInDesc: string[];
};

export type UserLocation = {
  town: string;
  province: string;
};
