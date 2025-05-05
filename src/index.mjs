import {cli} from "./cli.mjs";

const usernameArg = process.argv.find(arg => arg.startsWith("--username="));
const username = usernameArg ? usernameArg.split("=")[1] : "user";

cli(username);