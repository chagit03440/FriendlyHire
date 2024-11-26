import Link from 'next/link'
import React from 'react'

interface ButtonLinkProps {
  href: string;
  text: string;

}

const ButtonLink: React.FC<ButtonLinkProps> = ({ href, text }) => {
  return (

    <Link href={href}>
      <button className='mt-4 px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md'>
        {text}
      </button>
    </Link>
  )

}



export default ButtonLink
