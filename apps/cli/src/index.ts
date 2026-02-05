#!/usr/bin/env node
import { Command } from "commander";
import figlet from "figlet";
import chalk from "chalk"
import { login } from "./commands/login";
const program = new Command();

program
    .name("docshub")
    .description("generate docs from readme")
    .action(() => console.log(
        chalk.hex("#5FCD01").bold("DOCSHUB")
    ))

program
    .name("login")
    .description("login with github")
    .action(async () => {
        await login();
    });

program.parse();
