export class ResponseUtil {
  static success<T>(data: T, message = 'Success') {
    return {
      statusCode: 200,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message: string, statusCode = 400, data?: any) {
    return {
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}