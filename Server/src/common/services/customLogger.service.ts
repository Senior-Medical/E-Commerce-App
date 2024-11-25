import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomLogger extends ConsoleLogger implements LoggerService {
  private logFile = path.join(__dirname, '..', '..', '..', 'logs', 'app.log');

  private ensureLogFileExists() {
    if (!fs.existsSync(this.logFile)) {
      fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
      fs.writeFileSync(this.logFile, '');
    }
  }

  clearLogFile() {
    this.ensureLogFileExists();
    fs.writeFileSync(this.logFile, '');
  }

  log(message: string, context?: string) {
    const formattedMessage = context
    ? `[${context}] ${message}`
    : `${message}`;
    super.log(message, context);
    this.writeToFile(formattedMessage);
  }

  error(message: string, context: string, trace?: string) {
    const formattedMessage = context
      ? `[${context}] ${message} ${trace || ''}`
      : `${message} ${trace || ''}`;
    super.error(message, trace, context);
    this.writeToFile(formattedMessage);
  }

  private writeToFile(logMessage: string) {
    this.ensureLogFileExists();
    const timestamp = new Date().toISOString();
    fs.appendFileSync(this.logFile, `[${timestamp}] ${logMessage}\n`);
  }
}
