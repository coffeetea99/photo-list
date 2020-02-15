import React, { useState, useEffect } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import './MainPage.css';
import clipImageNotSelected from './on-ing.png';
import clipImageSelected from './blue.png';

const MainPage = () => {
  const [doneLoading, setDoneLoading] = useState(false)     //done loading all photos
  const [URINumber, setURINumber] = useState(1);          //number of photo list data from server

  const [photos, setPhotos] = useState([]);     //list of photos
  const [clippedOnly, setClippedOnly] = useState(false);

  const [clipData, setClipData] = useState();

  useEffect(() => {
    getNextPhotoList();
    setClipData(localStorage);
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

  const modifyClip = (id) => {
    //console.log(id);
    //console.log(localStorage.getItem(id));
    //console.log(localStorage.getItem(id) === null);
    //console.log(clipData[id]);
    //console.log(clipData[id] === undefined);
    
    if ( clipData[id] === undefined ) {    //unClipped => clipped
      const newClipData = {...clipData};
      newClipData[id] = "true";
      setClipData(newClipData);

      localStorage.setItem(id, true);
    } else {                          //clipped => unClipped
      const newClipData = {...clipData};
      delete newClipData[id];
      setClipData(newClipData);

      localStorage.removeItem(id);
    }
  }

  let photoList = photos.map(
    (photo, index) => {
      return(
        <div className="photo" key={index}>
          <div className="upper">
            <img className="profile-image" src={photo.profile_image_url} />
            <span className="writer">{photo.nickname}</span>
          </div>
          <img className="image" src={photo.image_url} />
          <img className="clip-image" src={clipData[photo.id] === "true" ? clipImageSelected : clipImageNotSelected} onClick={()=>{modifyClip(photo.id)}} />
        </div>
      );
    }
  );

  /* -------------------- */
  /* render */

  return (
    <>
      <div id="clip">
        <Checkbox
          checked={clippedOnly}
          onChange={(event)=>setClippedOnly(event.target.checked)}
          color="primary"
        />
        <span id="clip-message">스크랩한 것만 보기</span>
      </div>
      {photoList}
    </>
  )

}

export default MainPage;