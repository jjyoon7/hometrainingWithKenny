import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../../Context'

import './usePagination.css'

export default function usePagination(totalPageNum, perPage) {
    const [ paginationNumbersView, setPaginationNumbersView ] = useState(null)
    const { setCurrentPage, exerciseArr, currentPage } = useContext(Context)

    const paginate = (pageNumberValue) => {
        setCurrentPage(pageNumberValue)
    }

    useEffect(() => {
        const pageNumbers = []

        for(let i = 1; i <= Math.ceil(totalPageNum / perPage); i++) {
            pageNumbers.push(i)
        }
    
        const paginationLinks = pageNumbers.map(number => {
            if(number === currentPage) {
                return <li key={number} className="pagination-number-item" >
                    <a className={`pagination-button pagination-button-clicked`} onClick={() => paginate(number)}>{number}</a>
                </li>
            }
            return <li key={number} className="pagination-number-item" >
                      <a className={`pagination-button`} onClick={() => paginate(number)}>{number}</a>
                  </li>
        })

        setPaginationNumbersView(paginationLinks)
        //re-render pagenumber if there is a change in exerciseArr or favExerciseArr
        //which means the total number in array has been changed.
    }, [ totalPageNum, exerciseArr ])
    

    return(
        <div className="pagination-div">
            <ul className="pagination">
                {paginationNumbersView}
            </ul> 
        </div>
    )
}