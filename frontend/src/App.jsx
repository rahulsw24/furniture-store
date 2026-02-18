import CombinedSections from './components/CombinedSections'
import Hero from './components/Hero'
import PageEnd from './components/PageEnd'
import ProductGrid from './components/ProductGrid'
import PromiseSection from './components/PromiseSection'
import ReviewsSection from './components/ReviewCard'
import VideoCarousel from './components/VideoCarousel'

function App() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProductGrid />
      <VideoCarousel />
      <ReviewsSection />
      <PromiseSection />
      <CombinedSections />
      <PageEnd />
      {/* We will add the Product Grid next in Phase 2.2 */}
    </main>
  )
}

export default App