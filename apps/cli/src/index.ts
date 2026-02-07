#!/usr/bin/env node
import "dotenv/config";
import { Command } from "commander";
import chalk from "chalk";
import figlet from "figlet";
import { login } from "./commands/login";
import { fetchRepoFlow } from "./commands/generate";

const program = new Command();
let ghToken = "";

function showHeader() {
    console.log(
        chalk.hex("#39FF14").bold(
            figlet.textSync("DOCSHUB", {
                font: "Block", // "Block" or "Standard" provide the filled look
                horizontalLayout: "fitted",
            })
        )
    );
}

program
    .name("docshub")
    .description("generate docs from readme")
    .hook("preAction", () => {
        showHeader();
    });

program
    .command("login")
    .description("login with github")
    .action(async () => {
        ghToken = await login();
    });

program
    .command("init")
    .description("get repo metadata and readme content")
    .action(async () => {
        if (!ghToken) {
            ghToken = await login();
        }
        await fetchRepoFlow(ghToken);
    });

program.parse();
