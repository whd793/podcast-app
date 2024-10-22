import {
  BackupRounded,
  CloseRounded,
  CloudDone,
  CloudDoneRounded,
  Create,
} from '@mui/icons-material';
import {
  CircularProgress,
  IconButton,
  LinearProgress,
  Modal,
} from '@mui/material';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import app from '../firebase';
import ImageSelector from './ImageSelector';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../redux/snackbarSlice';
import { createPodcast } from '../api';
import { Category } from '../utils/Data';

import s3 from '../config/aws-config';

import { useTranslation } from 'react-i18next';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: top;
  justify-content: center;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  max-width: 500px;
  width: 100%;
  border-radius: 16px;
  margin: 50px 20px;
  height: min-content;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  margin: 12px 20px;
`;

const TextInput = styled.input`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text_secondary};
`;

const Desc = styled.textarea`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  padding: 10px 0px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary + 80};
  margin: 12px 20px 0px 20px;
`;

const OutlinedBox = styled.div`
  min-height: 48px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  color: ${({ theme }) => theme.text_secondary};
  ${({ googleButton, theme }) =>
    googleButton &&
    `
    user-select: none; 
  gap: 16px;`}
  ${({ button, theme }) =>
    button &&
    `
    user-select: none; 
  border: none;
    font-weight: 600;
    font-size: 16px;
    background: ${theme.button};
    color:'${theme.bg}';`}
    ${({ activeButton, theme }) =>
    activeButton &&
    `
    user-select: none; 
  border: none;
    background: ${theme.primary};
    color: white;`}
  margin: 3px 20px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 14px;
`;

const Select = styled.select`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text_secondary};
`;

const Option = styled.option`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.card};
  outline: none;
  color: ${({ theme }) => theme.text_secondary};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0px;
  margin: 6px 20px 20px 20px;
  align-items: center;
  gap: 12px;
`;

const FileUpload = styled.label`
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 16px 20px 3px 20px;
  border: 1px dashed ${({ theme }) => theme.text_secondary};
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.text_secondary};
  &:hover {
    background-color: ${({ theme }) => theme.text_secondary + 20};
  }
`;

const File = styled.input`
  display: none;
`;

const Uploading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
`;

