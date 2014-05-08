#!/bin/bash

WORKSPACE=$1
PROJECT_NAME=$2
BIN_PATH=$3

# This makes the source directory, and does not fail if it already exists
mkdir -p ${BIN_PATH}/build/source
SOURCE_PATH=${BIN_PATH}/build/source
PRODUCT_SOURCE_PATH=${SOURCE_PATH}/cssembed


# Just start somewhere.
cd ${WORKSPACE}

echo "-----------------------------------------------------"

figlet CSSEmbed

echo "WORKSPACE:    ${WORKSPACE}"
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "BIN_PATH:     ${BIN_PATH}"
echo "-----------------------------------------------------"
echo ""

if [ -d "${PRODUCT_SOURCE_PATH}" ]; then
    echo "The CSS Embed source is already available. Pulling update"
    cd ${PRODUCT_SOURCE_PATH}
    git pull
  else
    echo "The CSS Embed source is not available. Cloning it now..."
    cd ${SOURCE_PATH}
    git clone git://github.com/nzakas/cssembed.git;
fi

# Get and compile the source
cd ${PRODUCT_SOURCE_PATH};
ant;

# Move to the target directory.
cp build/cssembed*.jar ${BIN_PATH}/cssembed.jar;
cp build/datauri*.jar ${BIN_PATH}/datauri.jar;

# Clean up.
cd ${WORKSPACE}