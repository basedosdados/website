import { useState } from "react";
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  VStack, 
  HStack, 
  Textarea,
  Box
} from "@chakra-ui/react";

import BodyText from "../../atoms/Text/BodyText";
import LabelText from "../../atoms/Text/LabelText";

export default function FeedbackModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialRating = null, 
  initialComment = "" 
}) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const handleSubmit = () => {
    if (rating !== null) {
      onSubmit(rating, comment);
    }
  };

  const handleClose = () => {
    setRating(initialRating);
    setComment(initialComment);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <LabelText typography="medium" fontWeight="600" color="#252A32">
            {t('feedback.title')}
          </LabelText>
        </ModalHeader>
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Rating Selection */}
            <Box>
              <LabelText typography="small" color="#252A32" marginBottom={2}>
                {t('feedback.question')}
              </LabelText>
              <HStack spacing={4} justify="center">
                <Button
                  size="lg"
                  variant={rating === 1 ? "solid" : "outline"}
                  backgroundColor={rating === 1 ? "#48BB78" : "transparent"}
                  color={rating === 1 ? "white" : "#616161"}
                  borderColor={rating === 1 ? "#48BB78" : "#E2E8F0"}
                  onClick={() => setRating(1)}
                  _hover={{
                    backgroundColor: rating === 1 ? "#48BB78" : "#F0FFF4",
                    borderColor: "#48BB78"
                  }}
                >
                  {t('feedback.good')}
                </Button>
                <Button
                  size="lg"
                  variant={rating === 0 ? "solid" : "outline"}
                  backgroundColor={rating === 0 ? "#E53E3E" : "transparent"}
                  color={rating === 0 ? "white" : "#616161"}
                  borderColor={rating === 0 ? "#E53E3E" : "#E2E8F0"}
                  onClick={() => setRating(0)}
                  _hover={{
                    backgroundColor: rating === 0 ? "#E53E3E" : "#FED7D7",
                    borderColor: "#E53E3E"
                  }}
                >
                  {t('feedback.bad')}
                </Button>
              </HStack>
            </Box>

            {/* Comment Input */}
            <Box>
              <LabelText typography="small" color="#252A32" marginBottom={2}>
                {t('feedback.comment_label')}
              </LabelText>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('feedback.comment_placeholder')}
                backgroundColor="white"
                borderColor="#E2E8F0"
                _focus={{
                  borderColor: "#3182CE",
                  boxShadow: "0 0 0 1px #3182CE"
                }}
                rows={4}
              />
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button
              variant="outline"
              onClick={handleClose}
              borderColor="#E2E8F0"
              color="#616161"
              _hover={{
                borderColor: "#CBD5E0",
                backgroundColor: "#F7FAFC"
              }}
            >
              {t('feedback.cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === null}
              backgroundColor="#3182CE"
              color="white"
              _hover={{
                backgroundColor: "#2C5AA0"
              }}
              _disabled={{
                backgroundColor: "#CBD5E0",
                cursor: "not-allowed"
              }}
            >
              {t('feedback.submit')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 