import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./../../styles/visual/VisualSearch.css";
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const VisualSearch = () => {
    const breadcrumbItems = [
        { name: 'Home', link: '/' },
        { name: 'Visual Search', link: '/visual_search' }
    ];

    useEffect(() => {
        document.title = "Alurà - Visual Search";
    }, []);

    const [imagePreview, setImagePreview] = useState(null);
    const [imageLink, setImageLink] = useState("");
    const [showImageButton, setShowImageButton] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setImageLink("");
            setShowImageButton(false);
        }
    };

    const handleLinkInputChange = (e) => {
        setImageLink(e.target.value);
        setShowImageButton(true);
    };

    const handleShowImage = () => {
        setImagePreview(imageLink);
        setShowImageButton(false);
    };

    const handleSearch = () => {
        nav
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageLink("");
    };


    return (
        <div className="visual_search">
            <Breadcrumb items={breadcrumbItems} />

            <h2 className="visual_title">Visual Search</h2>
            <p className="visual_desc">Not sure how to describe in words? Use a photo to find information.</p>

            <div className="visual_search_container">
                <h2>Search for any products with image</h2>

                <div className="visual_drop_area">
                    {imagePreview ? (
                        <div className="image_preview_container">
                            <button className="remove_image_button" onClick={handleRemoveImage}>×</button>
                            <img src={imagePreview} alt="Preview" className="image_preview" />
                        </div>
                    ) : (
                        <div className="upload_placeholder">
                            <i className="fas fa-image upload_icon"></i>
                            <p>Drag an image here or <label htmlFor="imageUpload">upload a file</label></p>
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                onChange={handleImageChange}
                                hidden
                            />
                        </div>
                    )}
                </div>

                <div className="divider">
                    <span className="line"></span>
                    <span className="or-text">OR</span>
                    <span className="line"></span>
                </div>

                <div className="link_input_area">
                    <input
                        type="text"
                        placeholder="Paste image link"
                        value={imageLink}
                        onChange={handleLinkInputChange}
                    />
                    <button onClick={handleShowImage}>Preview</button>

                </div>

                {imagePreview && (
                    <button
                        className="search_button"
                        onClick={() => navigate("/visual-search-result", { state: { image: imagePreview } })}
                    >
                        Search for matching products
                    </button>

                )}
            </div>
            <br /><br /><br />
        </div>
    );
};

export default VisualSearch;
