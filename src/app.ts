#!/usr/bin/env node

import { readFileSync } from "fs";
import { Command } from "commander";
import { Library, Document } from "@apicurio/data-models";
import { exit } from "process";

const program = new Command();

// set up the command line options
program
  .name("resolver")
  .description("Resolve $refs in OpenAPI definitions")
  .arguments("[<file>]")
  .version("0.0.1", "--version");

program.parse(process.argv);

// Get the OpenAPI document
const openApiData: string = readFileSync(program.args[0], "utf8");

// Use the library util to create a data model instance from the given
// data.  This will convert from the source string into an instance of
// the OpenAPI data model.
const document: Document = Library.readDocumentFromJSONString(openApiData);

// Validate that your changes are OK.
const problems = await Library.validateDocument(document, null, []);
if (problems.length > 0) {
  console.error("Validation failed on input document.\n");
  console.error(JSON.stringify(problems, null, 2));
  exit(1);
}

const resolved = Library.dereferenceDocument(document);

console.log(JSON.stringify(Library.writeNode(resolved), null, 2));
