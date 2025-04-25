import dayjs, { Dayjs } from "dayjs";

export interface IUser {
  id: string;
  email: string;
  phone: string;
  avatar: string | null;
  firstName: string;
  lastName: string;
  bio: string | null;
  gender: string | null;
  dateOfBirth: Dayjs | null;
  emergencyPhone: string | null;
  address: string | null;
  role: string;
}
