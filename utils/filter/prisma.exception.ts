import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { error, log } from 'console';
import { Response } from 'express';
import { Prisma } from 'prisma/generated/prisma/client';
import { PrismaErrorEnum } from 'utils/enum/prismaError';
/**
 * Exception filter that handles Prisma client exceptions
 *
 * This filter catches PrismaClientKnownRequestError exceptions thrown by Prisma
 * and converts them into appropriate HTTP responses with meaningful error messages.
 * It maps Prisma error codes to HTTP status codes and provides custom error codes
 * for better client-side error handling.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  /**
   * Logger instance for this filter
   */
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  /**
   * Handles Prisma client exceptions and transforms them into HTTP responses
   *
   * @param exception The caught Prisma exception
   * @param host The arguments host for accessing the HTTP context
   *
   * This method:
   * 1. Extracts the HTTP response object from the context
   * 2. Maps Prisma error codes to appropriate HTTP status codes
   * 3. Generates meaningful error messages based on the exception details
   * 4. Returns a standardized error response with status code, error code, and message
   */
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode: string = "error 500";
    let message: string = 'Internal server Error';

    
    switch (exception.code) {
      // Handle unique constraint violations (e.g., duplicate email)
      case PrismaErrorEnum.UniqueConstraintFailed: {
        status = HttpStatus.CONFLICT;
        message = `Conflict unicity key : ${(exception.meta?.driverAdapterError as any).cause.constraint.index} for table: ${exception.meta?.modelName}`;
        errorCode = 'UNI-01';
        break;
      }

      // Handle foreign key constraint failures (e.g., invalid relation)
      case PrismaErrorEnum.ForeignKeyConstraintFailed: {
        status = HttpStatus.BAD_REQUEST;
        errorCode = 'BPL-01';
        message = `bad payload : ${exception.meta?.modelName}.${exception.meta?.field_name}`;
        break;
      }

      // Handle record not found errors
      case PrismaErrorEnum.RecordDoesNotExist: {
        status = HttpStatus.NOT_FOUND;
        errorCode = 'NFD-01';
        message = `Record not found for table:  ${exception.meta?.modelName}`;
        break;
      }

      default:
        // Log unhandled Prisma errors with default 500 error code
        this.logger.error(exception.code);
        this.logger.error(exception.meta);
        break;
    }

    // Return standardized error response
    response.status(status).json({
      statusCode: status,
      errorCode,
      message,
    });
  }
}