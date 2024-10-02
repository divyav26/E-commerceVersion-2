import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import banner1 from "../../assets/BannerHome/banner.jpg";
import banner2 from "../../assets/BannerHome/banner2.jpg";
import banner3 from "../../assets/BannerHome/banner3.png";


const Carousel = () => {
  var settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
  };

  const bannerData = [
    {
      id: 1,
      img: banner1,
      text: "cvbnbnm,",
      discription: "bncfs",
      discount: "10%",
    },
    {
      id: 2,
      img: banner2,
      text: "cvbnbnm,",
      discription: "bncfs",
      discount: "10%",
    },
    {
      id: 3,
      img: banner3,
      text: "cvbnbnm,",
      discription: "bncfs",
      discount: "10%",
    },
  ];

  return (
    <Slider {...settings}>
      {bannerData.map((item) => (
        <div key={item.id}>
          <div className="flex flex-col items-center justify-center">
            <img src={item.img} alt="banner" className="w-full h-[50vh] object-cover aspect-1/3" />
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
