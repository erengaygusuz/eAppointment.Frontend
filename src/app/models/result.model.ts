export class ResultModel<T>{
    data: any;
    errorMessages?: string[];
    isSuccessfull: boolean = true;
    statusCode: number = 200;
}