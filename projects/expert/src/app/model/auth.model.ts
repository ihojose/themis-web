export interface AuthModel {
  username: string;
  password: string;
}

export interface TokenModel {
  code: number;
  message: string;
  result: {
    token: string;
  }
}
