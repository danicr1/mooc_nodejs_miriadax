/**
 * Corrector para la práctica de ficheros
 */

// IMPORTS
const should = require('chai').should();
const path = require('path');
const fs = require('fs-extra');
const Utils = require('./utils');
const to = require('./to');
const spawn = require("child_process").spawn;

const path_assignment = path.resolve(path.join(__dirname, "../"));

// CRITICAL ERRORS
let error_critical = null;

// CONSTANTS
const T_WAIT = 5; // Time between commands
const T_TEST = 2 * 60; // Time between tests (seconds)

// HELPERS
const timeout = ms => new Promise(res => setTimeout(res, ms));

//TESTS
describe("mooc_node-mod4_file_reflex", function () {
    
    this.timeout(T_TEST * 1000);
    
    it('', async function () { this.name = `1: Checking that the file 'mod4_quotes_of_the_day.json' exists...`;
        this.score = 0.34;
        this.msg_ok = `The file 'mod4_quotes_of_the_day.json' has been found`;
        this.msg_err = `The file 'mod4_quotes_of_the_day.json' has not been found`;
        let [error_path, _] = await to(fs.pathExists(path.join(path_assignment, 'mod4_quotes_of_the_day.json')));
        if (error_path) {
            error_critical = this.msg_err;
            should.not.exist(error_critical);
        } else {
            [error_path, _] = await to(fs.move(path.join(path_assignment, 'mod4_quotes_of_the_day.json'), path.join(path_assignment, 'mod4_quotes_of_the_day.original.json')));
            [error_path, _] = await to(fs.move(path.join(path_assignment, 'tests', 'mod4_quotes_of_the_day.json'), path.join(path_assignment, 'mod4_quotes_of_the_day.json')));
        }
        should.not.exist(error_path);
    });

    it('', async function () { this.name = `2: Checking that the file 'mod4_quote_of_the_day.js' exists'...`;
        this.score = 0.33;
        this.msg_ok = `The file 'mod4_quote_of_the_day.js' has been found`;
        this.msg_err = `The file 'mod4_quote_of_the_day.js' has not been found`;
        const [error_path, _] = await to(fs.pathExists(path.join(path_assignment, 'mod4_quote_of_the_day.js')));
        if (error_path) {
            error_critical = this.msg_err;
        }
        should.not.exist(error_path);
    });

    it('', async function () { this.name = `3: Checking that the file 'mod4_file_reflex.js' exists...`;
        this.score = 0.33;
        this.msg_ok = `The file 'mod4_file_reflex.js' has been found`;
        this.msg_err = `The file 'mod4_file_reflex.js' has not been found`;
        const [error_path, _] = await to(fs.pathExists(path.join(path_assignment, 'mod4_file_reflex.js')));
        if (error_path) {
            error_critical = this.msg_err;
        }
        should.not.exist(error_path);
    });

    it(`4: Checking that the file 'mod4_quote_of_the_day.js' exports the function 'quote_of_the_day'...`,  async function () {
        this.score = 3;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            const expected = /exports\.quote_of_the_day/;
            const output = fs.readFileSync(path.join(path_assignment, 'mod4_quote_of_the_day.js'), "utf8");
            this.msg_ok = `Found '${expected}' in '${path.join(path_assignment, 'mod4_quote_of_the_day.js')}'`;
            this.msg_err = `Couldn't find '${expected}' in '${path.join(path_assignment, 'mod4_quote_of_the_day.js')}'`;
            const func_ok = Utils.search(expected, output);
            if (!func_ok) {
                error_critical = this.msg_err;
            }
            func_ok.should.be.equal(true);
        }
    });

    it('', async function () { this.name = `5: Checking that the daily quote is returned...`;
        this.score = 3;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            const input = ["\n"];
            const expected = "Quote 1";
            let output = "";
            let error_std = "";
            const client = spawn("node", [path.join(path_assignment,"mod4_file_reflex.js")], {cwd: path_assignment});
            client.on('error', function (data) {
                error_std += data
            });
            client.stdin.on('data', function (data) {
                output += data
            });
            client.stdout.on('data', function (data) {
                output += data
            });
            client.stderr.on('data', function (data) {
                error_std += data
            });
            await timeout(T_WAIT * 1000);
            client.stdin.write(input[0] + "\n");
            await timeout(T_WAIT * 1000);
            client.kill();
            this.msg_ok = `Found '${expected}' in ${path_assignment}`;
            this.msg_err = `Couldn't find '${expected}' in ${path_assignment}\n  Error:${error_std}\n  Received:${output}`;
            error_std.should.be.equal("");
            Utils.search(expected, output).should.be.equal(true);
        }
    });

    it('', async function () { this.name = `6: Checking the response to keypresses...'`;
        this.score = 3;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            const input = ["\n"];
            const expected = /\d{3}/;
            let output = "";
            let error_std = "";
            const client = spawn("node", [path.join(path_assignment,"mod4_file_reflex.js")], {cwd: path_assignment});
            client.on('error', function (data) {
                error_std += data
            });
            client.stdin.on('data', function (data) {
                output += data
            });
            client.stdout.on('data', function (data) {
                output += data
            });
            client.stderr.on('data', function (data) {
                //error_std += data
            });
            await timeout(T_WAIT * 1000);
            client.stdin.write(input[0] + "\n");
            await timeout(T_WAIT * 1000);
            client.kill();
            this.msg_ok = `Found '${expected}' in ${path_assignment}`;
            this.msg_err = `Couldn't find '${expected}' in ${path_assignment}\nError:${error_std}\nReceived:${output}`;
            error_std.should.be.equal("");
            Utils.search(expected, output).should.be.equal(true);
        }
    });

    after("Restoring the original file", async function () {
        await fs.move(path.join(path_assignment, 'mod4_quotes_of_the_day.original.json'), path.join(path_assignment, 'mod4_quotes_of_the_day.json'), {"overwrite": true});
    });

});