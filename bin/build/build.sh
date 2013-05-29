#!/bin/bash

WORKSPACE=~/Workspace/explore

# Relative to the workspace
BIN_PATH=${WORKSPACE}/bin
BUILD_PATH=${BIN_PATH}/build
PUBLIC_PATH=${WORKSPACE}/public
JS_PATH=${PUBLIC_PATH}/js
CSS_PATH=${PUBLIC_PATH}/css

# Library
CLOSURE_PATH=${JS_PATH}/closure-library/closure

# Compilers
JS_COMPILER_PATH=${BIN_PATH}/closure-compiler
CSS_COMPILER_PATH=${BIN_PATH}/closure-stylesheets
IMG_COMPILER_PATH=${BIN_PATH}/cssembed
GOOG_BIN_PATH=${CLOSURE_PATH}/bin/build

# Project Variables.
PROJECT_NAME=`grep name ${WORKSPACE}/package.json | cut -f4 -d'"'`
SITE_VERSION=`grep version ${WORKSPACE}/package.json | cut -f4 -d'"'`

#Task
TASK=$1

case "$1" in

# Prepare the Closure Development Environment
cde)  echo "Build Closure Development Environment"
    ${BUILD_PATH}/build-cde.sh \
        ${WORKSPACE} \
        ${BIN_PATH} \
        ${BUILD_PATH} \
        ${JS_PATH} \
        ${GOOG_BIN_PATH} \
        ${PROJECT_NAME}
    ;;

# Compile the Java Script
js)  echo  "Compile JS"
    ${BUILD_PATH}/compile-js.sh \
        ${WORKSPACE} \
        ${JS_PATH} \
        ${GOOG_BIN_PATH} \
        ${JS_COMPILER_PATH} \
        ${PROJECT_NAME} \
        ${SITE_VERSION}
    ;;

# Compile the CSS files.
css)  echo  "Compile CSS"
    ${BUILD_PATH}/compile-css.sh \
        ${WORKSPACE} \
        ${CSS_PATH} \
        ${CLOSURE_PATH} \
        ${CSS_COMPILER_PATH} \
        ${IMG_COMPILER_PATH} \
        ${PROJECT_NAME} \
        ${SITE_VERSION}
    ;;

# Build the deps file needed for un-compiled work.
deps) echo  "Build Closure Dependencies"
   ${BUILD_PATH}/build-deps.sh \
        ${WORKSPACE} \
        ${JS_PATH} \
        ${GOOG_BIN_PATH} \
        ${PROJECT_NAME}
   ;;

# Build the deps file needed for un-compiled work.
ui) echo  "Build Closure Dependencies"
    ${BUILD_PATH}/build.sh lint app
    ${BUILD_PATH}/build.sh lint bad
    ${BUILD_PATH}/build.sh js
    ${BUILD_PATH}/build.sh css
   ;;

# Lint some files.
lint) echo "Lint $2"
    ${BUILD_PATH}/lint.sh ${JS_PATH} $2
   ;;
esac
