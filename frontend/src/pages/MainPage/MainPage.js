import React, { useState, useEffect } from 'react';
import './MainPage.css';

const MainPage = () => {
  const [doneLoading, setDoneLoading] = useState(false)     //done loading all photos
  const [URINumber, setURINumber] = useState(1);          //number of photo list data from server

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    getNextPhotoList();
  }, []);

  /* -------------------- */
  /* sending queries */

  const getNextPhotoList = async () => {
    const targetURI = `https://s3.ap-northeast-2.amazonaws.com/bucketplace-coding-test/cards/page_${URINumber}.json`;
    const res = await fetch(targetURI, {
      method: 'GET',
    });
    const newPhotos = await res.json();
    setURINumber(URINumber+1);

    setPhotos(photos.concat(newPhotos));
  }

  /* -------------------- */
  /* visualize photo data */

  let photoList = photos.map(
    (photo, index) => {
      return(
        <div className="photo">
          <div className="upper">
            <img className="profile-image" src={photo.profile_image_url} />
            <text className="writer">{photo.nickname}</text>
          </div>
          <img className="image" src={photo.image_url} />
        </div>
      )
    }
  )

  /* -------------------- */
  /* render */

  return (
    <>
      {photoList}
    </>
  )

}

export default MainPage;