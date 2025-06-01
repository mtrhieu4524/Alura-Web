import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import ProductList from '../../components/ProductCard/ProductCard';
import Question from '../../components/Question/Question';
import '../../styles/product/ProductSearch.css';
import Insta from '../../components/Insta/Instagram';
// import CollectionSlide from '../../components/CollectionSlide/CollectionSlide';

const ProductSearch = () => {
    const location = useLocation();
    // const products = location.state?.products || [];
    const [products, setProducts] = useState([]);
    const searchQuery = location.state?.searchQuery || '';
    const resetKey = searchQuery + products.length;

    const hardcodedProducts = [
        {
            productId: 1,
            imageLinkList: 'https://i.pinimg.com/564x/70/e4/9c/70e49c4a2ea8af1f538cd0ea2c505db9.jpg',
            name: 'Matte Lipstick',
            price: 19.99,
            type: 'Lipstick',
            shade: 'Rose Pink',
            volume: '3g',
            sex: 'Women'
        },
        {
            productId: 2,
            imageLinkList: 'https://i.pinimg.com/564x/70/e4/9c/70e49c4a2ea8af1f538cd0ea2c505db9.jpg',
            name: 'Hydrating Serum',
            price: 29.99,
            type: 'Serum',
            shade: 'Clear',
            volume: '50ml',
            sex: 'Unisex'
        },
        {
            productId: 3,
            imageLinkList: 'https://i.pinimg.com/564x/70/e4/9c/70e49c4a2ea8af1f538cd0ea2c505db9.jpg',
            name: 'Compact Powder',
            price: 24.99,
            type: 'Powder',
            shade: 'Ivory',
            volume: '10g',
            sex: 'Women'
        },
    ];

    useEffect(() => {
        document.title = "Alurà - Search";
        setProducts(hardcodedProducts);
    }, []);

    const navItems = [
        { name: 'Home', link: '/' },
        { name: 'Search' }
    ];

    return (
        <div className="Search">
            <Breadcrumb items={navItems} />
            <br />

            <div className="search_counter">
                <div className="results_count">
                    <p>{`(${products.length} Results)`}</p>
                </div>
            </div>
            <br></br>

            <ProductList products={products} resetKey={resetKey} />

            <br></br><br></br>
            {/* <CollectionSlide /> */}
            <br></br><br></br>

            <Question />
            <Insta />
        </div>
    );
};

export default ProductSearch;
