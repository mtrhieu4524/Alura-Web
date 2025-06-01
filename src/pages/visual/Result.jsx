import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../../styles/visual/Result.css';
import ProductList from '../../components/ProductCard/ProductCard';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Insta from '../../components/Insta/Instagram';
import Question from '../../components/Question/Question';

function Result() {
    const { state } = useLocation();
    const image = state?.image;
    const navigate = useNavigate();
    // const products = location.state?.products || [];
    const [products, setProducts] = useState([]);

    const breadcrumbItems = [
        { name: 'Home', link: '/' },
        { name: 'Visual Search', link: '/visual-search' },
        { name: 'Visual Search Result', link: '' }
    ];

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
        document.title = "Alurà - Visual Search Result";
        setProducts(hardcodedProducts);
    }, []);

    return (
        <div className="Result">
            <Breadcrumb items={breadcrumbItems} />
            <br />

            {image && (
                <div className="search-again-container">
                    <button className="search-again-button" onClick={() => navigate('/visual-search')}>
                        &lt; Search Another Image
                    </button>

                    <div className="result-image-preview">
                        <img src={image} alt="Searched" className="result-image" />
                    </div>
                </div>
            )}

            <div className="search_counter">
                <div className="results_count">
                    <p>{`(${products.length} Results Matched The Image)`}</p>
                </div>
            </div>

            <br /><br /><br />

            <ProductList products={products} />

            <br /><br /><br />
            <Question />
            <Insta />
        </div>
    );
}

export default Result;
