import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import cookies from "js-cookie";
import {
  Box,
  Stack,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Text,
  Skeleton,
} from "@chakra-ui/react";
import Head from "next/head";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";
import { isMobileMod } from "../hooks/useCheckMobile.hook";
import { triggerGAEventWithData } from "../utils";

import { getAllFAQs } from "./api/faqs";

import Display from "../components/atoms/Text/Display";
import TitleText from "../components/atoms/Text/TitleText";
import BodyText from "../components/atoms/Text/BodyText";
import LabelText from "../components/atoms/Text/LabelText";
import QuestionsBox from "../components/molecules/QuestionsBox";
import TypewriterConsole from "../components/atoms/TypewriterConsole";
import Button from "../components/atoms/Button";
import Toggle from "../components/atoms/Toggle";
import CheckIcon from "../public/img/icons/checkIcon";

export async function getStaticProps({ locale }) {
  const faqs = await getAllFAQs(locale, "chatbot/FAQ");
  const pagesProps = await withPages();
  return {
    props: {
      ...pagesProps,
      ...(await serverSideTranslations(locale, ["common", "menu", "chatbot", "prices"])),
      faqs,
    },
    revalidate: 30,
  };
}

function filterChatbotPlans(edges) {
  return edges.filter((item) => {
    const name = item.node.productName?.toLowerCase() || "";
    const slug = item.node.productSlug?.toLowerCase() || "";
    const isConsumerChatbot =
      (name.includes("chatbot") || slug.includes("chatbot")) &&
      !name.includes("empresas");
    return (
      isConsumerChatbot &&
      item.node.isActive === true
    );
  });
}

async function fetchChatbotPlans() {
  const result = await fetch("/api/stripe/getPlans", { method: "GET" }).then(
    (res) => res.json()
  );

  if (!result.success) return null;

  const chatbotPlans = filterChatbotPlans(result.data);

  function findByInterval(interval, amount) {
    return (
      chatbotPlans.find(
        (item) =>
          item.node.interval === interval &&
          item.node.amount === amount
      )?.node ?? null
    );
  }

  return {
    month: findByInterval("month", 30),
    year: findByInterval("year", 326),
  };
}

function ChatbotPricingCardSkeleton() {
  const skeletonProps = {
    startColor: "#F0F0F0",
    endColor: "#F3F3F3",
    borderRadius: "6px",
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100%"
      minHeight={{ base: "auto", lg: "480px" }}
      borderRadius="16px"
      boxShadow="0 2px 16px 0 rgba(100, 96, 103, 0.16)"
      padding="40px 24px"
      backgroundColor="#FFFFFF"
    >
      <Box
        display="flex"
        width="100%"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap="8px"
        marginBottom="24px"
      >
        <Skeleton
          width="40px"
          height="24px"
          borderRadius="full"
          {...skeletonProps}
        />
        <Skeleton height="24px" width="140px" {...skeletonProps} />
        <Skeleton
          height="32px"
          width="72px"
          borderRadius="4px"
          startColor="#F0F0F0"
          endColor="#F3F3F3"
        />
      </Box>

      <Skeleton
        height="28px"
        width="92%"
        margin="0 auto 8px"
        {...skeletonProps}
      />
      <Skeleton
        height="28px"
        width="75%"
        margin="0 auto 24px"
        {...skeletonProps}
      />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginBottom="32px"
      >
        <Skeleton
          height="60px"
          width="120px"
          margin="0 auto"
          {...skeletonProps}
        />
        <Skeleton
          height="24px"
          width="200px"
          marginTop="16px"
          {...skeletonProps}
        />
      </Box>

      <VStack align="stretch" spacing="8px" flex={1} marginBottom="32px">
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="8px"
            padding="8px"
          >
            <Skeleton
              width="24px"
              height="24px"
              flexShrink={0}
              borderRadius="4px"
              startColor="#F0F0F0"
              endColor="#F3F3F3"
            />
            <Skeleton height="20px" flex={1} {...skeletonProps} />
          </Box>
        ))}
      </VStack>

      <Box marginTop="auto" width="100%">
        <Skeleton
          height="48px"
          width="100%"
          borderRadius="8px"
          startColor="#F0F0F0"
          endColor="#F3F3F3"
        />
        <Skeleton
          height="20px"
          width="80%"
          margin="16px auto 0"
          {...skeletonProps}
        />
      </Box>
    </Box>
  );
}

