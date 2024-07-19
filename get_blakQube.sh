#!/bin/bash

# show usage
function show_usage {
    echo "Usage: $0 <tokenId> <filename>"
}

# Check if the correct number of arguments provided
if [ "$#" -ne 2 ]; then
    echo "Error: Incorrect number of arguments."
    show_usage
    exit 1
fi

TOKEN_ID=$1
FILENAME=$2

# get Token URI
TOKEN_URI_OUTPUT=$(node scripts/getTokenURI.js "$TOKEN_ID" 2>&1)
if echo "$TOKEN_URI_OUTPUT" | grep -q "Error: execution reverted: ERC721Metadata: URI query for nonexistent token"; then
    echo "Error: Nonexistent token."
    exit 1
fi

echo "$TOKEN_URI_OUTPUT"
TOKEN_URI=$(echo "$TOKEN_URI_OUTPUT" | grep 'Token URI:' | awk '{print $NF}')
IPFS_LINK="https://${TOKEN_URI}.ipfs.w3s.link/metaQube.json"
echo "MetaQube JSON URL: $IPFS_LINK"

# download metaQube JSON
wget -O metaQube.json "$IPFS_LINK"
if [ $? -ne 0 ]; then
    echo "Error: Failed to download metaQube.json."
    exit 1
fi

echo -e "\n metaQube JSON:"
cat metaQube.json
echo -e "\n\n"

# extract CID from metaQube.json
ENCRYPTED_FILE_CID=$(jq -r '.entanglementData' metaQube.json | sed 's/ipfs:\/\///')
ENCRYPTED_FILE_URL="https://${ENCRYPTED_FILE_CID}.ipfs.w3s.link/${FILENAME}"
echo "Encrypted File URL: $ENCRYPTED_FILE_URL"

# download encrypted file
wget -O "$FILENAME" "$ENCRYPTED_FILE_URL"
if [ $? -ne 0 ]; then
    echo "Error: Failed to download encrypted file."
    exit 1
fi

# get secret key
SECRET_KEY_OUTPUT=$(node scripts/getSecretKey.js "$TOKEN_ID" 2>&1)
if echo "$SECRET_KEY_OUTPUT" | grep -q "Error:"; then
    echo "$SECRET_KEY_OUTPUT"
    exit 1
fi

SECRET_KEY=$(echo "$SECRET_KEY_OUTPUT" | grep 'Secret Key:' | awk '{print $NF}')
echo "Secret Key: $SECRET_KEY"

# decrypt the file
DECRYPT_OUTPUT=$(node scripts/decrypt.js "$FILENAME" "$SECRET_KEY" 2>&1)
if echo "$DECRYPT_OUTPUT" | grep -q "Error:"; then
    echo "$DECRYPT_OUTPUT"
    exit 1
fi

echo "$DECRYPT_OUTPUT"
