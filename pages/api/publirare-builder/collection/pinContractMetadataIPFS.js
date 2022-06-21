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


export default async function pinContractMetadataIPFS(req, res) {

  //! Initialisation Pinata SDK
  const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

  const prefixTempFolder = "temp-contractmetadata"
  let tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), prefixTempFolder))
  console.log(tmpDir);

  //! Get POST file informations and file - formidable parse is asynchrone
  const createMetadataJSON = await new Promise((res, rej) => {
    const form = new formidable.IncomingForm()
    form.parse(req, function(err, fields, files) {
      const metadataContract = `
        {
          "name":"${fields.collectionName}",
          "description":"${fields.collectionDesc}",
          "image":"${fields.collectionImgIpfsURL}",
          "external_link": "${fields.collectionLink}",
          "seller_fee_basis_points":"${fields.royaltyFeeInBips}",
          "fee_recipient":"${fields.clientAddress}"
        }
      `
      const fileName = `metaContract-${fields.collectionName}-${getInitials(fields.authorName)}-Ed${fields.editorName}.json`
      const jsonObject = JSON.parse(metadataContract)
      const jsonContent = JSON.stringify(jsonObject)
      const newFile = fs.writeFileSync(path.join(tmpDir, fileName), jsonContent, 'utf8', (err) => {
        if (err) throw err;
        console.log('Metadata file created successfully.');
      })
      
      const readableStream = fs.createReadStream(path.join(tmpDir, fileName))
      console.log("Metadata file created")

      const options = {
        pinataMetadata: {
          name: fileName,
          keyvalues: {
            type: "metadata collection",
            clientAddress: fields.clientAddress,
            collection: fields.collectionName,
            link: fields.collectionLink,
            authorName: fields.authorName,
            editorName: fields.editorName,
            rights: fields.rights,
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