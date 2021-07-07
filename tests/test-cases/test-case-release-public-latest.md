# Test case for 'release latest'

## Description

Test that calling 'release latest' will run the correct commands.

## Input config

    imageName: foo
    username: folkforms

## Input args

    release latest

## Expected commands

    docker image tag foo:latest docker.io/folkforms/foo:latest
    docker image push docker.io/folkforms/foo:latest
