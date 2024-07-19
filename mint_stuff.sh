#!/bin/bash

# prompt user for input
prompt() {
    local PROMPT_TEXT=$1
    local DEFAULT_VALUE=$2
    read -p "$PROMPT_TEXT [$DEFAULT_VALUE]: " INPUT
    if [ -z "$INPUT" ]; then
        echo "null"
    else
        echo "$INPUT"
    fi
}

# encrypt the file
FILE_PATH=$1
if [ -z "$FILE_PATH" ]; then
    echo "Usage: $0 <filepath>"
    exit 1
fi

ENCRYPT_OUTPUT=$(node scripts/encrypt.js "$FILE_PATH")
echo "$ENCRYPT_OUTPUT"

# extract encryption key from the output
ENCRYPTION_KEY=$(echo "$ENCRYPT_OUTPUT" | grep 'Secret Key (hex):' | awk '{print $NF}')
echo "Extracted Encryption Key: $ENCRYPTION_KEY"

# upload the encrypted file to IPFS
ENCRYPTED_FILE="encrypted-$(basename "$FILE_PATH")"
echo "Uploading Encrypted File online: $ENCRYPTED_FILE ..."
UPLOAD_OUTPUT=$(node scripts/upload.mjs "$ENCRYPTED_FILE")
echo "$UPLOAD_OUTPUT"

# extract IPFS CID from the output
ENCRYPTED_FILE_CID=$(echo "$UPLOAD_OUTPUT" | grep 'File CID:' | awk '{print $NF}')
echo "Extracted Encrypted File CID: $ENCRYPTED_FILE_CID"

echo -e "\n"

# prompt user for metaQube information
SCHEMA_IDENTIFIER=$(prompt "Enter schema identifier" "Name / Unique ID")
RECORDS_SCHEMA=$(prompt "Enter records schema" "Data records included in iQube")
RECORD_CHANGEABILITY=$(prompt "Enter record changeability" "Static / Fluid / Mixed")
OWNER_TYPE=$(prompt "Enter owner type" "Person / Org / Thing")
SUBJECT_IDENTIFIABILITY=$(prompt "Enter subject identifiability" "Ident / Semi-Ident / Anon / Semi-Anon")
ACCURACY=$(prompt "Enter accuracy" "1-10")
VERACITY=$(prompt "Enter veracity" "1-10")
SENSITIVITY=$(prompt "Enter sensitivity" "1-10")
INTRINSIC_RISK=$(prompt "Enter intrinsic risk" "1-10")
CONTEXTUAL_RISK=$(prompt "Enter contextual risk" "1-10")
DID=$(prompt "Enter owner DID (Anonymous DID)" "did:key:z6Mkt2EfbEu1swsrVNNWMHMSQLgFWVfgjnP7TBAUNbzTVPTi")

echo -e "\n"

# Create metaQube JSON
node scripts/metaQube.js \
  --schemaIdentifier="$SCHEMA_IDENTIFIER" \
  --recordsSchema="$RECORDS_SCHEMA" \
  --recordChangeability="$RECORD_CHANGEABILITY" \
  --ownerType="$OWNER_TYPE" \
  --subjectIdentifiability="$SUBJECT_IDENTIFIABILITY" \
  --accuracy="$ACCURACY" \
  --veracity="$VERACITY" \
  --sensitivity="$SENSITIVITY" \
  --intrinsicRisk="$INTRINSIC_RISK" \
  --contextualRisk="$CONTEXTUAL_RISK" \
  --cid="$ENCRYPTED_FILE_CID" \
  --did="$DID"

echo -e "\n"
# Upload metaQube JSON to IPFS
echo "Uploading metaQube JSON online ..."
METAQUBE_UPLOAD_OUTPUT=$(node scripts/upload.mjs metaQube.json)
echo "$METAQUBE_UPLOAD_OUTPUT"

# Extract metaQube CID from the output
METAQUBE_CID=$(echo "$METAQUBE_UPLOAD_OUTPUT" | grep 'File CID:' | awk '{print $NF}')
echo "Extracted metaQube CID: $METAQUBE_CID"

# Mint NFT with the metaQube data and encryption key
echo "Minting NFT ..."
node scripts/mintNFT.js "$METAQUBE_CID" "$ENCRYPTION_KEY"
