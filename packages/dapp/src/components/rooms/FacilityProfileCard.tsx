import type { LodgingFacilityRaw } from 'stays-data-models';
import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
  Box,
  // Collapsible,
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
import { Close, CaretRightFill, CaretDownFill } from 'grommet-icons';
import { useParams } from 'react-router-dom';
import { regexp } from '@windingtree/org.id-utils';
import ReactTagInput from '@pathofdev/react-tag-input';
import { MessageBox } from '../MessageBox';
import { ExternalLink } from '../ExternalLink';
import { Collapsible } from '../Collapsible';
import { validateLodgingFacilityData } from 'stays-data-models/dist/src/validators';
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

// Initialize logger
const logger = Logger('FacilityProfileCard');

export const defaultCountries: string[] = [
  'Afghanistan',
  'Aland Islands',
  'Albania',
  'Algeria',
  'American Samoa',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antarctica',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bonaire, Sint Eustatius and Saba',
  'Bosnia and Herzegovina',
  'Botswana',
  'Bouvet Island',
  'Brazil',
  'British Indian Ocean Territory',
  'Brunei Darussalam',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Cayman Islands',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Christmas Island',
  'Cocos (Keeling) Islands',
  'Colombia',
  'Comoros',
  'Congo',
  'Congo, Democratic Republic of the Congo',
  'Cook Islands',
  'Costa Rica',
  'Cote D\'Ivoire',
  'Croatia',
  'Cuba',
  'Curacao',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Falkland Islands (Malvinas)',
  'Faroe Islands',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'French Polynesia',
  'French Southern Territories',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Greece',
  'Greenland',
  'Grenada',
  'Guadeloupe',
  'Guam',
  'Guatemala',
  'Guernsey',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Heard Island and Mcdonald Islands',
  'Holy See (Vatican City State)',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran, Islamic Republic of',
  'Iraq',
  'Ireland',
  'Isle of Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea, Democratic People\'s Republic of',
  'Korea, Republic of',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Lao People\'s Democratic Republic',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libyan Arab Jamahiriya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macao',
  'Macedonia, the Former Yugoslav Republic of',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Martinique',
  'Mauritania',
  'Mauritius',
  'Mayotte',
  'Mexico',
  'Micronesia, Federated States of',
  'Moldova, Republic of',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'Netherlands Antilles',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Niue',
  'Norfolk Island',
  'Northern Mariana Islands',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestinian Territory, Occupied',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Pitcairn',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Reunion',
  'Romania',
  'Russian Federation',
  'Rwanda',
  'Saint Barthelemy',
  'Saint Helena',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Martin',
  'Saint Pierre and Miquelon',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Serbia and Montenegro',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Sint Maarten',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Georgia and the South Sandwich Islands',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Svalbard and Jan Mayen',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syrian Arab Republic',
  'Taiwan, Province of China',
  'Tajikistan',
  'Tanzania, United Republic of',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tokelau',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Turks and Caicos Islands',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'United States Minor Outlying Islands',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Viet Nam',
  'Virgin Islands, British',
  'Virgin Islands, U.s.',
  'Wallis and Futuna',
  'Western Sahara',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

export const defaultFormValue: LodgingFacilityRaw = {
  name: '',
  description: '',
  type: '',
  tier: '',
  contact: {
    name: '',
    phone: '',
    email: '',
    website: '',
  },
  amenities: [],
  address: {
    country: '',
    subdivision: '',
    locality: '',
    postalCode: '',
    streetAddress: '',
    premise: '',
    gps: ''
  },
  operator: {
    name: '',
    address: {
      country: '',
      subdivision: '',
      locality: '',
      postalCode: '',
      streetAddress: '',
      premise: '',
      gps: ''
    }
  },
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

export const FacilityProfileCard = () => {
  const { id } = useParams<{ id: string }>();
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
  const [countries, setCountries] = useState<string[]>(defaultCountries);
  const [contactOpen, setContactOpen] = useState<boolean>(false);
  const [addressOpen, setAddressOpen] = useState<boolean>(false);
  const [operatorOpen, setOperatorOpen] = useState<boolean>(false);
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
  const [selectedFacilityProfile, setSelectedFacilityProfile] = useState<LodgingFacilityRaw | undefined>();

  const isLoading = useMemo<boolean>(
    () => !!!web3Storage || loadingContract,
    [web3Storage, loadingContract]
  );

  useEffect(
    () => {
      if (isLoading || !id || !!!ownFacilities) {
        setSelectedFacilityProfile(undefined);
        return;
      }

      try {
        setFacilityError(undefined);
        setFacilityLoading(true);

        const facility = ownFacilities.find(
          f => f.contractData.lodgingFacilityId === id
        );

        if (!facility) {
          if (!ownFacilitiesLoading) {
            throw new Error(
              `Unable find the lodging facility with Id: ${id}`
            );
          }
          setSelectedFacilityProfile(undefined);
          return;
        }

        const profile = JSON.parse(JSON.stringify(facility));
        delete profile.contractData;
        delete profile.spaces;
        delete profile.updated;

        setSelectedFacilityProfile(profile);
        setProfileValue(flattenObject(profile));
        logger.debug('Selected facility profile', profile);
        setFacilityLoading(false);
      } catch (err) {
        logger.error(err);
        setFacilityError(
          (err as Error).message || 'Unknown lodging facility loading error'
        );
        setFacilityLoading(false);
      }
    },
    [id, ownFacilities, ownFacilitiesLoading, isLoading]
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

  const unFlattenProfile = useMemo<LodgingFacilityRaw>(
    () => unFlattenObject(profileValue),
    [profileValue]
  );

  const deployToIpfs = useCallback(
    async (
      file: File,
      loadingSetter = () => {},
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

        setProfileCreating(true);

        const profileData = unFlattenObject(profileValue);

        logger.debug('profileData', profileData);
        validateLodgingFacilityData(profileData);

        if (isUpdateMode) {
          if (!id) {
            throw new Error(
              'Id of the lodging facility is required but not found in the configuration'
            );
          }

          await contract.updateLodgingFacility(
            id,
            profileData,
            undefined,
            setHash,
            undefined
          );
        } else {
          await contract.registerLodgingFacility(
            profileData,
            true,
            undefined,
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
          `The Lodging Facility "${profileData.name}" has been successfully ${isUpdateMode ? 'updated' : 'created'}`,
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
    [showMessage, isUpdateMode, profileValue, id, contract, ownFacilitiesRefresh]
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
            Lodging Facility is profile loading. Please wait..&nbsp;
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
            setAddressOpen(false);
            setOperatorOpen(false);
            closeImageLoader();
          }}
          onSubmit={handleSubmit}
          onChange={nextValue => setProfileValue(nextValue)}
          onValidate={({ errors }) => {
            if (Object.keys(errors).some(x => /^contact\./.exec(x))) {
              setContactOpen(true);
            }

            if (Object.keys(errors).some(x => /^address\./.exec(x))) {
              setAddressOpen(true);
            }

            if (Object.keys(errors).some(x => /^operator\./.exec(x))) {
              setOperatorOpen(true);
            }
          }}
        >
          <Card width='xxlarge' elevation='xsmall' background='light-3'>
            <CardHeader pad='medium'>
              <Heading margin='none' level='3'>
                Lodging Facility Profile
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
                      placeholder='Select Room Type'
                      required
                      clear
                      options={enumerators.allowedLodgingFacilityTypes}
                    />
                  </FormField>

                  <FormField
                    style={{ padding: 10 }}
                    label='Tier'
                    name='tier'
                    required
                  >
                    <Select
                      name='tier'
                      style={{ textTransform: 'capitalize' }}
                      placeholder='Select Room Tier'
                      required
                      clear
                      options={enumerators.allowedLodgingFacilityTiers}
                    />
                  </FormField>

                  <FormField
                    style={{ padding: 10 }}
                    label='Amenities'
                    required
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

                  <Box>
                    <Heading
                      margin={{ 'left': 'small' }}
                      level='3'
                      style={{ cursor: 'pointer' }}
                      onClick={() => setContactOpen(!contactOpen)}
                    >
                      <Box direction='row'>
                        <Box pad={{ 'right': 'small' }}>
                          Contact
                        </Box>
                        <Box>
                          {contactOpen ? <CaretDownFill /> : <CaretRightFill />}
                        </Box>
                      </Box>
                    </Heading>

                    <Collapsible open={contactOpen}>
                      <FormField
                        label='Name / function'
                        style={{ padding: 10, marginLeft: 10, marginTop: 10 }}
                        name='contact.name'
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
                        style={{ padding: 10, marginLeft: 10 }}
                        label='Phone'
                        name='contact.phone'
                        required
                        validate={
                          [
                            value => {
                              if (!regexp.phone.exec(value)) {
                                return 'must be a valid phone number';
                              }
                            },
                          ]
                        }
                      />

                      <FormField
                        style={{ padding: 10, marginLeft: 10 }}
                        label='Email'
                        name='contact.email'
                        required
                        validate={
                          [
                            value => {
                              if (!regexp.email.exec(value)) {
                                return 'must be a valid email';
                              }
                            },
                          ]
                        }
                      />

                      <FormField
                        style={{ padding: 10, marginLeft: 10, marginTop: 0 }}
                        label='Website'
                        name='contact.website'
                        required
                        validate={
                          [
                            value => {
                              if (!regexp.uri.exec(value)) {
                                return 'must be a valid URI';
                              }
                            },
                          ]
                        }
                      />
                    </Collapsible>
                  </Box>

                  <Box>
                    <Heading
                      margin={{ 'left': 'small' }}
                      level='3'
                      style={{ cursor: 'pointer' }}
                      onClick={() => setAddressOpen(!addressOpen)}
                    >
                      <Box direction='row'>
                        <Box pad={{ 'right': 'small' }}>
                          Address
                        </Box>
                        <Box>
                          {addressOpen ? <CaretDownFill /> : <CaretRightFill />}
                        </Box>
                      </Box>
                    </Heading>

                    <Collapsible open={addressOpen}>
                      <FormField
                        label='Street Address'
                        style={{ padding: 10, marginLeft: 10, marginTop: 10 }}
                        name='address.streetAddress'
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
                        style={{ padding: 10, marginLeft: 10 }}
                        label='Locality'
                        name='address.locality'
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
                        style={{ padding: 10, marginLeft: 10 }}
                        label='Postal Code'
                        name='address.postalCode'
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
                        style={{ padding: 10, marginLeft: 10, marginTop: 0 }}
                        label='Country'
                        name='address.country'
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
                      >
                        <Select
                          name='address.country'
                          placeholder='Country'
                          clear
                          required
                          options={countries}
                          onSearch={(text) => {
                            const escapedText = text.replace(
                              /[-\\^$*+?.()|[\]{}]/g,
                              '\\$&'
                            );

                            const exp = new RegExp(escapedText, 'i');
                            setCountries(
                              defaultCountries.filter((o) => exp.test(o))
                            );
                          }}
                          onClose={() => setCountries(defaultCountries)}
                        />
                      </FormField>

                      <FormField
                        style={{ padding: 10, marginLeft: 10 }}
                        label='Subdivision'
                        name='address.subdivision'
                      />

                      <FormField
                        style={{ padding: 10, marginLeft: 10 }}
                        label='Premise'
                        name='address.premise'
                      />

                      <FormField
                        style={{ padding: 10, marginLeft: 10 }}
                        label='GPS'
                        name='address.gps'
                      />
                    </Collapsible>
                  </Box>

                  <Box>
                    <Heading
                      margin={{ 'left': 'small' }}
                      level='3'
                      style={{ cursor: 'pointer' }}
                      onClick={() => setOperatorOpen(!operatorOpen)}
                    >
                      <Box direction='row'>
                        <Box pad={{ 'right': 'small' }}>
                          Operator
                        </Box>
                        <Box>
                          {operatorOpen ? <CaretDownFill /> : <CaretRightFill />}
                        </Box>
                      </Box>
                    </Heading>

                    <Collapsible open={operatorOpen}>
                      <FormField
                        // style={{ padding: 10 }}
                        style={{ padding: 10, marginLeft: 10, marginTop: 10 }}
                        label='Operator Name'
                        name='operator.name'
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
                        label='Street Address'
                        style={{ padding: 10, marginLeft: 10, marginTop: 10 }}
                        name='operator.address.streetAddress'
                        required
                      />

                      <FormField
                        style={{ padding: 10, marginLeft: 10 }}
                        label='Locality'
                        name='operator.address.locality'
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
                        style={{ padding: 10, marginLeft: 10 }}
                        label='Postal Code'
                        name='operator.address.postalCode'
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
                        style={{ padding: 10, marginLeft: 10, marginTop: 0 }}
                        label='Country'
                        name='operator.address.country'
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
                      >
                        <Select
                          name='operator.address.country'
                          placeholder='Country'
                          clear
                          required
                          options={countries}
                          onSearch={(text) => {
                            const escapedText = text.replace(
                              /[-\\^$*+?.()|[\]{}]/g,
                              '\\$&'
                            );

                            const exp = new RegExp(escapedText, 'i');
                            setCountries(
                              defaultCountries.filter((o) => exp.test(o))
                            );
                          }}
                          onClose={() => setCountries(defaultCountries)}
                        />
                      </FormField>

                      <FormField
                        style={{ padding: 10, marginLeft: 10 }}
                        label='Subdivision'
                        name='operator.address.subdivision'
                      />

                      <FormField
                        style={{ padding: 10, marginLeft: 10 }}
                        label='Premise'
                        name='operator.address.premise'
                      />

                      <FormField
                        style={{ padding: 10, marginLeft: 10 }}
                        label='Geometry'
                        name='operator.address.gps'
                      />
                    </Collapsible>
                  </Box>

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
                    <Text>Facility Logo</Text>

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
                        id='ShowRImage'
                        onClick={() => setShowImagesLoader(true)}
                        label='Add Room Images'
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
                                SELECT ROOM IMAGES
                              </Text>
                            </CardHeader>
                            <CardBody style={{ padding: 20 }}>
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

                                        let unFlattenProfile = unFlattenObject(profileValue);

                                        const initialImagesCount = unFlattenProfile.media.images.length;
                                        logger.debug('initialImagesCount', initialImagesCount);

                                        for (let i=0; i < images.length; i++) {
                                          const uri = await deployToIpfs(
                                            images[i],
                                            () => {},
                                            true
                                          );

                                          if (uri) {
                                            unFlattenProfile = {
                                              ...unFlattenProfile,
                                              media: {
                                                ...unFlattenProfile.media,
                                                images: [
                                                  ...unFlattenProfile.media.images,
                                                  {
                                                    uri,
                                                    description: imagesDescriptions[images[i].name] || ''
                                                  }
                                                ]
                                              }
                                            };
                                          }
                                        }

                                        setProfileValue(flattenObject(unFlattenProfile));

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
