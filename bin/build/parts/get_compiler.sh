#!/bin/bash

WORKSPACE=$1
PROJECT_NAME=$2
BIN_PATH=$3

# This makes the source directory, and does not fail if it already exists
mkdir -p ${BIN_PATH}/build/source
SOURCE_PATH=${BIN_PATH}/build/source
PRODUCT_SOURCE_PATH=${SOURCE_PATH}/closure-compiler

# Just start somewhere.
cd ${WORKSPACE}

echo "-----------------------------------------------------"

figlet Closure Compiler

echo "WORKSPACE:    ${WORKSPACE}"
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "BIN_PATH:     ${BIN_PATH}"
echo "-----------------------------------------------------"
echo ""

if [ -d "${PRODUCT_SOURCE_PATH}" ]; then
    echo "The closure compiler source is already available. Pulling update"
    cd ${PRODUCT_SOURCE_PATH}
    git fetch --all
    git reset --hard origin/master
    git clean -df
  else
    echo "The closure compiler source is not available. Cloning it now..."
    cd ${SOURCE_PATH}
    git clone https://github.com/google/closure-compiler.git;
fi

# Extract and build in a temp directory
cd ${PRODUCT_SOURCE_PATH}
ant jar;
#ant test;
cp build/compiler.jar ${BIN_PATH};

# Clean up.
cd ${WORKSPACE}