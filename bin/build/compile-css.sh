#!/bin/bash

WORKSPACE=$1
CSS_PATH=$2
CLOSURE_PATH=$3
CSS_COMPILER_PATH=$4
IMG_COMPILER_PATH=$5
PROJECT_NAME=$6
SITE_VERSION=$7

OUTPUT_NAME=${PROJECT_NAME}_${SITE_VERSION}
THEME_PATH=${CSS_PATH}/themes
GOOG_CSS_PATH=${CLOSURE_PATH}/goog/css

echo "-----------------------------------------------------"

figlet Compile CSS

echo "WORKSPACE:            ${WORKSPACE}"
echo "CSS_PATH:             ${CSS_PATH}"
echo "CLOSURE_PATH:         ${CLOSURE_PATH}"
echo "CSS_COMPILER_PATH:    ${CSS_COMPILER_PATH}"
echo "IMG_COMPILER_PATH:    ${IMG_COMPILER_PATH}"
echo "PROJECT_NAME:         ${PROJECT_NAME}"
echo "SITE_VERSION:         ${SITE_VERSION}"
echo "-----------------------------------------------------"
echo ""

# Just start somewhere.
cd ${WORKSPACE}

RENAMESETTING=NONE
RENAMEFORMAT=JSON

echo "Global CSS";
echo "Building image data-urls..."
java -jar ${IMG_COMPILER_PATH}/cssembed.jar \
    --max-uri-length 999999 \
    --skip-missing \
    -o ${CSS_PATH}/compiled/images_datastream.css \
    ${CSS_PATH}/images.css


echo "Compiling Global Defaults..."
echo "Rename Setting: ${RENAMESETTING} "
echo "Rename Output Format: ${RENAMEFORMAT} "
java -jar ${CSS_COMPILER_PATH}/stylesheets.jar \
    --output-file ${CSS_PATH}/compiled/${OUTPUT_NAME}.css \
    --rename ${RENAMESETTING} \
    --output-renaming-map-format ${RENAMEFORMAT} \
    --output-renaming-map ${CSS_PATH}/compiled/renaming_map.json \
    --allowed-non-standard-function color-stop \
    --allowed-non-standard-function -o-radial-gradient \
    --allowed-non-standard-function -ms-radial-gradient \
    --allowed-non-standard-function radial-gradient \
    --allowed-non-standard-function -moz-radial-gradient \
    --allowed-non-standard-function -webkit-linear-gradient \
    --allowed-non-standard-function -moz-linear-gradient \
    --allowed-non-standard-function -ms-linear-gradient \
    --allowed-non-standard-function -webkit-radial-gradient \
    --allowed-non-standard-function -o-linear-gradient \
    --allowed-unrecognized-property -o-border-radius \
    --allowed-unrecognized-property -khtml-border-radius \
    --allowed-unrecognized-property -o-box-shadow \
    --allowed-unrecognized-property -moz-outline \
    --allowed-unrecognized-property -o-user-select \
    --allowed-unrecognized-property user-select \
    --allowed-unrecognized-property appearance \
    --allow-unrecognized-functions \
    ${CSS_PATH}/compiled/images_datastream.css \
    ${CSS_PATH}/default.css;
echo "Done"

echo "Going in to compile theme styles..."

# Find all the directories in the theme path, and compile their css
for i in `find ${THEME_PATH} -maxdepth 1 -type d | sort`
do
    THEMENAME=${i##/*/}
    if [ "${THEMENAME}" == "themes" ]
    then
        continue
    fi
    THEME_OUTPUT_FILE=${THEMENAME}_${SITE_VERSION}.css
    echo "-------------------------------";

    figlet ${THEMENAME}

    echo "THEME: ${THEMENAME}";
    echo "OUTPUT_FILE: ${THEME_PATH}/${THEMENAME}/css/$OUTPUT_FILE";
    echo "Building image data-urls..."
    java -jar ${IMG_COMPILER_PATH}/cssembed.jar \
        --max-uri-length 999999 \
        --skip-missing \
        -o ${THEME_PATH}/${THEMENAME}/css/images_datastream.css \
        ${THEME_PATH}/${THEMENAME}/css/images.css;

    echo "Compiling Theme..."
    java -jar ${CSS_COMPILER_PATH}/stylesheets.jar \
        --rename ${RENAMESETTING} \
        --allowed-non-standard-function -moz-radial-gradient \
        --allowed-unrecognized-property -o-border-radius \
        --allowed-non-standard-function color-stop \
        --allowed-unrecognized-property -o-box-shadow \
        --output-file ${THEME_PATH}/${THEMENAME}/css/compiled/${THEME_OUTPUT_FILE} \
        ${THEME_PATH}/${THEMENAME}/images_datastream.css \
        ${THEME_PATH}/${THEMENAME}/style.css;
done
echo "-------------------------------";
echo "Done"