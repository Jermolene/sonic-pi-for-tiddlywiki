# Sonic Pi for TiddlyWiki

A simple rig for driving Sonic Pi from TiddlyWiki running under Node.js.

## Warning

This code is highly experimental, and contains security pitfalls if used carelessly. In particular, it allows client software connecting to the TiddlyWiki HTTP server to execute arbitrary code on the computer. By default, this is mitigated by ensuring traffic is only accepted from within the same computer that is running TiddlyWiki (and Sonic Pi).

## Prerequisites

Install Sonic Pi from https://sonic-pi.net/

Install Node.js from https://nodejs.org/

## Installation

Download or clone this repository, and open a command prompt in the root of the repository.

Install dependencies with:

```
npm install
```

## Usage

Run Sonic Pi before running the server with:

```
npm start
```

Open a browser at http://127.0.0.1:8080/ to access the app.

The demo presents several editable text boxes showing Sonic Pi code. Clicking the "Play" button will cause Sonic Pi to run that code. The "Stop" button stops all running code.

Exit the server with <kbd>ctrl-C</kbd>.

### Using basic authentication

To use Basic authentication, set the credentials in the file `./wiki/credentials.csv` and use the following command

```
./node_modules/tiddlywiki/tiddlywiki.js ./wiki --listen credentials=credentials.csv readers=joebloggs writers=joebloggs
```

Use commas to delimit additional usernames.

## Acknowledgements

https://github.com/colinbdclark/osc.js

