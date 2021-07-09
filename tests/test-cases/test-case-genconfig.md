# Test case for 'genconfig' command

## Description

Test when we call 'genconfig' it executes the correct command.

## Input Config

## Input args

    genconfig

## Expected commands

    cp ./node_modules/docker-tasks/.docker-tasks-default-config.yml ./.docker-tasks.yml

## Expected echos

    Created file .docker-tasks.yml. You need to edit this file with your project details.