function ChatbotPricingCard({ highlightedFeature }) {
  const { t } = useTranslation(["chatbot", "prices"]);
  const router = useRouter();
  const { locale } = router;

  const [toggleAnual, setToggleAnual] = useState(true);
  const [plans, setPlans] = useState(null);
  const [username, setUsername] = useState(null);
  const [hasSubscribed, setHasSubscribed] = useState(true);
  const [isBDChatbot, setIsBDChatbot] = useState({ isCurrentPlan: false });
  const [isLoading, setIsLoading] = useState(true);

  const features = t("plans.chatbot.features", {
    returnObjects: true,
    ns: "prices",
  });

  const selectedPlan = toggleAnual ? plans?.year : plans?.month;
  const totalPrice = selectedPlan?.amount ?? (toggleAnual ? 326 : 30);
  const displayPrice = toggleAnual
    ? Math.ceil(totalPrice / 12)
    : totalPrice;

  const planInterval = toggleAnual ? "year" : "month";
  const isCurrentPlan =
    isBDChatbot.isCurrentPlan && isBDChatbot.planInterval === planInterval;

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      let user = null;
      if (cookies.get("userBD")) {
        user = JSON.parse(cookies.get("userBD"));
      }

      const promises = [fetchChatbotPlans()];

      if (user) {
        const reg = new RegExp("(?<=:).*");
        const match = reg.exec(user.id);
        if (match) {
          const [id] = match;
          promises.push(
            fetch(`/api/user/getAlreadySubscribed?p=${btoa(id)}`)
              .then((res) => res.json())
              .then(setHasSubscribed)
              .catch(() => setHasSubscribed(false))
          );
        } else {
          setHasSubscribed(false);
        }

        const internalNodes =
          user?.internalSubscription?.edges?.map((e) => e?.node) || [];
        const chatbotNode = internalNodes.find((n) =>
          (n?.stripeSubscription || "").toLowerCase().includes("chatbot")
        );

        setUsername(user?.username);
        setIsBDChatbot({
          isCurrentPlan: !!chatbotNode,
          planInterval: chatbotNode?.planInterval,
        });
      } else {
        setHasSubscribed(false);
      }

      const [chatbotPlans] = await Promise.all(promises);
      if (chatbotPlans) setPlans(chatbotPlans);
      setIsLoading(false);
    }

    loadData();
  }, []);

  const handleSubscribe = () => {
    triggerGAEventWithData("bd_chatbot_card_price", {
      plan_interval: planInterval,
      is_free_trial: !hasSubscribed,
      source: "chatbot_lp",
    });

    if (selectedPlan?._id) {
      cookies.set("plan_selected", selectedPlan._id, { expires: 1, path: "/" });
    }

    if (username === null) {
      router.push("/user/login");
      return;
    }

    router.push(`/user/${username}?plans_and_payment`);
  };

  const buttonLabel = isCurrentPlan
    ? t("currentPlan", { ns: "prices" })
    : hasSubscribed
      ? t("subscribe", { ns: "prices" })
      : t("startFreeTrial", { ns: "prices" });

  if (isLoading) {
    return <ChatbotPricingCardSkeleton />;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100%"
      borderRadius="16px"
      boxShadow="0 2px 16px 0 rgba(100, 96, 103, 0.16)"
      padding="40px 24px"
      backgroundColor="#FFFFFF"
    >
      <Box
        display="flex"
        width="100%"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap="8px"
        marginBottom="24px"
      >
        <Toggle
          id="toggle-chatbot-lp-price"
          defaultChecked
          value={toggleAnual}
          onChange={() => setToggleAnual(!toggleAnual)}
        />
        <LabelText
          typography="large"
          position="relative"
          top="-2px"
          gap="8px"
          display="flex"
          fontWeight="400"
          alignItems="center"
          textAlign="center"
        >
          {t("annualDiscount", { ns: "prices" })}
          <LabelText
            typography="large"
            as="span"
            color="#2B8C4D"
            backgroundColor="#D5E8DB"
            padding="2px 4px"
            borderRadius="4px"
            height="32px"
          >
            {t("save20", { ns: "prices" })}
          </LabelText>
        </LabelText>
      </Box>

      <TitleText typography="large" textAlign="center" marginBottom="24px">
        {t("pricingCard.title")}
      </TitleText>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginBottom="32px"
      >
        <Box
          display="flex"
          flexDirection="row"
          height="60px"
          alignItems="center"
        >
          <Display textAlign="center">R$ {displayPrice}</Display>
          <TitleText
            typography="small"
            position="relative"
            top="16px"
            right="-4px"
            textAlign="center"
          >
            {t("perMonth", { ns: "prices" })}
          </TitleText>
        </Box>
        <BodyText
          height="24px"
          color="#464A51"
          marginTop="16px"
          textAlign="center"
        >
          {toggleAnual &&
            t("annualBillingMessage", {
              ns: "prices",
              price: totalPrice.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 0,
              }),
            })}
        </BodyText>
      </Box>

      <VStack align="stretch" spacing="8px" flex={1} marginBottom="32px">
        {features.map((feature, index) => {
          const isHighlighted = highlightedFeature === index;

          return (
            <Box
              key={feature}
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap="8px"
              padding="8px"
              borderRadius="8px"
              backgroundColor={isHighlighted ? "#E8F5EC" : "transparent"}
              transition="background-color 0.25s ease"
            >
              <CheckIcon width="24px" height="24px" fill="#2B8C4D" />
              <BodyText
                alignItems="center"
                color={isHighlighted ? "#252A32" : "#464A51"}
                fontWeight={isHighlighted ? "500" : "400"}
              >
                {feature}
              </BodyText>
            </Box>
          );
        })}
      </VStack>

      <Box marginTop="auto" width="100%">
        {isCurrentPlan ? (
          <LabelText
            typography="x-large"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="48px"
            textAlign="center"
            color="#7D7D7D"
          >
            {buttonLabel}
          </LabelText>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
            borderRadius="8px"
            backgroundColor="#2B8C4D"
            padding="12px 16px"
            cursor="pointer"
            color="#FFF"
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="20px"
            lineHeight="36px"
            onClick={handleSubscribe}
            _hover={{ backgroundColor: "#22703E" }}
          >
            {buttonLabel}
          </Box>
        )}

        <BodyText
          display="flex"
          flexDirection="row"
          justifyContent="center"
          textAlign="center"
          color="#71757A"
          marginTop="16px"
        >
          {t("readThe", { ns: "prices" })}
          <Link href="/terms?section=terms" locale={locale} passHref>
            <BodyText
              as="span"
              cursor="pointer"
              marginLeft="4px"
              alignItems="center"
              color="#0068C5"
              _hover={{ color: "#0057A4" }}
            >
              {t("termsOfService", { ns: "prices" })}
            </BodyText>
          </Link>
        </BodyText>
      </Box>
    </Box>
  );
}

