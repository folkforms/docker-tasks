# Test case for 'build' command

## Description

Test when we call 'build' it executes the correct command.

## Input config

    imageName: bar

## Input args

    build

## Expected commands

    docker build --tag bar:latest .
