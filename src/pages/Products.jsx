import { ProductList } from '../components/products/ProductList'
import { ProductDetail as ProductDetailComponent } from '../components/products/ProductDetail'
import { OrderTrackPage } from './OrderTrack'

export default function ProductsPage() {
  return <ProductList />
}

export function ProductDetail() {
  return <ProductDetailComponent />
}

export { OrderTrackPage }
