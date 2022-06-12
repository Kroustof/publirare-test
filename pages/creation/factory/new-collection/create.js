import { useEffect, useRef, useState } from "react"
import LayoutNFTCreate from "../../../../components/Layout/LayoutNFTCreate"
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import Image from 'next/image'
import loader from '../../../../public/loader.gif'
import { useMoralis } from "react-moralis"
import { useRouter } from 'next/router'
import { useMoralisDapp } from "../../../../providers/MoralisDappProvider/MoralisDappProvider"
import CreateNFTBook from "../../../../components/Creation/NFTBook/CreateNFTBook"
import PreviewImage from "../../../../components/Creation/NFTBook/PreviewImage"
import DetailsCollection from "../../../../components/Creation/NFTBook/DetailsCollection"
import DetailsNFTBook from "../../../../components/Creation/NFTBook/DetailsNFTBook"
import ErrorArrayMessage from "../../../../components/Alerts/ErrorArrayMessage"
import FactoryCreationStatus from "../../../../components/Creation/Factory/FactoryCreationStatus"
import { CloudUploadIcon, CogIcon, DocumentAddIcon, SpeakerphoneIcon } from "@heroicons/react/outline"


export default function Create() {

  const router = useRouter()
  const { format, extension, size } = router.query
  const { isAuthenticated, isAuthUndefined, chainId } = useMoralis()
  const { isCreator, creatorInfos, isLoading } = useMoralisDapp()
  const [isOpenValidation, setIsOpenValidation] = useState(false)
  const [isOpenErrorFields, setIsOpenErrorFields] = useState(false)
  const [errorFields, setErrorFields] = useState(null)
  const [loadingState, setLoadingState] = useState(1)
  // creation steps ("upcoming" / "completed" / "current")
  const [steps, setSteps] = useState([
    { id: 1, title: "Build NFT Book", icon: CogIcon, status: "upcoming" },
    { id: 2, title: "Pin Metadata to IPFS", icon: CloudUploadIcon, status: "upcoming" },
    { id: 3, title: "Create Smart Contract", icon: DocumentAddIcon, status: "upcoming" },
    { id: 4, title: "Congratulations!", icon: SpeakerphoneIcon, status: "upcoming" }
  ])
  
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
  let openseaGlobalRoyaltyInBips //! REDONDANT Value provide later (seller_fee_basis_points)
  let openseaGlobalRoyaltyBeneficiary //! REDONDANT Value provide later (fee_recipient)
  // book infos
  const formatRef = useRef("") //! ALREADY PROVIDED IN QUERY URL FORMAT
  const titleRef = useRef("") //! metadata + pinata (name)
  const authorNameRef = useRef("") //! pinata
  const editorNameRef = useRef("") //! pinata
  const serieRef = useRef("")
  const tomeRef = useRef("")
  // metadata book
  const descriptionRef = useRef("")
  const externalUrlRef = useRef("") //! Web 3 Book URL
  const languageRef = useRef("") //! attributes
  const category1Ref = useRef("") //! attributes
  const category2Ref = useRef("") //! attributes
  const specialEditionRef = useRef("") //! attributes
  const [publishingRights, setPublishingRights] = useState(null) //! attributes

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
  }


  //! CREATION STEPS
  // Step 1: Check input fields requirements
  const checkRequiredFields = (e) => {
    e.preventDefault()
    setIsOpenValidation(false)
    setErrorFields(null)
    setLoadingState(1)
    let errorsArray = []
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
  // Step 2: Create NFT Book
  const mintNewNFTBook = async (e) => {
    e.preventDefault()
    setLoadingState(2)
    updateSteps(1)
  }
  

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

          <form 
            action=""
            onSubmit={checkRequiredFields}
            className="flex flex-col"
          >
            
            {/* :Fields Container */}
            <div className={`${loadingState > 1 ? "hidden" : "flex flex-col"}`}>

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
                />
              </div>

            </div>

            {/* :Currently Building */}
            <div className="pt-20 text-center">
              <h2 className="text-5xl text-gray-700 font-bold">Do not close this window</h2>
              <p className="mt-5">PubliRare Factory is currently creating your NFT Book. Please wait.</p>
            </div>

            {/* :Submit Button & Status */}
            <div className="mt-16 flex justify-center items-center">
              <button 
                type="submit"
                disabled={loadingState !== 0}
                className="relative m-3 inline-flex justify-center items-center px-7 py-3.5 min-w-[160px] border border-transparent rounded-2xl bg-teal-400 text-2xl text-white font-bold tracking-wide hover:bg-teal-500"
              >
                <span className={`mr-2 ${loadingState !== 0 ? "block" : "hidden"}`}>
                  {loadingState !== 0 &&
                    <Image
                      src={loader}
                      alt="loading spinner"
                      width={40}
                      height={40}
                    />
                  }
                </span>
                {loadingState === 1
                  ? "Checking fields..."
                  : loadingState === 2
                  ? "Build NFT Book"
                  : loadingState === 3
                  ? "Pin Metadata to IPFS"
                  : loadingState === 4
                  ? "Create Smart Contract"
                  : "Create"
                }
              </button>
              <button
                onClick={() => setIsOpenValidation(true)}
                className="relative m-3 inline-flex justify-center items-center px-7 py-3.5 min-w-[160px] border border-transparent rounded-2xl bg-sky-400 text-2xl text-white font-bold tracking-wide hover:bg-sky-500"
              >
                Check Status
              </button>
            </div>

          </form>

          <FactoryCreationStatus 
            isOpen={isOpenValidation}
            setIsOpen={setIsOpenValidation}
            steps={steps}
            setSteps={setSteps}
            start={mintNewNFTBook}
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