import React, { useState, useEffect, useRef, useCallback } from "react";
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
  TextInput,
  Spinner,
  Stack,
} from "grommet";
import ContentLoader from "react-content-loader";

//import type { IPFS } from "@windingtree/ipfs-apis";
import { useWeb3StorageApi } from "../../hooks/useWeb3StorageApi";

import { useAppState } from "../../store";
import { useContract } from "./../../hooks/useContract";

import {
  validateLodgingFacilityData,
  //validateSpaceData,
} from "stays-data-models/dist/src/validators";
import type { LodgingFacilityRaw } from "stays-data-models";


import { HelpOption, Close, StatusGood, StatusCritical } from "grommet-icons";
import { useWindowsDimension } from "../../hooks/useWindowsDimension";
import {
  //LoadScript,
  defaultRoomTypes,
  defaultCountries,
  defaultRoomTier,
  defaultFormValue,
  ResponsiveColumn,
  //LodgingFacilityRaw,
  LodgingFacilityRaw2,
  //imageSchema,
} from "../../utils/roomProfile";

export const RoomProfileCard: React.FC<{
  imageUrl?: string;
  name?: string | null;
  location?: string | null;
  price?: string | null;
}> = ({ imageUrl, name, location, price }) => {
  let autoComplete: any;
  let autoComplete2: any;

  const autoCompleteRef = useRef(null);
  const autoCompleteRef2 = useRef(null);
  const [query, setQuery] = useState("");
  const [query2, setQuery2] = useState("");

  //const { ipfsNode } = useAppState();
  const { provider, ipfsNode } = useAppState();
  const web3Storage = useWeb3StorageApi(ipfsNode);

  const [contract] = useContract(provider, ipfsNode);

  useEffect(() => {
    handleScriptLoad2(autoComplete2, setQuery2, autoCompleteRef2);
    handleScriptLoad(autoComplete, setQuery, autoCompleteRef);
  }, [autoComplete, autoComplete2, handleScriptLoad, handleScriptLoad2]);

  const [valid, setValid] = useState(false);

  const [isW3loaded, setIsW3loaded] = useState(false);
  const [isUploadingIpfs, setIsUploadingIpfs] = useState(false);
  const [isUploadingIpfsError, setIsUploadingIpfsError] = useState<any>("");

  const [roomLogoURL, setRoomLogoURL] = useState("");

  const [, setIsConntryOpen] = useState(false);
  const [, setIsConntryOpen2] = useState(false);

  const [value, setValue] = useState(defaultFormValue);

  const { winWidth } = useWindowsDimension();

  const [roomTypeOption, setRoomTypeOption] = useState(defaultRoomTypes);
  const [roomTierOption, setRoomTierOption] = useState(defaultRoomTier);
  const [addressCountry, setAddressCountry] = useState(defaultCountries);
  const [addressObject, setaddressObject] = useState<any[]>([]);
  const [addressGeometry, setaddressGeometry] = useState<any>("");

  const [addressObject2, setaddressObject2] = useState<any[]>([]);
  const [addressGeometry2, setaddressGeometry2] = useState<any>("");
  const [roomImages, setRoomImages] = useState<File[]>([]);
  const [roomImagesDesc, setRoomImagesDesc] = useState<any[]>([]);
  const [roomImagesURL, setRoomImagesURL] = useState<any[]>([]);
  const [roomImagesErrorURL, setRoomImagesErrorURL] = useState<any[]>([]);

  const [showRImage, setShowRImage] = useState(false);
  const [currentlyUploading, setCurrentlyUploading] = useState(10);
  const [successfullyUploading, setSuccessfullyUploading] = useState(-1);

  const handleImageChange = ({
    currentTarget: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (files && files.length) {
      setRoomImages((existing) => existing.concat(Array.from(files)));
    }
  };

  //console.log("LodgingFacilityRawMain", LodgingFacilityRawMain);

  useEffect(() => {
    //setRoomImages([]);
    //setSuccessfullyUploading(-1);
    //setRoomImagesDesc([])
    //alert('sdsd')
    //console.log(roomImagesDesc[1])
  }, []);

  useEffect(() => {
    if (web3Storage !== undefined) {
      setIsW3loaded(true);
    } else {
      setIsW3loaded(false);
    }
  }, [web3Storage]);

  const deployToIpfs = useCallback(
    async (file: File) => {
      if (!web3Storage) {
        throw new Error("IPFS API not ready yet");
      }
      return web3Storage.add(file);
    },
    [web3Storage]
  );


  const handleDepoyFile: any = useCallback(
    async (file: File, isImage = false, type: any) => {
      try {
        const cid = await deployToIpfs(file);

        const uri = isImage
          ? `https://${cid.cid}.ipfs.dweb.link`
          : `ipfs://${cid.cid}`;

        if (type === "logo") {
          //console.log("URI", uri);
          setRoomLogoURL(uri);
          setIsUploadingIpfs(false);
          return uri;
        } else {
          let newArr = [...roomImagesURL]; // copying the old datas array
          newArr[type] = uri; // replace e.target.value with whatever you want to change it to

          setRoomImagesURL(newArr);

          //let desc = roomImagesDesc[type];
          //console.log(type + " - " + desc);
          //console.log(roomImagesDesc);
          return uri;
        }
      } catch (err) {
        if (type === "logo") {
          setRoomLogoURL("");
          setIsUploadingIpfs(false);
          setIsUploadingIpfsError(err);
        } else {
          let NewStatus = [...roomImagesErrorURL];
          NewStatus[type] = true;
          setRoomImagesErrorURL(NewStatus);
          roomImagesURL.splice(type, 1);
        }

        console.log(err);

        // handle errors
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deployToIpfs]
  );

  useEffect(() => {
    value.addressGeometry = addressGeometry;
  }, [addressGeometry, value]);

  useEffect(() => {
    value.operatorGeometry = addressGeometry2;
  }, [addressGeometry2, value]);

  useEffect(() => {
    if (Object.keys(addressObject2).length > 0) {
      for (const component of addressObject2) {
        const componentType2 = component.types[0];

        // console.log(addressObject2);
        switch (componentType2) {
          case "postal_code": {
            value.operatorPostalCode = component.long_name;
            LodgingFacilityRaw2.operator.address.postalCode =
              component.long_name;
            //console.log("operatorPostalCode", component.long_name);
            break;
          }
          case "locality":
            //console.log("locality", component.long_name);
            LodgingFacilityRaw2.operator.address.locality = component.long_name;
            value.operatorLocality = component.long_name;

            break;

          case "administrative_area_level_1":
            // console.log("administrative_area_level_1", component.long_name);
            if (
              value.operatorLocality == null ||
              value.operatorLocality === ""
            ) {
              value.operatorLocality = component.long_name;
              LodgingFacilityRaw2.operator.address.locality =
                component.long_name;
            }

            break;
          case "country":
            value.operatorCountry = component.long_name;
            LodgingFacilityRaw2.operator.address.country = component.long_name;
            break;
        }
      }

      setIsConntryOpen2(true);
      let tm2 = setTimeout(() => {
        setIsConntryOpen2(false);
        clearTimeout(tm2);
      }, 10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressObject2]);

  useEffect(() => {
    if (Object.keys(addressObject).length > 0) {
      for (const component of addressObject) {
        const componentType = component.types[0];

        switch (componentType) {
          case "postal_code": {
            value.addressPostalCode = component.long_name;
            LodgingFacilityRaw2.address.postalCode = component.long_name;
            break;
          }
          case "locality":
            value.addressLocality = component.long_name;
            LodgingFacilityRaw2.address.locality = component.long_name;

            break;

          case "administrative_area_level_1":
            if (value.addressLocality == null || value.addressLocality === "") {
              value.addressLocality = component.long_name;
              LodgingFacilityRaw2.address.locality = component.long_name;
            }

            break;
          case "country":
            value.addressCountry = component.long_name;
            LodgingFacilityRaw2.address.country = component.long_name;

            break;
        }
      }

      /* */ setIsConntryOpen(true);
      let tm = setTimeout(() => {
        setIsConntryOpen(false);
        clearTimeout(tm);
      }, 10); /* */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressObject]);
  //

  const [operatorCountry, setOperatorCountry] = useState(defaultCountries);

  const handlePlaceSelect2 = async (autoComplete2: any, updateQuery2: any) => {
    const operatorObject = autoComplete2.getPlace();
    const query2 = operatorObject.formatted_address;
    updateQuery2(query2);

    LodgingFacilityRaw2.operator.address.streetAddress = query;
    setaddressGeometry2(
      `${operatorObject.geometry.location.lat()},${operatorObject.geometry.location.lng()}`
    );

    LodgingFacilityRaw2.operator.address.gps = `${operatorObject.geometry.location.lat()},${operatorObject.geometry.location.lng()}`;

    setaddressObject2(operatorObject.address_components);
  };
  const handlePlaceSelect = async (autoComplete: any, updateQuery: any) => {
    const addressObject = autoComplete.getPlace();
    const query = addressObject.formatted_address;
    //console.log(addressObject);

    LodgingFacilityRaw2.address.streetAddress = query;

    //console.log(LodgingFacilityRaw2);

    updateQuery(query);
    setaddressObject(addressObject.address_components);
    setaddressGeometry(
      `${addressObject.geometry.location.lat()},${addressObject.geometry.location.lng()}`
    );
    LodgingFacilityRaw2.address.gps = `${addressObject.geometry.location.lat()},${addressObject.geometry.location.lng()}`;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleScriptLoad(
    autoComplete: any,
    updateQuery: any,
    autoCompleteRef: any
  ): any {
    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      { types: ["address"] }
      //    { types: ["(cities)"], componentRestrictions: { country: "us" } }
    );
    autoComplete.setFields([
      "formatted_address",
      "address_components",
      "geometry",
      //"name"
    ]);
    return autoComplete.addListener("place_changed", () =>
      handlePlaceSelect(autoComplete, updateQuery)
    );
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleScriptLoad2(
    autoComplete2: any,
    updateQuery2: any,
    autoCompleteRef2: any
  ): any {
    autoComplete2 = new window.google.maps.places.Autocomplete(
      autoCompleteRef2.current,
      { types: ["address"] }
      //    { types: ["(cities)"], componentRestrictions: { country: "us" } }
    );

    autoComplete2.setFields([
      "formatted_address",
      "address_components",
      "geometry",
    ]);
    return autoComplete2.addListener("place_changed", () =>
      handlePlaceSelect2(autoComplete2, updateQuery2)
    );
  }

  function populateImageDescription(e: any, index: number) {
    let newArr = [...roomImagesDesc]; // copying the old datas array
    newArr[index] = e.target.value; // replace e.target.value with whatever you want to change it to

    setRoomImagesDesc(newArr);

    let NewStatus = [...roomImagesErrorURL];
    NewStatus[index] = false;
    setRoomImagesErrorURL(NewStatus);

    //console.log(newArr);
    // console.log(index);
  }

  const addFacilityProfile = useCallback(async () => {
    try {
      if (contract)
      {
        const facilityId = await contract.registerLodgingFacility(
          LodgingFacilityRaw2,
          true
        );

        console.log(facilityId);

        alert('ROOM ADDED SUUCESSFULLY')
        }
        
    } catch (err) {
      // Handle errors
    }
  }, [contract]);



  //console.log(allowedLodgingFacilityTypes);
  
  return (
    <>
      <Form
        value={value}
        validate="change"
        onReset={(event) => {
          setValue(defaultFormValue);
          //console.log(event);
        }}
        onSubmit={(event) => {
          if (Object.keys(roomImages).length <= 0) {
            let ShowRImage: HTMLElement = document.getElementById(
              "ShowRImage"
            ) as HTMLElement;

            alert("You need to upload Room Images to continue");
            ShowRImage.click();
          } else {
            //console.log("Submit", event.value, event.touched);
            console.log(LodgingFacilityRaw2);
            const facilityProfile: LodgingFacilityRaw = LodgingFacilityRaw2;

            try {
              validateLodgingFacilityData(facilityProfile);
              addFacilityProfile();
            } catch (e) {
              alert("ERROR");
              console.log(JSON.stringify(e));
            }

            //console.log(validateLodgingFacilityData(facilityProfile));
          }
        }}
        onChange={(nextValue, { touched }) => {
          // console.log("Change", nextValue, touched);

          setValue(nextValue);
          console.log(LodgingFacilityRaw2);
        }}
        onValidate={(validationResults) => {
          setValid(validationResults.valid);
        }}
      >
        <Card width="xxlarge" elevation="xsmall" background="light-3">
          <CardHeader pad="medium">
            <Heading margin="none" level="3">
              ROOM PROFILE
            </Heading>
          </CardHeader>
          <CardBody
            pad="medium"
            alignSelf="start"
            //background="#fafafa"
            background="#fff"
            width="xxlarge"
          >
            {isW3loaded ? (
              <Grid
                // alignSelf="center"
                //rows={[""]}
                columns={ResponsiveColumn(winWidth)}
                //gap="xxsmall"
                responsive={true}
              >
                <Box>
                  <FormField
                    style={{ padding: 10 }}
                    label="Name"
                    name="roomName"
                    onChange={(e) => {
                      LodgingFacilityRaw2.name = e.target.value;
                      //console.log(LodgingFacilityRaw2)
                    }}
                    required
                    validate={[
                      { regexp: /^[a-z]/i },
                      (roomName) => {
                        if (roomName && roomName.length === 1)
                          return "must be >1 character";
                        return undefined;
                      },
                    ]}
                  />
                  <FormField
                    style={{ padding: 10 }}
                    label="Type"
                    name="roomType"
                  >
                    <Select
                      name="roomType"
                      style={{ textTransform: "capitalize" }}
                      id="roomType"
                      placeholder="Select Room Type"
                      required
                      clear
                      onChange={(e) =>
                        (LodgingFacilityRaw2.type = e.target.value)
                      }
                      options={roomTypeOption}
                      onClose={() => setRoomTypeOption(defaultRoomTypes)}
                    />
                  </FormField>
                  <FormField
                    style={{ padding: 10 }}
                    label="Tier"
                    name="roomTier"
                  >
                    <Select
                      name="roomTier"
                      id="roomTier"
                      style={{ textTransform: "capitalize" }}
                      placeholder="Select Room Tier"
                      required
                      clear
                      onChange={(e) =>
                        (LodgingFacilityRaw2.tier = e.target.value)
                      }
                      options={roomTierOption}
                      onClose={() => setRoomTierOption(defaultRoomTier)}
                    />
                  </FormField>

                  <FormField
                    style={{ padding: 10 }}
                    label="Description"
                    name="description"
                    id="description"
                    htmlFor="text-area"
                    component={TextArea}
                    required
                    onChange={(e) =>
                      (LodgingFacilityRaw2.description = e.target.value)
                    }
                    validate={[
                      { regexp: /^[a-z]/i },
                      (description) => {
                        if (description && description.length === 1)
                          return "must be >1 character";
                        return undefined;
                      },
                    ]}
                  />

                  <div
                    /* */ style={{
                      display:
                        value.description === "" || value.description === null
                          ? "none"
                          : "block",
                    }} /**/
                  >
                    <br />
                    <br />
                    <br />
                    <div style={{ padding: 10, paddingBottom: 0 }}>
                      <Heading
                        margin="none"
                        level="3"
                        style={{ paddingLeft: 10 }}
                      >
                        Address
                      </Heading>
                    </div>
                    <FormField
                      label="Street Address"
                      style={{ padding: 10, marginLeft: 10, marginTop: 10 }}
                      name="streetAddress"
                    >
                      <TextInput
                        required
                        name="streetAddress"
                        id="streetAddress"
                        className="input"
                        ref={autoCompleteRef}
                        onChange={(event) => {
                          setQuery(event.target.value);

                          //console.log(LodgingFacilityRaw2);
                        }}
                        placeholder="Enter Address, City, location or postal code to continnue"
                        value={query}
                      />
                    </FormField>

                    <FormField
                      style={{ padding: 10, marginLeft: 10 }}
                      label="Locality"
                      name="addressLocality"
                    >
                      <TextInput
                        required
                        id="addressLocality"
                        name="addressLocality"
                        //value={addressLocality}
                      />
                    </FormField>

                    <FormField
                      style={{ padding: 10, marginLeft: 10 }}
                      label="Postal Code"
                      name="addressPostalCode"
                      id="addressPostalCode"
                      onChange={(e) =>
                        (LodgingFacilityRaw2.address.postalCode =
                          e.target.value)
                      }
                      //value={addressPostalCode}
                      required
                    />

                    <FormField
                      style={{ padding: 10, marginLeft: 10, marginTop: 0 }}
                      label="Country"
                      name="addressCountry"
                    >
                      <Select
                        name="addressCountry"
                        id="addressCountry"
                        placeholder="Country"
                        required
                        onChange={(e) =>
                          (LodgingFacilityRaw2.address.country = e.target.value)
                        }
                        clear
                        //open={isConntryOpen}
                        // value={addressCountryValue}
                        options={addressCountry}
                        onSearch={(text) => {
                          const escapedText = text.replace(
                            /[-\\^$*+?.()|[\]{}]/g,
                            "\\$&"
                          );

                          const exp = new RegExp(escapedText, "i");
                          setAddressCountry(
                            defaultCountries.filter((o) => exp.test(o))
                          );
                        }}
                        onClose={() => setAddressCountry(defaultCountries)}
                      />
                    </FormField>

                    <FormField
                      style={{ padding: 10, marginLeft: 10 }}
                      label="Subdivision"
                      name="addressSubdivision"
                      required
                      onChange={(e) =>
                        (LodgingFacilityRaw2.address.subdivision =
                          e.target.value)
                      }
                    />

                    <FormField
                      style={{ padding: 10, marginLeft: 10 }}
                      label="Premise"
                      name="addressPremise"
                      onChange={(e) =>
                        (LodgingFacilityRaw2.address.premise = e.target.value)
                      }
                      required
                    />

                    <FormField
                      style={{ padding: 10, marginLeft: 10 }}
                      label="Geometry"
                      name="addressGeometry"
                      id="addressGeometry"
                      onChange={(e) =>
                        (LodgingFacilityRaw2.address.gps = e.target.value)
                      }
                      //value={addressGeometry}
                      required
                    />
                  </div>

                  <div
                    /* */ style={{
                      display:
                        value.addressGeometry === "" ||
                        value.addressGeometry === null
                          ? "none"
                          : "block",
                    }} /* */
                  >
                    <br />
                    <br />
                    <br />
                    <div style={{ padding: 10, paddingBottom: 0 }}>
                      <Heading
                        margin="none"
                        level="3"
                        style={{ paddingLeft: 10 }}
                      >
                        Operator Details
                      </Heading>
                    </div>

                    <FormField
                      // style={{ padding: 10 }}
                      style={{ padding: 10, marginLeft: 10, marginTop: 10 }}
                      label="Operator Name"
                      name="operatorName"
                      onChange={(e) => {
                        LodgingFacilityRaw2.operator.name = e.target.value;
                        //console.log(LodgingFacilityRaw2)
                      }}
                      required
                    />

                    <FormField
                      label="Street Address"
                      style={{ padding: 10, marginLeft: 10, marginTop: 10 }}
                      name="operatorStreetAddress"
                    >
                      <TextInput
                        required
                        name="operatorStreetAddress"
                        id="operatorStreetAddress"
                        className="input"
                        ref={autoCompleteRef2}
                        onChange={(event) => setQuery2(event.target.value)}
                        placeholder="Enter Operator Address, City, location or postal code to continnue"
                        value={query2}
                      />
                    </FormField>
                    <FormField
                      style={{ padding: 10, marginLeft: 10 }}
                      label="Locality"
                      name="operatorLocality"
                    >
                      <TextInput
                        required
                        id="operatorLocality"
                        name="operatorLocality"
                        //value={operatorLocality}
                        onChange={(e) =>
                          (LodgingFacilityRaw2.operator.address.locality =
                            e.target.value)
                        }
                      />
                    </FormField>
                    <FormField
                      style={{ padding: 10, marginLeft: 10 }}
                      label="Postal Code"
                      name="operatorPostalCode"
                      id="operatorPostalCode"
                      onChange={(e) =>
                        (LodgingFacilityRaw2.operator.address.postalCode =
                          e.target.value)
                      }
                      // value={operatorPostalCode}
                      required
                    />
                    <FormField
                      style={{ padding: 10, marginLeft: 10, marginTop: 0 }}
                      label="Country"
                      name="operatorCountry"
                    >
                      <Select
                        name="operatorCountry"
                        id="operatorCountry"
                        placeholder="Country"
                        required
                        clear
                        //open={isConntryOpen2}
                        // value={operatorCountryValue}
                        options={operatorCountry}
                        onSearch={(text) => {
                          const escapedText = text.replace(
                            /[-\\^$*+?.()|[\]{}]/g,
                            "\\$&"
                          );

                          const exp = new RegExp(escapedText, "i");
                          setOperatorCountry(
                            defaultCountries.filter((o) => exp.test(o))
                          );
                        }}
                        onChange={(e) =>
                          (LodgingFacilityRaw2.operator.address.country =
                            e.target.value)
                        }
                        onClose={() => setOperatorCountry(defaultCountries)}
                      />
                    </FormField>
                    <FormField
                      style={{ padding: 10, marginLeft: 10 }}
                      label="Subdivision"
                      name="operatorSubdivision"
                      onChange={(e) =>
                        (LodgingFacilityRaw2.operator.address.subdivision =
                          e.target.value)
                      }
                      required
                    />
                    <FormField
                      style={{ padding: 10, marginLeft: 10 }}
                      label="Premise"
                      name="operatorPremise"
                      onChange={(e) =>
                        (LodgingFacilityRaw2.operator.address.premise =
                          e.target.value)
                      }
                      required
                    />

                    <FormField
                      style={{ padding: 10, marginLeft: 10 }}
                      label="Geometry"
                      name="operatorGeometry"
                      id="operatorGeometry"
                      onChange={(e) =>
                        (LodgingFacilityRaw2.operator.address.gps =
                          e.target.value)
                      }
                      //value={operatorGeometry}
                      required
                    />
                  </div>
                </Box>
                <Box alignSelf="start" align="center">
                  <Box
                    direction="column"
                    align="center"
                    gap={"small"}
                    pad={{ top: "medium" }}
                  >
                    <Text>Room Logo</Text>

                    <Stack anchor="top-right">
                      <Image
                        src={
                          roomLogoURL === ""
                            ? "/interior-design.png"
                            : roomLogoURL
                        }
                        fit="cover"
                        width="110rem"
                        style={{
                          background: "rgba(255,255,255, 0.5)",
                          transition: "all .3s linear",
                          padding: 40,
                          border: "1px solid #ccc",
                        }}
                        height="110rem"
                        //onClick={() => navigate("/")}
                      />
                      {roomLogoURL === "" ? null : (
                        <Box
                          background="brand"
                          pad={{ horizontal: "small", vertical: "small" }}
                          style={{ cursor: "pointer" }}
                          round
                          onClick={() => {
                            setRoomLogoURL("");
                          }}
                        >
                          <Close color="white" size="small" />
                        </Box>
                      )}
                    </Stack>
                    {isUploadingIpfs ? (
                      <Box direction="row" style={{ marginTop: 10 }}>
                        <Box>Uploading Room Logo..&nbsp;</Box>
                        <Spinner />
                      </Box>
                    ) : roomLogoURL === "" ? (
                      <>
                        <FormField name="roomLogo" htmlFor="fileInput" required>
                          <FileInput
                            accept="image/*"
                            name="roomLogo"
                            id="roomLogo"
                            maxSize={50000}
                            confirmRemove={({ onConfirm, onCancel }) => (
                              <Layer onClickOutside={onCancel} onEsc={onCancel}>
                                <Box
                                  style={{ padding: 30 }}
                                  alignSelf="center"
                                  align="center"
                                >
                                  <HelpOption
                                    color="brand"
                                    size="large"
                                    style={{ paddingBottom: 30 }}
                                    //alignSelf="center"
                                  />
                                  Are you sure you want to delete this file?
                                  <Box
                                    direction="row"
                                    gap="large"
                                    style={{ padding: 10, paddingTop: 30 }}
                                  >
                                    <Button
                                      label="Cancel"
                                      primary
                                      onClick={onCancel}
                                    />
                                    <Button
                                      label="Delete file"
                                      onClick={onConfirm}
                                    />
                                  </Box>
                                </Box>
                              </Layer>
                            )}
                            messages={{
                              browse: "browse",
                              dropPrompt: "Drop file here or",
                              dropPromptMultiple: "Drop files here or",
                              files: "files",
                              remove: "remove",
                              removeAll: "remove all",
                              maxFile: "Attach a maximum of {max} files only.",
                            }}
                            onChange={async (event) => {
                              //console.log(event.target.files);

                              setIsUploadingIpfsError("");

                              if (event.target.files) {
                                setIsUploadingIpfs(true);
                                let data = await handleDepoyFile(
                                  event.target.files[0],
                                  true,
                                  "logo"
                                );

                                //lodgingFacilityData.media.logo = data;
                                LodgingFacilityRaw2.media.logo = data;
                              }

                              //console.log(LodgingFacilityRaw2);
                            }}
                          />
                        </FormField>

                        {isUploadingIpfsError === "" ? null : (
                          <Box
                            background="status-error"
                            pad={{ horizontal: "xsmall" }}
                            round
                          >
                            <Text style={{ padding: 3 }}>
                              Error uploading Room Logo <br />
                            </Text>
                          </Box>
                        )}
                      </>
                    ) : null}
                  </Box>

                  <Box
                    direction="column"
                    align="center"
                    gap={"small"}
                    style={{ marginTop: 0 }}
                    pad={{ top: "medium" }}
                  >
                    {roomLogoURL === "" ? null : (
                      <Stack anchor="top-right" style={{ marginTop: 80 }}>
                        <Button
                          id="ShowRImage"
                          onClick={() => setShowRImage(true)}
                          //primary
                          //color="status-ok"
                          label="Add Room Images"
                          style={{
                            //width: 150,
                            height: 40,

                            //color: "white",
                            fontSize: 12,
                            marginTop: 6,
                          }}
                        />

                        <Box
                          background="brand"
                          pad={{ horizontal: "xsmall" }}
                          round
                        >
                          <Text>{Object.keys(roomImages).length}</Text>
                        </Box>
                      </Stack>
                    )}

                    {showRImage ? (
                      <Layer
                        style={{ overflow: "auto" }}
                        onEsc={() => setShowRImage(false)}
                        onClickOutside={() => setShowRImage(false)}
                      >
                        <Box
                          background="brand"
                          pad={{ horizontal: "small", vertical: "small" }}
                          style={{
                            cursor: "pointer",
                            width: 30,
                            position: "absolute",
                            right: "0",
                          }}
                          round
                          onClick={() => setShowRImage(false)}
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
                              SELECT ROOM IMAGE
                            </Text>
                          </CardHeader>
                          <CardBody style={{ padding: 20 }}>
                            {}
                            <form
                              onSubmit={async (e: any) => {
                                e.preventDefault();

                                if (
                                  Object.keys(roomImagesDesc).length ===
                                  Object.keys(roomImages).length
                                ) {
                                  if (roomImages) {
                                    for (
                                      let i = 0;
                                      i < Object.keys(roomImages).length;
                                      i += 1
                                    ) {
                                      // const file = roomImages[i];

                                      setCurrentlyUploading(i);
                                      /* console.log(
                                        "uploading image " +
                                          i +
                                          " :: =>" +
                                          file.name
                                      ); */

                                      let data = await handleDepoyFile(
                                        roomImages[i],
                                        true,
                                        i
                                      );

                                      //console.log(data);

                                      //console.log(roomImagesDesc)
                                      let mediaImage = {
                                        description: roomImagesDesc[i],
                                        uri: data,
                                      };
                                      LodgingFacilityRaw2.media.images.push(
                                        mediaImage
                                      );

                                      //console.log(file.name);
                                      setSuccessfullyUploading(i);
                                      //console.log(i);
                                    }

                                    //console.log(LodgingFacilityRaw2);
                                  }
                                }
                              }}
                            >
                              <FormField name="roomImage" htmlFor="fileInput">
                                <FileInput
                                  accept="image/*"
                                  name="roomImage"
                                  id="roomImage"
                                  multiple={{
                                    max: 4,
                                  }}
                                  //maxSize={50000}

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
                                  onChange={handleImageChange}
                                />
                              </FormField>
                              {Object.keys(roomImages).length > 0 ? (
                                <>
                                  <div
                                    style={{
                                      fontSize: 14,
                                      fontWeight: "600",
                                      marginTop: 40,
                                    }}
                                  >
                                    ROOM IMAGE DESCRIPTION
                                  </div>
                                  <ul
                                    style={{
                                      listStyleType: "none",
                                      marginTop: "-20",
                                    }}
                                  >
                                    <br />
                                    {roomImages.map((file, index) => (
                                      <li
                                        key={index}
                                        style={{ paddingTop: 25 }}
                                      >
                                        <Box direction="row">
                                          <img
                                            style={{ height: 40, width: 40 }}
                                            alt=""
                                            src={URL.createObjectURL(file)}
                                          ></img>
                                          {/* <div>{file.name}</div> */}
                                          <textarea
                                            onChange={(e) =>
                                              populateImageDescription(e, index)
                                            }
                                            required
                                            className={`textarea_${index}`}
                                            placeholder={`add a description for ${file.name}`}
                                            rows={2}
                                            cols={40}
                                            style={{
                                              padding: 15,
                                              border: "1px solid #ccc",
                                              marginLeft: 10,
                                            }}
                                          ></textarea>{" "}
                                          {index === currentlyUploading ? (
                                            successfullyUploading ===
                                            index ? null : (
                                              <div
                                                style={{ padding: 10 }}
                                                className={`success_${index}`}
                                              >
                                                <Spinner />
                                              </div>
                                            )
                                          ) : null}
                                          {index <= successfullyUploading ? (
                                            <div
                                              style={{ padding: 10 }}
                                              className={`success_${index}`}
                                            >
                                              {roomImagesErrorURL[index] ? (
                                                <StatusCritical
                                                  color="red"
                                                  size="20"
                                                />
                                              ) : (
                                                <StatusGood
                                                  color="green"
                                                  size="20"
                                                />
                                              )}
                                            </div>
                                          ) : null}
                                        </Box>
                                      </li>
                                    ))}
                                  </ul>

                                  <Button
                                    fill={true}
                                    type="submit"
                                    label="Upload"
                                    disabled={
                                      successfullyUploading + 1 ===
                                      Object.keys(roomImages).length
                                        ? true
                                        : false
                                    }
                                    primary
                                    style={{
                                      margin: 15,
                                      height: 50,
                                      width: "94%",
                                    }}
                                    onClick={async () => {}}
                                  />
                                </>
                              ) : null}
                            </form>
                          </CardBody>
                        </Card>
                      </Layer>
                    ) : null}
                  </Box>
                </Box>
              </Grid>
            ) : (
              <ContentLoader
                speed={2}
                width={"900"}
                style={{ paddingLeft: 50 }}
                height={550}
                title="Connecting to Web3 Sever"
                viewBox="0 0 400 160"
                backgroundColor="#fff"
                foregroundColor="#ecebeb"
              >
                <rect x="80%" y="0" rx="3" ry="3" width="185" height="80" />
                <rect x="80%" y="85" rx="3" ry="3" width="80%" height="6" />

                <rect x="35" y="3" rx="3" ry="3" width="88" height="6" />
                <rect x="35" y="20" rx="3" ry="3" width="52" height="6" />

                <rect x="0" y="56" rx="3" ry="3" width="70%" height="6" />
                <rect x="0" y="72" rx="3" ry="3" width="70%" height="6" />
                <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
                <rect x="0" y="105" rx="3" ry="3" width="70%" height="8" />

                <rect x="20%" y="125" rx="3" ry="3" width="70%" height="6" />
                <rect x="0" y="140" rx="3" ry="3" width="50%" height="6" />
                <rect x="0" y="155" rx="3" ry="3" width="30%" height="6" />

                <rect x="0" y="185" rx="3" ry="3" width="70%" height="6" />

                <circle cx="13" cy="13" r="13" />
              </ContentLoader>
            )}
          </CardBody>
          {isW3loaded ? (
            <CardFooter pad={{ horizontal: "small" }} background="light-2">
              <Box
                direction="row"
                justify="between"
                width="xxlarge"
                margin={"medium"}
              >
                <Button size="large" type="reset" label="Reset" />
                <Button
                  type="submit"
                  //badge={true}
                  size="large"
                  label="Save"
                  disabled={!valid}
                  primary
                />
              </Box>
            </CardFooter>
          ) : null}
        </Card>
      </Form>
    </>
  );
};
