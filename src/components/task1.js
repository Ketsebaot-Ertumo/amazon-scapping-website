import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

const ProductTable1 = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const asins = [ "B0716LYWXG", "B073M2SKKQ", "B0746G7SBF", "B074MB4X97", "B074MCDX59", "B074MCMM89","B07953J7MC","B07K54FH2Y","B07MMZ5141","B07Q23GW7W","B07Z8HBC19","B083ZJ2964","B084KQTQL8","B0851NR414","B08571NLQV","B08BNC4GL6","B08BNGRCJS","B08M6DJ925",
        "B08N5F5X91","B08N5FQN62","B08PQ7GR1V","B08PS67BH6","B08QFS24H5","B0BTDD6Z24","B08J5NZ8RH","B0BK9NJJFH","B0CB1BGFX3","B0CB1BFQCZ","B09Y2DFGVK","B095J4W4SJ","B0CLM8GDCQ","B079CMQ362","B08GBYD7LN","B01GU06PFW","B0C243R7JY","B095J89LR4","B08VHDJMBK",
        "B07LB8S9LL","B00MR2K43W","B08BNPCD55","B0B8ZPGN7F","B00PM9R87W","B0BVMGYQJJ","B011KPL5BQ","B07QN8DJFK","B092MRC5Y9","B09WZDVY29","B08KHNGVCX","B0CBKJVLFB","B0CGV6V47P","B01N5WN83Y","B0CFLQ95BL","B09B7XV6SY","B0CJ99HNZ7","B078VD5SVJ","B08THPKRMY",
        "B07Z8H313L","B09MNH2FTG","B0CLM7582R","B09W2Q6N78","B07SV3KST2","B08GQGF9D7","B007SBBJ2M","B07V2PBJBC","B0BBJH8F9V","B09C3NTQSP","B09VM4MD9G","B01ETNW7PY","B08PZ39F9Y","B07WJHVDFC","B000NIDR9K","B0C8JH7HTS","B09VH2TW3H","B074WH9LX8","B0CHS1KPT5",
        "B0CLM8TSB8","B09RN2F7BL","B07TT7XVVF","B0B8ZMMP54","B0CJS2VYVQ","B08KHQ2T6G","B016DOIXB4","B00PQJ59GU","B0B4K9B9Q4","B0968PW797","B0CHS34LVP","B00U2MZCGI","B0BSFPTZWJ","B0763KR5DM","B09WCHJNK5","B08KHP79L7","B0C9NKS78X","B0CJS1HRQY","B0CJS1VS6C",
        "B0CCPCNLWF","B07GWYYXD3","B0763KGZ9W","B095J8FYZP","B08MVMPLJQ","B09SZMQV11"]
    const Asins = asins.join(',');
    const url = process.env.REACT_APP_URL1;
    const apiKey = process.env.REACT_APP_apiKey1;

    const fetchProducts = async () => {
        try {
            const fields = 'asin,imagesCSV,title,itemWeight,buyBoxCurrent,salesRankDrop,historicFBASellers,referralFeePercentage,liveFBASellers,fbaFees'
            const response = await axios.get(
                `${url}/product/?key=${apiKey}&domain=1&asin=${Asins}&fields=${fields}`
            );
            const foundProducts = response.data.products;
            const updatedProducts = foundProducts.map(product => {
                const offers = product.offers; // Assuming offers is present

                console.log(products.imagesCSV)
                // Initialize variables
                let saturationScore = null;
                let totalFBASock = 0;
                let purchasableUnits = 0;
                
                if (offers) {
                    if (offers.FBA) {
                        for (const offer of offers.FBA) {
                            totalFBASock += offer.stock || 0; // Sum up stock for FBA offers
                            saturationScore = offer.saturationScore || null; // Take saturation score
                        }
                    }
                    if (offers.merchant) {
                        for (const offer of offers.merchant) {
                            purchasableUnits += offer.stock || 0; // Sum up stock for Merchant offers
                        }
                    }
                }
                return {
                    ...product,
                    totalFBASock,
                    saturationScore,
                    purchasableUnits
                };
            });
            setProducts(updatedProducts);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [asins]);

    const columns = [
        {
            field: 'asin',
            headerName: 'ASIN',
            width: 150,
            editable: false,
        },
        {
            field: 'imagesCSV',
            headerName: 'Images',
            width: 300,
            renderCell: (params) => {
                const baseUrl = "https://images-na.ssl-images-amazon.com/images/I/"; // Use the correct base URL
                const images = params.row.imagesCSV ? params.row.imagesCSV.split(',') : [];
                
                return images.length > 0 ? (
                    images.map((image, index) => (
                        <img 
                            key={index} 
                            src={`${baseUrl}${image}`} // Construct full URL
                            alt={`Image-${index + 1}`} 
                            style={{ width: '50px', height: 'auto', marginRight: '5px' }} 
                        />
                    ))
                ) : (
                    'Null'
                );
            },
        },
        {
            field: 'title',
            headerName: 'Title',
            width: 200,
            editable: false,
            renderCell: (params) => params.row.title || 'N/A',
        },
        {
            field: 'itemWeight',
            headerName: 'Weight (grams)',
            width: 150,
            editable: false,
            renderCell: (params) => params.row.itemWeight || 'N/A',
        },
        {
            field: 'buyBoxCurrent',
            headerName: 'Buy Box Current',
            width: 150,
            renderCell: (params) => 
                params.row.buyBoxEligibleOfferCounts 
                    ? params.row.buyBoxEligibleOfferCounts[0] 
                    : 'N/A',
        },
        {
            field: 'salesRankDrop',
            headerName: 'Sales Rank: 30 days drop %',
            width: 200,
            renderCell: (params) => calculateSalesRankDrop(params.row.salesRankReferenceHistory),
        },
        {
            field: 'historicFBASellers',
            headerName: 'Historic FBA Sellers',
            width: 150,
            renderCell: (params) => 
                params.row.buyBoxEligibleOfferCounts 
                    ? params.row.buyBoxEligibleOfferCounts.reduce((a, b) => a + b, 0) 
                    : 'N/A',
        },
        {
            field: 'referralFeePercentage',
            headerName: 'Referral fee (%)',
            width: 150,
            editable: false,
            renderCell: (params) => params.row.referralFeePercentage || 'N/A',
        },
        {
            field: 'liveFBASellers',
            headerName: '# FBA Sellers Live',
            width: 150,
            renderCell: (params) => 
                params.row.buyBoxEligibleOfferCounts 
                    ? params.row.buyBoxEligibleOfferCounts.length 
                    : 'N/A',
        },
        {
            field: 'saturationScore',
            headerName: 'Saturation Score',
            width: 150,
            editable: false,
            renderCell: (params) => params.row.saturationScore || "null",
        },
        {
            field: 'fbaFees',
            headerName: 'FBA Fees',
            width: 150,
            renderCell: (params) => 
                params.row.fbaFees 
                    ? params.row.fbaFees.pickAndPackFee 
                    : 'N/A',
        },
        {
            field: 'totalFBASock',
            headerName: 'Total FBA Stock',
            width: 150,
            editable: false,
            renderCell: (params) => params.row.totalFBASock || 0,
        },
        {
            field: 'purchasableUnits',
            headerName: 'Purchasable Units',
            width: 150,
            editable: false,
            renderCell: (params) => params.row.purchasableUnits || 0,
        },
    ];
    

    return (
        <div className='pl-2'>
            <h1 className='font-bold py-10 text-center text-2xl'>Product Table</h1>
            {error && <p>Error: {error}</p>}

            <DataGrid 

                getRowId={(row) => row.asin} 
                sx={{
                    '& .MuiTablePagination-displayedRow': {
                    color: 'black',
                },
                color: 'black',
                [
                    `& .${gridClasses.row}`]:{bgcolor: 'white'},
                }}

                rows={products}  // Assuming `products.data` contains your list of products
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                pagination
                pageSizeOptions={[5,10,25,50,100]}
            />
        </div>
    )
}

// Function to calculate the 30 days sales rank drop percentage
const calculateSalesRankDrop = (salesRankHistory) => {
    if (!salesRankHistory || salesRankHistory.length < 2) {
        return 'N/A'; // Not enough data
    }
    const initialRank = salesRankHistory[0];
    const finalRank = salesRankHistory[salesRankHistory.length - 1];
    const dropPercent = ((initialRank - finalRank) / initialRank) * 100;
    return dropPercent.toFixed(2); // Formatting the drop percentage
};

export default ProductTable1;

