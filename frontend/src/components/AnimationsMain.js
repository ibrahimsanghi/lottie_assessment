import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimationsList from './AnimationsList.js';

function AnimationsMain() {
  const [animationsData, setAnimationsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [file, setFile] = useState(null);
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const response = await axios.post('http://localhost:4000/graphql', {
      query: `
        query {
          animations {
            id
            title
            body
            tags
            link
          }
        }
      `,
    });
    const fetchedData = await Promise.all(response.data.data.animations.map(async (animation) => {
      if (extractFileExtension(animation.link) === 'json') {
        const dataResponse = await fetch(animation.link);
        const animationData = await dataResponse.json();
        return {
          ...animation,
          animationData: animationData,
        };
      } else {
        return {
          ...animation,
        };
      }
    }));
    setAnimationsData(fetchedData);
    setFlag(true);
  };

  const animationsSearch = async () => {
    const response = await axios.post('http://localhost:4000/graphql', {
      query: `
        query($searchQuery: String!) {
          searchAnimations(searchQuery: $searchQuery) {
            id
            title
            body
            tags
            link
          }
        }
      `,
      variables: { searchQuery },
    });
    const fetchedData = await Promise.all(response.data.data.searchAnimations.map(async (animation) => {
      if (extractFileExtension(animation.link) === 'json') {
        const dataResponse = await fetch(animation.link);
        const animationData = await dataResponse.json();
        return {
          ...animation,
          animationData: animationData,
        };
      } else {
        return {
          ...animation,
        };
      }
    }));
    setAnimationsData(fetchedData);
  };

  const fileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const processData = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('file', file);
    data.append('body', body);
    data.append('tags', tags);
    await axios.post('http://localhost:4000/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    fetchFiles();
  };

  function extractFileExtension(url) {
    const parts = url.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1];
    } else {
      return 'txt';
    }
  }

  return (
    <div>
      <h1>Lottie Animations</h1>
      <form onSubmit={processData}>
        <input type="file" onChange={fileUpload} required />
        <input
          type="text"
          placeholder="description"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
        />
        <button type="submit">Upload</button>
      </form>
      <input
        type="text"
        placeholder="Search animations"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={animationsSearch}>Search</button>
      {flag && (<AnimationsList list={animationsData} />)}
    </div>
  );
};

export default AnimationsMain;
