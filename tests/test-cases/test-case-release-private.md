# Test that calling 'release 0.0.1 --private' will override a 'defaultRelease: public' configuration

## Description

Test that calling 'release 0.0.1 --private' will override a 'defaultRelease: public' configuration.

## Input config

    imageName: foo
    defaultRelease: public
    privateRepoUrl: private-repo-url.com
    privateRepoFolder: private-repo-folder

## Input args

    release 0.0.1 --private

## Expected commands

    docker image tag foo:latest foo:0.0.1
    docker image tag foo:latest private-repo-url.com/private-repo-folder/foo:0.0.1
    docker image push private-repo-url.com/private-repo-folder/foo:0.0.1
