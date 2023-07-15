import { HTTP } from "../constants/HTTP";

interface errorArgs {
  name: string;
  message: string;
  status: HTTP;
  isSuccess: boolean;
}

export class mainAppErrorHandler extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly status: HTTP;
  public readonly isSuccess: boolean = true;

  constructor(args: errorArgs) {
    super(args.message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name || "Error";
    // this.message = args.message;
    this.status = args.status;

    if (this.isSuccess !== undefined) {
      this.isSuccess = args.isSuccess;
    }

    Error.captureStackTrace(this);
  }
}
