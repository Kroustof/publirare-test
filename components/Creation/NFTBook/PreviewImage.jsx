import React, { useState } from 'react'
import { ExternalLinkIcon, InformationCircleIcon } from "@heroicons/react/outline"
import FileUpload from "./FileUpload"


const PreviewImage = ({ images, setImages }) => {

  const [showInstruction, setShowInstruction] = useState(false)

  return (
    <div className="relative py-5 flex flex-col md:flex-row items-center md:items-start">
      
      {/* :PREVIEW IMAGE */}
      <div className="flex-shrink-0 md:mr-10 lg:mr-20 w-40 sm:w-56 md:w-72">
        <FileUpload
          id="previewImage"
          images={images}
          setImages={setImages}
          inputName="Preview Image"
          required={true}
          accept=".png, .jpg, .webp, .gif"
          details="PNG, JPEG, WEBP or GIF only (500 Ko MAX)"
          maxSize={500} // in Ko
        />
      </div>


      {/* :INFORMATIONS */}
      <div className="pt-5 md:pt-0 md:pl-5 md:border-l border-gray-200">
        {/* ::Title */}
        <h3 className="mb-4 flex items-center text-lg text-gray-500 font-semibold">
          <InformationCircleIcon className="mr-2 w-6 h-6" />
          Informations
        </h3>
        {/* ::Infos */}
        <p className="text-xs sm:text-sm text-gray-500">Because NFT Books are interactive, you need to provide an image (PNG, JPG, or WEBP) for the card display of your item. As a preview image you can choose a custom image or (and this is advisable) use a picture of the NFT model you just built above. <br /> 
        To use an image of the book you just designed you will need to do a screenshot of it, download it to your computer and then upload it here as preview image. <br /> <br />
        <b>Click below for instructions on your browser screenshot methods.</b>
        </p>
        {/* ::Button */}
        <div className="mt-5 flex items-center">
          <span className="w-full h-px bg-gray-200" />
          <button
            type="button"
            onClick={() => setShowInstruction(!showInstruction)}
            className="flex-shrink-0 mx-0 py-2 w-40 border border-gray-200 rounded-full text-sm text-teal-500 font-semibold uppercase hover:border-teal-500 hover:bg-teal-500 hover:text-white"
          >
            {showInstruction ? "Ok, I got it!" : "How to do it?"}
          </button>
          <span className="w-full h-px bg-gray-200" />
        </div>
        {/* ::Instructions */}
        <div className={`
          ${showInstruction ? "block" : "hidden"}
          mt-5 grid grid-cols-1 lg:grid-cols-2 gap-y-5 gap-x-10 transition-all duration-200 ease-in
        `}>
          {/* :::firefox */}
          <div className="col-span-1">
            <span className="block text-base text-gray-500 font-bold underline">Firefox:</span>
            <p className="block text-xs text-gray-500">Firefox has a built-in function to do screenshot on web page. Follow these steps:</p>
            <ul className="mt-2 list-decimal list-inside text-sm text-gray-500 font-semibold">
              <li>Right click on this page.</li>
              <li>Click on &laquo;Take a screenshot&raquo;.</li>
              <li>Crop the image of your NFT Book Preview on the page and save it.</li>
              <li>Upload the preview image right here.</li>
            </ul>
          </div>
          {/* :::chrome */}
          <div className="col-span-1">
            <span className="block text-base text-gray-500 font-bold underline">Chrome:</span>
            <p className="block text-xs text-gray-500">
              Chrome does not have a built-in function to do screenshots. So you need to install an add-on in your browser. You have multiple solutions available, here are the most popular: &#160;
              <span>
                <a href="https://chrome.google.com/webstore/detail/nimbus-screenshot-screen/bpconcjcammlapcogcnnelfmaeghhagj" target="_blank" rel="noopener noreferrer" className="mr-2 inline-flex items-center underline">Nimbus Screenshot <ExternalLinkIcon className="ml-0.5 w-3 h-3 text-gray-400" /></a>
                <a href="https://chrome.google.com/webstore/detail/awesome-screenshot-screen/nlipoenfbbikpbjkfpfillcgkoblgpmj" target="_blank" rel="noopener noreferrer" className="mr-2 inline-flex items-center underline">Awesome Screenshot <ExternalLinkIcon className="ml-0.5 w-3 h-3 text-gray-400" /></a>
                <a href="https://chrome.google.com/webstore/detail/take-webpage-screenshots/mcbpblocgmgfnpjjppndjkmgjaogfceg" target="_blank" rel="noopener noreferrer" className="mr-2 inline-flex items-center underline">Fireshot <ExternalLinkIcon className="ml-0.5 w-3 h-3 text-gray-400" /></a>
                <a href="https://chrome.google.com/webstore/detail/lightshot-screenshot-tool/mbniclmhobmnbdlbpiphghaielnnpgdp" target="_blank" rel="noopener noreferrer" className="mr-2 inline-flex items-center underline">Lightshot <ExternalLinkIcon className="ml-0.5 w-3 h-3 text-gray-400" /></a>
              </span>
            </p>
            <ul className="mt-2 list-decimal list-inside text-sm text-gray-500 font-semibold">
              <li>Install the add-on.</li>
              <li>In your browser taskbar click on the new add-on icon and select &laquo;Take a screenshot&raquo;.</li>
              <li>Crop the image of your NFT Book Preview on the page and save it.</li>
              <li>Upload the preview image right here.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}

export default PreviewImage