function WhyChatbotSection() {
  const { t, ready } = useTranslation("chatbot");
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = isMobileMod();

  if (!ready) return null;

  let items = t("why.items", { returnObjects: true });
  if (!Array.isArray(items) && items && typeof items === "object") {
    items = Object.values(items);
  }
  if (!Array.isArray(items)) return null;

  return (
    <VStack
      width="100%"
      maxWidth="1440px"
      margin="0 auto"
      padding="80px 24px"
      spacing="0"
      gap="80px"
    >
      <Display
        as="h2"
        typography={isMobile ? "small" : "medium"}
        maxWidth="900px"
        textAlign="center"
      >
        {t("why.title")}
      </Display>

      <Stack
        width="100%"
        maxWidth="1200px"
        justifyContent="space-between"
        alignItems={{ base: "center", lg: "stretch" }}
        gap="40px"
        flexDirection={{ base: "column", lg: "row" }}
        spacing={0}
      >
        <Box flex={1} maxWidth={{ base: "100%", lg: "624px" }} width="100%" alignSelf="stretch">
          <Accordion
            index={activeIndex}
            onChange={(index) => setActiveIndex(index)}
            width="100%"
          >
            {items.map((elm, index) => (
              <AccordionItem
                key={elm.title}
                borderTopWidth="0"
                borderBottomWidth="1px"
                padding="10px 0"
              >
                <AccordionButton
                  padding={index === activeIndex ? "24px 0 0" : "24px 0"}
                  _hover={{ backgroundColor: "transparent" }}
                >
                  <TitleText
                    typography={isMobile ? "small" : "medium"}
                    display="flex"
                    width="100%"
                    flexDirection="row"
                    justifyContent="space-between"
                    textAlign="left"
                    color={index === activeIndex ? "#252A32" : "#71757A"}
                    _hover={{ color: "#252A32" }}
                  >
                    {elm.title}
                    <Text
                      display={activeIndex === index ? "none" : "flex"}
                      fontSize="32px"
                      fontWeight="300"
                      color="#2B8C4D"
                    >
                      +
                    </Text>
                  </TitleText>
                </AccordionButton>
                <AccordionPanel padding="8px 0 24px">
                  <BodyText
                    typography={isMobile ? "medium" : "large"}
                    color="#464A51"
                  >
                    {elm.content}
                  </BodyText>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>

        <Box
          width={{ base: "100%", lg: "400px" }}
          maxWidth="100%"
          flexShrink={0}
          display="flex"
          alignSelf={{ base: "center", lg: "stretch" }}
        >
          <ChatbotPricingCard
            highlightedFeature={items[activeIndex]?.highlightFeature}
          />
        </Box>
      </Stack>
    </VStack>
  );
}

function clearPresentationHashFromUrl() {
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}`
  );
}

function scrollToPresentation() {
  const el = document.getElementById("presentation");
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${"presentation"}`);

  window.setTimeout(clearPresentationHashFromUrl, 1500);
}

function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      video.play().catch((error) => {
        console.error("Video play failed:", error);
      });
    } else {
      video.pause();
    }
  }, [isVisible]);

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      preload="auto"
      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function Hero({ t }) {
  const router = useRouter();
  const prompts = t("hero.prompts", { returnObjects: true });

  return (
    <Box
      position="relative"
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight={{ base: "800px", lg: "700px" }}
      backgroundColor="#FFFFFF"
      padding="40px 24px"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        zIndex="1"
        width="100%"
        height="100%"
        pointerEvents="none"
        backgroundImage={
          "linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)"
        }
        backgroundSize="80px 80px"
        sx={{
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 95% at 50% 50%, #fff 0%, rgba(255,255,255,0.45) 45%, transparent 72%)",
          maskImage:
            "radial-gradient(ellipse 95% 95% at 50% 50%, #fff 0%, rgba(255,255,255,0.45) 45%, transparent 72%)",
        }}
      />
      <VStack gap="32px" spacing="0" textAlign="center" zIndex="2">
        <Display
          as="h1"
          typography={isMobileMod() ? "small" : "medium"}
          maxWidth="700px"
          textAlign="center"
        >
          {t("hero.title.prefix")}{" "}
          <Box as="span" color="#2B8C4D" fontStyle="italic" display="inline">
            {t("hero.title.highlight1")}
          </Box>{" "}
          {t("hero.title.middle")}{" "}
          <Box as="span" color="#2B8C4D" fontStyle="italic" display="inline">
            {t("hero.title.highlight2")}
          </Box>{" "}
          {t("hero.title.suffix")}
        </Display>
        <TypewriterConsole
          messages={prompts}
          textBtn={t("hero.buttonPrompt.text")}
          onClickBtn={() => router.push("/chatbot")}
          targetBtn="_blank"
        />
        <Button
          marginTop="32px !important"
          width="160px !important"
          justifyContent="center"
          alignItems="center"
          display="flex"
          height="40px !important"
          backgroundColor="#464A51"
          _hover={{
            backgroundColor: "#71757A",
          }}
          onClick={scrollToPresentation}
        >
          {t("hero.buttonScroll.text")}
        </Button>
      </VStack>
    </Box>
  );
}

