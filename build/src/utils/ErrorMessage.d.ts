export declare class MyErrorsResponse {
    private errors;
    constructor(message?: string, field?: string);
    addError(message: string, field?: string): void;
    addErrors(errors: MyError[]): this;
}
export interface MyError {
    message: string;
    field: string;
}
