export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  fullName: string;
  teamName: string;
  mobileConfirm: boolean;
  lastLogin: Date;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  password: string;
}

