import React from 'react'
import InputTextLg from "../../Forms/InputTextLg"
import FileUpload from "./FileUpload"


const DetailsCollection = ({ collectionNameRef, collectionDescRef, collectionLinkRef, images, setImages }) => {
  return (
    <div className="relative py-5 grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">

      {/* :COLLECTION IMAGE */}
      <div className="col-span-full flex flex-col-reverse sm:flex-row">
        <div className="flex-shrink-0 relative m-2 w-40 sm:w-56">
          <FileUpload
            id="collectionImage"
            images={images}
            setImages={setImages}
            inputName=""
            required={true}
            accept=".png, .jpg, .webp, .gif"
            details="PNG, JPEG, WEBP or GIF only (500 Ko MAX)"
            maxSize={500} // in Ko
          />
        </div>
        <div className="sm:ml-10 py-5 sm:max-w-md">
          <p className="px-1 text-sm text-gray-500 font-bold">Collection Image</p>
          <p className="mt-2 text-xs sm:text-sm text-gray-400 font-medium">This image will be used for featuring your collection on the homepage, category pages, navigation or other promotional areas. 600 x 600 recommended.</p>
        </div>
      </div>
      
      {/* :COLLECTION NAME */}
      <span className="col-span-1 max-w-xl">
        <InputTextLg 
          name="Collection Name"
          id="collection-name"
          inputRef={collectionNameRef}
          placeholder="My Awesome Book Serie"
          required={true}
          details="You can organise your collection by serie of books or by authors (if you are an editor)."
        />
      </span>

      {/* :COLLECTION Link */}
      <span className="col-span-1 max-w-xl">
        <InputTextLg 
          name="External Link"
          id="collection-link"
          inputRef={collectionLinkRef}
          placeholder="https://your-author-blog/my-collection"
          required={false}
          details="URL to your author/editor blog or website."
        />
      </span>

      {/* :COLLECTION DESCRIPTION */}
      <div className="col-span-full max-w-4xl">
        <span className="flex justify-between">
          <label htmlFor="collection-description" className="px-1 text-sm text-gray-500 font-bold">Collection Description</label>
          <span className="text-xs text-gray-400 font-medium italic">(optional)</span>
        </span>
        <p className="my-2 text-xs text-gray-400 font-semibold">Markdown syntax is supported. 0 of 1000 characters used.</p>
        <textarea 
          ref={collectionDescRef} 
          name="collection-description" 
          id="collection-description" 
          cols="30" rows="8"
          maxLength={1000}
          placeholder=""
          className="form-textarea resize-none w-full shadow-sm rounded border-gray-300 bg-gray-50 placeholder-gray-300 focus:border-teal-500 focus:ring-teal-500"
        ></textarea>
      </div>

    </div>
  )
}

export default DetailsCollection
