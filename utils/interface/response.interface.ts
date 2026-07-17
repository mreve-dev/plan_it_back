export interface IResponse<T> {  // 
    data: T;
    timeStamp: Date;
    url : string;  // /auth/signin
}

export interface RequestWithUser extends Request {
    user: {id: number, role: string}
}