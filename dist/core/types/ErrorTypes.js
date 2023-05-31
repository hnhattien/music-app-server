"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationFailedError = exports.UnauthorizedError = exports.UnAuthenticated = exports.NotFoundError = exports.InternalServerError = exports.InputValidationError = exports.ForbiddenError = exports.ErrorBase = void 0;
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line max-classes-per-file
class ErrorBase {
    constructor(msg, type, error_code, httpCode, additionalProperties) {
        this.message = msg || "Internal server error";
        this.httpCode = httpCode || 500;
        this.type = type || "internal_server_error";
        this.error_code = String(error_code || this.type).toUpperCase();
        this.additionalProperties = additionalProperties || {};
    }
}
exports.ErrorBase = ErrorBase;
class UnauthorizedError extends ErrorBase {
    constructor(msg, error_code, additionalProperties) {
        super(msg || "Insufficient permission", error_code || "unauthorized", "unauthorized", 401, additionalProperties);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class UnAuthenticated extends ErrorBase {
    constructor(msg, error_code, additionalProperties) {
        super(msg || "Unauthenticated request", error_code || "unauthenticated", "unauthenticated", 401, additionalProperties);
    }
}
exports.UnAuthenticated = UnAuthenticated;
class NotFoundError extends ErrorBase {
    constructor(msg, error_code, httpCode, type, additionalProperties) {
        super(msg || "Dữ liệu không tồn tại.", type || "not_found", error_code || "not_found", httpCode || 404, additionalProperties || {});
    }
}
exports.NotFoundError = NotFoundError;
class ValidationFailedError extends ErrorBase {
    constructor(msg, error_code, httpCode, type, additionalProperties) {
        super(msg || "Please verify the input data", type || "validation_failed", error_code || "validation_failed", httpCode || 400, additionalProperties || {});
    }
}
exports.ValidationFailedError = ValidationFailedError;
class InputValidationError extends ErrorBase {
    constructor(msg, error_code, httpCode, type, additionalProperties) {
        super(msg || "Please verify the input data", type || "validation_failed", error_code || "validation_failed", httpCode || 400, additionalProperties || {});
    }
}
exports.InputValidationError = InputValidationError;
class InternalServerError extends ErrorBase {
    constructor(msg, error_code, httpCode, type, additionalProperties) {
        super(msg || "Internal server error", type || "internal_server_error", error_code || "internal_server_error", httpCode || 500, additionalProperties || {});
    }
}
exports.InternalServerError = InternalServerError;
class ForbiddenError extends ErrorBase {
    constructor(msg, additionalProperties) {
        super(msg || "You don’t have permission to access this resource", "forbidden", "forbidden", 403, additionalProperties);
    }
}
exports.ForbiddenError = ForbiddenError;
