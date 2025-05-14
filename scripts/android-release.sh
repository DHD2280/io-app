#!/bin/bash

# Recreate google-services.json from ENV variable
echo "" > $1/google-services.json

# Recreate JSON key file (for Google Play) from ENV variable
echo "" | base64 --decode > /tmp/json-key.json

# Recreate keystore from ENV variable
echo $ENCODED_IO_APP_RELEASE_KEYSTORE | base64 --decode > /tmp/ioapp-release.keystore

# Recreate sentry.properties from ENV variable
echo "" | base64 --decode > ./android/sentry.properties
