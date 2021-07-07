# Test case for 'build -p' command

## Description

Test when we call 'build -p' it executes the correct command.

## Input config

    imageName: foo

## Input args

    build -p

## Expected commands

    docker system prune --force
    docker build --tag foo:latest .
