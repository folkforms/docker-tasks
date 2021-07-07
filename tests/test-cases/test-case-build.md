# Test case for 'build' command

## Description

Test when we call 'build' it executes the correct command.

## Input config

    imageName: foo
    runArgs: -p 3000:3000
    repoFolder: folkforms
    repoUrl: example.com

## Input args

    build

## Expected commands

    docker build --tag foo:latest .
