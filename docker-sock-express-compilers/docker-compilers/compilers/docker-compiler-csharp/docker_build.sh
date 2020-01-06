#!/bin/bash
COMPILER_VERSION=2.9.4-dev
# https://github.com/neo-project/neo-compiler/commits/master-2.x
COMPILER_COMMIT_NEOCOMPILER=f6b05a6ebea9ce99133cfaf47f154f154c0645ca

#https://github.com/neo-project/neo-devpack-dotnet/commits/master-2.x
REPO_DEVPACK=https://github.com/neo-project/neo-devpack-dotnet.git
BRANCH_DEVPACK=master-2.x
COMPILER_COMMIT_DEVPACK=8a0c998a531aa3754d79fb3299a988a885a30dab

ARGS="--build-arg COMPILER_COMMIT_NEOCOMPILER=$COMPILER_COMMIT_NEOCOMPILER --build-arg COMPILER_COMMIT_DEVPACK=$COMPILER_COMMIT_DEVPACK --build-arg BRANCH_DEVPACK=$BRANCH_DEVPACK --build-arg REPO_DEVPACK=$REPO_DEVPACK"

echo "Building ARGS are: $ARGS"

docker build $ARGS -t docker-mono-neo-compiler:$COMPILER_VERSION .
docker tag docker-mono-neo-compiler:$COMPILER_VERSION "docker-mono-neo-compiler:latest"
