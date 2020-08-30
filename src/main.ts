
import logger from "./logger";

function main(args: string[]) {
    logger.info("My args: ", args);
}

main(process.argv);
