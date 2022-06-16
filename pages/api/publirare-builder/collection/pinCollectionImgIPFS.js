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

export default async function pinCollectionImgIPFS(req, res) {
  
  //! Initialisation Pinata SDK
  const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);
  
  //! Get POST file informations and file - formidable parse is asynchrone
  const getPOST = () => {
    const promise = new Promise((res, err) => {
      const form = new formidable.IncomingForm()
      form.parse(req, async function (err, fields, files) {
        const post = {}
        post.pathFile = files.collectionImage.filepath
        post.clientAddress = fields.clientAddress
        post.collectionName = fields.collectionName
        post.collectionLink = fields.collectionLink
        post.authorName = fields.authorName
        post.editorName = fields.editorName
        post.rights = fields.rights
        // customized file name 
        const authorInitials = getInitials(post.authorName)
        post.name = `colImg-${post.collectionName}-${authorInitials}-Ed${post.editorName}`
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
        type: "collection nfts",
        clientAddress: fileInfos.clientAddress,
        collection: fileInfos.collectionName,
        link: fileInfos.collectionLink,
        authorName: fileInfos.authorName,
        editorName: fileInfos.editorName,
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
    res.status(500).send({ error: "Failed to pin Collection Image to IPFS." })
  }
  
};