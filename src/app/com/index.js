export const logger = {
    log: true,
};

export function log_cli(msg) {
    if (!logger.log) return;

    console.log(msg);
}
