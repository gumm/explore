#!/bin/bash

WORKSPACE=$1
PROJECT_NAME=$2
BIN_PATH=$3

TARGET_PATH=${BIN_PATH}/closure-compiler
TEMP_PATH=${BIN_PATH}/temp

# Just start somewhere.
cd ${WORKSPACE}

echo "-----------------------------------------------------"

figlet Closure Compiler

echo "WORKSPACE:    ${WORKSPACE}"
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "BIN_PATH:     ${BIN_PATH}"
echo "-----------------------------------------------------"
echo ""

# Clean Install
rm -rf ${TARGET_PATH}
mkdir -p ${TARGET_PATH}

# Extract and build in a temp directory
rm -rf ${TEMP_PATH}
mkdir -p ${TEMP_PATH}
cd ${TEMP_PATH}

# Get and compile the source
wget http://dl.google.com/closure-compiler/compiler-latest.zip
unzip compiler-latest.zip
mv compiler.jar ${TARGET_PATH};

# Clean up.
cd ${WORKSPACE}
rm -rf ${TEMP_PATH}