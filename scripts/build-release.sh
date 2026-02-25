#!/bin/bash

set -a
source android/.env
set +a

PASSWORD=$(secret-tool lookup app android-key key-name password)

if [ -z "$PASSWORD" ]; then
    echo "Password not found in keyring"
    exit 1
fi

npm run build
npx cap sync android
npx cap build android --keystorepath upload-keystore.jks \
                      --keystorepass "$PASSWORD" \
                      --keystorealiaspass "$PASSWORD" \
                      --keystorealias upload \
                      --signing-type apksigner \
                      --androidreleasetype APK
