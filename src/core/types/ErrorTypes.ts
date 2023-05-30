/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line max-classes-per-file
class ErrorBase {
    type?: any;
    error_code?: any;
  
    httpCode?: any;
  
    message: string;
  
    additionalProperties?: any;
  
    constructor(
      msg?: string,
      type?: string,
      error_code?: any,
      httpCode?: any,
      additionalProperties?: any
    ) {
      this.message = msg || "Internal server error";
      this.httpCode = httpCode || 500;
      this.type = type || "internal_server_error";
      this.error_code = String(error_code || this.type).toUpperCase();
      this.additionalProperties = additionalProperties || {};
    }
  }
  class UnauthorizedError extends ErrorBase {
    constructor(msg?: string, error_code?: any, additionalProperties?: any) {
      super(
        msg || "Insufficient permission",
        error_code || "unauthorized",
        "unauthorized",
        401,
        additionalProperties
      );
    }
  }
  
  class UnAuthenticated extends ErrorBase {
    constructor(msg?: string, error_code?: any, additionalProperties?: any) {
      super(
        msg || "Unauthenticated request",
        error_code || "unauthenticated",
        "unauthenticated",
        401,
        additionalProperties
      );
    }
  }
  
  class NotFoundError extends ErrorBase {
    constructor(
      msg?: string,
      error_code?: any,
      httpCode?: any,
      type?: any,
      additionalProperties?: any
    ) {
      super(
        msg || "Dữ liệu không tồn tại.",
        type || "not_found",
        error_code || "not_found",
        httpCode || 404,
        additionalProperties || {}
      );
    }
  }
  
  class ValidationFailedError extends ErrorBase {
    constructor(
      msg?: string,
      error_code?: any,
      httpCode?: any,
      type?: any,
      additionalProperties?: any
    ) {
      super(
        msg || "Please verify the input data",
        type || "validation_failed",
        error_code || "validation_failed",
        httpCode || 400,
        additionalProperties || {}
      );
    }
  }
  
  class InputValidationError extends ErrorBase {
    constructor(
      msg?: string,
      error_code?: any,
      httpCode?: any,
      type?: any,
      additionalProperties?: any
    ) {
      super(
        msg || "Please verify the input data",
        type || "validation_failed",
        error_code || "validation_failed",
        httpCode || 400,
        additionalProperties || {}
      );
    }
  }
  
  class InternalServerError extends ErrorBase {
    constructor(
      msg?: string,
      error_code?: any,
      httpCode?: any,
      type?: any,
      additionalProperties?: any
    ) {
      super(
        msg || "Internal server error",
        type || "internal_server_error",
        error_code || "internal_server_error",
        httpCode || 500,
        additionalProperties || {}
      );
    }
  }
  
  class ForbiddenError extends ErrorBase {
    constructor(msg?: string, additionalProperties?: any) {
      super(
        msg || "You don’t have permission to access this resource",
        "forbidden",
        "forbidden",
        403,
        additionalProperties
      );
    }
  }
  
  export {
    ErrorBase,
    ForbiddenError,
    InputValidationError,
    InternalServerError,
    NotFoundError,
    UnAuthenticated,
    UnauthorizedError,
    ValidationFailedError,
  };