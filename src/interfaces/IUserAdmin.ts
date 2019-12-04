export interface IUserAdmin {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
  }
  
  export interface IUserAdminInputDTO {
    name: string;
    email: string;
    password: string;
  }
  