import './App.css';
import { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

function Home() {
    const [product, setProduct] = useState({});

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPage, setTotalPage] = useState(1);

    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState();

    const [syncCount, setSyncCount] = useState(0);
    const [deleteCount, setDeleteCount] = useState(0);

    useEffect(() => {
        fetchProducts().then();
        fetchCategories().then();
    }, []);

    useEffect(() => {
        fetchProducts().then();
    }, [page, limit, category, syncCount, deleteCount]);

    const fetchProducts = async () => {
        let url = `${process.env.REACT_APP_API_URL}/api/products?page=${page}&limit=${limit}`;
        if (category && category !== '') {
            url = `${url}&category=${category}`;
        }
        const { data } = await axios.get(url);
        if (data?.data?.data) {
            const result = [];
            for (let i = 0; i < data?.data?.data.length; i += 4) {
                const chunk = data?.data?.data.slice(i, i + 4);
                result.push(chunk);
            }
            return setProduct(result);
        }
        setTotalPage(data.data?.totalPages);
    }

    const fetchCategories = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
        if (data?.data) {
            setCategories(data.data);
        }
    }

    const handlePrevious = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    const handleNext = () => {
        if (page < totalPage) {
            setPage(page + 1);
        }
    }

    const handleLimitChanged = (e) => {
        if (e.target.value !== '') {
            setLimit(e.target.value);
        } else {
            setLimit(10);
        }
    }

    const handleCategoryChanged = (e) => {
        setCategory(e.target.value);
    }

    const handleSynchronize = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/synchronize`);
        if (data?.data) {
            if (page !== 1) {
                setPage(1);
            } else {
                setSyncCount(syncCount + 1);
            }
            alert('Sinkronisasi berhasil');
        }
    }

    const handleUpdateButtonClicked = () => {

    }

    const handleDeleteButtonClicked = async (productId) => {
        const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${productId}`);
        if (data?.data) {
            if (page !== 1) {
                setPage(1);
            } else {
                setDeleteCount(deleteCount + 1);
            }
            alert('Data berhasil dihapus');
        }
    }

    const handleExportToXMLButtonClicked = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/export-xml`, { responseType: 'stream' });

            const blob = new Blob([response.data], { type: 'application/xml' });

            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'products.xml';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error downloading the XML:', error);
        }
    }

    const handleExportToExcelClicked = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/export-csv`, { responseType: 'blob' });

            const blob = new Blob([response.data], { type: 'text/csv' });
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'products.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading the CSV:', error);
        }
    }

    const renderPageButton = () => {
        const element = [];
        for (let i = 1; i <= totalPage; i++) {
            element.push(<li className="page-item"><a className="page-link" href="#" onClick={() => setPage(i)}>{i}</a></li>)
        }
        return element;
    }

    return (
        <>
            <div className="container" style={{ padding: '50px' }}>
                <div className="row" style={{ marginBottom: '40px' }}>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-4">
                                <select className="form-control" onChange={handleCategoryChanged}>
                                    <option value="">Kategori</option>
                                    {
                                        Array.isArray(categories) && categories.map((category) => {
                                            return <option value={category.id} key={category.id}>{ category.name }</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-md-4">
                                <select className="form-control" onChange={handleLimitChanged}>
                                    <option value="">Jumlah Data</option>
                                    {/*<option value={2}>2</option>*/}
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <button type="button" className="btn btn-dark">Tampilkan</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-3">
                                <Link to="/create">
                                    <button type="button" className="btn btn-dark">Tambah Produk</button>
                                </Link>
                            </div>
                            <div className="col-md-3">
                                <button type="button" className="btn btn-dark" onClick={handleExportToXMLButtonClicked}>Export to XML</button>
                            </div>
                            <div className="col-md-3">
                                <button type="button" className="btn btn-dark" onClick={handleExportToExcelClicked}>Export to Excel</button>
                            </div>
                            <div className="col-md-3">
                                <button type="button" className="btn btn-dark" onClick={handleSynchronize}>Sinkronisasi</button>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    Array.isArray(product) && product.map((x) => {
                        return <>
                            <div className="row" style={{ display: 'flex' }}>
                                {
                                    Array.isArray(x) && x.map((p) => {
                                        return <>
                                            <div className="col-md-3">
                                                <div className="card" style={{ margin: '10px' }}>
                                                    <div className="card-body">
                                                        {
                                                            Array.isArray(p.images) && p.images.length > 0
                                                                ? <div style={{ height: '150px', backgroundImage: `url(${p.images[0].content})`, backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center' }} />
                                                                : <div style={{ height: '150px', backgroundImage: `url(${process.env.PUBLIC_URL}/no-image.png)`, backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center' }} />
                                                        }
                                                        <div style={{ padding: '10px' }}>
                                                            <h5 className="card-title">{p.title}</h5>
                                                            <p className="card-text">{p.stock}</p>

                                                        </div>
                                                        <div style={{margin: '10px'}}>

                                                            <Link to={`${p.id}/update`}>
                                                                <button style={{ marginRight: '10px' }} type="button" className="btn btn-dark" onClick={handleUpdateButtonClicked}>Update</button>
                                                            </Link>
                                                            <button type="button" className="btn btn-dark" onClick={() => handleDeleteButtonClicked(p.id)}>Delete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    })
                                }
                            </div>
                        </>
                    })
                }
                <div className="row">
                    <nav>
                        <ul className="pagination">
                            <li className="page-item"><a className="page-link" onClick={handlePrevious} href="#">Previous</a></li>
                            {
                                renderPageButton()
                            }
                            <li className="page-item"><a className="page-link" onClick={handleNext} href="#">Next</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}

export default Home;
