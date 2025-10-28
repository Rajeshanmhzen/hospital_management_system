import morgan from "morgan"
import fs from "fs"
import path from "path"

const logDirectory = path.resolve("src/logs");
if(!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, {recursive:true})
}

const accesslogStream = fs.createWriteStream(
    path.join(logDirectory, "access.log"),
    {flags:"a"}
);

const morganMiddleware = morgan("combined", {
    stream:accesslogStream,
})

const consoleLogger = morgan("dev")

export {morganMiddleware, consoleLogger}