import React from 'react'


const InputTextLg = ({ name, id, placeholder, inputRef, required, details, maxlength = "" }) => {
  return (
    <span className="relative">
      <span className="flex justify-start items-center space-x-4">
        {/* ::Label */}
        <label htmlFor={id} className="px-1 text-sm text-gray-500 font-bold">{name}</label>
        {/* ::Requirement */}
        <span className={`${required ? "text-red-700" : "text-gray-400"} text-xs font-medium italic`}>
          {required ? "(required)" : "(optional)"}
        </span>
      </span>
      {/* ::Details */}
      <p className="mt-2 text-xs text-gray-400 font-semibold">{details}</p>
      {/* ::Input */}
      <input 
        type="text" 
        ref={inputRef}
        id={id} 
        name={id}
        required={required}
        placeholder={placeholder}
        maxLength={maxlength}
        className="form-input mt-2 px-5 py-2.5 w-full block shadow-sm rounded-2xl border-gray-200 bg-gray-100 text-base placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:bg-white"
      />
    </span>
  )
}

export default InputTextLg
