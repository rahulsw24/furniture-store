import CombinedSections from "../components/CombinedSections";
import Hero from "../components/Hero";
import PageEnd from "../components/PageEnd";
import ProductGrid from "../components/ProductGrid";
import PromiseSection from "../components/PromiseSection";
import ReviewsSection from "../components/ReviewCard";
import TrustSection from "../components/TrustSection";
import VideoCarousel from "../components/VideoCarousel";


const Home = () => (
    <>
        <Hero />
        <ProductGrid />
        <TrustSection />
        {/* <VideoCarousel /> */}
        <ReviewsSection />
        <PromiseSection />
        <CombinedSections />
        <PageEnd />

    </>
);

export default Home;