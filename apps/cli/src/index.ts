#!/usr/bin/env node
import { Command } from "commander";
import figlet from "figlet";
import chalk from "chalk"
import { login } from "./commands/login";
import { fetchRepoFlow } from "./commands/generate";
const program = new Command();

let ghToken = "";

program
    .name("docshub")
    .description("generate docs from readme")
    .action(() => console.log(
        chalk.hex("#5FCD01").bold("DOCSHUB")
    ))

program
    .command("login")
    .description("login with github")
    .action(async () => {
        ghToken = await login();
    });

program
    .command("fetch")
    .description("get repo metadata and readme content")
    .action(async () => {
        if (!ghToken || ghToken == "") {
            ghToken = await login();
        }
        await fetchRepoFlow(ghToken);
    })

program.parse();
