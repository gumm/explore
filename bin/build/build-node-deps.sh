#!/bin/bash

WORKSPACE=$1
JS_PATH=$2
NODE_ROOT=$3
GOOG_BIN_PATH=$4
PROJECT_NAME=$5

echo "-----------------------------------------------------"

figlet Build NODE Dependencies

echo "WORKSPACE:        ${WORKSPACE}"
echo "JS_PATH:          ${JS_PATH}"
echo "NODE_ROOT:        ${NODE_ROOT}"
echo "GOOG_BIN_PATH:    ${GOOG_BIN_PATH}"
echo "PROJECT_NAME:     ${PROJECT_NAME}"
echo "-----------------------------------------------------"
echo ""

# Just start somewhere.
cd ${WORKSPACE}

chmod +x ${GOOG_BIN_PATH}/*.py

# The path should be relative to where goog.base is...
${GOOG_BIN_PATH}/depswriter.py \
    --root_with_prefix='app ../../../../../../app' \
    > deps.js
