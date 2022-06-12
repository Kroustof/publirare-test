import { useState } from 'react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Combobox } from '@headlessui/react'
import { languageISO } from "../../helpers/languageISO"


const InputCombobox = ({ data, label, inputRef, required, details, emptyValue, uppercase = false, language = false, maxLength = "" }) => {
  const [query, setQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState()

  const filteredData =
    query === ''
      ? data
      : data.filter((item) => {
          return item.toLowerCase().includes(query.toLowerCase())
        })

  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <Combobox as="div" value={selectedItem} onChange={setSelectedItem}>
      {/* ::Label */}
      <span className="flex justify-start items-center space-x-4">
        <Combobox.Label className="px-1 block text-sm text-gray-500 font-bold">{label}</Combobox.Label>
        <span className={`${required ? "text-red-700" : "text-gray-400"} text-xs font-medium italic`}>
          {required ? "(required)" : "(optional)"}
        </span>
      </span>
      {/* ::Details */}
      <p className="mt-2 text-xs text-gray-400 font-semibold">{details}</p>
      <div className="relative mt-2">
        {/* ::Input */}
        <Combobox.Input
          ref={inputRef}
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(item) => item}
          required={required}
          maxLength={maxLength}
          className={`
            ${uppercase ? "uppercase" : "normal-case"}
            pl-5 pr-10 py-2.5 w-full rounded-2xl border border-gray-200 shadow-sm bg-gray-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm
          `}
        />
        {/* ::Button */}
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {/* ::Options */}
        {filteredData.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <Combobox.Option
              value=""
              className={({ active, selected }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-8 pr-4',
                    active ? 'bg-gray-700 text-white' : 'text-gray-900',
                    selected ? 'text-gray-400 font-bold' : ''
                  )
                }
            >
              {emptyValue}
            </Combobox.Option>
            {filteredData.map((item, itemIdx) => (
              <Combobox.Option
                key={itemIdx}
                value={item}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-8 pr-4',
                    active ? 'bg-teal-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={classNames('flex justify-between truncate', selected && 'font-semibold', uppercase && 'uppercase')}>
                      {item}
                      {language &&
                        <span className="text-xs text-gray-400 normal-case">{`(${languageISO[item]})`}</span>
                      }
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 left-0 flex items-center pl-1.5',
                          active ? 'text-white' : 'text-teal-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}

export default InputCombobox
