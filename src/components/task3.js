import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const title = 'Adeptus Mechanicus Sicarians Warhammer 40,000';
    // const priceCents = 3210; // $32.10 in cents
    const url = process.env.REACT_APP_URL2;
    const apiKey = process.env.REACT_APP_apiKey2;
    // const title = [];
    // const price = [];
    console.log("url", url)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    `${url}/search/?key=${apiKey}&q=${encodeURIComponent(title)}`
                );
                const foundProducts = response.data.product_result.pricing || [];

                // Filter products by title and price
                // const filteredProducts = foundProducts.filter(product => {
                //     const productPrice = product.price || 0;
                //     return product.title === title && productPrice === price;
                // });
                const link = foundProducts.link;
                const asin = extractASIN(link);
                console.log(link, asin)
                // setProducts(filteredProducts);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProducts();
    // }, [apiKey, title, priceCents]);
}, [apiKey, title,]);

    return (
        <div>
            <h1>Product Table</h1>
            {error && <p>Error: {error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price (USD)</th>
                        <th>Amazon Link</th>
                        <th>ASIN</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.asin}>
                            <td>{product.title}</td>
                            <td>${(product.buyBoxPrice / 100).toFixed(2)}</td>
                            <td>
                                <a href={`https://www.amazon.com/dp/${product.asin}`} target="_blank" rel="noopener noreferrer">
                                    View Product
                                </a>
                            </td>
                            <td>{product.asin}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const extractASIN = (link) => {
    const regex = /\/(dp|gp\/product)\/([A-Z0-9]{10})/;
    const match = link.match(regex);
    return match ? match[2] : null;
};


export default ProductTable;