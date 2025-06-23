import { DomainExceptionFilter } from './domain-exception.filter';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { TripNotFoundException } from 'src/trips/domain/exceptions/trip-not-found.exception';
import { InvalidTripTypeException } from 'src/trips/domain/exceptions/invalid-trip-type.exception';
import { InvalidSortingStrategyException } from 'src/trips/domain/exceptions/invalid-sorting-strategy.exception';
import { InvalidTripPlaceException } from 'src/trips/domain/exceptions/invalid-trip-place.exception';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

describe('DomainExceptionFilter', () => {
  let filter: DomainExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockArgumentsHost: Partial<ArgumentsHost>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    filter = new DomainExceptionFilter();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = { status: statusMock } as any;
    mockArgumentsHost = {
      switchToHttp: () => ({ getResponse: () => mockResponse }),
    } as any;
  });

  it('should map TripNotFoundException to 404', () => {
    const exception = new TripNotFoundException('id');
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);
    expect(statusMock).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        message: exception.message,
        error: exception.name,
      }),
    );
  });

  it('should map InvalidTripTypeException to 400', () => {
    const exception = new InvalidTripTypeException('msg');
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);
    expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
        error: exception.name,
      }),
    );
  });

  it('should map InvalidSortingStrategyException to 400', () => {
    const exception = new InvalidSortingStrategyException('msg');
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);
    expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
        error: exception.name,
      }),
    );
  });

  it('should map InvalidTripPlaceException to 400', () => {
    const exception = new InvalidTripPlaceException('place');
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);
    expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
        error: exception.name,
      }),
    );
  });

  it('should map unknown DomainException to 500', () => {
    class UnknownDomainException extends DomainException {
      constructor() {
        super('unknown');
      }
    }
    const exception = new UnknownDomainException();
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);
    expect(statusMock).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        error: exception.name,
      }),
    );
  });
});
