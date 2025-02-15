import {
  Stack,
  Box,
  Input,
  FormControl,
  FormLabel,
  Image,
  Tooltip,
  useDisclosure,
  SkeletonCircle,
  SkeletonText,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import ImageCrop from "../../molecules/ImgCrop";
import Checkbox from "../../atoms/Checkbox";
import LabelText from "../../atoms/Text/LabelText";
import BodyText from "../../atoms/Text/BodyText";
import { cleanString } from "../../../utils";

import {
  LabelTextForm,
  SkStack,
  InputForm,
  ErrorMessage,
  Button,
} from "../../molecules/uiUserPage";

import PenIcon from "../../../public/img/icons/penIcon";

export default function ProfileConfiguration({ userInfo }) {
  const { t } = useTranslation("user");
  const [isLoading, setIsLoading] = useState(true);
  const [isImgLoading, setIsImgLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    isEmailVisible: false,
    website: "",
    github: "",
    twitter: "",
    linkedin: "",
  });
  const [pictureProfile, setPictureProfile] = useState("");
  const [errors, setErrors] = useState({});
  const menuAvatar = useDisclosure();
  const pictureModal = useDisclosure();
  const [picture, setPicture] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  useEffect(() => {
    if (Object.keys(userInfo).length === 0) return null;

    setFormData({
      firstName: userInfo?.firstName,
      lastName: userInfo?.lastName || "",
      isEmailVisible: userInfo?.isEmailVisible,
      website: userInfo?.website || "",
      github: userInfo?.github || "",
      twitter: userInfo?.twitter || "",
      linkedin: userInfo?.linkedin || "",
    });

    setPictureProfile(userInfo?.picture || "");

    setTimeout(() => {
      setIsLoading(false);
    }, [1000]);
  }, [userInfo]);

  useEffect(() => {
    setIsImgLoading(isLoading);
  }, [isLoading]);

  function handleInputChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  function handleCheckboxChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      isEmailVisible: !formData.isEmailVisible,
    }));
  }

  async function handleUpdateProfile() {
    setIsLoading(true);
    const validationErrors = {};

    if (!formData.firstName) {
      validationErrors.firstName = t("username.requiredField");
    }
    if (/\s/.test(formData.website)) {
      validationErrors.website = t("username.noSpaces");
    }
    if (/\s/.test(formData.github)) {
      validationErrors.github = t("username.noSpaces");
    }
    if (/\s/.test(formData.twitter)) {
      validationErrors.twitter = t("username.noSpaces");
    }
    if (/\s/.test(formData.linkedin)) {
      validationErrors.linkedin = t("username.noSpaces");
    }
    if (formData.website) {
      if (!formData.website.startsWith("http"))
        validationErrors.website = t("username.invalidURL");
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return setIsLoading(false);
    } else {
      const reg = new RegExp("(?<=:).*");
      const [id] = reg.exec(userInfo?.id);
      const form = { ...formData, id: id };

      const result = await fetch(
        `/api/user/updateProfile?p=${btoa(form.id)}&f=${btoa(cleanString(form.firstName))}&l=${btoa(cleanString(form?.lastName || "") || "null")}&e=${btoa(form?.isEmailVisible || "false")}&w=${btoa(form?.website || "null")}&g=${btoa(form?.github || "null")}&t=${btoa(form?.twitter || "null")}&li=${btoa(form?.linkedin || "null")}`,
        { method: "GET" },
      ).then((res) => res.json());

      if (result.errors.length > 0) {
        result.errors.map((elm) => {
          console.error(`Campo ${elm.field}: ${elm.messages}`);
        });
      }

      const userData = await fetch(`/api/user/getUser?p=${btoa(id)}`, {
        method: "GET",
      }).then((res) => res.json());
      cookies.set("userBD", JSON.stringify(userData));
      setIsLoading(false);
    }
  }

  const handleImageChange = (event) => {
    const input = event.target;

    if (input.files && input.files[0]) {
      const fileType = input.files[0].type;
      if (
        fileType === "image/png" ||
        fileType === "image/jpeg" ||
        fileType === "image/jpg"
      ) {
        const reader = new FileReader();
        reader.onload = function (e) {
          setPicture(e.target.result);
        };
        pictureModal.onOpen();
        reader.readAsDataURL(input.files[0]);
      } else {
        setPicture(null);
        input.value = "";
      }
    }
  };

  async function hanlderRemovePicture() {
    setIsImgLoading(true);
    menuAvatar.onClose();
    const reg = new RegExp("(?<=:).*");
    const [id] = reg.exec(userInfo.id);

    const res = await fetch(`/api/user/deletePictureProfile?p=${btoa(id)}`, {
      method: "GET",
    }).then((res) => res.json());

    if (res?.ok === true) {
      const userData = await fetch(`/api/user/getUser?p=${btoa(id)}`, {
        method: "GET",
      }).then((res) => res.json());
      cookies.set("userBD", JSON.stringify(userData));
      window.location.reload();
    }
  }

  useEffect(() => {
    setPicture(null);
    setFileInputKey(Date.now());
  }, [pictureModal.isOpen === false]);

  return (
    <Stack
      flexDirection={{ base: "column-reverse", lg: "row" }}
      spacing={0}
      gap="24px"
    >
      <Box
        display={isImgLoading ? "flex" : "none"}
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        zIndex="99999"
      />

      <ImageCrop
        isOpen={pictureModal.isOpen}
        onClose={pictureModal.onClose}
        src={picture}
        id={userInfo.id}
        username={userInfo.username}
        email={userInfo.email}
      />

      <Stack spacing="24px" flex={1} maxWidth="480px">
        <FormControl isInvalid={!!errors.firstName}>
          <LabelTextForm text={t("username.firstName")} />
          <SkStack isLoaded={!isLoading}>
            <InputForm
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder={t("username.enterFirstName")}
            />
          </SkStack>
          <ErrorMessage>{errors.firstName}</ErrorMessage>
        </FormControl>

        <FormControl>
          <LabelTextForm text={t("username.lastName")} />
          <SkStack isLoaded={!isLoading}>
            <InputForm
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder={t("username.enterLastName")}
            />
          </SkStack>
        </FormControl>

        <FormControl>
          <LabelTextForm text={t("username.email")} />
          <SkeletonText
            isLoaded={!isLoading}
            fadeDuration={2}
            height="48px"
            width="100%"
            noOfLines={2}
            startColor="#F0F0F0"
            endColor="#F3F3F3"
          >
            <label
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                cursor: "pointer",
                alignItems: "center",
                padding: "15px",
                color: "#464A51",
                fontFamily: "Roboto",
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "20px",
              }}
            >
              <Checkbox
                id="isEmailVisible"
                name="isEmailVisible"
                defaultChecked={formData.isEmailVisible}
                checked={formData.isEmailVisible}
                onChange={handleCheckboxChange}
              />
              {t("username.makeEmailPublic")}
            </label>
          </SkeletonText>
        </FormControl>

        <FormControl isInvalid={!!errors.website}>
          <LabelTextForm text={t("username.url")} />
          <SkStack isLoaded={!isLoading}>
            <InputForm
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder={t("username.enterURL")}
            />
          </SkStack>
          <ErrorMessage>{errors.website}</ErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.github}>
          <LabelTextForm text={t("username.github")} />
          <SkStack isLoaded={!isLoading}>
            <InputForm
              id="github"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              placeholder={t("username.githubProfileLink")}
            />
          </SkStack>
          <ErrorMessage>{errors.github}</ErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.twitter}>
          <LabelTextForm text={t("username.twitter")} />
          <SkStack isLoaded={!isLoading}>
            <InputForm
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              placeholder={t("username.twitterProfileLink")}
            />
          </SkStack>
          <ErrorMessage>{errors.twitter}</ErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.linkedin}>
          <LabelTextForm text={t("username.linkedIn")} />
          <SkStack isLoaded={!isLoading}>
            <InputForm
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder={t("username.linkedinProfileLink")}
            />
          </SkStack>
          <ErrorMessage>{errors.linkedin}</ErrorMessage>
        </FormControl>

        <LabelText typography="small" fontWeight="400" color="#71757A">
          {t("username.shareInfo")}
        </LabelText>

        <Button onClick={() => handleUpdateProfile()} isLoading={isLoading}>
          {t("username.updateProfile")}
        </Button>
      </Stack>

      <Stack
        flex={1}
        spacing="8px"
        alignItems={{ base: "start", lg: "center" }}
      >
        <LabelText>{t("username.profilePicture")}</LabelText>

        <SkeletonCircle
          position="relative"
          height="200px"
          width="200px"
          startColor="#F0F0F0"
          endColor="#F3F3F3"
          isLoaded={!isImgLoading}
          fadeDuration={2}
        >
          <Box position="relative" width="200px" height="200px">
            <Box borderRadius="50%" overflow="hidden">
              <Image
                src={
                  pictureProfile
                    ? pictureProfile
                    : "https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"
                }
                width="100%"
                height="100%"
              />
            </Box>

            <Popover
              returnFocusOnClose={false}
              isOpen={menuAvatar.isOpen}
              onClose={menuAvatar.onClose}
            >
              <PopoverTrigger>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="absolute"
                  cursor="pointer"
                  bottom="10px"
                  left="10px"
                  width="48px"
                  height="48px"
                  borderRadius="50%"
                  backgroundColor="#2B8C4D"
                  onClick={() => {
                    menuAvatar.onOpen();
                  }}
                >
                  <Tooltip
                    hasArrow
                    placement="top"
                    isDisabled={menuAvatar.isOpen}
                    label={t("username.edit")}
                    padding="16px"
                    backgroundColor="#252A32"
                    boxSizing="border-box"
                    borderRadius="8px"
                    fontFamily="Roboto"
                    fontWeight="400"
                    fontSize="14px"
                    lineHeight="20px"
                    textAlign="center"
                    color="#FFFFFF"
                    maxWidth="230px"
                    marginTop="10px"
                    minWidth="96px"
                  >
                    <PenIcon width="24px" height="24px" fill="#FFF" />
                  </Tooltip>
                </Box>
              </PopoverTrigger>
              <PopoverContent
                width="100%"
                boxShadow="0 1.6px 16px 0 rgba(100, 96, 103, 0.16) !important"
              >
                <PopoverArrow />
                <PopoverBody padding="8px 24px" zIndex="100 !important">
                  <FormControl>
                    <FormLabel
                      cursor="pointer"
                      fontFamily="Roboto"
                      fontSize="14px"
                      lineHeight="20px"
                      fontWeight="400"
                      color="#252A32"
                      margin="0"
                      _hover={{ color: "#2B8C4D" }}
                    >
                      {t("username.updatePicture")}
                    </FormLabel>
                    <Input
                      key={fileInputKey}
                      display="none"
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      onChange={handleImageChange}
                    />
                  </FormControl>

                  <BodyText
                    typography="small"
                    paddingTop="8px"
                    cursor="pointer"
                    _hover={{ color: "#2B8C4D" }}
                    onClick={() => hanlderRemovePicture()}
                  >
                    {t("username.removePicture")}
                  </BodyText>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        </SkeletonCircle>
      </Stack>
    </Stack>
  );
}
