import axios from 'axios';
import formidable from "formidable";
import { bookTypes } from "../../../../helpers/bookTypes";
const fs = require('fs');
const path = require('path');
const os = require('os');
const FormData = require('form-data');
const recursive = require('recursive-fs');


//! Configuration to use formidable
export const config = {
  api: {
    bodyParser: false
  }
};

//! Helper to get authorName initials
const getInitials = (fullName) => {
  const nameArr = fullName.split('')
  let initials = nameArr.filter(char => {
    return /[A-Z]/.test(char)
  })
  return initials.join('')
}


export default async function pinBookIPFS(req, res) {

  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
  const src = path.join(process.cwd(), 'templates/structures/manga-standard-full-png')
  const prefixTempFolder = "temp-nftcontent"
  let tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), prefixTempFolder))
  // console.log(tmpDir);

  let data = new FormData();

  //! ADD METADATA AND NFT CONTENT TO FORM DATA
  const addMetadataAndContent = new Promise((res, rej) => {
    const form = new formidable.IncomingForm({
      uploadDir: tmpDir,
      keepExtensions: true,
      filename: (name, ext) => `${name}${ext}`
    })
    form.parse(req, function(err, fields, files) {
      const metadata = JSON.stringify({
        name: `nftBook-${fields.title}-${fields.collectionName}-${getInitials(fields.authorName)}-Ed${fields.editorName}`,
        keyvalues: {
          type: "interactive nft book",
          clientAddress: fields.clientAddress,
          format: fields.format,
          title: fields.title,
          authorName: fields.authorName,
          editorName: fields.editorName,
          collection: fields.collectionName,
          tome: fields.tome,
          rights: fields.rights
        }
      })
      data.append('pinataMetadata', metadata)
      // console.log("Book metadata added", metadata)

      const content = Object.keys(files).map((key) => {
        const name = files[key].originalFilename
        const filepath = files[key].filepath
        // console.log(name);
        data.append('file', fs.createReadStream(filepath), {
          filepath: path.join("/nftbook/", name)
        })
      });
      // console.log("Book content added")
      res(console.log("Infos and content collected then added"))
    })
  })

  //! ADD BOOK STRUCTURE TO FORM DATA
  const addStructureToData = new Promise((res, rej) => {
    recursive.readdirr(src, (err, dirs, files) => {
      files.forEach((file) => {
        const name = path.basename(file)
        // console.log(name);
        data.append('file', fs.createReadStream(file), {
          filepath: path.join("/nftbook/", name)
        })
      });
      res(console.log("Book structure added"))
    })
  })

  //! ADD BOOK PARAMS TO FORM DATA
  const addParamsToData = new Promise((res, rej) => {
    const form = new formidable.IncomingForm()
    form.parse(req, function(err, fields, files) {
      const content = `
        export default {
          pages: ${fields.bookLength || 10},
          widthSm: ${bookTypes[fields.format].width},
          heightSm: ${bookTypes[fields.format].height},
          widthLg: 500,
          heightLg: 500,
          insideCover: "${fields.insideCover || ''}",
          insideBack: "${fields.insideBack || ''}",
          pagesColor: "${fields.pagesColor || ''}",
          canvasBg: "${fields.canvasBg || 'transparent'}",
        }
      `
      const newFile = fs.writeFileSync(path.join(tmpDir, "01-book-params.js"), content, (err) => {
        if (err) throw err;
        // console.log('Params file is created successfully.');
      })
      
      const readableStream = fs.createReadStream(path.join(tmpDir, "01-book-params.js"))
      data.append('file', readableStream, {
        filepath: path.join("/nftbook/", "01-book-params.js")
      })

      res(console.log("Client book params added"))
    })
  })


  try {
    //! WAIT FOR ALL DATA REGROUPED IN FORM DATA
    await Promise.all([addMetadataAndContent, addStructureToData, addParamsToData])
    // console.log("After adding all content:", data);
    //! PIN NFT BOOK TO PINATA
    const pinToIPFS = await axios.post(url, data, {
      maxBodyLength: "Infinity",
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET
      }
    })
    // console.log("finished")
    //! SEND RESPONSE (HASH, SIZE & TIMESTAMP)
    res.status(200).send(pinToIPFS.data)
  } 
  catch (err) {
    console.log(err);
    res.status(500).send({ error: "Failed to pin NFT Book." })
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