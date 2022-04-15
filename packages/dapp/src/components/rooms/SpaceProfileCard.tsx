import type { SpaceRaw } from 'stays-data-models';
import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
  Box,
  Image,
  Text,
  TextArea,
  Form,
  Grid,
  FormField,
  FileInput,
  Layer,
  Heading,
  Select,
  Spinner,
  Stack,
  Carousel,
} from 'grommet';
import { Close } from 'grommet-icons';
import { useParams } from 'react-router-dom';
// import { regexp } from '@windingtree/org.id-utils';
import ReactTagInput from '@pathofdev/react-tag-input';
import { MessageBox } from '../MessageBox';
import { ExternalLink } from '../ExternalLink';
import { validateSpaceData } from 'stays-data-models/dist/src/validators';
import { enumerators } from 'stays-data-models';
import { centerEllipsis } from '../../utils/strings';
import { useAppState } from '../../store';
import { useWeb3StorageApi } from '../../hooks/useWeb3StorageApi';
import { useContract } from './../../hooks/useContract';
import { useWindowsDimension } from '../../hooks/useWindowsDimension';
import { useGoToMessage } from '../../hooks/useGoToMessage';
import { ResponsiveColumn } from '../../utils/roomProfile';
import { getNetwork } from '../../config';
import Logger from '../../utils/logger';
import '@pathofdev/react-tag-input/build/index.css';
import { utils } from 'ethers';

// Initialize logger
const logger = Logger('SpaceProfileCard');

export const defaultFormValue: SpaceRaw = {
  name: '',
  description: '',
  type: '',
  amenities: [],
  capacity: 1,
  guestsNumber: 1,
  beds: 1,
  price: '',
  media: {
    logo: '',
    images: []
  }
};

const flattenObject = (obj: any, prefix = ''): Record<string, any> =>
  Object
    .keys(obj)
    .reduce(
      (acc, key) => {
        const pre = prefix.length ? prefix + '.' : '';
        acc = {
          ...acc,
          ...(
            typeof obj[key] === 'object'
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ? flattenObject(obj[key], pre + key)
              : {
                [pre + key]: obj[key]
              }
          )
        };
        return acc;
      },
      {}
    );

const unFlattenObject = (obj: Record<string, any>) => {
  const result: any = {};
  for (let i in obj) {
    const keys = i.split('.');
    keys.reduce(
      (acc, key, j) => {
        return acc[key] ||
          (acc[key] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 === j ? obj[i] : {}) : [])
      },
      result
    );
  }
  return result;
};

