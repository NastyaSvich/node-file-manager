import {cli} from "./cli.mjs";

const usernameArg = process.argv.find(arg => arg.startsWith("--username="));
const lowercaseUserName = usernameArg ? usernameArg.split("=")[1] : "user";
const userName = lowercaseUserName.charAt(0).toUpperCase() + lowercaseUserName.slice(1);

cli(userName);