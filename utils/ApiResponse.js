export class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.status = "success";
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
