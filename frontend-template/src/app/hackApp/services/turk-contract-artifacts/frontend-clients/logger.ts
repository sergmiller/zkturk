enum LogLevel {
  DEBUG,
  INFO,
  WARNING,
  ERROR,
}


export function log(message: any, level: LogLevel = LogLevel.DEBUG, ...options: any[]) {
    if (level === LogLevel.DEBUG) {
        return console.log(message, options);
    }
    if (level === LogLevel.INFO) {
        return console.info(message, options);
    }
    if (level === LogLevel.WARNING) {
        return console.warn(message, options);
    }
    if (level === LogLevel.ERROR) {
        return console.error(message, options);
    }
    throw Error("NotIImplemented.")
}
