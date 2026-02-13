#!/usr/bin/env bun
import "dotenv/config";
import { Command } from "commander";
import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import { login } from "./commands/login";
import { fetchRepoFlow } from "./commands/generate";
import { renderCliHeader } from "./lib/header";



const program = new Command();
let ghToken = "";

function showHeader() {
    renderCliHeader();
}

function setupExitHandlers() {
    const exit = () => {
        console.log("\nExiting...");
        process.exit(0);
    };

    process.on("SIGINT", exit);   // ctrl + c
    process.on("SIGTERM", exit);  // kill
}

setupExitHandlers();


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
