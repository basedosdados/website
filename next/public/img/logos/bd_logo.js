import { Icon, Box } from '@chakra-ui/react'

const BDLogoImage = ({widthImage = "130px", heightImage="60px", ...style}) => (
  <Box 
    display="flex"
    alignItems="center"
    justifyItems="center"
    position="relative"
    {...style}
  >
    <Icon
      viewBox="0 0 130 60"
      width={widthImage}
      height={heightImage}
    >
      <g clip-path="url(#clip0_5632_230)">
      <g filter="url(#filter0_d_5632_230)">
      <rect y="0.0861816" width="62.3783" height="59.8569" rx="3.61673" fill="#2B8C4D"/>
      </g>
      <g filter="url(#filter1_d_5632_230)">
      <path d="M29.3102 48.4166C27.4005 48.4166 25.4736 48.3472 23.5292 48.2083C21.5848 48.1042 19.8835 47.8611 18.4253 47.4792V12.4287C19.1891 12.2898 20.005 12.1683 20.8731 12.0641C21.7411 11.9252 22.6265 11.8211 23.5292 11.7516C24.4319 11.6822 25.3173 11.6301 26.1853 11.5954C27.0881 11.5607 27.9387 11.5433 28.7373 11.5433C30.9247 11.5433 32.9559 11.7169 34.8308 12.0641C36.7057 12.3766 38.3202 12.9148 39.6743 13.6786C41.0631 14.4425 42.1395 15.4494 42.9033 16.6993C43.6672 17.9493 44.0491 19.4943 44.0491 21.3345C44.0491 23.0359 43.6325 24.4941 42.7992 25.7093C42.0006 26.9246 40.8722 27.8967 39.4139 28.6259C41.6013 29.355 43.2158 30.4314 44.2574 31.8549C45.299 33.2784 45.8199 35.0839 45.8199 37.2713C45.8199 40.9864 44.4657 43.7814 41.7575 45.6564C39.0493 47.4966 34.9002 48.4166 29.3102 48.4166ZM24.8833 31.7507V42.7398C25.6124 42.8093 26.3936 42.8613 27.2269 42.8961C28.0602 42.9308 28.8241 42.9481 29.5185 42.9481C30.8726 42.9481 32.1226 42.8613 33.2683 42.6877C34.4488 42.5141 35.4557 42.219 36.289 41.8024C37.1571 41.351 37.8341 40.7607 38.3202 40.0316C38.841 39.3025 39.1014 38.365 39.1014 37.2192C39.1014 35.1707 38.3549 33.7472 36.8619 32.9486C35.3689 32.15 33.3031 31.7507 30.6643 31.7507H24.8833ZM24.8833 26.5947H29.5185C32.0184 26.5947 33.9801 26.2475 35.4037 25.5531C36.8272 24.824 37.539 23.5393 37.539 21.6991C37.539 19.9631 36.7925 18.7305 35.2995 18.0014C33.8412 17.2722 31.9316 16.9077 29.5706 16.9077C28.5637 16.9077 27.661 16.925 26.8624 16.9597C26.0985 16.9945 25.4388 17.0465 24.8833 17.116V26.5947Z" fill="#FAFAFA"/>
      </g>
      <g filter="url(#filter2_d_5632_230)">
      <rect x="67.6218" y="0.0861816" width="62.3783" height="59.8569" rx="3.61673" fill="#7EC876"/>
      </g>
      <g filter="url(#filter3_d_5632_230)">
      <path d="M91.3439 42.5836C91.7258 42.6183 92.2293 42.653 92.8543 42.6877C93.4792 42.6877 94.3299 42.6877 95.4062 42.6877C99.8157 42.6877 103.097 41.5767 105.25 39.3546C107.437 37.0977 108.531 33.9555 108.531 29.9279C108.531 25.8309 107.472 22.6886 105.354 20.5012C103.236 18.3138 99.9546 17.2201 95.5104 17.2201C93.566 17.2201 92.1772 17.2722 91.3439 17.3764V42.5836ZM115.405 29.9279C115.405 33.0528 114.919 35.7783 113.947 38.1046C112.975 40.3962 111.586 42.3232 109.781 43.8856C108.01 45.4133 105.857 46.5591 103.323 47.3229C100.823 48.0521 98.045 48.4166 94.9896 48.4166C93.5313 48.4166 91.8821 48.3472 90.0419 48.2083C88.2017 48.1042 86.4483 47.8611 84.7817 47.4792V12.4287C86.4483 12.0468 88.2191 11.8037 90.094 11.6996C91.9689 11.5954 93.6355 11.5433 95.0937 11.5433C98.1144 11.5433 100.875 11.9079 103.375 12.637C105.875 13.3314 108.01 14.4425 109.781 15.9702C111.586 17.4632 112.975 19.3728 113.947 21.6991C114.919 23.9907 115.405 26.7336 115.405 29.9279Z" fill="white"/>
      </g>
      </g>
      <defs>
      <filter id="filter0_d_5632_230" x="-0.723347" y="0.0861816" width="63.8251" height="61.3036" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="0.723347"/>
      <feGaussianBlur stdDeviation="0.361673"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5632_230"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5632_230" result="shape"/>
      </filter>
      <filter id="filter1_d_5632_230" x="17.7019" y="11.5432" width="28.8412" height="38.3202" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="0.723347"/>
      <feGaussianBlur stdDeviation="0.361673"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5632_230"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5632_230" result="shape"/>
      </filter>
      <filter id="filter2_d_5632_230" x="66.8985" y="0.0861816" width="63.8251" height="61.3036" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="0.723347"/>
      <feGaussianBlur stdDeviation="0.361673"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5632_230"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5632_230" result="shape"/>
      </filter>
      <filter id="filter3_d_5632_230" x="84.0584" y="11.5432" width="32.0702" height="38.3202" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="0.723347"/>
      <feGaussianBlur stdDeviation="0.361673"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5632_230"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5632_230" result="shape"/>
      </filter>
      <clipPath id="clip0_5632_230">
      <rect width="130" height="60" fill="white"/>
      </clipPath>
      </defs>
    </Icon>
  </Box>
)

export default BDLogoImage