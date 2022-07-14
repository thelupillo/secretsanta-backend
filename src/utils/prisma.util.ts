import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientRustPanicError, PrismaClientInitializationError, PrismaClientValidationError } from '@prisma/client/runtime';
import { StatusCodes } from 'http-status-codes';

export const prismaErrorHandler = (error: PrismaClientKnownRequestError | PrismaClientUnknownRequestError | PrismaClientRustPanicError | PrismaClientInitializationError | PrismaClientValidationError | any): StatusCodes => {
  if (
    error instanceof PrismaClientUnknownRequestError ||
    error instanceof PrismaClientRustPanicError
    ) {
    console.error({ PrismaClientError: error });
    return StatusCodes.INTERNAL_SERVER_ERROR;
  }

  if (error instanceof PrismaClientInitializationError) {
    console.error({ PrismaClientInitializationError: error });
    return StatusCodes.INTERNAL_SERVER_ERROR;
  }

  if (error instanceof PrismaClientValidationError) {
    return StatusCodes.BAD_REQUEST;
  }

  if (!(error instanceof PrismaClientKnownRequestError)) {
    console.error({ PrismaError: error });
    return StatusCodes.INTERNAL_SERVER_ERROR;
  }

  // https://www.prisma.io/docs/reference/api-reference/error-reference
  switch (error.code) {
    // Prisma client error codes
    case "P2000": // The provided value for the column is too long for the column's type
    case "P2001": // The record searched for in the where condition doesn't exist
    case "P2002": // Unique constraint failed
    case "P2003": // Foreign key constraint failed
    case "P2004": // A constraint failed on the database
    case "P2005": // The value stored in the database for the field is invalid for the field's type
    case "P2006": // The provided value for the model's field is not valid
    case "P2007": // Data validation error
    case "P2008": // Failed to parse the query
    case "P2009": // Failed to validate the query
    case "P2010": // Raw query failed
    case "P2011": // Null constraint violation
    case "P2012": // Missing a required value
    case "P2013": // Missing the required argument
    case "P2014": // The change you are trying to make would violate the required relation
    case "P2015": // A related record could not be found
    case "P2016": // Query interpretation error
    case "P2017": // The records for relation are not connected
    case "P2018": // The required connected records were not found
    case "P2019": // Input error
    case "P2020": // Value out of range for the type
    case "P2025": // An operation failed because it depends on one or more records that were required but not found
      return StatusCodes.BAD_REQUEST;

    // Common error codes
    case "P1000": // Authentication failed
    case "P1001": // Can't reach database or the database isn't running
    case "P1002": // Database was reached but timed out
    case "P1003": // Database doesn't exists at the database server
    case "P1008": // Operation timed out
    case "P1010": // Database user doesn't have access to the database
    case "P1011": // Error opening a TLS connection
    case "P1012": // Multiple errors (~38) https://www.prisma.io/docs/reference/api-reference/error-reference#p1012
    case "P1013": // The database string is invalid
    case "P1016": // The raw query had an incorrect number of parameters
    case "P1017": // Server has closed the connection
    // Prisma Client (Query Engine) Errors
    case "P2021": // The table doesn't exist in the current database
    case "P2022": // The column doesn't exist in the current table
    case "P2023": // Inconsisted column data
    case "P2024": // Timed out fetching a new connection from the connections pool
    case "P2026": // The current server provider doesn't support a feature that the query used
    case "P2027": // Multiple errors occurred on the database during query execution
    case "P2033": // A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type
    default:
      console.error({ PrismaClientKnownRequestError: error });
      return StatusCodes.INTERNAL_SERVER_ERROR;
  }
};