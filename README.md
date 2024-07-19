# iQube NFT minting

## Steps:
### Making blakQube& metaQube, uploading, and minting NFT.
- Encrypt File: Encrypt a "blakQube" file using a symmetric encryption algorithm and save the encryption key.
    -  ```node scripts/encrypt.js <filepath>```.

- Upload to IPFS: Upload the encrypted file to some online storage. I'm using web3.storage (IPFS) in this example. 
    - ```node scripts/upload.mjs <encrypted-file>``` to upload the blakQube (encrypted).

- Create metaQube JSON: Create the metaQube JSON file with the hash of the encrypted "blakQube" file and upload it also.
    - ```node scripts/metaQube.js --schemaIdentifier="metaQube" --recordsSchema="New Content" --recordChangeability="Fluid" --ownerType="Org" --subjectIdentifiability="Anon" --accuracy="" --veracity="" --sensitivity="" --intrinsicRisk="" --contextualRisk="" --cid="newCidHere" --did="newDidHere"``` to create the metaQube with the blakQube hash entanglement.
    - 
    - ```node scripts/upload.mjs metaQube.json``` to upload the metaQube to online storage also. This will give a hash that we need for the NFT minting.
    
- Mint NFT: Use the metaQube JSON's hash as the URI in the NFT metadata and the encryption key to mint the NFT on the Polygon network. Store the encryption key securely.
    - ```node scripts/mintQube.js <metaQubeCID> <secretKey>``` to mint NFTs.

- Automate with
    - ```./mint_stuff.sh <filename>```

### Retrieving metaQube, blakQube, encryption key, and decrypting.
- Get Token URI from metaQube NFT:
    - ``` node scripts/getTokenURI.js <tokenId>```
    ```https://bafybeidptwqrgbdw6b5yt43zpl565l6onstxfuf5ke2iauzulvr6lhjpte.ipfs.w3s.link/metaQube.json```

- Get the MetaQube.json:
    - ```wget https://bafybeibdca7vsoxuyvssbapgp3he5ixqmbmj25fofdwov3flr2putbrlky.ipfs.w3s.link/metaQube.json```

- Get Encrypted blakQube:
    - ```wget https://bafybeibdca7vsoxuyvssbapgp3he5ixqmbmj25fofdwov3flr2putbrlky.ipfs.w3s.link/<encrypted_uploaded_filename>```.

- Get Secret Key (should only be accessable by owner of NFT):
    - ```node scripts/getSecretKey.js <tokenId>```.

- Decrypt blakQube:
    - ```node scripts/decrypt.js <encrypted-file> <secret-key>```.


### Extras
- To upload a new smart contract: 
    - ```npx hardhat run scripts/deployContract.js --network zkEVM```

- Transfer a NFT:
    - ```node scripts/transferNFT.js <tokenId> "<recipient-account-id>"```
- more to come


# intro
This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