export const SpaceProfileCard = () => {
  const { facilityId, id } = useParams<{ facilityId: string, id: string }>();
  const showMessage = useGoToMessage();
  const { winWidth } = useWindowsDimension();
  const {
    provider,
    ipfsNode,
    ownFacilities,
    ownFacilitiesLoading,
    ownFacilitiesRefresh
  } = useAppState();
  const [contract, loadingContract] = useContract(provider, ipfsNode);
  const web3Storage = useWeb3StorageApi(ipfsNode);
  const [profileValue, setProfileValue] = useState<Record<string, any>>(flattenObject(defaultFormValue));
  const [showImagesLoader, setShowImagesLoader] = useState<boolean>(false);
  const [uploadIpfsError, setUploadIpfsError] = useState<string | undefined>();
  const [facilityError, setFacilityError] = useState<string | undefined>();
  const [facilityLoading, setFacilityLoading] = useState<boolean>(false);
  const [logoUploading, setLogoUploading] = useState<boolean>(false);
  const [imagesUploading, setImagesUploading] = useState<boolean>(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagesDescriptions, setImagesDescriptions] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState<string | undefined>();
  const [hash, setHash] = useState<string | undefined>();
  const [profileCreating, setProfileCreating] = useState<boolean>(false);

  // editing scope
  const [selectedFacilityProfile, setSelectedFacilityProfile] = useState<SpaceRaw | undefined>();

  const isLoading = useMemo<boolean>(
    () => !!!web3Storage || loadingContract,
    [web3Storage, loadingContract]
  );

  useEffect(
    () => {
      if (isLoading || !id || !facilityId || !!!ownFacilities) {
        setSelectedFacilityProfile(undefined);
        return;
      }

      try {
        setFacilityError(undefined);
        setFacilityLoading(true);

        const facility = ownFacilities.find(
          f => f.contractData.lodgingFacilityId === facilityId
        );

        if (!facility) {
          if (!ownFacilitiesLoading) {
            throw new Error(
              `Unable find the facility with Id: ${facilityId}`
            );
          }
          setSelectedFacilityProfile(undefined);
          return;
        }

        const space = facility.spaces.find(s => s.spaceId === id);

        if (!space) {
          throw new Error(
            `Unable find the space with Id: ${id}`
          );
        }

        const profile = JSON.parse(JSON.stringify(space));
        delete profile.spaceId;
        delete profile.tokens;
        delete profile.contractData;
        delete profile.updated;

        // convert xWEI to xDAI
        const xDaiValue = utils.formatEther(profile.price);
        profile.price = xDaiValue

        setSelectedFacilityProfile(profile);
        setProfileValue(flattenObject(profile));
        logger.debug('Selected space profile', profile);
        setFacilityLoading(false);
      } catch (err) {
        logger.error(err);
        setFacilityError(
          (err as Error).message || 'Unknown space loading error'
        );
        setFacilityLoading(false);
      }
    },
    [facilityId, id, ownFacilities, ownFacilitiesLoading, isLoading]
  );

  // true - update; false - create
  const isUpdateMode = useMemo(
    () => !!selectedFacilityProfile,
    [selectedFacilityProfile]
  );

  const hashLink = useMemo(() => {
    const network = getNetwork();
    return hash ? `${network.blockExplorer}/tx/${hash}` : null;
  }, [hash]);

  const closeImageLoader = () => {
    setImages([]);
    setImagesDescriptions({});
    setShowImagesLoader(false);
  };

  const unFlattenProfile = useMemo<SpaceRaw>(
    () => unFlattenObject(profileValue),
    [profileValue]
  );

  const deployToIpfs = useCallback(
    async (
      file: File,
      loadingSetter = () => { },
      isImage = false
    ) => {
      try {
        if (!web3Storage) {
          throw new Error("IPFS API not ready yet");
        }
        loadingSetter(true);
        const { cid } = await web3Storage.add(file);
        const uri = isImage
          ? `https://${cid}.ipfs.dweb.link`
          : `ipfs://${cid}`;
        loadingSetter(false);
        return uri;
      } catch (err) {
        logger.error(err);
        setUploadIpfsError(
          (err as Error).message || 'Unknown IPFS uploader error'
        );
        loadingSetter(false);
        return null;
      }
    },
    [web3Storage]
  );

  const handleSubmit = useCallback(
    async () => {
      setValidationError(undefined);

      try {
        if (!contract) {
          throw new Error('Contract is not connected');
        }

        if (!facilityId) {
          throw new Error(
            'Facility Id is required but not found in the configuration'
          );
        }

        setProfileCreating(true);

        const profileData = unFlattenObject(profileValue) as SpaceRaw;
        // convert xDAI to xWEI
        const xWeiValue = utils.parseEther(profileData.price);
        profileData.price = xWeiValue.toString()

        logger.debug('profileData', profileData);
        validateSpaceData(profileData);

        if (isUpdateMode) {
          if (!id) {
            throw new Error(
              'Id of the space is required but not found in the configuration'
            );
          }

          await contract.updateSpace(
            id,
            profileData,
            undefined,
            setHash,
            undefined
          );
        } else {
          await contract.addSpace(
            profileData,
            facilityId,
            profileData.capacity,
            profileData.price,
            true,
            undefined,
            setHash,
            undefined
          );
        }

        if (ownFacilitiesRefresh) {
          ownFacilitiesRefresh();
        }

        await new Promise(resolve => setTimeout(resolve, 10000));

        setProfileCreating(false);

        showMessage(
          `The Space "${profileData.name}" has been successfully ${isUpdateMode ? 'updated' : 'created'}`,
          'info',
          '/facilities',
          'Back to my Lodging Facilities'
        );
      } catch (err) {
        logger.error(err);
        setValidationError(
          (err as Error).message ||
          'Unknown profile validation error'
        );
        setProfileCreating(false);
      }
    },
    [showMessage, isUpdateMode, profileValue, facilityId, id,
      contract, ownFacilitiesRefresh]
  );

  return (
    <>
      <MessageBox type='info' show={isLoading}>
        <Box direction='row'>
          <Box>
            Profile form dependencies are loading. Please wait..&nbsp;
          </Box>
          <Spinner />
        </Box>
      </MessageBox>

      <MessageBox type='info' show={facilityLoading}>
        <Box direction='row'>
          <Box>
            Space is profile loading. Please wait..&nbsp;
          </Box>
          <Spinner />
        </Box>
      </MessageBox>

      <MessageBox type='error' show={!!uploadIpfsError}>
        <Box>
          {uploadIpfsError}
        </Box>
      </MessageBox>

      <MessageBox type='error' show={!!facilityError}>
        <Box>
          {facilityError}
        </Box>
      </MessageBox>

      {!isLoading &&
        <Form
          value={profileValue}
          validate='change'
          onReset={() => {
            setProfileValue(flattenObject(defaultFormValue));
            closeImageLoader();
          }}
          onSubmit={handleSubmit}
          onChange={nextValue => setProfileValue(nextValue)}
        >
          <Card width='xxlarge' elevation='xsmall' background='light-3'>
            <CardHeader pad='medium'>
              <Heading margin='none' level='3'>
                Space Profile
              </Heading>
            </CardHeader>
            <CardBody
              pad='medium'
              alignSelf='start'
              background='#fff'
              width='xxlarge'
            >
              <Grid
                columns={ResponsiveColumn(winWidth)}
                responsive={true}
              >
                <Box>
                  <FormField
                    style={{ padding: 10 }}
                    label='Name'
                    name='name'
                    required
                    validate={
                      [
                        name => {
                          if (!name || name === '') {
                            return 'cannot be empty';
                          }
                        },
                      ]
                    }
                  />

                  <FormField
                    style={{ padding: 10 }}
                    label='Description'
                    name='description'
                    htmlFor='text-area'
                    component={TextArea}
                    required
                    validate={
                      [
                        name => {
                          if (!name || name === '') {
                            return 'cannot be empty';
                          }
                        },
                      ]
                    }
                  />

                  <FormField
                    style={{ padding: 10 }}
                    label='Type'
                    name='type'
                    required
                  >
                    <Select
                      name='type'
                      style={{ textTransform: 'capitalize' }}
                      placeholder='Select Space Type'
                      required
                      clear
                      options={enumerators.allowedSpaceTypes}
                    />
                  </FormField>

                  <FormField
                    style={{ padding: 10 }}
                    label='Amenities'
                    name='amenities'
                  >
                    <ReactTagInput
                      tags={unFlattenProfile.amenities || []}
                      placeholder="Type and press enter"
                      editable={true}
                      readOnly={false}
                      removeOnBackspace={true}
                      onChange={newTags => {
                        const profileClone =
                          JSON.parse(JSON.stringify(unFlattenProfile));
                        profileClone.amenities = newTags;
                        setProfileValue(flattenObject(profileClone));
                      }}
                      validator={value => {
                        return true;
                      }}
                    />
                  </FormField>

                  <FormField
                    style={{ padding: 10 }}
                    label='Capacity'
                    name='capacity'
                    type='number'
                    defaultValue={1}
                    required
                    validate={
                      [
                        value => {
                          if (!value || value === 0) {
                            return 'cannot be equal to zero';
                          }
                        },
                      ]
                    }
                  />

                  <FormField
                    style={{ padding: 10 }}
                    label='Guests number'
                    name='guestsNumber'
                    type='number'
                    defaultValue={1}
                    required
                    validate={
                      [
                        value => {
                          if (!value || value === 0) {
                            return 'cannot be equal to zero';
                          }
                        },
                      ]
                    }
                  />

                  <FormField
                    style={{ padding: 10 }}
                    label='Beds'
                    name='beds'
                    type='number'
                    defaultValue={1}
                    required
                    validate={
                      [
                        value => {
                          if (!value || value === 0) {
                            return 'cannot be equal to zero';
                          }
                        },
                      ]
                    }
                  />

                  <FormField
                    style={{ padding: 10 }}
                    label='Price'
                    name='price'
                    type='number'
                    defaultValue={1}
                    required
                    validate={
                      [
                        value => {
                          if (!value || value === 0) {
                            return 'cannot be equal to zero';
                          }
                        },
                      ]
                    }
                  />

                  {unFlattenProfile?.media?.images && unFlattenProfile.media.images.length > 0 &&
                    <Box>
                      <Heading
                        margin={{ 'left': 'small' }}
                        level='3'
                      >
                        Facility Images
                      </Heading>

                      <Box height='medium' overflow='hidden'>
                        <Carousel fill initialChild={0}>
                          {unFlattenProfile.media.images.map(
                            (image, index: number) => (
                              <Stack key={index} fill anchor='center'>
                                <Image
                                  fill
                                  height='medium'
                                  fit='cover'
                                  src={image.uri}
                                  title={image.description}
                                />
                                <Button
                                  icon={<Close color='white' />}
                                  onClick={() => {
                                    setProfileValue(
                                      flattenObject({
                                        ...unFlattenProfile,
                                        media: {
                                          ...unFlattenProfile.media,
                                          images: unFlattenProfile?.media?.images?.filter(
                                            (_, i) => i !== index
                                          )
                                        }
                                      })
                                    );
                                  }}
                                />
                              </Stack>
                            )
                          )}
                        </Carousel>
                      </Box>
                    </Box>
                  }
                </Box>

                <Box alignSelf='start' align='center'>
                  <Box
                    direction='column'
                    align='center'
                    gap={'small'}
                    pad={{ top: 'medium' }}
                  >
                    <Text>The Space Logo</Text>

                    <Stack anchor='top-right'>
                      <Image
                        src={
                          profileValue['media.logo'] === ''
                            ? '/interior-design.png'
                            : profileValue['media.logo']
                        }
                        fit='cover'
                        width='110rem'
                        height='110rem'
                        style={{
                          background: 'rgba(255,255,255, 0.5)',
                          transition: 'all .3s linear',
                          padding: 40,
                          border: '1px solid #ccc',
                        }}
                      />
                      {profileValue['media.logo'] === '' ? null : (
                        <Box
                          background='brand'
                          margin='small'
                          pad={{ horizontal: 'small', vertical: 'small' }}
                          style={{ cursor: 'pointer' }}
                          round
                          onClick={() => setProfileValue({
                            ...profileValue,
                            'media.logo': ''
                          })}
                        >
                          <Close color='white' size='small' />
                        </Box>
                      )}
                      {logoUploading &&
                        <Spinner size='medium' margin={{ top: '80px', right: '80px' }} />
                      }
                    </Stack>

                    {profileValue['media.logo'] === '' &&
                      <FormField htmlFor='fileInput' required>
                        <FileInput
                          accept='image/*'
                          max={1}
                          maxSize={50000}
                          messages={{
                            browse: 'browse',
                            dropPrompt: 'Drop file here or',
                            files: 'files',
                            remove: 'remove',
                            removeAll: 'remove all',
                            maxFile: 'Attach a maximum of {max} files only.',
                          }}
                          onChange={async (event) => {
                            setUploadIpfsError(undefined);

                            if (event.target.files) {
                              const uri = await deployToIpfs(
                                event.target.files[0],
                                setLogoUploading,
                                true
                              );

                              if (uri) {
                                setProfileValue({
                                  ...profileValue,
                                  'media.logo': uri
                                });
                              }
                            }
                          }}
                        />
                      </FormField>
                    }
                  </Box>

                  <Box
                    direction='column'
                    align='center'
                    gap={'small'}
                    style={{ marginTop: 0 }}
                    pad={{ top: 'medium' }}
                  >
                    <Stack anchor='top-right' style={{ marginTop: 80 }}>
                      <Button
                        onClick={() => setShowImagesLoader(true)}
                        label='Add Space Images'
                        style={{
                          height: 40,
                          fontSize: 12,
                          marginTop: 6,
                        }}
                      />

                      {showImagesLoader &&
                        <Layer
                          style={{ overflow: "auto" }}
                          onEsc={closeImageLoader}
                          onClickOutside={closeImageLoader}
                        >
                          <Box
                            background="brand"
                            margin={{ top: "small", right: "small" }}
                            style={{
                              cursor: "pointer",
                              width: 30,
                              height: 30,
                              position: "absolute",
                              right: "0",
                            }}
                            round
                            align='center'
                            justify='center'
                            onClick={closeImageLoader}
                          >
                            <Close color="white" size="small" />
                          </Box>

                          <Card width="large" background="light-1">
                            <CardHeader>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: "600",
                                  padding: 20,
                                  paddingBottom: 10,
                                }}
                              >
                                SELECT SPACE IMAGES
                              </Text>
                            </CardHeader>
                            <CardBody style={{ padding: 20, maxHeight: '80vh', overflow: 'scroll' }}>
                              <form>
                                <FormField htmlFor="fileInput">
                                  <FileInput
                                    accept="image/*"
                                    multiple={{ max: 5 }}
                                    messages={{
                                      browse: "browse",
                                      dropPrompt: "Drop file here or",
                                      dropPromptMultiple: "Drop files here or",
                                      files: "files",
                                      remove: "remove",
                                      removeAll: "remove all",
                                      maxFile:
                                        "Attach a maximum of {max} files only.",
                                    }}
                                    onChange={((e: any, { files }: { files: File[] }) => {
                                      logger.debug(e);
                                      if (files.length > 0) {
                                        setImages(files);
                                      }
                                    }) as any}
                                  />
                                </FormField>

                                {images.length > 0 &&
                                  <>
                                    <Heading
                                      margin={{ 'left': 'small' }}
                                      level='3'
                                    >
                                      IMAGES
                                    </Heading>

                                    <ul
                                      style={{ listStyleType: 'none' }}
                                    >
                                      <br />
                                      {images.map((file, index) => (
                                        <li
                                          key={index}
                                          style={{ paddingBottom: 25 }}
                                        >
                                          <Box direction="row">
                                            <img
                                              style={{ height: 40, width: 40 }}
                                              alt={file.name}
                                              src={URL.createObjectURL(file)}
                                            ></img>
                                            <textarea
                                              value={imagesDescriptions[file.name] || ''}
                                              onChange={(e) => {
                                                setImagesDescriptions({
                                                  ...imagesDescriptions,
                                                  [file.name]: e.target.value
                                                });
                                              }}
                                              required
                                              placeholder={`add a description for ${file.name}`}
                                              rows={2}
                                              cols={40}
                                              style={{
                                                padding: 15,
                                                border: "1px solid #ccc",
                                                marginLeft: 10,
                                              }}
                                            ></textarea>
                                          </Box>
                                        </li>
                                      ))}
                                    </ul>

                                    <Button
                                      fill={true}
                                      label={
                                        <Box direction='row'>
                                          <Box margin={{ right: 'small' }}>
                                            <Text>
                                              Upload
                                            </Text>
                                          </Box>
                                          {imagesUploading &&
                                            <Spinner color='white' />
                                          }
                                        </Box>
                                      }
                                      disabled={isLoading || imagesUploading}
                                      primary
                                      style={{
                                        margin: 15,
                                        height: 50,
                                        width: "94%",
                                      }}
                                      onClick={async (e: any) => {
                                        e.preventDefault();
                                        setImagesUploading(true);

                                        let profileClone = JSON.parse(JSON.stringify(unFlattenProfile)) as SpaceRaw;

                                        const initialImagesCount = profileClone?.media?.images?.length || 0;
                                        logger.debug('initialImagesCount', initialImagesCount);

                                        for (let i = 0; i < images.length; i++) {
                                          const uri = await deployToIpfs(
                                            images[i],
                                            () => { },
                                            true
                                          );

                                          if (uri) {
                                            profileClone = {
                                              ...unFlattenProfile,
                                              media: {
                                                ...unFlattenProfile.media,
                                                images: [
                                                  ...(unFlattenProfile?.media?.images || []),
                                                  {
                                                    uri,
                                                    description: imagesDescriptions[images[i].name] || ''
                                                  }
                                                ]
                                              }
                                            };
                                          }
                                        }

                                        setProfileValue(flattenObject(profileClone));

                                        setImagesUploading(false);
                                        closeImageLoader();
                                      }}
                                    />
                                  </>
                                }
                              </form>
                            </CardBody>
                          </Card>
                        </Layer>
                      }

                    </Stack>

                  </Box>
                </Box>
              </Grid>
            </CardBody>
            <CardFooter pad={{ horizontal: 'small' }} background='light-2'>
              <Box
                direction='row'
                justify='between'
                width='xxlarge'
                margin={'medium'}
              >
                <Button size='large' type='reset' label='Reset' />
                <Box direction='column' align='center'>
                  <Box>
                    <Button
                      type='submit'
                      size='large'
                      label={
                        <Box direction='row'>
                          <Box margin={{ right: 'small' }}>
                            {isUpdateMode ? 'Update' : 'Save'}
                          </Box>
                          {profileCreating &&
                            <Spinner color='white' />
                          }
                        </Box>
                      }
                      disabled={isLoading || profileCreating}
                      primary
                    />
                  </Box>
                  {hashLink !== null && hash &&
                    <Box margin={{ top: 'small' }}>
                      <ExternalLink
                        href={hashLink}
                        label={centerEllipsis(hash)}
                      />
                    </Box>
                  }
                </Box>

              </Box>
            </CardFooter>
          </Card>

          <MessageBox type='error' show={!!validationError}>
            <Box>
              {validationError}
            </Box>
          </MessageBox>
        </Form>
      }
    </>
  );
};