function Presentation({ t }) {
  const isMobile = isMobileMod();

  return (
    <VStack width="100%" padding="80px 24px" spacing="24px">
      <Display
        as="h2"
        typography={isMobile ? "small" : "medium"}
        width="100%"
        maxWidth="800px"
        textAlign="center"
        margin="0 auto"
      >
        {t("presentation.title")}
      </Display>

      <TitleText
        as="h3"
        maxWidth="1000px"
        typography={isMobileMod() ? "small" : "small"}
        fontWeight="400"
        color="#464A51"
      >
        {t("presentation.description")}
      </TitleText>

      <Box
        id="presentation"
        scrollMargin={isMobile ? "320px" : "250px"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="fit-content"
        maxWidth="800px"
        height={{ base: "auto", md: "450px" }}
        minHeight={{ base: "250px", md: "450px" }}
        backgroundColor="#F9F9F9"
        boxShadow="0px 1.6px 16px rgba(100, 96, 103, 0.16)"
        borderRadius="16px"
        overflow="hidden"
      >
        <VideoPlayer src="https://storage.googleapis.com/basedosdados-website/video/modo_de_usar_chatbot.mp4" />
      </Box>
    </VStack>
  );
}

function FAQ({ t, faqs }) {
  const isMobile = isMobileMod();

  return (
    <VStack
      width="100%"
      maxWidth="800px"
      margin="0 auto"
      padding="80px 24px"
      gap={{base: "40px", md: "80px"}}
      spacing="0"
    >
      <Display
        as="h2"
        typography={isMobile ? "small" : "medium"}
        width="100%"
        maxWidth="800px"
        textAlign="center"
        margin="0 auto"
      >
        {t('faq.title')}
      </Display>

      <VStack
        width="100%"
        spacing={8}
        alignItems="stretch"
      >
        {faqs && faqs.map((elm, i) => (
          <QuestionsBox
            key={i}
            question={elm.question}
            answer={elm.content}
            id={elm.id}
          />
        ))}
      </VStack>
    </VStack>
  );
}

export default function ChatbotLPPage({ faqs }) {
  const { t } = useTranslation(['chatbot', 'prices']);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.location.hash !== `#${"presentation"}`
    ) {
      return;
    }

    const el = document.getElementById("presentation");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const timeout = window.setTimeout(clearPresentationHashFromUrl, 1500);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <MainPageTemplate>
      <Head>
        <title>{t('head.pageTitle')}</title>
        <meta property="og:title" content={t('head.metaTitle')} key="ogtitle" />
      </Head>
      <Hero t={t} />
      <Presentation t={t} />
      <WhyChatbotSection />
      <FAQ t={t} faqs={faqs} />
    </MainPageTemplate>
  );
}
