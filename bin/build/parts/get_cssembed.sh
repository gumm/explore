#!/bin/bash

WORKSPACE=$1
PROJECT_NAME=$2
BIN_PATH=$3

TARGET_PATH=${BIN_PATH}/cssembed
TEMP_PATH=${BIN_PATH}/temp

# Just start somewhere.
cd ${WORKSPACE}

echo "-----------------------------------------------------"

figlet CSSEmbed

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
git clone git://github.com/nzakas/cssembed.git;
cd cssembed;
ant;

# Move to the target directory.
mv ${TEMP_PATH}/cssembed/build/cssembed*.jar ${TARGET_PATH}/cssembed.jar;
mv ${TEMP_PATH}/cssembed/build/datauri*.jar ${TARGET_PATH}/datauri.jar;

# Clean up.
cd ${WORKSPACE}
rm -rf ${TEMP_PATH}