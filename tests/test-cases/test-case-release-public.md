# Test that calling 'release 0.0.1 --public' will override a 'defaultRelease: private' configuration

## Description

Test that calling 'release 0.0.1 --public' will override a 'defaultRelease: private' configuration.

## Input config

    imageName: foo
    defaultRelease: private
    username: folkforms
    privateRepoFolder: private-repo-folder
    privateRepoUrl: private-repo-url.com

## Input args

    release 0.0.1 --public

## Expected commands

    docker image tag foo:latest foo:0.0.1
    docker image tag foo:latest docker.io/folkforms/foo:0.0.1
    docker image tag foo:latest docker.io/folkforms/foo:latest
    docker image push docker.io/folkforms/foo:0.0.1
    docker image push docker.io/folkforms/foo:latest
