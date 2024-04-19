import React from 'react'
import convert from 'color-convert';

const ColourCard = ({ color, hex }) => {

  const rgb = convert.hex.rgb(hex);
  const hsl = convert.hex.hsl(hex);
  
  const colorStyle = {
    backgroundColor: `${hex}`,
  };

  return (
    <tr className=' overflow-auto text-sm  mb-4 font-semibold'>
     <td className='flex'><span className="inline-block w-5 h-5 rounded-sm mr-2" style={colorStyle}></span><h1>{color}</h1></td>
    <td>{hex}</td>
    <td>{`${rgb.join(', ')}`}</td>
    <td>{`${hsl.join(', ')}`}</td>
  </tr>
  )
}

export default ColourCard;