import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import '../../styles/product/ProductList.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Question from '../../components/Question/Question';
import ProductList from '../../components/ProductCard/ProductCard';
// import CollectionSlide from '../../components/CollectionSlide/CollectionSlide';
import Insta from '../../components/Insta/Instagram';
import banner from '../../assets/banner.png';

function ProductListPage() {
    const [sort, setSort] = useState('');
    const [sex, setSex] = useState('');
    const [type, setType] = useState('');
    const [products, setProducts] = useState([]);
    const [resetKey, setResetKey] = useState(Date.now());
    const [transitionKey, setTransitionKey] = useState(Date.now());

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
        {
            productId: 4,
            imageLinkList: 'https://i.pinimg.com/564x/70/e4/9c/70e49c4a2ea8af1f538cd0ea2c505db9.jpg',
            name: 'Hydrating Serum',
            price: 29.99,
            type: 'Serum',
            shade: 'Clear',
            volume: '50ml',
            sex: 'Unisex'
        },
        {
            productId: 5,
            imageLinkList: 'https://i.pinimg.com/564x/70/e4/9c/70e49c4a2ea8af1f538cd0ea2c505db9.jpg',
            name: 'Compact Powder',
            price: 24.99,
            type: 'Powder',
            shade: 'Ivory',
            volume: '10g',
            sex: 'Women'
        }
    ];

    useEffect(() => {
        let filtered = [...hardcodedProducts];

        if (sex) filtered = filtered.filter(p => p.sex === sex);
        if (type) filtered = filtered.filter(p => p.type === type);

        if (sort) {
            filtered.sort((a, b) => {
                switch (sort) {
                    case 'Newest': return b.productId - a.productId;
                    case 'Oldest': return a.productId - b.productId;
                    case 'Price (Low to High)': return a.price - b.price;
                    case 'Price (High to Low)': return b.price - a.price;
                    default: return 0;
                }
            });
        }

        setProducts(filtered);
        setResetKey(Date.now());
    }, [sort, sex, type]);

    const handleRemoveFilters = () => {
        setSort('');
        setSex('');
        setType('');
    };

    useEffect(() => {
        document.title = "Alurà - All Product";
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            document.querySelector('.news_banner_main_wrapper').classList.add('visible');
        }, 10);
        return () => clearTimeout(timeout);
    }, [transitionKey]);

    return (
        <div className="ProductList">
            <Breadcrumb items={[{ name: 'Home', link: '/' }, { name: 'Product', link: '' }]} />
            <div key={transitionKey} className="news_banner_main_wrapper">
                <div className="news_banner_image">
                    <img src={banner} alt="banner" />
                </div>
            </div>
            <div className="filters_and_products">
                <div className="filters_products">
                    {(sort || sex || type) && (
                        <Button
                            onClick={handleRemoveFilters}
                            variant="outlined"
                            color="primary"
                            startIcon={<i className="fas fa-times"></i>}
                            className='filter_group_remove'
                        >
                            Remove Filters
                        </Button>
                    )}

                    {/* Sort */}
                    <FormControl className="filter_group_sort" size="small">
                        <InputLabel id="sortFilter-label" sx={{
                            fontSize: '14px',
                            paddingTop: '2px'
                        }}
                        >Sort</InputLabel>
                        <Select
                            labelId="sortFilter-label"
                            id="sortFilter"
                            value={sort}
                            label="Sort"
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="Newest">Newest</MenuItem>
                            <MenuItem value="Oldest">Oldest</MenuItem>
                            <MenuItem value="Price (Low to High)">
                                Price <i className="fas fa-arrow-up" style={{ marginLeft: 8 }}></i>
                            </MenuItem>
                            <MenuItem value="Price (High to Low)">
                                Price <i className="fas fa-arrow-down" style={{ marginLeft: 8 }}></i>
                            </MenuItem>
                        </Select>
                    </FormControl>

                    {/* Sex */}
                    <FormControl className="filter_group" size="small">
                        <InputLabel id="sexFilter-label" sx={{
                            fontSize: '14px',
                            paddingTop: '2px'
                        }}
                        >Sex</InputLabel>
                        <Select
                            labelId="sexFilter-label"
                            id="sexFilter"
                            value={sex}
                            label="Sex"
                            onChange={(e) => setSex(e.target.value)}
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="Women">Women</MenuItem>
                            <MenuItem value="Men">Men</MenuItem>
                            <MenuItem value="Unisex">Unisex</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Type */}
                    <FormControl className="filter_group" size="small">
                        <InputLabel
                            id="typeFilter-label"
                            sx={{
                                fontSize: '14px',
                                paddingTop: '2px'
                            }}
                        >
                            Type
                        </InputLabel>
                        <Select
                            labelId="typeFilter-label"
                            id="typeFilter"
                            value={type}
                            label="Type"
                            onChange={(e) => setType(e.target.value)}
                        >
                            <MenuItem value="">None</MenuItem>

                            {/* Skincare */}
                            <MenuItem value="Cleanser">Cleanser</MenuItem>
                            <MenuItem value="Toner">Toner</MenuItem>
                            <MenuItem value="Serum">Serum</MenuItem>
                            <MenuItem value="Face Mask">Face Mask</MenuItem>
                            <MenuItem value="Cream">Cream</MenuItem>

                            {/* Haircare */}
                            <MenuItem value="Shampoo">Shampoo</MenuItem>
                            <MenuItem value="Conditioner">Conditioner</MenuItem>
                            <MenuItem value="Hair Serum">Hair Serum</MenuItem>
                            <MenuItem value="Hair Tonic">Hair Tonic</MenuItem>
                            <MenuItem value="Scalp Treatment">Scalp Treatment</MenuItem>

                            {/* Body Care */}
                            <MenuItem value="Body Lotion">Body Lotion</MenuItem>
                            <MenuItem value="Body Wash">Body Wash</MenuItem>
                            <MenuItem value="Deodorant">Deodorant</MenuItem>
                            <MenuItem value="Sunscreen">Sunscreen</MenuItem>
                            <MenuItem value="Body Scrub">Body Scrub</MenuItem>

                            {/* Lip & Nail */}
                            <MenuItem value="Lip Balm">Lip Balm</MenuItem>
                            <MenuItem value="Lip Stick">Lip Stick</MenuItem>
                            <MenuItem value="Lip Scrub">Lip Scrub</MenuItem>
                            <MenuItem value="Nail Strengthener">Nail Strengthener</MenuItem>
                            <MenuItem value="Cuticle Oil">Cuticle Oil</MenuItem>
                            <MenuItem value="Nail Treatment">Nail Treatment</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Brand */}
                    <FormControl className="filter_group" size="small">
                        <InputLabel id="brandFilter-label"
                            sx={{
                                fontSize: '14px',
                                paddingTop: '2px'
                            }}>Brand</InputLabel>
                        <Select
                            labelId="brandFilter-label"
                            id="brandFilter"
                            label="Brand"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="Naris Cosmetics">Naris Cosmetics</MenuItem>
                            <MenuItem value="L'Oreal">L'Oreal</MenuItem>
                            <MenuItem value="Eucerin">Eucerin</MenuItem>
                            <MenuItem value="La Roche-Posay">La Roche-Posay</MenuItem>
                            <MenuItem value="Cocoon">Cocoon</MenuItem>
                            <MenuItem value="Bioderma">Bioderma</MenuItem>
                            <MenuItem value="CeraVe">CeraVe</MenuItem>
                            <MenuItem value="B.O.M">B.O.M</MenuItem>
                            <MenuItem value="Angel's Liquid">Angel's Liquid</MenuItem>
                            <MenuItem value="Swiss Image">Swiss Image</MenuItem>
                            <MenuItem value="3CE">3CE</MenuItem>
                            <MenuItem value="Vichy">Vichy</MenuItem>
                            <MenuItem value="Maybelline">Maybelline</MenuItem>
                            <MenuItem value="Vaseline">Vaseline</MenuItem>
                        </Select>
                    </FormControl>


                    {/* Skin Type */}
                    <FormControl className="filter_group" size="small">
                        <InputLabel
                            id="skinTypeFilter-label"
                            sx={{
                                fontSize: '14px',
                                paddingTop: '2px'
                            }}
                        >Skin Type</InputLabel>
                        <Select
                            labelId="skinTypeFilter-label"
                            id="skinTypeFilter"
                            label="Skin Type"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="Normal">Normal</MenuItem>
                            <MenuItem value="Dry">Dry</MenuItem>
                            <MenuItem value="Oily">Oily</MenuItem>
                            <MenuItem value="Combination">Combination</MenuItem>
                            <MenuItem value="Sensitive">Sensitive</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Skin Color */}
                    <FormControl className="filter_group" size="small">
                        <InputLabel id="skinColorFilter-label" sx={{
                            fontSize: '14px',
                            paddingTop: '2px'
                        }}
                        >Skin Color</InputLabel>
                        <Select
                            labelId="skinColorFilter-label"
                            id="skinColorFilter"
                            label="Skin Color"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="Light">Light</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Tan">Tan</MenuItem>
                            <MenuItem value="Dark">Dark</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Capacity */}
                    <FormControl className="filter_group" size="small">
                        <InputLabel id="volumnFilter-label" sx={{
                            fontSize: '14px',
                            paddingTop: '2px'
                        }}
                        >Volumn</InputLabel>
                        <Select
                            labelId="volumnFilter-label"
                            id="volumnFilter"
                            label="Volumn"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="10g">10g</MenuItem>
                            <MenuItem value="30ml">30ml</MenuItem>
                            <MenuItem value="50ml">50ml</MenuItem>
                            <MenuItem value="100ml">100ml</MenuItem>
                            <MenuItem value="Full Size">Full size</MenuItem>
                        </Select>
                    </FormControl>


                    {/* Stock Status */}
                    <FormControl className="filter_group" size="small">
                        <InputLabel id="stockFilter-label" sx={{
                            fontSize: '14px',
                            paddingTop: '2px'
                        }}
                        >Stock</InputLabel>
                        <Select
                            labelId="stockFilter-label"
                            id="stockStatusFilter"
                            label="Stock"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="In Stock">In Stock</MenuItem>
                            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                        </Select>
                    </FormControl>


                </div>


                <ProductList products={products} resetKey={resetKey} />
            </div>

            <br /><br />
            {/* <CollectionSlide /> */}
            <br /><br />

            <Question />
            <Insta />
        </div>
    );
}

export default ProductListPage;
