import pinataSDK from '@pinata/sdk';

export default async function pinPreviewImgIPFS(req, res) {
  console.log(req.name);

  //! Unpin Files
  try {
    // const pinFileToIPFS = await pinata.pinFileToIPFS(readableStreamForFile, options)
    res.status(200).json({ answer: "great" })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to unpin file(s)." })
  }
}