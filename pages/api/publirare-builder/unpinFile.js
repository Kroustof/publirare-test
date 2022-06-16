import pinataSDK from '@pinata/sdk';


export default async function unpinFile(req, res) {
  
  const fileCID = req.body

  //! Initialisation Pinata SDK
  const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

  // console.log("files to delete:", fileCID);

  //! Unpin Files
  try {
    await pinata.unpin(fileCID)
    res.status(200).json({ success: "File successfully removed" })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to unpin the file." })
  }
}