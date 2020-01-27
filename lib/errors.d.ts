declare class ValidationError extends Error {
    code: Number;
    response: any;
    constructor(e: string);
}
declare class Unauthorised extends Error {
    code: Number;
    response: any;
    constructor(e: string);
}
declare const _default: {
    ValidationError: typeof ValidationError;
    Unauthorised: typeof Unauthorised;
};
export default _default;
