export interface IErrorObj {
  [key: string]: { statusCode: number; message: string };
}

export interface IProfile {
  bio?: string;
  avatar?: string;
  cover?: string;
  userId?: string;
}

export interface IRegister {
  username: string;
  password: string;
  email: string;
  fullname: string;
}

export interface IThread{
  content: string
  image: ThreadImage[]
  like: Like[]
  
}