import { useState, useEffect } from "react";
import { Box, VStack, HStack, Text, Collapse, Button, Spinner, Fade } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useTranslation } from "next-i18next";
import BodyText from "../../atoms/Text/BodyText";
import LabelText from "../../atoms/Text/LabelText";

export default function StreamingThoughts2({ 
  steps = [], 
  isStreaming = false, 
  currentStep = null,
  isOpen = false,
  onToggle 
}) {
  const { t } = useTranslation('chatbot');
  const [expanded, setExpanded] = useState(isOpen);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setExpanded(isOpen);
  }, [isOpen]);

  // Force re-render when steps change to trigger animations
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [steps.length]);

  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (onToggle) {
      onToggle(newExpanded);
    }
  };

  // Don't render if no steps and not streaming
  if (!isStreaming && steps.length === 0) {
    return null;
  }

  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      bg="gray.50"
      p={3}
      mb={3}
      boxShadow="sm"
      transition="all 0.2s ease-in-out"
      _hover={{
        boxShadow: "md"
      }}
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={handleToggle}
        rightIcon={expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        width="100%"
        justifyContent="space-between"
        fontWeight="normal"
        color="gray.600"
        _hover={{ bg: "gray.100" }}
        p={2}
        h="auto"
        transition="all 0.2s ease-in-out"
      >
        <HStack spacing={2}>
          {isStreaming && (
            <Fade in={isStreaming}>
              <Spinner size="xs" color="blue.500" />
            </Fade>
          )}
          <LabelText typography="small" fontWeight="500">
            {isStreaming ? t('processing_request') : t('processing_completed')}
          </LabelText>
          {!isStreaming && steps.length > 0 && (
            <Text fontSize="xs" color="gray.500">
              ({steps.length} {steps.length === 1 ? 'passo' : 'passos'})
            </Text>
          )}
        </HStack>
      </Button>

      <Collapse in={expanded} animateOpacity>
        <VStack align="stretch" spacing={2} mt={2} key={animationKey}>
          {steps.map((step, index) => (
            <Fade 
              key={`${step.label}-${index}`} 
              in={true}
              transition={{ enter: { duration: 0.3, delay: index * 0.1 } }}
            >
              <Box
                p={3}
                bg="white"
                borderRadius="sm"
                border="1px solid"
                borderColor="gray.100"
                position="relative"
                transition="all 0.2s ease-in-out"
                _hover={{
                  borderColor: "gray.200",
                  boxShadow: "sm"
                }}
              >
                <HStack spacing={3} align="flex-start">
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg={index === steps.length - 1 && isStreaming ? "blue.500" : "green.500"}
                    flexShrink={0}
                    mt={1}
                    transition="all 0.2s ease-in-out"
                    boxShadow={index === steps.length - 1 && isStreaming ? "0 0 8px rgba(66, 153, 225, 0.5)" : "none"}
                  />
                  <VStack align="stretch" spacing={1} flex={1}>
                    <LabelText typography="small" fontWeight="600" color="gray.700">
                      {step.label || `Passo ${index + 1}`}
                    </LabelText>
                    <BodyText typography="small" color="gray.600" lineHeight="1.4">
                      {step.content || t('processing')}
                    </BodyText>
                  </VStack>
                  {index === steps.length - 1 && isStreaming && (
                    <Fade in={isStreaming}>
                      <Spinner size="xs" color="blue.500" />
                    </Fade>
                  )}
                </HStack>
              </Box>
            </Fade>
          ))}
          
          {isStreaming && currentStep && (
            <Fade in={isStreaming && !!currentStep}>
              <Box
                p={3}
                bg="blue.50"
                borderRadius="sm"
                border="1px solid"
                borderColor="blue.200"
                position="relative"
                transition="all 0.2s ease-in-out"
                _hover={{
                  borderColor: "blue.300",
                  boxShadow: "sm"
                }}
              >
                <HStack spacing={3} align="flex-start">
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg="blue.500"
                    flexShrink={0}
                    mt={1}
                    boxShadow="0 0 8px rgba(66, 153, 225, 0.5)"
                    animation="pulse 2s infinite"
                  />
                  <VStack align="stretch" spacing={1} flex={1}>
                    <LabelText typography="small" fontWeight="600" color="blue.700">
                      {currentStep.label || t('processing')}
                    </LabelText>
                    <BodyText typography="small" color="blue.600" lineHeight="1.4">
                      {currentStep.content || t('processing')}
                    </BodyText>
                  </VStack>
                  <Fade in={isStreaming}>
                    <Spinner size="xs" color="blue.500" />
                  </Fade>
                </HStack>
              </Box>
            </Fade>
          )}

          {/* Empty state when no steps but streaming */}
          {isStreaming && steps.length === 0 && !currentStep && (
            <Fade in={isStreaming && steps.length === 0}>
              <Box
                p={3}
                bg="blue.50"
                borderRadius="sm"
                border="1px solid"
                borderColor="blue.200"
                textAlign="center"
              >
                <HStack spacing={2} justify="center">
                  <Spinner size="xs" color="blue.500" />
                  <BodyText typography="small" color="blue.600">
                    {t('processing')}...
                  </BodyText>
                </HStack>
              </Box>
            </Fade>
          )}
        </VStack>
      </Collapse>
    </Box>
  );
}
