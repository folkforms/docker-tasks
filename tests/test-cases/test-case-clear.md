# Test case for 'clear' command

## Description

Test when we call 'clear' it executes the correct commands.

## Input config

    imageName: bar

## Input args

    clear

## Expected commands

    docker stop bar
    docker rm bar
