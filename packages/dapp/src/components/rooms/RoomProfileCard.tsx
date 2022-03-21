import React, { useState, useEffect, useRef } from "react";
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
} from "grommet";

import { HelpOption } from "grommet-icons";
import { useWindowsDimension } from "../../hooks/useWindowsDimension";
import {
  LoadScript,
  defaultRoomTypes,
  defaultCountries,
  defaultRoomTier,
  defaultFormValue,
  ResponsiveColumn,
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

  useEffect(() => {
    LoadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`,
      () => handleScriptLoad2(autoComplete2, setQuery2, autoCompleteRef2)
    );

    LoadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`,
      () => handleScriptLoad(autoComplete, setQuery, autoCompleteRef)
    );
  }, []);

  const [valid, setValid] = useState(false);
  const [isConntryOpen, setIsConntryOpen] = useState(false);
  const [isConntryOpen2, setIsConntryOpen2] = useState(false);

  //

  const [value, setValue] = useState(defaultFormValue);

  const { winWidth } = useWindowsDimension();

  const [roomTypeOption, setRoomTypeOption] = useState(defaultRoomTypes);
  const [roomTierOption, setRoomTierOption] = useState(defaultRoomTier);
  const [addressCountry, setAddressCountry] = useState(defaultCountries);
  const [addressObject, setaddressObject] = useState<any[]>([]);
  const [addressGeometry, setaddressGeometry] = useState<any>("");

  useEffect(() => {
    value.addressGeometry = addressGeometry;
  }, [addressGeometry]);

  useEffect(() => {
    if (Object.keys(addressObject).length > 0) {
      for (const component of addressObject) {
        const componentType = component.types[0];

        switch (componentType) {
          case "postal_code": {
            value.addressPostalCode = component.long_name;
            break;
          }
          case "locality":
            value.addressLocality = component.long_name;

            break;

          case "administrative_area_level_1":
            if (value.addressLocality == null || value.addressLocality === "") {
              value.addressLocality = component.long_name;
            }

            break;
          case "country":
            value.addressCountry = component.long_name;
            break;
        }
      }

      setIsConntryOpen(true);
      let tm = setTimeout(() => {
        setIsConntryOpen(false);
        clearTimeout(tm);
      }, 10);
    }
  }, [addressObject]);
  //

  const [operatorCountry, setOperatorCountry] = useState(defaultCountries);


  const handlePlaceSelect2 = async (autoComplete2: any, updateQuery2: any) => {
    const operatorObject = autoComplete2.getPlace();
    const query2 = operatorObject.formatted_address;
    updateQuery2(query2);

    value.operatorGeometry = `${operatorObject.geometry.location.lat()},${operatorObject.geometry.location.lng()}`;

    for (const component of operatorObject.address_components) {
      const componentType = component.types[0];

      switch (componentType) {
        case "postal_code": {
          value.operatorPostalCode = component.long_name;
          break;
        }
        case "locality":
          console.log("locality", component.long_name);
          value.operatorLocality = component.long_name;

          break;

        case "administrative_area_level_1":
          console.log("administrative_area_level_1", component.long_name);
          if (value.operatorLocality == null || value.operatorLocality === "") {
            value.operatorLocality = component.long_name;
          }

          break;
        case "country":
          value.operatorCountry = component.long_name;
          break;
      }
      setIsConntryOpen2(true);
      let tm2 = setTimeout(() => {
        setIsConntryOpen2(false);
        clearTimeout(tm2);
      }, 10);
    }

    console.log("operatorObject", operatorObject);

    //return operatorObject;
  };
  const handlePlaceSelect = async (autoComplete: any, updateQuery: any) => {
    const addressObject = autoComplete.getPlace();
    const query = addressObject.formatted_address;
    updateQuery(query);
    setaddressObject(addressObject.address_components);
    setaddressGeometry(
      `${addressObject.geometry.location.lat()},${addressObject.geometry.location.lng()}`
    );

   

    //console.log("addressObject", addressObject);

    return addressObject;
  };

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
    return autoComplete.addListener(
      "place_changed",
      () => handlePlaceSelect(autoComplete, updateQuery)
      //handlePlaceSelect(autoComplete,updateQuery)
    );
  }

  function handleScriptLoad2(
    //handlePlaceSelect: Function,
    autoComplete2: any,
    updateQuery2: any,
    autoCompleteRef2: any
  ): any {
    autoComplete2 = new window.google.maps.places.Autocomplete(
      autoCompleteRef2.current,
      { types: ["address"] }
      //    { types: ["(cities)"], componentRestrictions: { country: "us" } }
    );

     // alert("autoComplete2");
    console.log("autoComplete2", autoComplete2);

    autoComplete2.setFields([
      "formatted_address",
      "address_components",
      "geometry",
      //"name"
    ]);
    return autoComplete2.addListener(
      "place_changed",
      () => handlePlaceSelect2(autoComplete2, updateQuery2)
      //handlePlaceSelect(autoComplete,updateQuery)
    );
  }

  return (
    <>
      <Form
        value={value}
        validate="change"
        onReset={(event) => {
          setValue(defaultFormValue);
          console.log(event);
        }}
        onSubmit={(event) => console.log("Submit", event.value, event.touched)}
        onChange={(nextValue, { touched }) => {
          console.log("Change", nextValue, touched);
          setValue(nextValue);
        }}
        onValidate={(validationResults) => {
          // console.log("validationResults = ", validationResults);
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
            background="#fafafa"
            width="xxlarge"
          >
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
                <FormField style={{ padding: 10 }} label="Type" name="roomType">
                  <Select
                    name="roomType"
                    id="roomType"
                    placeholder="Select Room Type"
                    required
                    clear
                    options={roomTypeOption}
                    onClose={() => setRoomTypeOption(defaultRoomTypes)}
                  />
                </FormField>
                <FormField style={{ padding: 10 }} label="Tier" name="roomTier">
                  <Select
                    name="roomTier"
                    id="roomTier"
                    placeholder="Select Room Tier"
                    required
                    clear
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
                /*  style={{
                    display:
                      value.description === "" || value.description === null
                        ? "none"
                        : "block",
                  }}  */
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
                      onChange={(event) => setQuery(event.target.value)}
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
                      clear
                      open={isConntryOpen}
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
                  />

                  <FormField
                    style={{ padding: 10, marginLeft: 10 }}
                    label="Premise"
                    name="addressPremise"
                    required
                  />

                  <FormField
                    style={{ padding: 10, marginLeft: 10 }}
                    label="Geometry"
                    name="addressGeometry"
                    id="addressGeometry"
                    //value={addressGeometry}
                    required
                  />
                </div>

                <div
                /* style={{
                    display:
                      value.addressGeometry === "" ||
                      value.addressGeometry === null
                       ? "none"
                        : "block",
                  }}  */
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
                      Operator Address
                    </Heading>
                  </div>
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
                    />
                  </FormField>
                  <FormField
                    style={{ padding: 10, marginLeft: 10 }}
                    label="Postal Code"
                    name="operatorPostalCode"
                    id="operatorPostalCode"
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
                      open={isConntryOpen2}
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
                      onClose={() => setOperatorCountry(defaultCountries)}
                    />
                  </FormField>
                  <FormField
                    style={{ padding: 10, marginLeft: 10 }}
                    label="Subdivision"
                    name="operatorSubdivision"
                    required
                  />
                  <FormField
                    style={{ padding: 10, marginLeft: 10 }}
                    label="Premise"
                    name="operatorPremise"
                    required
                  />

                  <FormField
                    style={{ padding: 10, marginLeft: 10 }}
                    label="Geometry"
                    name="operatorGeometry"
                    id="operatorGeometry"
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
                  <Image
                    src="/interior-design.png"
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
                              <Button label="Delete file" onClick={onConfirm} />
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
                      onChange={(/* event */) => {
                        // const fileList = event.target.files;
                        // if (typeof fileList == "object" && fileList != null) {
                        //   for (let i = 0; i < fileList.length; i += 1) {
                        //     const file = fileList[i];
                        //   }
                        // }
                      }}
                    />
                  </FormField>
                </Box>
              </Box>
            </Grid>
          </CardBody>
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
                label="Update"
                disabled={!valid}
                primary
              />
            </Box>
          </CardFooter>
        </Card>
      </Form>
    </>
  );
};
