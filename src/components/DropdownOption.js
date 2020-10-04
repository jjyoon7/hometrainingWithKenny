import React from 'react'

export default function DropdownOption({item, text}) {
    return (
        <option
            key={item}
            value={item}
            >
              {item} {text}
        </option>
    ) 
}