const Upload = ({ setUploadOpen }) => {
  const [podcast, setPodcast] = React.useState({
    name: '',
    desc: '',
    thumbnail: '',
    tags: [],
    category: '',
    type: 'audio',
    episodes: [
      {
        name: '',
        desc: '',
        type: 'audio',
        file: '',
      },
    ],
  });
  const [showEpisode, setShowEpisode] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [backDisabled, setBackDisabled] = React.useState(false);
  const [createDisabled, setCreateDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const token = localStorage.getItem('podstreamtoken');

  const goToAddEpisodes = () => {
    setShowEpisode(true);
  };

  const goToPodcast = () => {
    setShowEpisode(false);
  };

  useEffect(() => {
    if (podcast === null) {
      setDisabled(true);
      setPodcast({
        name: '',
        desc: '',
        thumbnail: '',
        tags: [],
        episodes: [
          {
            name: '',
            desc: '',
            type: 'audio',
            file: '',
          },
        ],
      });
    } else {
      if (podcast.name === '' && podcast.desc === '') {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }
  }, [podcast]);

  // const uploadFile = (file, index) => {
  //   const storage = getStorage(app);
  //   const fileName = new Date().getTime() + file.name;
  //   const storageRef = ref(storage, fileName);
  //   const uploadTask = uploadBytesResumable(storageRef, file);

  //   uploadTask.on(
  //     'state_changed',
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       podcast.episodes[index].file.uploadProgress = Math.round(progress);
  //       setPodcast({ ...podcast, episodes: podcast.episodes });
  //       switch (snapshot.state) {
  //         case 'paused':
  //           console.log('Upload is paused');
  //           break;
  //         case 'running':
  //           console.log('Upload is running');
  //           break;
  //         default:
  //           break;
  //       }
  //     },
  //     (error) => {},
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         const newEpisodes = podcast.episodes;
  //         newEpisodes[index].file = downloadURL;
  //         setPodcast({ ...podcast, episodes: newEpisodes });
  //       });
  //     }
  //   );
  // };

  // const uploadFile = (file, index) => {
  //   const fileName = `${new Date().getTime()}_${file.name}`;
  //   const params = {
  //     Bucket: process.env.AWS_S3_BUCKET_NAME, // Your S3 bucket name
  //     Key: fileName, // File name you want to save as in S3
  //     Body: file,
  //     ContentType: file.type,
  //   };

  //   const upload = s3.upload(params);

  //   upload.on('httpUploadProgress', (event) => {
  //     const progress = Math.round((event.loaded / event.total) * 100);
  //     podcast.episodes[index].file.uploadProgress = progress;
  //     setPodcast({ ...podcast, episodes: podcast.episodes });
  //   });

  //   upload.send((err, data) => {
  //     if (err) {
  //       console.error('There was an error uploading your file: ', err);
  //       return;
  //     }
  //     const newEpisodes = podcast.episodes;
  //     newEpisodes[index].file = data.Location; // S3 file URL
  //     setPodcast({ ...podcast, episodes: newEpisodes });
  //   });
  // };

  const uploadFile = (file, index) => {
    const fileName = `${new Date().getTime()}_${file.name}`;
    const bucketName = process.env.REACT_APP_AWS_S3_BUCKET_NAME;

    console.log('Bucket Name:', bucketName); // Debug line

    const params = {
      Bucket: bucketName, // Ensure this is not undefined or empty
      Key: fileName, // File name you want to save as in S3
      Body: file,
      ContentType: file.type,
    };

    const upload = s3.upload(params);

    upload.on('httpUploadProgress', (event) => {
      const progress = Math.round((event.loaded / event.total) * 100);
      podcast.episodes[index].file.uploadProgress = progress;
      setPodcast({ ...podcast, episodes: podcast.episodes });
    });

    upload.send((err, data) => {
      if (err) {
        console.error('There was an error uploading your file: ', err);
        return;
      }
      const newEpisodes = podcast.episodes;
      newEpisodes[index].file = data.Location; // S3 file URL
      setPodcast({ ...podcast, episodes: newEpisodes });
    });
  };

  const createpodcast = async () => {
    console.log(podcast);
    setLoading(true);
    await createPodcast(podcast, token)
      .then((res) => {
        console.log(res);
        setDisabled(true);
        setBackDisabled(true);
        setUploadOpen(false);
        setLoading(false);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Podcast created successfully',
            severity: 'success',
          })
        );
      })
      .catch((err) => {
        setDisabled(false);
        setBackDisabled(false);
        setLoading(false);
        console.log(err);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Error creating podcast',
            severity: 'error',
          })
        );
      });
  };

  useEffect(() => {
    console.log('b' + process.env.REACT_APP_AWS_S3_BUCKET_NAME);
    if (
      podcast.episodes.length > 0 &&
      podcast.episodes.every(
        (episode) =>
          episode.file !== '' &&
          episode.name !== '' &&
          episode.desc !== '' &&
          podcast.name !== '' &&
          podcast.desc !== '' &&
          podcast.tags !== '' &&
          podcast.image !== '' &&
          podcast.image !== undefined &&
          podcast.image !== null
      )
    ) {
      if (podcast.episodes.every((episode) => episode.file.name === undefined))
        setCreateDisabled(false);
      else setCreateDisabled(true);
    }
  }, [podcast]);

  return (
    <Modal open={true} onClose={() => setUploadOpen(false)}>
      <Container>
        <Wrapper>
          <CloseRounded
            style={{
              position: 'absolute',
              top: '24px',
              right: '30px',
              cursor: 'pointer',
            }}
            onClick={() => setUploadOpen(false)}
          />
          <Title>{t('uploadpodcast')}</Title>
          {!showEpisode ? (
            <>
              <Label>Podcast Details:</Label>

              <ImageSelector podcast={podcast} setPodcast={setPodcast} />
              <OutlinedBox style={{ marginTop: '12px' }}>
                <TextInput
                  placeholder={t('podcastname')}
                  type='text'
                  value={podcast?.name}
                  onChange={(e) =>
                    setPodcast({ ...podcast, name: e.target.value })
                  }
                />
              </OutlinedBox>
              <OutlinedBox style={{ marginTop: '6px' }}>
                <Desc
                  placeholder={t('podcastdescription')}
                  name='desc'
                  rows={5}
                  value={podcast?.desc}
                  onChange={(e) =>
                    setPodcast({ ...podcast, desc: e.target.value })
                  }
                />
              </OutlinedBox>
              <OutlinedBox style={{ marginTop: '6px' }}>
                <Desc
                  placeholder={t('tagsseparated')}
                  name='tags'
                  rows={4}
                  value={podcast?.tags}
                  onChange={(e) =>
                    setPodcast({ ...podcast, tags: e.target.value.split(',') })
                  }
                />
              </OutlinedBox>
              <div
                style={{
                  display: 'flex',
                  gap: '0px',
                  width: '100%',
                  gap: '6px',
                }}
              >
                <OutlinedBox
                  style={{
                    marginTop: '6px',
                    width: '100%',
                    marginRight: '0px',
                  }}
                >
                  <Select
                    onChange={(e) =>
                      setPodcast({ ...podcast, type: e.target.value })
                    }
                  >
                    <Option value='audio'>Audio</Option>
                    <Option value='video'>Video</Option>
                  </Select>
                </OutlinedBox>
                <OutlinedBox
                  style={{ marginTop: '6px', width: '100%', marginLeft: '0px' }}
                >
                  <Select
                    onChange={(e) =>
                      setPodcast({ ...podcast, category: e.target.value })
                    }
                  >
                    <Option value={Category[0].name} selected disabled hidden>
                      {t('selectcategory')}
                    </Option>
                    {Category.map((category) => (
                      <Option value={category.name}>
                        {t(category.name.toLowerCase())}{' '}
                      </Option>
                    ))}
                  </Select>
                </OutlinedBox>
              </div>
              <OutlinedBox
                button={true}
                activeButton={!disabled}
                style={{ marginTop: '22px', marginBottom: '18px' }}
                onClick={() => {
                  !disabled && goToAddEpisodes();
                }}
              >
                Next
              </OutlinedBox>
            </>
          ) : (
            <>
              <Label>Episode Details:</Label>
              {podcast.episodes.map((episode, index) => (
                <>
                  <FileUpload for={'fileField' + index}>
                    {podcast.episodes[index].file === '' ? (
                      <Uploading>
                        <BackupRounded />
                        Select Audio / Video
                      </Uploading>
                    ) : (
                      <Uploading>
                        {podcast.episodes[index].file.name === undefined ? (
                          <div
                            style={{
                              color: 'green',
                              display: 'flex',
                              gap: '6px',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CloudDoneRounded sx={{ color: 'inherit' }} />
                            File Uploaded Successfully
                          </div>
                        ) : (
                          <>
                            File: {podcast.episodes[index].file.name}
                            <LinearProgress
                              sx={{
                                borderRadius: '10px',
                                height: 3,
                                width: '100%',
                              }}
                              variant='determinate'
                              value={
                                podcast.episodes[index].file.uploadProgress
                              }
                              color={'success'}
                            />
                            {podcast.episodes[index].file.uploadProgress}%
                            Uploaded
                          </>
                        )}
                      </Uploading>
                    )}
                  </FileUpload>
                  <File
                    style={{ marginTop: '16px' }}
                    type='file'
                    accept='file_extension|audio/*|video/*|media_type'
                    id={'fileField' + index}
                    onChange={(e) => {
                      podcast.episodes[index].file = e.target.files[0];
                      setPodcast({ ...podcast, episodes: podcast.episodes });
                      uploadFile(podcast.episodes[index].file, index);
                    }}
                  />
                  <OutlinedBox>
                    <TextInput
                      placeholder={t('episodename')}
                      type='text'
                      value={episode.name}
                      onChange={(e) => {
                        const newEpisodes = podcast.episodes;
                        newEpisodes[index].name = e.target.value;
                        setPodcast({ ...podcast, episodes: newEpisodes });
                      }}
                    />
                  </OutlinedBox>
                  <OutlinedBox style={{ marginTop: '6px' }}>
                    <Desc
                      placeholder={t('episodedescription')}
                      name='desc'
                      rows={5}
                      value={episode.desc}
                      onChange={(e) => {
                        const newEpisodes = podcast.episodes;
                        newEpisodes[index].desc = e.target.value;
                        setPodcast({ ...podcast, episodes: newEpisodes });
                      }}
                    />
                  </OutlinedBox>
                  <OutlinedBox
                    button={true}
                    activeButton={false}
                    style={{ marginTop: '6px', marginBottom: '12px' }}
                    onClick={() =>
                      setPodcast({
                        ...podcast,
                        episodes: podcast.episodes.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                  >
                    {t('delete')}
                  </OutlinedBox>
                </>
              ))}
              <OutlinedBox
                button={true}
                activeButton
                style={{ marginTop: '4px', marginBottom: '18px' }}
                onClick={() =>
                  setPodcast({
                    ...podcast,
                    episodes: [
                      ...podcast.episodes,
                      { name: '', desc: '', file: '' },
                    ],
                  })
                }
              >
                {t('addepisode')}
              </OutlinedBox>

              <ButtonContainer>
                <OutlinedBox
                  button={true}
                  activeButton={false}
                  style={{ marginTop: '6px', width: '100%', margin: 0 }}
                  onClick={() => {
                    !backDisabled && goToPodcast();
                  }}
                >
                  {t('back')}
                </OutlinedBox>
                <OutlinedBox
                  button={true}
                  activeButton={!disabled}
                  style={{ marginTop: '6px', width: '100%', margin: 0 }}
                  onClick={() => {
                    !disabled && createpodcast();
                  }}
                >
                  {loading ? (
                    <CircularProgress color='inherit' size={20} />
                  ) : (
                    t('create')
                  )}
                </OutlinedBox>
              </ButtonContainer>
            </>
          )}
        </Wrapper>
      </Container>
    </Modal>
  );
};

export default Upload;
