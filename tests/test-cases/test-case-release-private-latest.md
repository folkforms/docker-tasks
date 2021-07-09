# Test that calling 'release latest' with 'defaultRelease: private' will be a private release

## Description

Test that calling 'release latest' with 'defaultRelease: private' will be a private release.

## Input config

    imageName: foo
    defaultRelease: private
    privateRepoUrl: private-repo-url.com
    privateRepoFolder: private-repo-folder

## Input args

    release latest

## Expected commands

    docker image tag foo:latest private-repo-url.com/private-repo-folder/foo:latest
    docker image push private-repo-url.com/private-repo-folder/foo:latest
