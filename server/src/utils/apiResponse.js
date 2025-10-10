class ApiResponse {
  constructor(statusCode, message = "Success", data = null) {
    this.status = statusCode;
    this.message = typeof message === "string" ? message : String(message);
    this.data = data;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
