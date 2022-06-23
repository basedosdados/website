import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

export default function Carousel({ settings, children }) {
  return (
    <Swiper modules={[Navigation, Pagination, Autoplay]} {...settings}>
      {children && children.map((elm)=> {
        return (
          <SwiperSlide>
            {elm}
          </SwiperSlide>
        )
      })} 
    </Swiper>
  )
}