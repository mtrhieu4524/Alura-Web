import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Button
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import '../../styles/product/ProductList.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Question from '../../components/Question/Question';
import ProductList from '../../components/ProductCard/ProductCard';
import Insta from '../../components/Insta/Instagram';
import banner from '../../assets/banner.png';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function CosmeticListPage() {
    const location = useLocation();

    const [sort, setSort] = useState('');
    const [sex, setSex] = useState([]);
    const [type, setType] = useState([]);
    const [brand, setBrand] = useState([]);
    const [skinType, setSkinType] = useState([]);
    const [skinColor, setSkinColor] = useState([]);
    const [volume, setVolume] = useState([]);
    const [stock, setStock] = useState([]);

    const [products, setProducts] = useState([]);
    const [resetKey, setResetKey] = useState(Date.now());
    const [transitionKey, setTransitionKey] = useState(Date.now());

    useEffect(() => {
        document.title = 'Alurà - Cosmetics';
    }, []);

    useEffect(() => {
        if (location.state) {
            if (location.state.sort) setSort(location.state.sort);

            if (location.state.sex) setSex(Array.isArray(location.state.sex) ? location.state.sex : [location.state.sex]);
            if (location.state.type) setType(Array.isArray(location.state.type) ? location.state.type : [location.state.type]);
            if (location.state.brand) setBrand(Array.isArray(location.state.brand) ? location.state.brand : [location.state.brand]);
            if (location.state.skinType) setSkinType(Array.isArray(location.state.skinType) ? location.state.skinType : [location.state.skinType]);
            if (location.state.skinColor) setSkinColor(Array.isArray(location.state.skinColor) ? location.state.skinColor : [location.state.skinColor]);
            if (location.state.volume) setVolume(Array.isArray(location.state.volume) ? location.state.volume : [location.state.volume]);
            if (location.state.stock) setStock(Array.isArray(location.state.stock) ? location.state.stock : [location.state.stock]);
        }
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/products?pageIndex=1&pageSize=100`
                );

                const data = await response.json();

                if (data.success && data.products) {
                    // let filtered = [...data.products];

                    //
                    let original = [...data.products];
                    let filtered = [];
                    while (filtered.length < 15) {
                        filtered = [...filtered, ...original];
                    }
                    filtered = filtered.slice(0, 15);
                    //

                    if (sex.length) {
                        filtered = filtered.filter((p) =>
                            sex.includes(p.sex?.toLowerCase())
                        );
                    }

                    if (type.length) {
                        filtered = filtered.filter((p) =>
                            p.tags?.some((tag) => type.includes(tag.toLowerCase()))
                        );
                    }

                    if (brand.length) {
                        filtered = filtered.filter((p) =>
                            brand.includes(p.brand?._id)
                        );
                    }

                    if (skinType.length) {
                        filtered = filtered.filter((p) =>
                            p.skinType?.some((s) => skinType.includes(s.toLowerCase()))
                        );
                    }

                    if (skinColor.length) {
                        filtered = filtered.filter((p) =>
                            skinColor.includes(p.skinColor?.toLowerCase())
                        );
                    }

                    if (volume.length) {
                        filtered = filtered.filter((p) =>
                            volume.includes(p.volume)
                        );
                    }

                    if (stock.length) {
                        if (stock.includes("In Stock")) {
                            filtered = filtered.filter(p => p.stock > 0);
                        }
                        if (stock.includes("Out of Stock")) {
                            filtered = filtered.filter(p => p.stock === 0);
                        }
                    }

                    if (sort) {
                        filtered.sort((a, b) => {
                            switch (sort) {
                                case 'Newest':
                                    return new Date(b.createdAt) - new Date(a.createdAt);
                                case 'Oldest':
                                    return new Date(a.createdAt) - new Date(b.createdAt);
                                case 'Price (Low to High)':
                                    return a.price - b.price;
                                case 'Price (High to Low)':
                                    return b.price - a.price;
                                default:
                                    return 0;
                            }
                        });
                    }

                    setProducts(filtered);
                    setResetKey(Date.now());
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [sort, sex, type, brand, skinType, skinColor, volume, stock]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            document.querySelector('.news_banner_main_wrapper')?.classList.add('visible');
        }, 10);
        return () => clearTimeout(timeout);
    }, [transitionKey]);

    const handleRemoveFilters = () => {
        setSort('');
        setSex([]);
        setType([]);
        setBrand([]);
        setSkinType([]);
        setSkinColor([]);
        setVolume([]);
        setStock([]);
    };

    const anyFilterActive = sort || sex.length || type.length || brand.length || skinType.length || skinColor.length || volume.length || stock.length;

    return (
        <div className="ProductList">
            <Breadcrumb items={[{ name: 'Home', link: '/' }, { name: 'Cosmetics' }]} />

            <div key={transitionKey} className="news_banner_main_wrapper">
                <div className="news_banner_image">
                    <img src={banner} alt="banner" />
                </div>
            </div>

            <div className="filters_and_products_wrapper">
                <div className="filter_sidebar">
                    <Button
                        onClick={handleRemoveFilters}
                        variant="outlined"
                        className="clear_filters_btn"
                    >
                        Clear All Filters
                    </Button>

                    <FormControl fullWidth size="small" className="sort_select_box">
                        <InputLabel id="sortFilter-label">Sort</InputLabel>
                        <Select
                            labelId="sortFilter-label"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            input={<OutlinedInput label="Sort" />}
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="Newest">Newest</MenuItem>
                            <MenuItem value="Oldest">Oldest</MenuItem>
                            <MenuItem value="Price (Low to High)">Price ↑</MenuItem>
                            <MenuItem value="Price (High to Low)">Price ↓</MenuItem>
                        </Select>
                    </FormControl>

                    {[{
                        label: "Type", state: type, setter: setType, options: [
                            "Cleanser", "Toner", "Serum", "Face Mask", "Cream", "Shampoo",
                            "Conditioner", "Hair Serum", "Hair Tonic", "Scalp Treatment",
                            "Body Lotion", "Body Wash", "Deodorant", "Sunscreen", "Body Scrub",
                            "Lip Balm", "Lip Stick", "Lip Scrub", "Nail Strengthener", "Cuticle Oil", "Nail Treatment"
                        ]
                    }, {
                        label: "Brand", state: brand, setter: setBrand, options: [
                            "Naris Cosmetics", "L'Oreal", "Eucerin", "La Roche-Posay", "Cocoon", "Bioderma",
                            "CeraVe", "B.O.M", "Angel's Liquid", "Swiss Image", "3CE", "Vichy", "Maybelline", "Vaseline"
                        ]
                    }, {
                        label: "Stock", state: stock, setter: setStock, options: ["In Stock", "Out of Stock"]
                    }, {
                        label: "Sex", state: sex, setter: setSex, options: ["Male", "Female", "Unisex"]
                    }, {
                        label: "Skin Type", state: skinType, setter: setSkinType,
                        options: ["Normal", "Dry", "Oily", "Combination", "Sensitive"]
                    }, {
                        label: "Skin Color", state: skinColor, setter: setSkinColor,
                        options: ["Light", "Medium", "Tan", "Dark", "Neutral", "Cool"]
                    }, {
                        label: "Volume", state: volume, setter: setVolume,
                        options: ["10g", "30ml", "50ml", "100ml", "200ml", "1000ml", "Full Size"]
                    }].map((filter, i) => (
                        <Accordion key={i}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>{filter.label}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth size="small" className="filter_select_box">
                                    <Select
                                        labelId={`${filter.label}-label`}
                                        multiple
                                        value={filter.state}
                                        onChange={(e) => filter.setter(e.target.value)}
                                        input={<OutlinedInput />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {filter.options.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                <Checkbox checked={filter.state.indexOf(option) > -1} />
                                                <ListItemText primary={option} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>

                <div className="product_main_list_area">
                    <ProductList products={products} resetKey={resetKey} />
                </div>
            </div>

            <br /><br />
            <Question />
            <Insta />
        </div>
    );
}

export default CosmeticListPage;
