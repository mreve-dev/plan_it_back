/**
 * Enum representing Prisma error codes
 *
 * This enum maps human-readable names to Prisma's error codes,
 * making it easier to handle specific database errors in a type-safe way.
 */
export enum PrismaErrorEnum {
    /**
     * Error thrown when a requested record does not exist in the database
     * Typically occurs during findUnique or findFirst operations
     */
    RecordDoesNotExist = 'P2025',

    /**
     * Error thrown when a unique constraint is violated
     * Occurs when trying to create or update a record with a value that should be unique
     * but already exists in another record (e.g., duplicate email)
     */
    UniqueConstraintFailed = 'P2002',

    /**
     * Error thrown when a foreign key constraint is violated
     * Occurs when trying to reference a record that doesn't exist in a related table
     */
    ForeignKeyConstraintFailed = 'P2003'
}