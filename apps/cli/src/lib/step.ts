import ora from "ora";
import chalk from "chalk";

export async function step<T>(
    text: string,
    fn: () => Promise<T>
): Promise<T> {
    const spinner = ora(chalk.cyan(text)).start();

    try {
        const result = await fn();
        spinner.succeed(chalk.green(text.replace("...", "")));
        return result;
    } catch (e) {
        spinner.fail(chalk.red(text));
        throw e;
    }
}
