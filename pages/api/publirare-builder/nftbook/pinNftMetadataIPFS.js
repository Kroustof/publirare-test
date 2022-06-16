import pinataSDK from '@pinata/sdk';
import formidable from 'formidable';
const fs = require('fs');
const path = require('path');
const os = require('os');


// Configuration to use formidable
export const config = {
  api: {
    bodyParser: false
  }
};

// Helper to get authorName initials
const getInitials = (fullName) => {
  const nameArr = fullName.split('')
  let initials = nameArr.filter(char => {
    return /[A-Z]/.test(char)
  })
  return initials.join('')
}


export default async function pinNftMetadataIPFS(req, res) {

  //! Initialisation Pinata SDK
  const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

  const prefixTempFolder = "temp-nftmetadata"
  let tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), prefixTempFolder))
  // console.log(tmpDir);

  //! Get POST file informations and file - formidable parse is asynchrone
  const createMetadataJSON = await new Promise((res, rej) => {
    const form = new formidable.IncomingForm()
    form.parse(req, function(err, fields, files) {
      const metadataNFT = `
        {
          "description":"${fields.description}",
          "external_url": "${fields.external_url}",
          "image":"${fields.previewIpfsURL}",
          "name":"${fields.title}",
          "animation_url":"${fields.nftBookURI}",
          "attributes": [
            {
              "trait_type": "Language", 
              "value": "${fields.language}"
            }, 
            {
              "trait_type": "Format", 
              "value": "${fields.format}"
            }, 
            {
              "trait_type": "Editor", 
              "value": "${fields.editorName || 'self-publishing'}"
            }, 
            {
              "trait_type": "Special Edition", 
              "value": "${fields.specialEdition}"
            }, 
            {
              "trait_type": "Category #1", 
              "value": "${fields.category1}"
            }, 
            {
              "trait_type": "Category #2", 
              "value": "${fields.category2}"
            }, 
            {
              "display_type": "date",
              "trait_type": "NFT Publication Date", 
              "value": "${fields.timestamp}"
            },
            {
              "trait_type": "NFT Publication Rights", 
              "value": "${fields.rights}"
            },
          ]
        }
      `
      const fileName = `metaToken-${fields.title}-${fields.collectionName}-${getInitials(fields.authorName)}-Ed${fields.editorName}.json`
      const newFile = fs.writeFileSync(path.join(tmpDir, fileName), metadataNFT, (err) => {
        if (err) throw err;
        // console.log('Metadata file created successfully.');
      })
      
      const readableStream = fs.createReadStream(path.join(tmpDir, fileName))
      // console.log("Metadata file created")

      const options = {
        pinataMetadata: {
          name: fileName,
          keyvalues: {
            type: "metadata nft book",
            clientAddress: fields.clientAddress,
            format: fields.format,
            title: fields.title,
            authorName: fields.authorName,
            editorName: fields.editorName,
            collection: fields.collectionName,
            tome: fields.tome,
            rights: fields.rights
          }
        },
      }

      return res({
        readableStream: readableStream,
        options: options
      })
    })
  })

  try {
    const metadataJSON = createMetadataJSON.readableStream
    const pinataOptions = createMetadataJSON.options
    const pinMetadataToIPFS = await pinata.pinFileToIPFS(metadataJSON, pinataOptions)
    res.status(200).json(pinMetadataToIPFS)
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to upload NFT Metadata" })
  }
  finally {
    try {
      if (tmpDir) {
        fs.rmSync(tmpDir, { recursive: true });
      }
    }
    catch (err) {
      console.error(`An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${err}`);
    }
  }

}