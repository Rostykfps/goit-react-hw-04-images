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

const PER_PAGE = 12;

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }
    setIsLoader(true);
    setIsLoadMore(false);
    getImages(searchQuery, page, PER_PAGE);
  }, [searchQuery, page]);

  const handleSubmit = searchQuery => {
    setSearchQuery(searchQuery);
    setImages([]);
    setPage(1);
  };

  const getImages = async (query, page, PER_PAGE) => {
    try {
      const { hits, totalHits } = await API.getData(query, page, PER_PAGE);

      if (hits.length === 0) {
        setIsLoader(false);
        toast.error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      setImages(prevState => [...prevState, ...hits]);
      const totalPages = Math.ceil(totalHits / PER_PAGE);

      setIsLoadMore(page < totalPages);

      if (page === 1) {
        toast.info(`Hooray! We found ${totalHits} images.`);
      } else if (page === totalPages) {
        toast.warn(
          "We're sorry, but you've reached the end of search results."
        );
      }
      setIsLoader(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const showModal = largeImage => {
    setIsShowModal(true);
    setLargeImageURL(largeImage);
  };

  const closeModal = () => {
    setIsShowModal(false);
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
