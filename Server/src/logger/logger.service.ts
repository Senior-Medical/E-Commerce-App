import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

/**
 * - Extends NestJS ConsoleLogger to log messages to the console and a log file.
 * - Ensures a log file exists and writes log messages to it with a timestamp.
 * 
 * Methods:
 * - log: Logs a message to the console and writes it to the log file.
 * - error: Logs an error message to the console and writes it to the log file.
 * - clearLogFile: Clears the log file.
 * - writeToFile: Writes a log message to the log file with a timestamp.
 */
@Injectable()
export class CustomLoggerService extends ConsoleLogger implements LoggerService {
  private logFile = path.join(__dirname, '..', '..', 'logs', 'app.log');

  /**
   * ensureLogFileExists - Ensures the log file exists, creating it if necessary.
   */
  private ensureLogFileExists() {
    if (!fs.existsSync(this.logFile)) {
      fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
      fs.writeFileSync(this.logFile, '');
    }
  }

  /**
   * clearLogFile - Clears the log file.
   */
  clearLogFile() {
    this.ensureLogFileExists();
    fs.writeFileSync(this.logFile, '');
  }

  /**
   * log - Logs a message to the console and writes it to the log file.
   * @param message - The message to log.
   * @param context - The context or origin of the log (optional).
   */
  log(message: string, context: string) {
    const formattedMessage = context
    ? `[${context}] ${message}`
    : `${message}`;
    super.log(message, context);
    this.writeToFile(formattedMessage);
  }

  /**
   * error - Logs an error message to the console and writes it to the log file.
   * @param message - The error message to log.
   * @param context - The context or origin of the error (optional).
   * @param trace - The error stack trace (optional).
   */
  error(message: string, context: string, trace?: string) {
    const formattedMessage = context
      ? `[${context}] ${message} ${trace || ''}`
      : `${message} ${trace || ''}`;
    super.error(message, trace, context);
    this.writeToFile(formattedMessage);
  }

  /**
   * writeToFile - Writes a log message to the log file with a timestamp.
   * @param logMessage - The message to write to the log file.
   */
  private writeToFile(logMessage: string) {
    this.ensureLogFileExists();
    const timestamp = new Date().toISOString();
    fs.appendFileSync(this.logFile, `[${timestamp}] ${logMessage}\n`);
  }
}
