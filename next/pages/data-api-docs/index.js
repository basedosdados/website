import { Box, Grid, GridItem, VStack, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, Code } from "@chakra-ui/react";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPageTemplate } from "../../components/templates/main";
import { useState, useEffect } from 'react';
import { capitalize } from 'lodash';
import { useRouter } from 'next/router';
import Link from 'next/link';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu', 'dataAPI'])),
    },
    revalidate: 60,
  };
}

export default function DataAPIDocs() {
  const { locale } = useRouter();
  const { t } = useTranslation('dataAPI');
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [endpointDetails, setEndpointDetails] = useState(null);
  const [categories, setCategories] = useState([]);
  const [endpoints, setEndpoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('overview');

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching data for locale:', locale);
        
        const [categoriesRes, endpointsRes] = await Promise.all([
          fetch(`/api/dataAPI/getDataAPIEndpointCategories?locale=${locale}`, { method: "GET" }),
          fetch(`/api/dataAPI/getDataAPIEndpoints?locale=${locale}`, { method: "GET" })
        ]);

        const [categoriesData, endpointsData] = await Promise.all([
          categoriesRes.json(),
          endpointsRes.json()
        ]);

        console.log('Categories API response:', categoriesData);
        console.log('Endpoints API response:', endpointsData);

        const processedCategories = Object.values(categoriesData?.resource || {});
        const processedEndpoints = Object.values(endpointsData?.resource || {});

        console.log('Processed categories:', processedCategories);
        console.log('Processed endpoints:', processedEndpoints);

        setCategories(processedCategories);
        setEndpoints(processedEndpoints);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories([]);
        setEndpoints([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [locale]);

  useEffect(() => {
    console.log('Current categories:', categories);
    console.log('Current endpoints:', endpoints);
  }, [categories, endpoints]);

  useEffect(() => {
    if (selectedEndpoint && endpoints.length > 0) {
      const selected = endpoints.find(endpoint => endpoint._id === selectedEndpoint);
      setEndpointDetails(selected);
    }
  }, [selectedEndpoint, endpoints]);

  return (
    <MainPageTemplate>
      <Text
        fontSize="4xl"
        fontWeight="bold"
        textAlign="center"
        mb={8}
        mt={4}
      >
        {t('title')}
      </Text>
      <Grid
        templateColumns={{ base: "1fr", md: "250px 1fr" }}
        gap={8}
        width="100%"
        maxWidth="1200px"
        margin="0 auto"
        padding="24px"
      >
        {/* Left Sidebar */}
        <GridItem>
          <VStack align="stretch" spacing={6} position="sticky" top="24px">
            <Box>
              <Text fontWeight="bold" fontSize="xl" mb={4}>
                {t('gettingStarted.title')}
              </Text>
              <VStack align="stretch" pl={4} mb={6}>
                <Text 
                  cursor="pointer" 
                  _hover={{ color: "blue.500" }}
                  color={!selectedEndpoint && selectedSection === 'overview' ? "blue.500" : "inherit"}
                  onClick={() => {
                    setSelectedEndpoint(null);
                    setSelectedSection('overview');
                  }}
                >
                  {t('overview.title')}
                </Text>
                <Text 
                  cursor="pointer" 
                  _hover={{ color: "blue.500" }}
                  color={!selectedEndpoint && selectedSection === 'authentication' ? "blue.500" : "inherit"}
                  onClick={() => {
                    setSelectedEndpoint(null);
                    setSelectedSection('authentication');
                  }}
                >
                  {t('authentication.title')}
                </Text>
                <Text 
                  cursor="pointer" 
                  _hover={{ color: "blue.500" }}
                  color={!selectedEndpoint && selectedSection === 'pricing' ? "blue.500" : "inherit"}
                  onClick={() => {
                    setSelectedEndpoint(null);
                    setSelectedSection('pricing');
                  }}
                >
                  {t('pricing.title')}
                </Text>
              </VStack>
            </Box>

            <Box>
              <Text fontWeight="bold" fontSize="xl" mb={4}>
                {t('endpoints.title')}
              </Text>
              <VStack align="stretch">
                {categories.map((category) => (
                  <Box key={category._id}>
                    <Text fontWeight="semibold" mb={2}>
                      {category[`name${capitalize(locale)}`] || category.name}
                    </Text>
                    <VStack align="stretch" pl={4} mb={4}>
                      {endpoints
                        .filter(endpoint => endpoint.category?._id === category._id && endpoint.isActive)
                        .map(endpoint => (
                          <Text
                            key={endpoint._id}
                            cursor="pointer"
                            color={selectedEndpoint === endpoint._id ? "blue.500" : "inherit"}
                            _hover={{ color: "blue.500" }}
                            onClick={() => setSelectedEndpoint(endpoint._id)}
                          >
                            {endpoint[`name${capitalize(locale)}`] || endpoint.name}
                          </Text>
                        ))}
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          </VStack>
        </GridItem>

        {/* Main Content */}
        <GridItem>
          {selectedEndpoint ? (
            endpointDetails && (
              <VStack align="stretch" spacing={6}>
                <Text fontSize="2xl" fontWeight="bold">
                  {endpointDetails[`name${capitalize(locale)}`] || endpointDetails.name}
                </Text>
                
                {/* Status Indicators */}
                <Box>
                  {endpointDetails.isDeprecated && (
                    <Text color="red.500" fontWeight="semibold" mb={2}>
                      ⚠️ {t('endpoints.deprecated')}
                    </Text>
                  )}
                  {!endpointDetails.isActive && (
                    <Text color="orange.500" fontWeight="semibold" mb={2}>
                      ⚠️ {t('endpoints.inactive')}
                    </Text>
                  )}
                </Box>

                {/* Description */}
                <Box>
                  <Text fontWeight="bold" mb={2}>{t('endpoints.description')}</Text>
                  <Text>{endpointDetails[`description${capitalize(locale)}`] || endpointDetails.description}</Text>
                </Box>
                
                {/* Endpoint URL */}
                <Box>
                  <Text fontWeight="bold" mb={2}>{t('endpoints.endpointURL')}</Text>
                  <Code p={4} borderRadius="md" display="block">
                    https://api.basedosdados.org/data?category={endpointDetails.category.slug}&endpoint={endpointDetails.slug}&parameters={"<PARAMETER1:VALUE1,PARAMETER2:VALUE2>"}&key={"<API_KEY>"}
                  </Code>
                </Box>

                {/* Parameters */}
                {endpointDetails.parameters && Object.keys(endpointDetails.parameters).length > 0 && (
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" mb={4}>{t('endpoints.parameters')}</Text>
                    <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4}>
                      {Object.values(endpointDetails.parameters).map((param) => (
                        <Box 
                          key={param._id} 
                          p={4} 
                          borderWidth={1} 
                          borderRadius="md"
                          backgroundColor="gray.50"
                        >
                          <Text fontWeight="semibold" color="blue.600">
                            {param[`name${capitalize(locale)}`] || param.name}
                            {param.required && <Text as="span" color="red.500">*</Text>}
                          </Text>
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            {param.type?.name}
                          </Text>
                          <Text>{param[`description${capitalize(locale)}`] || param.description}</Text>
                        </Box>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Pricing Tiers */}
                {endpointDetails.pricingTiers && Object.keys(endpointDetails.pricingTiers).length > 0 && (
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" mb={4}>{t('endpoints.pricingTiers')}</Text>
                    <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                      {Object.values(endpointDetails.pricingTiers).map((tier) => (
                        <Box 
                          key={tier._id}
                          p={4}
                          borderWidth={1}
                          borderRadius="md"
                          backgroundColor="blue.50"
                        >
                          <Text fontWeight="semibold" mb={2}>
                            {tier.minRequests} - {tier.maxRequests || '∞'} {t('endpoints.requests')}
                          </Text>
                          <Text>
                            {tier.pricePerRequest} {tier.currency?.[`name${capitalize(locale)}`] || tier.currency?.name} / {t('endpoints.request')}
                          </Text>
                        </Box>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Last Updated */}
                <Text fontSize="sm" color="gray.600" mt={4}>
                  {t('endpoints.lastUpdated')}: {new Date(endpointDetails.updatedAt).toLocaleDateString()}
                </Text>
              </VStack>
            )
          ) : (
            <VStack align="stretch" spacing={6}>
              {selectedSection === 'overview' ? (
                <>
                  <Box
                    p={4}
                    mb={6}
                    bg="yellow.100"
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderColor="yellow.400"
                  >
                    <Text fontWeight="bold" mb={2}>
                      {t('overview.earlyRelease')} 🚧
                    </Text>
                    <Text>
                      {t('overview.earlyReleaseDescription')}
                    </Text>
                  </Box>
                  <Text fontSize="2xl" fontWeight="bold">
                    {t('overview.title')}
                  </Text>
                  <Text>
                    {t('overview.welcome')}
                  </Text>
                  <Text>
                    {t('overview.description')}
                  </Text>
                  <Text>
                    {t('overview.descriptionPricing')}
                  </Text>
                  <Box>
                    <Text fontWeight="bold" mb={2}>{t('overview.baseURL')}</Text>
                    <Code p={4} borderRadius="md" display="block">
                      api.basedosdados.org/data
                    </Code>
                  </Box>
                </>
              ) : selectedSection === 'authentication' ? (
                <>
                  <Text fontSize="2xl" fontWeight="bold">
                    {t('authentication.title')}
                  </Text>
                  <Text>
                    {t('authentication.description')}
                  </Text>
                  <Box>
                    <Text fontWeight="bold" mb={2}>{t('authentication.apiKey')}</Text>
                    <Text mb={4}>
                      {t('authentication.getApiKeyBy')}
                    </Text>
                    <VStack align="stretch" spacing={2} pl={4}>
                      <Text>1. {t('authentication.getApiKeyBy1')}</Text>
                      <Text>2. {t('authentication.getApiKeyBy2Contactus')} <Link href="/contact" fontWeight="700">{t('authentication.getApiKeyBy2ContactusLink')}</Link>.</Text>
                    </VStack>
                    <br></br>
                    <Text>
                      {t('authentication.weWillAnswerYou')}
                    </Text>
                  </Box>
                </>
              ) : (
                <>
                  <Text fontSize="2xl" fontWeight="bold">
                    {t('pricing.title')}
                  </Text>
                  <Text>
                    {t('pricing.description')}
                  </Text>
                  <Box>
                    <Text mb={4}>
                      {t('pricing.addCredits')}
                    </Text>
                    <VStack align="stretch" spacing={2} pl={4}>
                      <Text>{t('pricing.step1')}</Text>
                      <Text>{t('pricing.step2')}</Text>
                      <Text>{t('pricing.step3')}</Text>
                    </VStack>
                    <Text mt={4} fontStyle="italic">
                      {t('pricing.note')}
                    </Text>
                  </Box>
                </>
              )}
            </VStack>
          )}
        </GridItem>
      </Grid>
    </MainPageTemplate>
  );
} 