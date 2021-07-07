# Test case for 'build -p' command

## Description

Test when we call 'build -p' it executes the correct command.

## Input config

    imageName: foo
    runArgs: -p 3000:3000
    repoFolder: folkforms
    repoUrl: example.com

## Input args

    build -p

## Expected commands

    docker system prune --force
    docker build --tag foo:latest .
