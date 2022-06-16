import { useEffect, useRef, useState } from "react"
import LayoutNFTCreate from "../../../../components/Layout/LayoutNFTCreate"
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import Image from 'next/image'
import loader from '../../../../public/loader.gif'
import { useMoralis, useChain } from "react-moralis"
import { useRouter } from 'next/router'
import { useMoralisDapp } from "../../../../providers/MoralisDappProvider/MoralisDappProvider"
import CreateNFTBook from "../../../../components/Creation/NFTBook/CreateNFTBook"
import PreviewImage from "../../../../components/Creation/NFTBook/PreviewImage"
import DetailsCollection from "../../../../components/Creation/NFTBook/DetailsCollection"
import DetailsNFTBook from "../../../../components/Creation/NFTBook/DetailsNFTBook"
import ErrorArrayMessage from "../../../../components/Alerts/ErrorArrayMessage"
import FactoryCreationStatus from "../../../../components/Creation/Factory/FactoryCreationStatus"
import { ClockIcon, CloudUploadIcon, CogIcon, DocumentAddIcon, ExternalLinkIcon, SpeakerphoneIcon, XIcon } from "@heroicons/react/outline"
import FactoryCreationConfirmation from "../../../../components/Creation/Factory/FactoryCreationConfirmation"
import ErrorCreationMessage from "../../../../components/Alerts/ErrorCreationMessage"
import FuncWriteCreateNewNftBook from "../../../../components/Functions/Factory/FuncWriteCreateNewNftBook"


