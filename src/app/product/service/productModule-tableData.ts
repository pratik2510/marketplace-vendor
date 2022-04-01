export const ProductColumnData = [
    {
        label: '',
        valueKey: null,
        type: 'ExpandRow',
        IsShort: false,
        // colSize : '4em'
    },
    {
        label: 'PRODUCT_LIST.SR_NO',
        valueKey: null,
        type: 'index',
        IsShort: false,
        // colSize : '4em'
    },
    {
        label: 'PRODUCT_LIST.PRODUCT_ID',
        valueKey: 'id',
        type: 'data',
        IsShort: false,
        // colSize : '4em'
    },
    {
        label: 'PRODUCT_LIST.PRODUCT_CODE',
        valueKey: 'PNCDE',
        type: 'data',
        IsShort: false,
        // colSize : '8em'
    },
    {
        label: 'PRODUCT_LIST.NAME',
        valueKey: 'productName',
        type: 'data',
        IsShort: false,
        // colSize : '25em'
    },
    {
        label: 'PRODUCT_LIST.CATEGORY',
        valueKey: "category.categoryName",
        type: 'data',
        IsShort: false,
        // colSize : '10em'
    },
    {
        label: 'PRODUCT_LIST.COUNTRY',
        valueKey: "country.countryName",
        type: 'data',
        IsShort: true,
        // colSize : '10em'
    },
    {
        label: 'PRODUCT_LIST.MANUFACTURER',
        valueKey: "manufactureDetail.manufacturerName",
        type: 'data',
        IsShort: false,
        // colSize : '10em'
    },
    {
        label: 'PRODUCT_LIST.PRICE',
        valueKey: 'MRP',
        type: 'currency',
        IsShort: true,
        // colSize : '5em'
    },
    {
        label: 'PRODUCT_LIST.APPROVED_STATUS',
        valueKey: 'approvedStatus',
        type: 'data_design',
        IsShort: false,
        // colSize : '10em',
        addTag: true
    },
    {
        label: 'COMMON_KEYS.ACTION',
        valueKey: '',
        type: 'action',
        IsShort: false,
        // colSize : '4em'
    }
];

export const LiveProductColumnData = [
    {
        label: '',
        valueKey: null,
        type: 'ExpandRow',
        IsShort: false,
        // colSize : '1em'
    },
    {
        label: 'PRODUCT_LIST.SR_NO',
        valueKey: null,
        type: 'index',
        IsShort: false,
        // colSize : '1em'
    },
    {
        label: 'PRODUCT_LIST.PRODUCT_ID',
        valueKey: 'id',
        type: 'data',
        IsShort: false,
        // colSize : '2em'
    },
    {
        label: 'PRODUCT_LIST.PRODUCT_CODE',
        valueKey: 'PNCDE',
        type: 'data',
        IsShort: false,
        // colSize : '8em'
    },
    {
        label: 'PRODUCT_LIST.NAME',
        valueKey: 'productName',
        type: 'data',
        IsShort: false,
        // colSize : '8em'
    },
    {
        label: 'PRODUCT_LIST.CATEGORY',
        valueKey: "category.categoryName",
        type: 'data',
        IsShort: false,
        // colSize : '8em'
    },
    {
        label: 'PRODUCT_LIST.COUNTRY',
        valueKey: "country.countryName",
        type: 'data',
        IsShort: false,
        // colSize : '8em'
    },
    {
        label: 'PRODUCT_LIST.MANUFACTURER',
        valueKey: "manufactureDetail.manufacturerName",
        type: 'data',
        IsShort: false,
        // colSize : '8em'
    },
    {
        label: 'PRODUCT_LIST.QUANTITY',
        valueKey: "sellerProducts.0.quantity",
        type: 'data',
        IsShort: false,
        // colSize : '8em'
    },
    {
        label: 'PRODUCT_LIST.PRICE',
        valueKey: 'MRP',
        type: 'currency',
        IsShort: true,
        // colSize : '2em'
    },
    {
        label: 'COMMON_KEYS.ACTION',
        valueKey: '',
        type: 'action',
        IsShort: false,
        // colSize : '2em'
    }

];

export const ProductChildColumnData = [
    {
        label: 'PRODUCT_MODULE.VARIANT_TABLE.VARIANT_ID',
        valueKey: 'id',
        type: 'data'
    },
    {
        label: 'PRODUCT_LIST.VARIANT',
        valueKey: 'productName',
        type: 'data'
    },
    {
        label: 'PRODUCT_LIST.QUANTITY',
        valueKey: 'sellerProducts.0.quantity',
        type: 'data'
    },
    {
        label: 'PRODUCT_LIST.SALE_PRICE',
        valueKey: 'sellPrice',
        type: 'currency'
    },
    {
        label: 'PRODUCT_LIST.PRICE',
        valueKey: 'MRP',
        type: 'currency'
    },
    {
        label: 'PRODUCT_LIST.WALLET_PRICE',
        valueKey: 'walletPrice',
        type: 'currency'
    },
    {
        label: 'COMMON_KEYS.ACTION',
        valueKey: '',
        type: 'action'
    }
];

export const LiveChildColumnData = [
    {
        label: 'PRODUCT_MODULE.VARIANT_TABLE.VARIANT_ID',
        valueKey: 'id',
        type: 'data'
    },
    {
        label: 'PRODUCT_LIST.VARIANT',
        valueKey: 'productName',
        type: 'data'
    },
    {
        label: 'PRODUCT_LIST.QUANTITY',
        valueKey: 'sellerProducts.0.quantity',
        type: 'data'
    },
    {
        label: 'PRODUCT_LIST.SALE_PRICE',
        valueKey: 'sellPrice',
        type: 'currency'
    },
    {
        label: 'PRODUCT_LIST.PRICE',
        valueKey: 'MRP',
        type: 'currency'
    },
    {
        label: 'PRODUCT_LIST.WALLET_PRICE',
        valueKey: 'walletPrice',
        type: 'currency'
    }
];

export const productActions = {
    settingOptions: [
        { title: 'Duplicate' },
        { title: 'Edit' }
    ],
    settingOptions_variant: [
        { title: 'Delete' }
    ],
    isLiveProductPage: false
}

export const liveProductActions = {
    settingOptions: [
        { title: 'Edit' }
    ],
    isLiveProductPage: true
}
