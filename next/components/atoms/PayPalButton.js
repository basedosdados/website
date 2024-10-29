import { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';

const PayPalButton = () => {
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    const renderButton = () => {
      if (window.paypal && window.paypal.HostedButtons) {
        const buttonConfig = getButtonConfig(locale);
        window.paypal.HostedButtons({
          hostedButtonId: buttonConfig.id,
        }).render(`#paypal-container-${buttonConfig.id}`);
      }
    };

    if (window.paypal && window.paypal.HostedButtons) {
      renderButton();
    } else {
      const checkPayPal = setInterval(() => {
        if (window.paypal && window.paypal.HostedButtons) {
          renderButton();
          clearInterval(checkPayPal);
        }
      }, 100);

      return () => clearInterval(checkPayPal);
    }
  }, [locale]);

  const getButtonConfig = (locale) => {
    switch (locale) {
      case 'en':
        return { id: '7Z8VZRT49598E', localeParam: 'en_US' };
      case 'es':
        return { id: '9T4KS6AZABF92', localeParam: 'es_ES' };
      default:
        return { id: '9XUDXZSNZFS84', localeParam: 'pt_BR' };
    }
  };

  const buttonConfig = getButtonConfig(locale);

  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=BAAMRKxOIs8HZRucUi9h6KGCm--Le5G4bexjKHt6phnjlGLYPvr4VvXNxKuABcWPY8Cr6-E3AydIRd0r-4&components=hosted-buttons&disable-funding=venmo&locale=${buttonConfig.localeParam}`}
        onLoad={() => {
          if (window.renderPayPalButton) {
            window.renderPayPalButton();
          }
        }}
      />
      <div id={`paypal-container-${buttonConfig.id}`}></div>
    </>
  );
};

export default PayPalButton;
