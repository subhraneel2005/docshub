export const API_ERRORS = {
    // client errors
    BAD_REQUEST: {
      status: 400,
      message: "Bad request",
    },
    MISSING_REQUIRED_FIELDS: {
        status: 400,
        message: "Required input fields are missing",
      },
    UNAUTHORIZED: {
      status: 401,
      message: "Unauthorized",
    },
    FORBIDDEN: {
      status: 403,
      message: "Forbidden",
    },
    NOT_FOUND: {
      status: 404,
      message: "Resource not found",
    },
    METHOD_NOT_ALLOWED: {
      status: 405,
      message: "Method not allowed",
    },
    CONFLICT: {
      status: 409,
      message: "Resource conflict",
    },
    PAYLOAD_TOO_LARGE: {
      status: 413,
      message: "Payload too large",
    },
    UNSUPPORTED_MEDIA_TYPE: {
      status: 415,
      message: "Unsupported media type",
    },
    UNPROCESSABLE_ENTITY: {
      status: 422,
      message: "Validation failed",
    },
    GITHUB_NOT_LINKED: {
      status: 404,
      message: "Github account not linked"
    },

    // server errors
  
    INTERNAL_SERVER_ERROR: {
      status: 500,
      message: "Internal server error",
    },
    NOT_IMPLEMENTED: {
      status: 501,
      message: "Not implemented",
    },
    BAD_GATEWAY: {
      status: 502,
      message: "Bad gateway",
    },
    SERVICE_UNAVAILABLE: {
      status: 503,
      message: "Service unavailable",
    },
    GATEWAY_TIMEOUT: {
      status: 504,
      message: "Gateway timeout",
    },
  } as const;
  