export default function Create() {

  const router = useRouter()
  const { format, extension, size } = router.query
  const { isAuthenticated, isAuthUndefined, account } = useMoralis()
  const { switchNetwork, chainId } = useChain()
  const { isCreator, creatorInfos, isLoading } = useMoralisDapp()

  //!=============== STATES ===============================================================================================
  const [isOpenValidation, setIsOpenValidation] = useState(false)
  const [isOpenErrorFields, setIsOpenErrorFields] = useState(false)
  const [errorFields, setErrorFields] = useState(null)
  const [errorCreation, setErrorCreation] = useState(null)
  const [isFatalError, setIsFatalError] = useState(false)
  const [loadingState, setLoadingState] = useState(0)
  const [creationStatus, setCreationStatus] = useState("")
  const [readyToMint, setReadyToMint] = useState(false)
  // creation steps ("upcoming" / "completed" / "current")
  const [steps, setSteps] = useState([
    { id: 1, title: "Build NFT Book", icon: CogIcon, status: "upcoming" },
    { id: 2, title: "Pin Metadata to IPFS", icon: CloudUploadIcon, status: "upcoming" },
    { id: 3, title: "Create Smart Contract", icon: DocumentAddIcon, status: "upcoming" },
    { id: 4, title: "Congratulations!", icon: SpeakerphoneIcon, status: "upcoming" }
  ])
  const [pinValidation, setPinValidation] = useState({
    collectionImg: null,
    previewImg: null,
    nftbook: null,
    contractMetadata: null,
    metadata: null
  })
  const [nftInfos, setNftInfos] = useState({
    collectionImgCID: null,
    contractMetadataCID: null,
    previewImgCID: null,
    nftbookCID: null,
    metadataCID: null,
    contractAddress: null,
    isNftMinted: false
  })
  const [mintOptions, setMintOptions] = useState({
    amount: null,
    maxCopies: null,
    royaltyFeesInBips: null,
    collectionName: null,
  })
  
  //!=============== INPUTS ===============================================================================================
  // customization
  const [images, setImages] = useState({
    collectionImage: null,
    previewImage: null,
    cover: null,
    background: null,
    pages: []
  })
  const canvasBgRef = useRef("")
  const insideCoverRef = useRef("")
  const insideBackRef = useRef("")
  const pagesColorRef = useRef("")
  // collection infos [contract URI] //! Create metadata contract
  const collectionNameRef = useRef("") //! Name ref change be careful to update functions (name) + pinata
  const collectionDescRef = useRef("") //! New ref (description)
  const collectionLinkRef = useRef("") //! New ref (external_link)
  // book infos
  const titleRef = useRef("") //! metadata + pinata (name)
  const authorNameRef = useRef("") //! pinata
  const editorNameRef = useRef("") //! pinata
  const serieRef = useRef("")
  const tomeRef = useRef("")
  const amountRef = useRef("") //! contract 
  const maxCopiesRef = useRef("") //! contract
  const royaltyFeeInBipsRef = useRef("") //! contract
  // metadata book
  const descriptionRef = useRef("")
  const externalUrlRef = useRef("") //! Web 3 Book URL
  const languageRef = useRef("") //! attributes
  const category1Ref = useRef("") //! attributes
  const category2Ref = useRef("") //! attributes
  const specialEditionRef = useRef("") //! attributes
  const [publishingRights, setPublishingRights] = useState(null) //! attributes


  //!=============== CREATION HELP FUNCTIONS ===============================================================================================
  // Update steps
  const updateSteps = (currentStep) => {
    let newState = [...steps]
    for (let i = 0; i < steps.length; i++) {
      if (i + 1 < currentStep) {
        newState[i].status = "completed"
      } else if (i + 1 === currentStep) {
        newState[i].status = "current"
      } else {
        newState[i].status = "upcoming"
      }
    }
    setSteps(newState)
  }
  // Delete All Pinned Files from IPFS
  const deleteAllFilesIPFS = async () => {
    if ((loadingState >= 1.9 && isFatalError) || loadingState === 3) {
      const infos = {...nftInfos}
      console.log(infos);
      const body = new FormData()
      Object.keys(infos).map(cid => {
        body.append(`${cid}`, infos[cid] || "")
      })
      const response = await fetch(`${router.basePath}/api/publirare-builder/unpinAllFiles/`, {
        method: "POST",
        body: body,
      })
      const data = await response.json()
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data.success);
        let newState = Object.keys(infos).map(key => infos[key] = null)
        setNftInfos(newState)
      }
    } else {
      console.log("Pinning work not finished...");
    }
  }
  // Body POST full (contain all inputs)
  const buildBodyPOST = () => {
    const body = new FormData()
    return new Promise((res, rej) => {
      // Info & Customization
      body.append("clientAddress", account)
      body.append("format", format)
      body.append("extension", extension)
      body.append("size", size)
      body.append("title", titleRef.current.value)
      body.append("authorName", authorNameRef.current.value)
      body.append("editorName", editorNameRef.current.value || "Self-Publishing")
      body.append("collectionName", collectionNameRef.current.value)
      body.append("collectionLink", collectionLinkRef.current.value)
      body.append("collectionDesc", collectionDescRef.current.value)
      body.append("tome", tomeRef.current.value)
      body.append("canvasBg", canvasBgRef.current.value)
      body.append("insideCover", insideCoverRef.current.value)
      body.append("insideBack", insideBackRef.current.value)
      body.append("pagesColor", pagesColorRef.current.value)
      body.append("description", descriptionRef.current.value)
      body.append("external_url", externalUrlRef.current.value)
      body.append("language", languageRef.current.value)
      body.append("specialEdition", specialEditionRef.current.value)
      body.append("category1", category1Ref.current.value)
      body.append("category2", category2Ref.current.value)
      body.append("rights", publishingRights ? "Rights Owner" : "Public Domain")
      body.append("amount", Number.parseInt(amountRef.current.value))
      body.append("maxCopies", maxCopiesRef.current.value ? Number.parseInt(maxCopiesRef.current.value) : Number.parseInt(amountRef.current.value))
      body.append("royaltyFeeInBips", (Number.parseInt(royaltyFeeInBipsRef.current.value) * 100)) // User input is a percentage (0% to 50%)
      // Files
      body.append("collectionImage", images.collectionImage)
      body.append("previewImage", images.previewImage)
      body.append("bookLength", images.pages.length)
      body.append("cover", images.cover, "cover.png")
      images.background && body.append("background", images.background, "background.png")
      images.pages.map((page, index) => {
        body.append(`page${index + 1}`, page, `${index + 1}.png`)
      })
      console.log("data POST completed")
      res(body)
    })
  }
  // Upload Collection Image to IPFS
  const pinCollectionImage = async (collectedData) => {
    const response = await fetch(`${router.basePath}/api/publirare-builder/collection/pinCollectionImgIPFS/`, {
      method: "POST",
      body: collectedData
    })
    const data = await response.json()
    if (data.error) {
      console.log(data.error);
      setIsFatalError(true)
      setErrorCreation(prevState => (prevState || "") + ` An error occured with collection image: ${data.error}`)
      setPinValidation(prevState => ({ ...prevState, collectionImg: "error" }))
    } else {
      // console.log(data);
      data.source = "collection image"
      setPinValidation(prevState => ({ ...prevState, collectionImg: "success" }))
      setNftInfos(prevState => ({ ...prevState, collectionImgCID: data.IpfsHash }))
      setCreationStatus("Collection image successfully pinned to IPFS")
      return data
    }
  } 
  // Upload Preview Image to IPFS
  const pinPreviewImage = async (collectedData) => {
    const response = await fetch(`${router.basePath}/api/publirare-builder/nftbook/pinPreviewImgIPFS/`, {
      method: "POST",
      body: collectedData
    })
    const data = await response.json()
    if (data.error) {
      console.log(data.error);
      setIsFatalError(true)
      setErrorCreation(prevState => (prevState || "") + ` An error occured with preview image: ${data.error}`)
      setPinValidation(prevState => ({ ...prevState, previewImg: "error" }))
    } else {
      // console.log(data);
      data.source = "preview image"
      setPinValidation(prevState => ({ ...prevState, previewImg: "success" }))
      setNftInfos(prevState => ({ ...prevState, previewImgCID: data.IpfsHash }))
      setCreationStatus("Preview image successfully pinned to IPFS")
      return data
    }
  }
  // Upload Book to IPFS
  const pinBook = async (collectedData) => {
    const response = await fetch(`${router.basePath}/api/publirare-builder/nftbook/pinBookIPFS/`, {
      method: "POST",
      body: collectedData
    })
    const data = await response.json()
    if (data.error) {
      console.log(data.error);
      setIsFatalError(true)
      setErrorCreation(prevState => (prevState || "") + ` An error occured with the book: ${data.error}`)
      setPinValidation(prevState => ({ ...prevState, nftbook: "error" }))
    } else {
      // console.log(data);
      data.source = "book"
      setPinValidation(prevState => ({ ...prevState, nftbook: "success" }))
      setNftInfos(prevState => ({ ...prevState, nftbookCID: data.IpfsHash }))
      setCreationStatus("Book successfully pinned to IPFS")
      return data
    }
  }
  // Upload Contract Metadata to IPFS
  const pinContractMetadata = async (collectedData, timestamp, collectionImgCID) => {
    const customBody = collectedData
    customBody.append("timestamp", timestamp)
    customBody.append("collectionImgIpfsURL", `ipfs://${collectionImgCID}`)
    const response = await fetch(`${router.basePath}/api/publirare-builder/collection/pinContractMetadataIPFS/`, {
      method: "POST",
      body: customBody
    })
    const data = await response.json()
    if (data.error) {
      console.log(data.error);
      setIsFatalError(true)
      setErrorCreation(prevState => (prevState || "") + ` An error occured with contract metadata: ${data.error}`)
      setPinValidation(prevState => ({ ...prevState, contractMetadata: "error" }))
    } else {
      // console.log(data);
      data.source = "metadata"
      setPinValidation(prevState => ({ ...prevState, contractMetadata: "success" }))
      setNftInfos(prevState => ({ ...prevState, contractMetadataCID: data.IpfsHash }))
      setCreationStatus("Contract metadata successfully pinned to IPFS")
      return data
    }
  }
  // Upload NFT Metadata to IPFS
  const pinNftMetadata = async (collectedData, timestamp, previewImgCID, bookCID) => {
    const customBody = collectedData
    customBody.append("timestamp", timestamp)
    customBody.append("previewIpfsURL", `ipfs://${previewImgCID}`)
    customBody.append("nftBookURI", `https://gateway.pinata.cloud/ipfs/${bookCID}/`)
    const response = await fetch(`${router.basePath}/api/publirare-builder/nftbook/pinNftMetadataIPFS/`, {
      method: "POST",
      body: customBody
    })
    const data = await response.json()
    if (data.error) {
      console.log(data.error);
      setIsFatalError(true)
      setErrorCreation(prevState => (prevState || "") + ` An error occured with nft metadata: ${data.error}`)
      setPinValidation(prevState => ({ ...prevState, metadata: "error" }))
    } else {
      // console.log(data);
      data.source = "metadata"
      setPinValidation(prevState => ({ ...prevState, metadata: "success" }))
      setNftInfos(prevState => ({ ...prevState, metadataCID: data.IpfsHash }))
      setCreationStatus("NFT Book metadata successfully pinned to IPFS")
      return data
    }
  }
  // Check pin validation
  const checkPinValidation = () => {
    return Object.keys(pinValidation).every(key => {
            pinValidation[key] === "success"
          })
  }
  // Cancel creation
  const cancelCreation = async () => {
    await deleteAllFilesIPFS()
    router.reload()
  }

  //!=============== CREATION STEPS ===============================================================================================
  
  //! Step 1: Check input fields requirements
  const checkRequiredFields = (e) => {
    e.preventDefault()
    setIsOpenValidation(false)
    setErrorFields(null)
    let errorsArray = []
    // Check chain and switch to Polygon (testnet)
    if (chainId !== "0x13881") {
      alert("You are connected to the wrong blockchain! Change to Polygon blockchain.")
      switchNetwork("0x13881")
      return
    }
    // validate images
    if (!images.cover) errorsArray.push("Book cover missing! Please upload a cover image.")
    if (images.pages.length < 1) errorsArray.push("Your NFT book must have at least 1 page! Please upload a page or more to your NFT book.")
    if (!images.previewImage) errorsArray.push("Preview image missing! Please upload a preview image for your NFT.")
    if (!images.collectionImage) errorsArray.push("Collection image missing! Please upload an image for your collection.")
    // validate url query infos
    if (!format) errorsArray.push("Book format missing! Fatal error, close session and retry.")
    // validate required user input
    if (collectionNameRef.current.value === "") errorsArray.push("Collection name missing! Please provide a name to your new collection.")
    if (titleRef === "") errorsArray.push("Book title missing! Please provide a title to your first NFT book.")
    if (authorNameRef === "") errorsArray.push("Author name missing! Please provide the book author's name.")
    if (tomeRef < 0) errorsArray.push("Tome number cannot be negative! Please set tome number to 0 or more.")
    if (languageRef.current.value.length !== 2) errorsArray.push("Book language is required! Please select a book language.")
    if (externalUrlRef.current.value === "") errorsArray.push("External link to your book missing! Please provide a valid link to your book.")
    if (category1Ref.current.value === "") errorsArray.push("Book category missing! Please select at least 1 category to your NFT book.")
    if (category1Ref.current.value === "") errorsArray.push("Book category missing! Please select at least 1 category to your NFT book.")
    if (publishingRights === null) errorsArray.push("Copyrights infos required! Please choose between the two copyright options.")
    if (Number.parseInt(amountRef.current.value) < 2) errorsArray.push("Number of copies too low! Please set a number of copy over 2.")
    if (Number.parseInt(amountRef.current.value) > 25000000) errorsArray.push("Limit of copies exceeded! Please set a maximum number of 25,000,000.")
    if (Number.parseInt(maxCopiesRef.current.value) < Number.parseInt(amountRef.current.value)) errorsArray.push("Maximum copies cannot be lower than the number of copies minted at creation! Please set a valid number or delete max copies value.")
    if (Number.parseInt(maxCopiesRef.current.value) > 25000000) errorsArray.push("Limit of copies exceeded! Please set a maximum number of 25,000,000.")
    if (Number.parseInt(royaltyFeeInBipsRef.current.value) > 50) errorsArray.push("Royalties cannot exceed 50%! Please set a valid royalty percentage.")
    if (Number.parseInt(royaltyFeeInBipsRef.current.value) < 0) errorsArray.push("Royalties cannot be a negative number! Please set a valid royalty percentage.")
    
    if (errorsArray.length > 0) {
      setErrorFields(errorsArray)
      setIsOpenValidation(false)
      setIsOpenErrorFields(true)
      setLoadingState(0)
      return
    } else {
      setErrorFields(null)
      setIsOpenErrorFields(false)
      setIsOpenValidation(true)
    }
  }
  //! Step 2: Create NFT Book
  const pinNewNFTBook = async (e) => {
    e.preventDefault()
    setIsOpenValidation(false)
    try {
    setLoadingState(1)
    updateSteps(1)
    const collectedData = await buildBodyPOST()
    setCreationStatus("Working on your new collection & NFT book...")
      // PIN COLLECTION IMAGE
      const pinCollectionImageToIPFS = pinCollectionImage(collectedData)
      // PIN PREVIEW IMAGE
      const pinPreviewImageToIPFS = pinPreviewImage(collectedData)
      // PIN BOOK
      const pinBookToIPFS = pinBook(collectedData)
      
      // WAIT TO RESOLVE ASYNC CONTENTS PIN
      const pinNFTContents = await Promise.allSettled([pinCollectionImageToIPFS, pinPreviewImageToIPFS, pinBookToIPFS])

      console.log(pinNFTContents);
      if (
        pinNFTContents.every(result => result.status === "fulfilled" && result.value)
      ) 
      {
        setLoadingState(2)
        updateSteps(2)
        // COLLECT ADDITIONAL IPFS INFOS FOR NFT BOOK METADATAs
        const pinTimestamp = await pinNFTContents[pinNFTContents.findIndex(ipfs => ipfs.value.source === "preview image")].Timestamp
        const collectionImgCID = await pinNFTContents[pinNFTContents.findIndex(ipfs => ipfs.value.source === "collection image")].IpfsHash
        const previewImgCID = await pinNFTContents[pinNFTContents.findIndex(ipfs => ipfs.value.source === "preview image")].IpfsHash
        const bookCID = await pinNFTContents[pinNFTContents.findIndex(ipfs => ipfs.value.source === "book")].IpfsHash
        
        // PIN CONTRACT METADATA
        await pinContractMetadata(collectedData, pinTimestamp, collectionImgCID)
        // PIN CONTRACT METADATA
        await pinNftMetadata(collectedData, pinTimestamp, previewImgCID, bookCID)
        
        setLoadingState(3)
        updateSteps(3)
        setMintOptions({
          amount: Number.parseInt(amountRef.current.value),
          maxCopies: Number.parseInt(maxCopiesRef.current.value) < Number.parseInt(amountRef.current.value) ? Number.parseInt(amountRef.current.value) : Number.parseInt(maxCopiesRef.current.value),
          collectionName: collectionNameRef.current.value,
          royaltyFeesInBips: (Number.parseInt(royaltyFeeInBipsRef.current.value) * 100) || 0,
        })
        setReadyToMint(true)
        setCreationStatus("Ready to mint NFT !")
      } else {
        setLoadingState(1.9)
        updateSteps(1, true)
        setCreationStatus("Fatal error during building. Please cancel and retry.")
      }

    } catch (error) {
      console.log(error);
      setIsFatalError(true)
      setErrorCreation(prevState => prevState + ` ==> ${error}`)
    }
  }
  //! Step 3: Create contract & Mint NFT (server side)
  const mintNewNFTBook = async (e) => {
    e.preventDefault()
  }
  console.log("mint options:", mintOptions);
  
  //? ====================== USER NOT AUTHENTICATED ==================================================================================

  //! Redirect unauthenticated users to login page
  useEffect(() => {
    if (!isAuthenticated && !isAuthUndefined) {
      router.push("/login")
    }
  })


  //? ====================== USER IS NOT AUTHOR OR EDITOR ==================================================================================

  if (isAuthenticated && isCreator === false && !isLoading) {
    return (
      <div className="py-16 flex flex-col items-center space-y-5">
        <h2 className="">This account is not registered as Author or Editor. Please register before publishing your NFT Book</h2>
        <Link href="/register">
          <a className="py-2 px-6 border border-gray-700 text-gray-700 hover:text-gray-800">Register as Author/Editor</a>
        </Link>
      </div>
    )
  }


  //? ====================== USER IS A CREATOR BUT NOT PREMIUM ==================================================================================

  if (isAuthenticated && !isAuthUndefined && isCreator && !creatorInfos.isPremium && !isLoading) {
    return (
      <div className="mx-auto py-32 min-h-full w-full max-w-7xl flex flex-col justify-center items-center text-center">
        <h3 className="text-4xl text-gray-700 font-bold">This account is not Premium</h3>
        <p className="mt-3 max-w-xl text-base text-gray-500">Sorry, it seems your author/editor account is not premium. If it is not the case please contact our support.</p>
        <div className="mt-12 flex space-x-8">
          <Link href="/contact" >
            <a className="relative w-44 inline-flex justify-center items-center px-3.5 py-2 rounded border border-transparent bg-gray-500 text-sm text-white font-medium hover:bg-gray-600">Contact support</a>
          </Link>
          <Link href="/account" >
            <a className="relative w-44 inline-flex justify-center items-center px-3.5 py-2 rounded border-2 border-gray-500 bg-transparent text-sm text-gray-500 font-medium hover:border-gray-600 hover:text-gray-600">Check status</a>
          </Link>
        </div>
      </div>
    )
  }


  //? ====================== USER IS CERTIFIED AUTHOR OR EDITOR ==================================================================================
  
  if (isAuthenticated && isCreator && creatorInfos.isPremium && !isLoading) {
    return (
      <div className="relative pb-40 mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-5xl">
          
          {errorFields && 
            <ErrorArrayMessage
              isOpen={isOpenErrorFields}
              setIsOpen={setIsOpenErrorFields}
              errorArray={errorFields}
              setErrorArray={setErrorFields}
            />
          }
          { errorCreation && 
            <ErrorCreationMessage 
              error={errorCreation} 
              setError={setErrorCreation} 
              deleteAllFiles={deleteAllFilesIPFS} 
              loadingState={loadingState}
            /> 
          }

          <form 
            action=""
            onSubmit={checkRequiredFields}
            className="flex flex-col"
          >
            
            {/* :FIELDS CONTAINER */}
            <div className={`${loadingState > 0 ? "hidden" : "flex flex-col"}`}>

              <div className="self-center text-center uppercase">
                <span className="block sm:text-lg text-gray-500 font-bold uppercase">{format}</span>
                <h1 className="block text-2xl sm:text-3xl lg:text-4xl text-gray-700 font-extrabold">New Contract & Book</h1>
                <span className="inline-block w-40 h-0.5 bg-teal-500 opacity-30" />
              </div>

              <div className="relative mt-16 ">
                <h2 className="py-5 text-xl text-teal-500 font-semibold">Create Your NFT Book</h2>
                <span className="absolute inset-0 text-7xl text-teal-500 font-black uppercase opacity-10">Step 1</span>
                <CreateNFTBook
                  images={images}
                  setImages={setImages}
                  format={format}
                  extension={extension}
                  size={size}
                  canvasBgRef={canvasBgRef}
                  insideCoverRef={insideCoverRef}
                  insideBackRef={insideBackRef}
                  pagesColorRef={pagesColorRef}
                />
              </div>

              <div className="relative mt-16 border-t-2 border-dotted border-teal-500 border-opacity-20">
                <h2 className="py-5 text-xl text-teal-500 font-semibold">Upload Preview Image</h2>
                <span className="absolute inset-0 text-7xl text-teal-500 font-black uppercase opacity-10">Step 2</span>
                <PreviewImage
                  images={images}
                  setImages={setImages}
                />
              </div>

              <div className="relative mt-16 border-t-2 border-dotted border-teal-500 border-opacity-20">
                <h2 className="py-5 text-xl text-teal-500 font-semibold">New Collection Details</h2>
                <span className="absolute inset-0 text-7xl text-teal-500 font-black uppercase opacity-10">Step 3</span>
                <DetailsCollection
                  collectionNameRef={collectionNameRef}
                  collectionDescRef={collectionDescRef}
                  collectionLinkRef={collectionLinkRef}
                  images={images}
                  setImages={setImages}
                />
              </div>

              <div className="relative mt-16 border-t-2 border-dotted border-teal-500 border-opacity-20">
                <h2 className="py-5 text-xl text-teal-500 font-semibold">NFT Book Details</h2>
                <span className="absolute inset-0 text-7xl text-teal-500 font-black uppercase opacity-10">Step 4</span>
                <DetailsNFTBook
                  format={format}
                  size={size}
                  titleRef={titleRef}
                  authorNameRef={authorNameRef}
                  editorNameRef={editorNameRef}
                  serieRef={serieRef}
                  tomeRef={tomeRef}
                  descriptionRef={descriptionRef}
                  externalUrlRef={externalUrlRef}
                  languageRef={languageRef}
                  category1Ref={category1Ref}
                  category2Ref={category2Ref}
                  specialEditionRef={specialEditionRef}
                  publishingRights={publishingRights}
                  setPublishingRights={setPublishingRights}
                  amountRef={amountRef}
                  maxCopiesRef={maxCopiesRef}
                  royaltyFeeInBipsRef={royaltyFeeInBipsRef}
                />
              </div>

            </div>

            {/* :BUILDING STATUS */}
            <div className={`
              pt-5 text-center 
              ${loadingState === 0 ? "hidden" : "flex flex-col"}
            `}>
              {isFatalError 
                ? <>
                    <h2 className="flex justify-center items-center text-5xl text-gray-700 font-bold">
                      <XIcon className="relative top-1 mr-3 w-12 h-12" />
                      Creation Failed
                    </h2>
                    <p className="mt-5 mx-auto max-w-lg text-gray-500">Something went wrong during the creation process... In order to help us clean this problem please click on &ldquo;Cancel&rdquo; below.</p>
                  </>
                : <>
                    <h2 className="text-5xl text-gray-700 font-bold">Do not close this window</h2>
                    <p className="mt-5">PubliRare Factory is currently creating your NFT Book.</p>
                  </>
              }
              <p className="mt-2 text-sm text-teal-400 font-medium">{`Current status: ${creationStatus}`}</p>
              <FactoryCreationStatus 
                steps={steps}
                nftInfos={nftInfos}
                loadingStatus={loadingState}
                isFatalError={isFatalError}
              />
            </div>
            
            {/* :ACTION BUTTONS */}
            <div className="mt-5 flex flex-wrap justify-center items-center">
              {/* ::Cancel Before Minting */}
              { (loadingState === 3 || isFatalError) &&
                  <button
                    type="button"
                    onClick={cancelCreation}
                    disabled={loadingState > 3 || loadingState < 1.9}
                    className="relative m-3 inline-flex justify-center items-center px-7 py-3.5 min-w-[160px] h-16 text-2xl text-red-700 font-bold tracking-wide underline hover:text-gray-800 disabled:cursor-wait"
                  >
                    { loadingState < 1.9 && <ClockIcon className="mr-3 w-7 h-7 text-red-700" /> }
                    Cancel
                  </button>
              }
              {/* ::Create */}
              { loadingState < 3 && loadingState !== 1.9 && !isFatalError &&
                <button 
                  type="submit"
                  disabled={loadingState !== 0}
                  className="relative m-3 inline-flex justify-center items-center px-7 py-3.5 min-w-[160px] h-16 border border-transparent rounded-2xl bg-teal-400 text-2xl text-white font-bold tracking-wide hover:bg-teal-500"
                >
                  <span className={`mr-2 ${loadingState !== 0 ? "block" : "hidden"}`}>
                    <Image
                      src={loader}
                      alt="loading spinner"
                      width={40}
                      height={40}
                    />
                  </span>
                  {loadingState !== 0 && loadingState < 4
                    ? "Please Wait..."
                    : "Create"
                  }
                </button>
              }
              {/* ::Mint */}
              { readyToMint && !isFatalError &&
                <FuncWriteCreateNewNftBook 
                  name="createNewNFTBook"
                  amount={mintOptions.amount}
                  maxCopies={mintOptions.maxCopies}
                  royaltyFeesInBips={mintOptions.royaltyFeesInBips}
                  uri={`https://gateway.pinata.cloud/ipfs/${nftInfos.metadataCID}/`}
                  contractURI={`https://gateway.pinata.cloud/ipfs/${nftInfos.contractMetadataCID}/`}
                  collectionName={mintOptions.collectionName}
                  className="relative m-3 inline-flex justify-center items-center px-7 py-3.5 min-w-[160px] h-16 border border-transparent rounded-2xl bg-sky-400 text-2xl text-white font-bold tracking-wide hover:bg-sky-500"
                >
                  Mint
                </FuncWriteCreateNewNftBook>
              }
            </div>

            {/* :LINK TO LIVE PREVIEW BOOK */}
            {loadingState > 1.9 && !isFatalError &&
              <p className="mt-10 flex flex-col items-center text-base text-gray-500 font-semibold">
                <span>Preview Live NFT Book:</span>
                {nftInfos.nftbookCID
                  ? <a 
                      href={`https://gateway.pinata.cloud/ipfs/${nftInfos.nftbookCID}/`}
                      target="__blank"
                      className="mt-1 inline-flex items-center text-sm text-sky-500 font-medium underline hover:text-sky-600"
                    >
                      LIVE PREVIEW BOOK
                      <ExternalLinkIcon className="ml-2 w-4 h-4 text-teal-500" />
                    </a>
                  : <span className="ml-1 inline-flex items-center text-sm text-gray-300 font-semibold">
                      Awaiting...
                      <ClockIcon className="ml-2 w-5 h-5 text-gray-300" />
                    </span>
                }
              </p>
            }

          </form>

          <FactoryCreationConfirmation 
            isOpen={isOpenValidation}
            setIsOpen={setIsOpenValidation}
            start={pinNewNFTBook}
            loadingState={loadingState}
          />
          
        </div>
      </div>
    )
  }


  //? ====================== LOADING... ==================================================================================
  
  return (
    <div className="lg:p-20 flex flex-col justify-center items-center space-y-3">
      <Image 
        src={loader}
        alt="loading spinner"
      />
      <Link href="/">
        <a className="mt-10 text-gray-500 underline hover:text-gray-700">Return to Homepage</a>
      </Link>
    </div>
  )
};


Create.getLayout = function getLayout(page) {
  return (
    <LayoutNFTCreate>
      {page}
    </LayoutNFTCreate>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['navigation', 'footer']),
  },
})