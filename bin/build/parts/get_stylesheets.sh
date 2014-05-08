#!/bin/bash

WORKSPACE=$1
PROJECT_NAME=$2
BIN_PATH=$3

# This makes the source directory, and does not fail if it already exists
mkdir -p ${BIN_PATH}/build/source
SOURCE_PATH=${BIN_PATH}/build/source
PRODUCT_SOURCE_PATH=${SOURCE_PATH}/closure-stylesheets

# Just start somewhere.
cd ${WORKSPACE}

echo "-----------------------------------------------------"

figlet Closure Stylesheets

echo "WORKSPACE:    ${WORKSPACE}"
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "BIN_PATH:     ${BIN_PATH}"
echo "-----------------------------------------------------"
echo ""

if [ -d "${PRODUCT_SOURCE_PATH}" ]; then
    echo "The closure stylesheet source is already available. Pulling update"
    cd ${PRODUCT_SOURCE_PATH}
    git pull
  else
    echo "The closure stylesheet source is not available. Cloning it now..."
    cd ${SOURCE_PATH}
    git clone https://github.com/google/closure-stylesheets.git;
fi

# Get and compile the source
cd ${PRODUCT_SOURCE_PATH}
ant;
ant test;

# Move to target directory
cp build/closure-stylesheets.jar ${BIN_PATH};

# Clean up.
cd ${WORKSPACE}