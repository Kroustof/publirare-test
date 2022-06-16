import pinataSDK from '@pinata/sdk';
import fs from 'fs';
import formidable from 'formidable';


//! Configuration to use formidable
export const config = {
  api: {
    bodyParser: false
  }
};

//! Helper to get authorName initiales
const getInitials = (fullName) => {
  const nameArr = fullName.split('')
  let initials = nameArr.filter(char => {
    return /[A-Z]/.test(char)
  })
  return initials.join('')
}

export default async function pinPreviewImgIPFS(req, res) {
  
  //! Initialisation Pinata SDK
  const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);
  
  //! Get POST file informations and file - formidable parse is asynchrone
  const getPOST = () => {
    const promise = new Promise((res, err) => {
      const form = new formidable.IncomingForm()
      form.parse(req, async function (err, fields, files) {
        const post = {}
        post.pathFile = files.previewImage.filepath
        post.clientAddress = fields.clientAddress
        post.format = fields.format
        post.title = fields.title
        post.authorName = fields.authorName
        post.editorName = fields.editorName
        post.collectionName = fields.collectionName
        post.tome = fields.tome
        post.rights = fields.rights
        // customized file name 
        const authorInitials = getInitials(post.authorName)
        post.name = `prevImg-${post.title}-${post.collectionName}-${authorInitials}-Ed${post.editorName}`
        return res(post)
      })
    })
    return promise
  };

  const fileInfos = await getPOST()
  // console.log(fileInfos);

  //! Create a readable stream of the image
  const readableStreamForFile = fs.createReadStream(fileInfos.pathFile);

  //! Pinata Metadata of the uploaded file
  const options = {
    pinataMetadata: {
      name: fileInfos.name,
      keyvalues: {
        type: "preview book img",
        clientAddress: fileInfos.clientAddress,
        format: fileInfos.format,
        title: fileInfos.title,
        authorName: fileInfos.authorName,
        editorName: fileInfos.editorName,
        collection: fileInfos.collectionName,
        tome: fileInfos.tome,
        rights: fileInfos.rights,
      }
    },
  }

  //! Upload image file and pin it to IPFS then delete the file in temp folder
  try {
    const pinFileToIPFS = await pinata.pinFileToIPFS(readableStreamForFile, options)
    res.status(200).json(pinFileToIPFS)
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to pin Preview Image to IPFS." })
  }
  
};