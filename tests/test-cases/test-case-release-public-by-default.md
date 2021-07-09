# Test that calling 'release 0.0.1' is a public release by default

## Description

Test that calling 'release 0.0.1' is a public release by default.

## Input config

    imageName: foo
    # defaultRelease: public # This line deliberately removed
    username: folkforms

## Input args

    release 0.0.1

## Expected commands

    docker image tag foo:latest foo:0.0.1
    docker image tag foo:latest docker.io/folkforms/foo:0.0.1
    docker image push docker.io/folkforms/foo:0.0.1
