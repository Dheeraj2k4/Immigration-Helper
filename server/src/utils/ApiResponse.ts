import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data
    });
  }

  static error(res: Response, message: string = 'Error occurred', statusCode: number = 500, errors?: any) {
    return res.status(statusCode).json({
      status: 'error',
      message,
      ...(errors && { errors })
    });
  }

  static created(res: Response, data: any, message: string = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}
