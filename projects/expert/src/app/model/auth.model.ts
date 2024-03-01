export interface AuthModel {
  email: string;
  password: string;
}

export interface TokenModel {
  code: number;
  message: string;
  result: {
    token: string;
  }
}
