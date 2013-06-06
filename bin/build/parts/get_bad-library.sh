#!/bin/bash

WORKSPACE=$1
PROJECT_NAME=$2
JS_PATH=$3
GOOG_BIN_PATH=$4

TARGET_PATH=${JS_PATH}/bad-library

# Just start somewhere.
cd ${WORKSPACE}

echo "-----------------------------------------------------"

figlet Bad Library

echo "WORKSPACE:        ${WORKSPACE}"
echo "PROJECT_NAME:     ${PROJECT_NAME}"
echo "JS_PATH:          ${JS_PATH}"
echo "GOOG_BIN_PATH:    ${GOOG_BIN_PATH}"
echo "-----------------------------------------------------"
echo ""

if [ -d "${TARGET_PATH}" ]; then
    echo "The bad-library is already installed. Pulling update"
    cd ${TARGET_PATH}
    git pull
  else
    echo "The bad-library is not installed. Cloning it now..."
    cd ${JS_PATH}
    git clone git@github.com:gumm/bad-library.git
fi

# Make the build tools executable
cd ${WORKSPACE}
chmod +x ${GOOG_BIN_PATH}/*.py
