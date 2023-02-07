export type Entry = {
  id: number | string;
  description: string;
  city: string;
  district: string;
  number?: string;
  createdAt: string;
};

export type UserLocation = {
  town: string;
  province: string;
};
