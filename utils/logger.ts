import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import winston, { format } from "winston";
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: format.combine(format.timestamp(), format.prettyPrint()),
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: format.combine(format.timestamp(), format.prettyPrint()),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
export default logger;
