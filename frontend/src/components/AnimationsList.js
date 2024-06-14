import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';

function AnimationsList(props) {
  const fileDownload = async (url) => {
    const response = await axios.get(url, {
      responseType: 'blob',
    });
    const linkBlob = window.URL.createObjectURL(new Blob([response.data]));
    const fileTitle = extractTitle(url);
    const link = document.createElement('a');
    link.href = linkBlob;
    link.setAttribute('download', fileTitle);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  function extractTitle(url) {
    const segments = url.split('/');
    return segments[segments.length - 1];
  }

  function extractFileExtension(url) {
    const parts = url.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1];
    } else {
      return 'txt';
    }
  }

  const renderingComponentMap = {
    'json': ({ animationData }) => {
      return (
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: animationData,
          }}
          height={200}
          width={200}
        />
      );
    },
    'gif': ({ url }) => <img src={url} alt="GIF" height={200} width={200} />,
    'mp4': ({ url }) => <video src={url} controls height={200} width={200} />,
  };

  return (
    <div>
      <ul>
        {props.list.map((animation) => (
          <li key={animation.id}>
            <h2>{animation.title}</h2>
            <p>{animation.body}</p>
            <p>{animation.tags}</p>
            {renderingComponentMap[extractFileExtension(animation.link)] ? (
              renderingComponentMap[extractFileExtension(animation.link)](animation)
            ) : null}
            <div> <button onClick={() => fileDownload(animation.link)}>Download</button> </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnimationsList;
