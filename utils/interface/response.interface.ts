export interface IResponse<T> {  // 
    data: T;
    timeStamp: Date;
    url : string;  // /auth/signin
}