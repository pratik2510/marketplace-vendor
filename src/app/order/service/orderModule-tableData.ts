export const orderColumnData = [
    {
        label: 'PRODUCT_LIST.SR_NO',
        valueKey: null,
        type: 'index',
        IsShort: false,
        // colSize: '1em'
    },
    {
        label: 'ORDER_MODULE.PURCHASE_ORDER',
        valueKey: 'orderNo',
        type: 'data',
        IsShort: true,
        // colSize: '2em'
    },
    {
        label: 'ORDER_MODULE.DATE',
        valueKey: 'orderDate',
        type: 'date',
        IsShort: true,
        // colSize: '3em'
    },
    {
        label: 'ORDER_MODULE.ORDER_TOTAL',
        valueKey: 'finalTotal',
        type: 'data',
        IsShort: true,
        // colSize: '2em'
    },
    {
        label: 'COMMON_KEYS.ACTION',
        valueKey: '',
        type: 'action',
        IsShort: false,
        // colSize: '2em'
    }
];

export const orderActions = {
    settingOptions: [
        { title: 'Download PO' }
    ]
};
