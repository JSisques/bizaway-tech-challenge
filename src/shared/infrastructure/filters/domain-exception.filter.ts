import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { InvalidTripTypeException } from 'src/trips/domain/exceptions/invalid-trip-type.exception';
import { TripNotFoundException } from 'src/trips/domain/exceptions/trip-not-found.exception';

/**
 * Filter that catches and handles domain exceptions thrown by the application
 * Maps domain exceptions to appropriate HTTP status codes and formats error responses
 */
@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  /**
   * Map of domain exceptions to their corresponding HTTP status codes
   */
  private readonly exceptionMap = new Map<Function, HttpStatus>([
    [TripNotFoundException, HttpStatus.NOT_FOUND],
    [InvalidTripTypeException, HttpStatus.BAD_REQUEST],
  ]);

  /**
   * Catches and handles exceptions by converting them to HTTP responses
   * @param exception - The caught exception
   * @param host - The arguments host providing access to the underlying platform-specific request/response
   */
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      this.exceptionMap.get(exception.constructor) || HttpStatus.BAD_REQUEST;
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      message: message,
      error: exception.name,
      timestamp: new Date().toISOString(),
    });
  }
}
