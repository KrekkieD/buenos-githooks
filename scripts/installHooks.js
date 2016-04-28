'use strict';

// booger

var $fs = require('fs');
var $path = require('path');

var $upTheTree = require('up-the-tree');
var $colors = require('colors');

module.exports = {
    installHooks: installHooks
};

function installHooks () {

    var moduleRoot = $upTheTree();
    var gitRoot = _findGitRoot();

    if (!gitRoot) {
        _error('Cannot find GIT root, are you in a GIT repository?', 'error');
        _exit();
    }

    var hooks = _getInstalledHooks(gitRoot);
    var templates = _getHookTemplates(moduleRoot);

    // confirm no existing hooks will be overwritten
    var errorCount = 0;
    templates.forEach(function (hookName) {

        if (hooks.indexOf(hookName) > -1) {
            errorCount++;
            _error('hook with name ' + hookName + ' already exists', 'error');
        }

    });

    if (errorCount > 0) {
        _exit();
    }

    var templatesRoot = $path.resolve(moduleRoot, 'hook-templates');
    var hooksRoot = $path.resolve(gitRoot, 'hooks');

    var hookTargets = _prependPathToFiles(hooksRoot, templates);
    var hookSources = _prependPathToFiles(templatesRoot, templates);

    // copy the hook templates
    _copyTemplates(hookSources, hookTargets);

    _success('GIT hooks successfully installed');

}

function _prependPathToFiles (path, files) {

    var prependedPaths = [];

    files.forEach(function (file) {
        prependedPaths.push($path.resolve(path, file));
    });

    return prependedPaths;

}

function _copyTemplates (hookSources, hookTargets) {

    hookSources.forEach(function (path, key) {

        $fs.writeFileSync(
            hookTargets[key],
            $fs.readFileSync(hookSources[key])
        );

        $fs.chmodSync(hookTargets[key], '0755');

    });

}

function _getHookTemplates (moduleRoot) {

    var templatesPath = $path.resolve(moduleRoot, 'hook-templates');
    var templates = $fs.readdirSync(templatesPath);

    var filteredTemplates = [];

    templates.forEach(function (template) {

        var templatePath = $path.resolve(templatesPath, template);
        if ($fs.statSync(templatePath).isFile()) {
            filteredTemplates.push(template);
        }

    });

    return filteredTemplates;

}

function _getInstalledHooks (gitRoot) {

    var hookPath = $path.resolve(gitRoot, 'hooks');
    var hooks = $fs.readdirSync(hookPath);

    return hooks;

}

function _findGitRoot () {

    return $upTheTree('.git', {
        resolve: true
    });

}

function _error (msg, type) {

    var errorMessage = msg;

    if (typeof type !== 'undefined') {
        errorMessage = type.toUpperCase() + ': ' + errorMessage;
    }

    console.error($colors.red(errorMessage));

}

function _success (msg) {

    console.error($colors.green(msg));

}

function _exit () {

    _error('Errors occured, aborting');
    process.exit(1);

}
