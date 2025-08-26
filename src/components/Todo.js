import React from 'react'
import { fontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export const Todo = () => {
  return (
    <div className='Todo'>
        <p>Go to School</p>
        <div>
            <fontAwesomeIcon icon={faPenToSquare} />
            <fontAwesomeIcon icon={faTrash} />
        </div>
    </div>
  )
}
