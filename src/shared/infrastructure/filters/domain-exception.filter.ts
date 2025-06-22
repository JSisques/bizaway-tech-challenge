import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Type,
} from '@nestjs/common';
import { Response } from 'express';
import { InvalidSortingStrategyException } from 'src/trips/domain/exceptions/invalid-sorting-strategy.exception';
import { InvalidTripTypeException } from 'src/trips/domain/exceptions/invalid-trip-type.exception';
import { TripNotFoundException } from 'src/trips/domain/exceptions/trip-not-found.exception';
import { InvalidTripPlaceException } from 'src/trips/domain/exceptions/invalid-trip-place.exception';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Filter that catches and handles domain exceptions thrown by the application
 * Maps domain exceptions to appropriate HTTP status codes and formats error responses
 */
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  /**
   * Map of domain exceptions to their corresponding HTTP status codes
   */
  private readonly exceptionMap = new Map<Type<DomainException>, HttpStatus>([
    [TripNotFoundException, HttpStatus.NOT_FOUND],
    [InvalidTripTypeException, HttpStatus.BAD_REQUEST],
    [InvalidSortingStrategyException, HttpStatus.BAD_REQUEST],
    [InvalidTripPlaceException, HttpStatus.BAD_REQUEST],
  ]);

  /**
   * Catches and handles exceptions by converting them to HTTP responses
   * @param exception - The caught exception
   * @param host - The arguments host providing access to the underlying platform-specific request/response
   */
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      this.exceptionMap.get(exception.constructor as Type<DomainException>) ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
      timestamp: new Date().toISOString(),
    });
  }
}
