#!/bin/bash

PASSWORD=$(secret-tool lookup app android-key key-name password)

if [ -z "$PASSWORD" ]; then
    echo "Password not found in keyring"
    exit 1
fi

npm run build
npx cap sync
npx cap build android --keystorepath upload-keystore.jks \
                      --keystorepass "$PASSWORD" \
                      --keystorealiaspass "$PASSWORD" \
                      --keystorealias upload \
                      --androidreleasetype APK
