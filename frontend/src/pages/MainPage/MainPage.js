import React, { useState, useEffect, useRef } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './MainPage.css';
import clipImageNotSelected from './on-ing.png';
import clipImageSelected from './blue.png';

const MainPage = () => {
  const [doneLoading, setDoneLoading] = useState(false);          //done loading all photos
  const [URINumber, setURINumber] = useState(1);                  //number of photo list data from server

  const [photos, setPhotos] = useState([]);                       //list of photos
  const [clippedOnly, setClippedOnly] = useState(false);          //show only clipped ones

  const [clipData, setClipData] = useState();                     //data about clipped photos

  useEffect(() => {
    setClipData(localStorage);              //transfer localStorage into hook
  }, []);

  /* -------------------- */
  /* sending queries */

  const getNextPhotoList = async () => {
    const targetURI = `https://s3.ap-northeast-2.amazonaws.com/bucketplace-coding-test/cards/page_${URINumber}.json`;
    const res = await fetch(targetURI, {
      method: 'GET',
    });
    const newPhotos = await res.json();

    if ( newPhotos.length === 0 ) {         //done loading every photos
      setDoneLoading(true);
    } else {                                //there are photos left to be rendered
      const updatedPhotos = photos.concat(newPhotos);
      setPhotos(updatedPhotos);
      const newNumber = URINumber + 1;
      setURINumber(newNumber);
    }
  }

  /* -------------------- */
  /* modify photo clip information */

  const modifyClip = (id) => {
    if ( clipData[id] === undefined ) {     //unClipped => clipped
        /* modify hook */
      const newClipData = {...clipData};
      newClipData[id] = "true";
      setClipData(newClipData);
        /* modify localStorage */
      localStorage.setItem(id, true);
    } else {                                //clipped => unClipped
        /* modify hook */
      const newClipData = {...clipData};
      delete newClipData[id];
      setClipData(newClipData);
        /* modify localStorage */
      localStorage.removeItem(id);
    }
  }

  /* -------------------- */
  /* visualize photo data */

  let photoList = photos.map(
    (photo, index) => {
      const clipped = clipData[photo.id] === "true";                            //whether this photo is clipped
      const clipImage = clipped ? clipImageSelected : clipImageNotSelected;     //which image this photo is using at left bottom
      const showThis = !(clippedOnly && !clipped);                              //whether to show this photo

      if (showThis) {
        return (
          <div className="photo" key={index}>
            <div className="upper">
              <img className="profile-image" src={photo.profile_image_url} />
              <span className="writer">{photo.nickname}</span>
            </div>
            <img className="image" src={photo.image_url} />
            <img className="clip-image" src={clipImage} onClick={() => { modifyClip(photo.id) }} />
          </div>
        );
      }
    }
  );

  /* -------------------- */
  /* get new photos */

  const expandIcon = useRef(null);

  const onIntersect = async ([entry], observer) => {
    if ( entry.isIntersecting && !doneLoading) {
      observer.unobserve(entry.target);         //prevent to many detections
      await getNextPhotoList();                 //get photos
      observer.observe(entry.target);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.5 });
    observer.observe(expandIcon.current);
    return () => observer.disconnect();
  }, [doneLoading, URINumber]);

  /* -------------------- */
  /* render */

  return (
    <div>
      <div id="clip">
        <Checkbox
          checked={clippedOnly}
          onChange={(event)=>setClippedOnly(event.target.checked)}
          color="primary"
        />
        <span id="clip-message">스크랩한 것만 보기</span>
      </div>
      <div id="photolist">
        {photoList}
      </div>
      <div id="expandIcon">
        <ExpandMoreIcon color="primary" fontSize="large" ref={expandIcon}/>
      </div>
      
    </div>
  )

}

export default MainPage;