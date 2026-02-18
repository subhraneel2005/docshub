#!/usr/bin/env bun
import "dotenv/config";
import { Command } from "commander";
import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import { login } from "./commands/login";
import { fetchRepoFlow } from "./commands/generate";
import { renderCliHeader } from "./lib/header";
import { CliRenderer, createCliRenderer } from "@opentui/core";
import { renderFeatures } from "./lib/features";



const program = new Command();
let ghToken = "";

const renderer = await createCliRenderer({ targetFps: 30, exitOnCtrlC: true, });


function showHome() {
    renderCliHeader(renderer);
    renderFeatures(renderer)
}

export function clearScreen(renderer: CliRenderer) {
    renderer.destroy()
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


// program
//     .name("docshub")
//     .description("generate docs from readme")

// program
//     .command("login")
//     .description("login with github")
//     .action(async () => {
//         ghToken = await login(renderer);
//     });

// program
//     .command("init")
//     .description("get repo metadata and readme content")
//     .action(async () => {
//         if (!ghToken) {
//             ghToken = await login(renderer);
//         }
//         await fetchRepoFlow(ghToken, renderer);
//     });

// program.parse();

showHome();
renderer.start()
