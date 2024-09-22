import React, {useEffect, useState} from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

function Update() {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        lang: '',
        status: '',
        count: '',
        stock: '',
        category: '',
        price: ''
    });

    const [categories, setCategories] = useState([]);

    const params = useParams();

    useEffect(() => {
        fetchProduct().then();
    }, []);

    const fetchProduct = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${params.id}`);
        if (data?.data) {
            setFormData({
                title: data.data?.title ?? '',
                slug: data.data?.slug ?? '',
                lang: data.data?.lang ?? '',
                status: data.data?.status ?? '',
                count: data.data?.count ?? '',
                stock: data.data?.stock ?? '',
                category: Array.isArray(data.data?.categories) && data.data?.categories.length > 0 ? data.data?.categories[0]?.id : '',
                price: data.data?.price?.price ?? '',
                /**
                 * not enough time
                 */
                // image:
            });
        }
    }

    const fetchCategories = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
        if (data?.data) {
            setCategories(data.data);
        }
    }

    useEffect(() => {
        fetchCategories().then();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${params.id}`, formData);
        window.location.href = '/';
    };

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center">
                <div className="create-form" style={{ width: '400px' }}>
                    <h2 className="text-center">Update Products</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                name="title"
                                type="text"
                                className="form-control"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Slug</label>
                            <input
                                name="slug"
                                type="text"
                                className="form-control"
                                value={formData.slug}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Lang</label>
                            <input
                                name="lang"
                                type="text"
                                className="form-control"
                                value={formData.lang}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <input
                                name="status"
                                type="text"
                                className="form-control"
                                value={formData.status}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Count</label>
                            <input
                                name="count"
                                type="text"
                                className="form-control"
                                value={formData.count}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Stock</label>
                            <input
                                name="stock"
                                type="text"
                                className="form-control"
                                value={formData.stock}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" className="form-control" onChange={handleChange} value={formData.category}>
                                <option value="">Kategori</option>
                                {
                                    Array.isArray(categories) && categories.map((category) => {
                                        return <option value={category.id} key={category.id}>{ category.name }</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                name="price"
                                type="text"
                                className="form-control"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Save</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Update;
