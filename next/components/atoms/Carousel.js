import { Swiper } from "swiper/react"  
import { Navigation, Autoplay } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

export default function Carousel({ settings, children }) {
  return (
    <Swiper modules={[Navigation, Autoplay]} {...settings}> {children} </Swiper>
  )
}