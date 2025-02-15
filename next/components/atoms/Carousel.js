import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Mousewheel } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

export default function Carousel({ settings, children }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, Mousewheel]}
      {...settings}
    >
      {children &&
        children.map((elm, i) => {
          return <SwiperSlide key={i}>{elm}</SwiperSlide>;
        })}
    </Swiper>
  );
}
