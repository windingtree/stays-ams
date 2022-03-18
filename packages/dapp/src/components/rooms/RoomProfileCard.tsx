import React, { useState } from "react";
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
} from "grommet";

import { HelpOption } from "grommet-icons";
import { useWindowsDimension } from "../../hooks/useWindowsDimension";

export const RoomProfileCard: React.FC<{
  imageUrl?: string;
  name?: string | null;
  location?: string | null;
  price?: string | null;
}> = ({ imageUrl, name, location, price }) => {
  const defaultValue = {
    roomName: "",
    description: "",
    roomType: [],
  };

  const defaultSelectOptions: any[] = [
    { label: "Superior Single", value: 1 },
    { label: "Superior Twin", value: 2 },
    { label: "Deluxe King", value: 3 },
    { label: "Swiss Suite", value: 4 },
    { label: "Diplomatic Suite", value: 5 },
    { label: "Presidential Suite", value: 6 },
    { label: "Event Hall", value: 7 },
  ];

  //const [selectValue, setSelectValue] = useState("");

  const [valid, setValid] = useState(false);

  const [value, setValue] = useState(defaultValue);

  const { winWidth } = useWindowsDimension();

  const [options, setOptions] = useState(defaultSelectOptions);

  const ResponsiveColumn = () => {
    if (winWidth >= 1300) {
      return ["65%", "35%"];
    } else if (winWidth >= 1000) {
      return ["65%", "35%"];
    } else if (winWidth >= 768) {
      return ["60%", "40%"];
    } else if (winWidth >= 600) {
      return ["large"];
    } else if (winWidth <= 500) {
      return ["xlarge"];
    } else if (winWidth <= 400) {
      return ["large"];
    }
  };

  return (
    <>
      <Form
        value={value}
        validate="change"
        onReset={(event) => {
          setValue(defaultValue);
          console.log(event);
        }}
        onSubmit={(event) => console.log("Submit", event.value, event.touched)}
        onChange={(nextValue, { touched }) => {
          console.log("Change", nextValue, touched);
          setValue(nextValue);
        }}
        onValidate={(validationResults) => {
          console.log("validationResults = ", validationResults);
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
              columns={ResponsiveColumn()}
              //gap="xxsmall"
              responsive={true}
            >
              <Box>
                <FormField
                  style={{ padding: 20 }}
                  label="Room Name"
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

                <FormField
                  style={{ padding: 20 }}
                  label="Room Type"
                  name="roomType"
                >
                  <Select
                    // size="medium"
                    placeholder="Select Room Type"
                    required
                    clear
                    labelKey="label"
                    valueKey="value"
                    value={value}
                    options={options}
                    //onChange={({ option }) => setValue(option)}
                    onChange={(nextValue) => {
                      console.log("Change", nextValue.option);
                      value.roomType = nextValue.option;
                      console.log(value);
                      //setValue();
                    }}
                    onClose={() => setOptions(defaultSelectOptions)}
                  />
                </FormField>

                <FormField
                  style={{ padding: 20 }}
                  label="Room Description"
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

                <FormField
                  style={{ padding: 20 }}
                  label="Room Terms & Conditions"
                  name="roomTerms"
                  id="roomTerms"
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
                      maxSize={500}
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
