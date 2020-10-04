import React, { useContext } from 'react'
import { Context } from '../Context'
import DropdownOption from './DropdownOption'

export default function SortByKeywordForm() {
    const { sortByKeywordArr, setSortByKeyword, sortByKeyword } = useContext(Context)
    const sortByItem = sortByKeywordArr.map(item => <DropdownOption key={item} item={item} text=''/>)
    const onChangeSortBy = e => setSortByKeyword(e.target.value)
        
    return (
            <div className="list-sort-select-div">
                <select required
                    className="list-sort-select"
                    value = {sortByKeyword}
                    onChange={onChangeSortBy}
                >
                    <option value={""}>sort by</option>
                    {sortByItem}
                </select>
            </div>
    )
}