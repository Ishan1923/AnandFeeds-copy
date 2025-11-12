import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import HotProducts from "@/components/HotProducts";
import Navbar from "@/components/Navbar";
import OurProducts from "@/components/OurProducts";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Gallery from "@/components/Gallery";
import ActitvityImageSlideshow from "@/components/ActivityCentre";

export default function Home({ searchParams }) {

  // const [reload, setReload] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between overflow-x-hidden">
      <Navbar searchParams={searchParams}  />
      <Carousel />
      <OurProducts />
      <HotProducts  />
      <Testimonials />
      <Gallery />
      <ActitvityImageSlideshow/>
      <Contact />
      <Footer />
    </main>
  );
}
