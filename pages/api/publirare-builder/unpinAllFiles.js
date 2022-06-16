import pinataSDK from '@pinata/sdk';
import formidable from 'formidable';

// Configuration to use formidable
export const config = {
  api: {
    bodyParser: false
  }
};


export default async function unpinAllFiles(req, res) {
  
  //! Initialisation Pinata SDK
  const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

  //! Get POST file informations and file - formidable parse is asynchrone
  const filesToDelete = await new Promise((res, rej) => {
    const form = new formidable.IncomingForm()
    form.parse(req, function(err, fields, files) {
      const cidArray = []
      cidArray.push(fields.collectionImgCID)
      cidArray.push(fields.previewImgCID)
      cidArray.push(fields.nftbookCID)
      cidArray.push(fields.contractMetadataCID)
      cidArray.push(fields.metadataCID)
      return res(cidArray)
    })
  })

  // console.log("files to delete:", filesToDelete);

  //! Unpin Files
  try {
    // console.log("test:", filesToDelete.every(cid => !cid));
    if (filesToDelete.every(cid => !cid)) {
      res.status(200).json({ success: "Nothing to delete" })
    } else {
      const promiseArray = []
      filesToDelete
        .filter(cid => cid !== "")
        .map(cid => {
          const newPromise = pinata.unpin(cid)
          promiseArray.push(newPromise)
        })
      await Promise.all(promiseArray)
      res.status(200).json({ success: "All files successfully removed" })
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to unpin file(s)." })
  }
}