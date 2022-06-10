import React from 'react'
import InputNumber from "../../Forms/InputNumber"
import InputTextLg from "../../Forms/InputTextLg"


const DetailsNFTBook = ({ format, size, titleRef, authorNameRef, editorNameRef, serieRef, tomeRef, descriptionRef, externalUrlRef, languageRef, category1Ref, category2Ref, specialEditionRef, setpublishingRights }) => {

  return (
    <div className="relative py-5 grid grid-cols-1 lg:grid-cols-10 gap-x-10 gap-y-10">

      <div className="col-span-full flex items-center space-x-10">
        {/* :BOOK FORMAT */}
        <span className="flex flex-col">
          <p className="px-1 text-sm text-gray-400 font-bold">Format</p>
          <span className="mt-2 px-5 py-1 w-full block shadow-sm rounded-2xl border-none bg-gray-100 text-base text-gray-500 capitalize">{format}</span>
        </span>
        {/* :BOOK SIZE */}
        <span className="flex flex-col">
          <p className="px-1 text-sm text-gray-400 font-bold">Size</p>
          <span className="mt-2 px-5 py-1 w-full block shadow-sm rounded-2xl border-none bg-gray-100 text-base text-gray-500 capitalize">{size}</span>
        </span>
      </div>

      {/* :COLLECTION NAME */}
      <span className="col-span-4 max-w-md">
        <InputTextLg 
          name="Book Title"
          id="book-title"
          inputRef={titleRef}
          placeholder="My Incredible #1 book"
          required={true}
          details="Title of your first NFT book in your new collection"
        />
      </span>

      {/* :AUTHOR NAME */}
      <span className="col-span-3 max-w-md">
        <InputTextLg 
          name="Author Name"
          id="author-name"
          inputRef={authorNameRef}
          placeholder="Jane Doe"
          required={true}
          details="The author of the book"
        />
      </span>

      {/* :EDITOR NAME */}
      <span className="col-span-3 max-w-md">
        <InputTextLg 
          name="Editor Name"
          id="editor-name"
          inputRef={editorNameRef}
          placeholder="Rare Editions"
          required={false}
          details="The author of the book"
        />
      </span>

      {/* :SERIE TITLE */}
      <span className="col-span-4 max-w-md">
        <InputTextLg 
          name="Serie Title"
          id="serie-title"
          inputRef={serieRef}
          placeholder="Harry Potter Serie"
          required={false}
          details="The serie to which the book belongs"
        />
      </span>

      {/* :TOME */}
      <span className="col-span-3 max-w-md">
        <InputNumber 
          name="Tome"
          id="tome"
          inputRef={tomeRef}
          placeholder="Tome 1"
          required={false}
          details="Tome number in the current serie"
        />
      </span>

      {/* :LANGUAGE */}
      <span className="col-span-3 max-w-md">
        <InputTextLg 
          name="Book Language"
          id="language"
          inputRef={languageRef}
          placeholder="i.e: 'EN' for english version"
          required={true}
          maxlength={2}
          details="Language version of the book"
        />
      </span>

      {/* :EXTERNAL LINK TO WEB3 BOOK */}
      <span className="col-span-full">
        <InputTextLg 
          name="External link (to your book)"
          id="external-link"
          inputRef={externalUrlRef}
          placeholder="https://web3-books.com/mybook/..."
          required={true}
          details="As you are building a NFT book this URL should be linked to the actual ebook and allow owners of the NFT to read the actual book. You are also welcome to link to your own webpage with more details."
        />
        <p className="mt-3 text-base text-gray-500 font-medium">
          Discover&#160;
          <a href="#link" target="__blank" className="text-sky-500 font-semibold underline hover:text-sky-600">Web3-Books</a>
          , a free solution to store your ebooks and linked them to your smart contracts to allow <b>ONLY owners of this NFT</b> to read your book.</p>
      </span>

      {/* :NFT BOOK DESCRIPTION */}
      <div className="col-span-full max-w-4xl">
        <span className="flex justify-between">
          <label htmlFor="book-description" className="px-1 text-sm text-gray-500 font-bold">NFT BOOK Description</label>
          <span className="text-xs text-gray-400 font-medium italic">(optional)</span>
        </span>
        <p className="my-2 text-xs text-gray-400 font-semibold">The description will be included on the item&apos;s detail page underneath its image. 0 of 1000 characters used.</p>
        <textarea 
          ref={descriptionRef} 
          name="book-description" 
          id="book-description" 
          cols="30" rows="8"
          maxLength={1000}
          placeholder=""
          className="form-textarea resize-none w-full shadow-sm rounded border-gray-300 bg-gray-50 placeholder-gray-300 focus:border-teal-500 focus:ring-teal-500"
        ></textarea>
      </div>

    </div>
  )
}

export default DetailsNFTBook
