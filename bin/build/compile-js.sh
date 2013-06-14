#!/bin/bash

# The closurebuilder.py tool, located in closure/bin/build, is a tool to help
# build compiled JavaScript files. It scans your files and the Closure Library
# files and can calculate orderings of script files in dependency order. It can
# output either the scripts' filenames or their contents in dependency order,
# or can pass the files along to the Closure Compiler to produce a compiled
# version.
# see: http://code.google.com/closure/library/docs/closurebuilder.html

WORKSPACE=$1
JS_PATH=$2
GOOG_BIN_PATH=$3
JS_COMPILER_PATH=$4
PROJECT_NAME=$5
SITE_VERSION=$6
RELATIVE_PATH="../explore/app/public/js"

OUTPUT_NAME=${PROJECT_NAME}_${SITE_VERSION}

if [ ! -d "${JS_PATH}/compiled/" ]; then
    echo "Create target directory"
    mkdir -p ${JS_PATH}/compiled
fi

echo "-----------------------------------------------------"

figlet Compile JS

echo "WORKSPACE:        ${WORKSPACE}"
echo "JS_PATH:          ${JS_PATH}"
echo "GOOG_BIN_PATH:    ${GOOG_BIN_PATH}"
echo "JS_COMPILER_PATH: ${JS_COMPILER_PATH}"
echo "PROJECT_NAME:     ${PROJECT_NAME}"
echo "SITE_VERSION:     ${SITE_VERSION}"
echo "-----------------------------------------------------"
echo ""

# Just start somewhere.
cd ${WORKSPACE}

${GOOG_BIN_PATH}/closurebuilder.py \
    --root=${JS_PATH}/closure-library/ \
    --root=${JS_PATH}/bad-library/ \
    --root=${JS_PATH}/app/ \
    --namespace="app" \
    --output_mode=compiled \
    --compiler_jar=${JS_COMPILER_PATH}/compiler.jar \
    --jvm_flags="-d64" \
    --jvm_flags="-client" \
    --compiler_flags="--manage_closure_dependencies" \
    --compiler_flags="--summary_detail_level=3" \
    --compiler_flags="--output_manifest=${JS_PATH}/compiled/${OUTPUT_NAME}.js.mainfest" \
    --compiler_flags="--js=${JS_PATH}/closure-library/closure/goog/deps.js" \
    --compiler_flags="--externs=${JS_PATH}/externs/google_maps_api_v3_9.js" \
    --compiler_flags="--externs=${JS_PATH}/externs/webkit_console.js" \
    --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
    --compiler_flags="--warning_level=VERBOSE" \
    --compiler_flags="--jscomp_off=accessControls" \
    --compiler_flags="--jscomp_warning=ambiguousFunctionDecl" \
    --compiler_flags="--jscomp_warning=checkRegExp" \
    --compiler_flags="--jscomp_warning=checkTypes" \
    --compiler_flags="--jscomp_warning=checkVars" \
    --compiler_flags="--jscomp_warning=const" \
    --compiler_flags="--jscomp_warning=constantProperty" \
    --compiler_flags="--jscomp_warning=deprecated" \
    --compiler_flags="--jscomp_warning=duplicateMessage" \
    --compiler_flags="--jscomp_warning=es5Strict" \
    --compiler_flags="--jscomp_warning=externsValidation" \
    --compiler_flags="--jscomp_warning=fileoverviewTags" \
    --compiler_flags="--jscomp_warning=globalThis" \
    --compiler_flags="--jscomp_warning=internetExplorerChecks" \
    --compiler_flags="--jscomp_warning=invalidCasts" \
    --compiler_flags="--jscomp_warning=missingProperties" \
    --compiler_flags="--jscomp_warning=nonStandardJsDocs" \
    --compiler_flags="--jscomp_warning=strictModuleDepCheck" \
    --compiler_flags="--jscomp_warning=typeInvalidation" \
    --compiler_flags="--jscomp_warning=undefinedNames" \
    --compiler_flags="--jscomp_warning=undefinedVars" \
    --compiler_flags="--jscomp_warning=unknownDefines" \
    --compiler_flags="--jscomp_warning=uselessCode" \
    --compiler_flags="--create_source_map=${JS_PATH}/compiled/${OUTPUT_NAME}.js.map" \
    --compiler_flags="--source_map_format=V3" \
    --compiler_flags="--output_wrapper='(function(){%output%})();//@ sourceMappingURL=/js/compiled/${OUTPUT_NAME}.js.map'"\
    --compiler_flags="--closure_entry_point=app" \
    > ${JS_PATH}/compiled/${OUTPUT_NAME}.js




