import { useEffect, useState } from 'react';

import ImageGallery from './ImageGallery/ImageGallery';
import Searchbar from './Searchbar/Searchbar';
import * as API from '../services/apiService';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import { Container } from './App.styled';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PER_PAGE = 200;

const App = () => {
  const [searchQuery, setsearchQuery] = useState('');
  const [images, setimages] = useState([]);
  const [page, setpage] = useState(1);
  const [isLoadMore, setisLoadMore] = useState(false);
  const [isLoader, setisLoader] = useState(false);
  const [isShowModal, setisShowModal] = useState(false);
  const [largeImageURL, setlargeImageURL] = useState('');

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }
    setisLoader(true);
    setisLoadMore(false);
    getImages(searchQuery, page, PER_PAGE);
  }, [searchQuery, page]);

  const handleSubmit = searchQuery => {
    setsearchQuery(searchQuery);
    setimages([]);
    setpage(1);
  };

  const getImages = async (query, page, PER_PAGE) => {
    try {
      const { hits, totalHits } = await API.getData(query, page, PER_PAGE);

      if (hits.length === 0) {
        setisLoader(false);
        toast.error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      setimages(prevState => [...prevState, ...hits]);
      const totalPages = Math.ceil(totalHits / PER_PAGE);

      setisLoadMore(page < totalPages);

      if (page === 1) {
        toast.info(`Hooray! We found ${totalHits} images.`);
      } else if (page === totalPages) {
        toast.warn(
          "We're sorry, but you've reached the end of search results."
        );
      }
      setisLoader(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadMore = () => {
    setpage(prevState => prevState + 1);
  };

  const showModal = largeImage => {
    setisShowModal(true);
    setlargeImageURL(largeImage);
  };

  const closeModal = () => {
    setisShowModal(false);
  };

  return (
    <>
      <Container>
        <Searchbar onSubmit={handleSubmit} />
        <ImageGallery images={images} onClick={showModal} />
        {isLoadMore && <Button onClick={loadMore} />}
        {isLoader && <Loader />}
        {isShowModal && (
          <Modal largeImage={largeImageURL} onClose={closeModal} />
        )}
        <ToastContainer autoClose={3000} />
      </Container>
    </>
  );
};

export default App;
