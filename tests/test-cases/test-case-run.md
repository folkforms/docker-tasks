# Test case for 'run' command

## Description

Test when we call 'run' it executes the correct commands.

## Input config

    imageName: bar
    runArgs: -p 3000:3000

## Input args

    run

## Expected commands

    docker stop bar
    docker rm bar
    docker run -p 3000:3000 --name bar bar:latest
