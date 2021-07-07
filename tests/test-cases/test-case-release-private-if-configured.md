# Test that calling 'release 0.0.1' with 'private' configured will be a private release

## Description

Test that calling 'release 0.0.1' with 'private' configured will be a private release.

## Input config

    imageName: foo
    runArgs: -p 3000:3000
    defaultRelease: private
    username: folkforms
    privateRepoFolder: private-repo-folder
    privateRepoUrl: private-repo-url.com

## Input args

    release 0.0.1

## Expected commands

    docker image tag foo:latest foo:0.0.1
    docker image tag foo:latest private-repo-url.com/private-repo-folder/foo:0.0.1
    docker image tag foo:latest private-repo-url.com/private-repo-folder/foo:latest
    docker image push private-repo-url.com/private-repo-folder/foo:0.0.1
    docker image push private-repo-url.com/private-repo-folder/foo:latest
