/**
 * Simple logger utility for the application
 * Can be replaced with a more robust logging solution if needed
 */

type LogLevel = "debug" | "info" | "warn" | "error";
// Define a type for metadata outside the class
type LogMetadata = Record<string, unknown>;

class Logger {
  private enabled: boolean;

  constructor() {
    this.enabled = process.env.NODE_ENV !== "production" || process.env.DEBUG === "true";
  }

  private formatMessage(level: LogLevel, message: string, metadata?: LogMetadata): string {
    const timestamp = new Date().toISOString();
    const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metadataStr}`;
  }

  debug(message: string, metadata?: LogMetadata): void {
    if (this.enabled) {
      console.debug(this.formatMessage("debug", message, metadata));
    }
  }

  info(message: string, metadata?: LogMetadata): void {
    console.info(this.formatMessage("info", message, metadata));
  }

  warn(message: string, metadata?: LogMetadata): void {
    console.warn(this.formatMessage("warn", message, metadata));
  }

  error(message: string, error?: Error, metadata?: LogMetadata): void {
    const errorDetails = error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : undefined;

    console.error(
      this.formatMessage("error", message, {
        ...metadata,
        error: errorDetails,
      })
    );
  }
}

export const logger = new Logger();
