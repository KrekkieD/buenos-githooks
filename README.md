# buenos-githooks

A utility to easily install your GIT hooks and keep them under version control.

## Installation

Install the module as a devDependency:

```bash
$ npm install --save-dev buenos-githooks
```

Next you will need to install the GIT hooks: 

```bash
$ ./node_modules/.bin/buenos-githooks
```

Note that you can pass a `--force` flag to overwrite any existing hooks, and a `--silent` flag to prevent any output.

**PRO-TIP:** You could add the following `postinstall` script to your `package.json` to automatically install the hooks on your colleagues machine when `npm install` is run, but note that this will also run when your package is a dependency in someone else's module.

```json
{
    "scripts": {
        "postinstall": "buenos-githooks --force --silent"
    }
}
```

## Implementing hooks

Create a folder called `.git-hooks` which you should place in the root directory of your project (same directory as where the `.git` directory resides). Within this folder you can create subfolders with a name identical to the GIT hook you wish to bind on. Place your scripts in here.

```text
/my-project
|-- .git
|-- .git-hooks
|   |-- commit-msg
|   `-- pre-commit
|       |-- unit-test.sh
|       `-- jscs.js
```

In this case the scripts `./.git-hooks/pre-commit/unit-test.sh` and `./.git-hooks/pre-commit/jscs.js` will run when the `pre-commit` hook fires. 

Note that the files should be executable, so make sure your file permissions are okay. Usually a `chmod +x path/to/file` fixes it.
