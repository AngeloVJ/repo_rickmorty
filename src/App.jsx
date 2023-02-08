import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import LocationInfo from './components/LocationInfo'
import ResidentInfo from './components/ResidentInfo'
import getRandomLocation from './utils/getRandomLocation'
import ReactPaginate from 'react-paginate';

function App() {

  const [location, setLocation] = useState()
  const [numberLocation, setNumberLocation] = useState(getRandomLocation())
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    axios.get(`https://rickandmortyapi.com/api/location/${numberLocation}`)
      .then(res => {
        setLocation(res.data)
        setHasError(false)
      })
      .catch(err => {
        console.log(err)
        setHasError(true)
      })
  }, [numberLocation])


  const handleSubmit = e => {
    e.preventDefault()
    if (e.target.inputLocation.value.trim().length === 0) {
      setNumberLocation(getRandomLocation())
    } else {
      setNumberLocation(e.target.inputLocation.value.trim())
    }
    e.target.inputLocation.value = e.target.inputLocation.value.trim()
  }

//Codigo para paginacion
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 6;
  console.log(currentItems)

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(location?.residents.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(location?.residents.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, location?.residents])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % location?.residents.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="app">

      <img className='app__gif' src="https://www.icegif.com/wp-content/uploads/2022/06/icegif-514.gif" alt="" />
      <form className='form' onSubmit={handleSubmit}>
        <input
          className='form__input'
          placeholder='Enter location ID'
          id='inputLocation'
          type="text"
        />
        <button className='form__btn'>Search</button>
      </form>

      {
        (hasError) ?
          <>
            <h2 className='app__error'>¡Not found! Enter an ID (1 to 126)</h2>
            <img className='img__error' src="error.png" alt="" />
          </>
          :
          <>
            <LocationInfo location={location} />

            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="<"
              renderOnZeroPageCount={null}
              containerClassName='pagination'
              pageLinkClassName='page-num'
              previousLinkClassName='page-num'
              nextLinkClassName='page-num'
              activeLinkClassName='active'
            />

            <div className='residents__container'>
              {
                currentItems?.map(url => (
                  <ResidentInfo
                    key={url}
                    url={url}
                  />
                ))
              }
            </div>
          </>
      }
    </div>
  )
}
export default App
