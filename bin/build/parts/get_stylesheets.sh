#!/bin/bash

WORKSPACE=$1
PROJECT_NAME=$2
BIN_PATH=$3

TARGET_PATH=${BIN_PATH}/closure-stylesheets
TEMP_PATH=${BIN_PATH}/temp

# Just start somewhere.
cd ${WORKSPACE}

echo "-----------------------------------------------------"

figlet Closure Stylesheets

echo "WORKSPACE:    ${WORKSPACE}"
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "BIN_PATH:     ${BIN_PATH}"
echo "-----------------------------------------------------"
echo ""

# Clean install
rm -rf ${TARGET_PATH}
mkdir -p ${TARGET_PATH}

# Extract and build in a temp directory
rm -rf ${TEMP_PATH}
mkdir -p ${TEMP_PATH}
cd ${TEMP_PATH}

# Get and compile the source
git clone https://code.google.com/p/closure-stylesheets/;
cd closure-stylesheets;
ant;
ant test;

# Move to target directory
mv ${TEMP_PATH}/closure-stylesheets/build/closure-stylesheets.jar ${TARGET_PATH}/stylesheets.jar;

# Clean up.
cd ${WORKSPACE}
rm -rf ${TEMP_PATH}
