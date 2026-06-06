import { Vendor, RFQ, Quotation, ApprovalWorkflow, PurchaseOrder, Invoice, ActivityLog } from '../types';

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'V1',
    name: 'Comfort Seating Store',
    category: 'Furniture',
    gstNo: '27AABCS1429B1Z0',
    contactNo: '9876543210',
    email: 'contact@seatingstore.com',
    status: 'Active',
    rating: 4.5,
    country: 'India',
    about: 'Supplier of easy-to-use office chairs and desks.',
    photoUrl: 'https://images.unsplash.com/photo-1590402449133-79d50ad1a940?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    trustScore: 94,
    riskCategory: 'Low Risk',
    onTimeDeliveryRate: 98,
    complianceCleared: true
  },
  {
    id: 'V2',
    name: 'SuperTech Laptops',
    category: 'IT Hardware',
    gstNo: '27AABCS1429B2Z0',
    contactNo: '9988776655',
    email: 'sales@supertechlaptops.com',
    status: 'Active',
    rating: 4.8,
    country: 'India',
    about: 'Affordable developer laptops and screens for local organizations.',
    photoUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    trustScore: 97,
    riskCategory: 'Low Risk',
    onTimeDeliveryRate: 99,
    complianceCleared: true
  },
  {
    id: 'V3',
    name: 'Star Laptops & Gadgets',
    category: 'IT Hardware',
    gstNo: '27AABCS1429B3Z0',
    contactNo: '9123456789',
    email: 'support@starlaptops.com',
    status: 'Active',
    rating: 4.2,
    country: 'India',
    about: 'Provides reliable laptops and computers on short notice.',
    photoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    trustScore: 82,
    riskCategory: 'Medium Risk',
    onTimeDeliveryRate: 88,
    complianceCleared: true
  },
  {
    id: 'V4',
    name: 'Simple Office Furnitures',
    category: 'Furniture',
    gstNo: '27AABCS1429B4Z0',
    contactNo: '8877665544',
    email: 'info@simplefurnitures.com',
    status: 'Active',
    rating: 3.8,
    country: 'India',
    about: 'Budget office chairs, tables, and cabinets.',
    photoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    trustScore: 71,
    riskCategory: 'Medium Risk',
    onTimeDeliveryRate: 74,
    complianceCleared: true
  },
  {
    id: 'V5',
    name: 'Apex Wholesale Brokers (Suspected Fake)',
    category: 'IT Hardware',
    gstNo: '99ZZZAA0000A1Z1',
    contactNo: '9000000000',
    email: 'fakeinbox12398@gmail.com',
    status: 'Blocked',
    rating: 1.2,
    country: 'Seychelles',
    about: 'Shell company offering high-discount bulk computers. Missing audited registrations.',
    photoUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    trustScore: 12,
    riskCategory: 'Suspicious (Fake)',
    isFakeVendor: true,
    onTimeDeliveryRate: 15,
    complianceCleared: false
  },
  {
    id: 'V6',
    name: 'Galaxy Tech Solutions',
    category: 'IT Hardware',
    gstNo: '27AABCS1429B5Z1',
    contactNo: '9822334455',
    email: 'bids@galaxytech.in',
    status: 'Active',
    rating: 4.6,
    country: 'India',
    about: 'Leading enterprise distributor of high-fidelity server clusters, developer consoles, and workspace laptops.',
    photoUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    trustScore: 95,
    riskCategory: 'Low Risk',
    onTimeDeliveryRate: 98,
    complianceCleared: true
  },
  {
    id: 'V7',
    name: 'Decent Woodworks & Decors',
    category: 'Furniture',
    gstNo: '27AABCS1429B6Z2',
    contactNo: '9833445566',
    email: 'corporate@decentwoods.co.in',
    status: 'Active',
    rating: 4.2,
    country: 'India',
    about: 'Premium custom office furniture, ergonomic modular meeting setups, and high-quality workspace cabins.',
    photoUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    trustScore: 89,
    riskCategory: 'Low Risk',
    onTimeDeliveryRate: 93,
    complianceCleared: true
  },
  {
    id: 'V8',
    name: 'Prime Speed Logistix Ltd',
    category: 'Logistics',
    gstNo: '27AABCS1429B7Z3',
    contactNo: '9844556677',
    email: 'operations@primespeed.com',
    status: 'Active',
    rating: 4.7,
    country: 'India',
    about: 'Third-party logistics, fast inter-city heavy vehicle freight, and same-day delivery SLAs for corporate inventory.',
    photoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    trustScore: 97,
    riskCategory: 'Low Risk',
    onTimeDeliveryRate: 99,
    complianceCleared: true
  },
  {
    id: 'V9',
    name: 'Office Kraft Stationery Providers',
    category: 'Stationery',
    gstNo: '27AABCS1429B8Z4',
    contactNo: '9855667788',
    email: 'sales@officekraft.co.in',
    status: 'Active',
    rating: 4.3,
    country: 'India',
    about: 'Wholesale suppliers of certified organic paper batches, filing cabinets, customized organizational tools, and ledger files.',
    photoUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    trustScore: 92,
    riskCategory: 'Low Risk',
    onTimeDeliveryRate: 96,
    complianceCleared: true
  },
  {
    id: 'V10',
    name: 'Reliable Build Materials',
    category: 'Constructions',
    gstNo: '27AABCS1429B9Z5',
    contactNo: '9865778899',
    email: 'tender@reliablebuild.com',
    status: 'Active',
    rating: 4.5,
    country: 'India',
    about: 'Heavy structural steel, cement blocks, modular ceiling structures, and corporate office real estate constructions material supplier.',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    trustScore: 94,
    riskCategory: 'Low Risk',
    onTimeDeliveryRate: 95,
    complianceCleared: true
  }
];

export const INITIAL_RFQS: RFQ[] = [
  {
    id: 'RFQ-2025-0001',
    title: 'Office Chairs & Desks',
    category: 'Furniture',
    deadline: '2025-06-15',
    description: 'We need 25 comfortable office chairs and 10 standing desks for our workspace upgrade.',
    status: 'Quotations Received',
    dateCreated: '2025-05-10',
    assignedVendors: ['V1', 'V4'],
    lineItems: [
      { id: 'L1', item: 'Office Chair', qty: 25, unit: 'NOS' },
      { id: 'L2', item: 'Standing Desk', qty: 10, unit: 'NOS' }
    ],
    attachments: [
      { name: 'Room_Layout.pdf', size: '1.2 MB' }
    ]
  },
  {
    id: 'RFQ-2025-0002',
    title: 'Laptops purchase',
    category: 'IT Hardware',
    deadline: '2025-06-25',
    description: 'We require 15 lightweight programmer laptops and 10 desktop screens for our new developers.',
    status: 'Quotations Received',
    dateCreated: '2025-05-20',
    assignedVendors: ['V2', 'V3', 'V1'],
    lineItems: [
      { id: 'L3', item: 'Core i7 Laptop', qty: 15, unit: 'NOS' },
      { id: 'L4', item: 'Desktop Screen', qty: 10, unit: 'NOS' }
    ],
    attachments: []
  },
  {
    id: 'RFQ-2025-0003',
    title: 'Delivery Trucks partnership',
    category: 'Logistics',
    deadline: '2025-07-01',
    description: 'Partnership with local delivery trucks to transport furniture and hardware around town.',
    status: 'Draft',
    dateCreated: '2025-05-28',
    assignedVendors: [],
    lineItems: [
      { id: 'L5', item: 'Loader Delivery Truck Km run', qty: 1000, unit: 'KM' }
    ],
    attachments: []
  }
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  // Office Chairs & Desks Quotations
  {
    id: 'Q-001',
    rfqId: 'RFQ-2025-0001',
    rfqTitle: 'Office Chairs & Desks',
    vendorId: 'V1',
    vendorName: 'Comfort Seating Store',
    lineItems: [
      { id: 'L1', item: 'Office Chair', qty: 25, unit: 'NOS', unitPrice: 3800 },
      { id: 'L2', item: 'Standing Desk', qty: 10, unit: 'NOS', unitPrice: 9000 }
    ],
    taxRate: 18,
    subtotal: 185000,
    gstAmount: 33300,
    grandTotal: 218300,
    deliveryDays: 5,
    notes: 'Premium ergonomic posture support chairs and easy-to-use tables.',
    status: 'Submitted',
    dateSubmitted: '2025-05-18',
    rating: 4.5
  },
  {
    id: 'Q-002',
    rfqId: 'RFQ-2025-0001',
    rfqTitle: 'Office Chairs & Desks',
    vendorId: 'V4',
    vendorName: 'Simple Office Furnitures',
    lineItems: [
      { id: 'L1', item: 'Office Chair', qty: 25, unit: 'NOS', unitPrice: 3500 },
      { id: 'L2', item: 'Standing Desk', qty: 10, unit: 'NOS', unitPrice: 8200 }
    ],
    taxRate: 18,
    subtotal: 169500,
    gstAmount: 30510,
    grandTotal: 200010,
    deliveryDays: 10,
    notes: 'Simple variants at bulk discount rates with durable builds.',
    status: 'Submitted',
    dateSubmitted: '2025-05-19',
    rating: 3.8
  },

  // Laptop Purchase Quotations (Precisely 3 Quotations to Compare)
  {
    id: 'Q-003',
    rfqId: 'RFQ-2025-0002',
    rfqTitle: 'Laptops purchase',
    vendorId: 'V2',
    vendorName: 'SuperTech Laptops',
    lineItems: [
      { id: 'L3', item: 'Core i7 Laptop', qty: 15, unit: 'NOS', unitPrice: 55000 },
      { id: 'L4', item: 'Desktop Screen', qty: 10, unit: 'NOS', unitPrice: 15000 }
    ],
    taxRate: 18,
    subtotal: 975000,
    gstAmount: 175500,
    grandTotal: 1150500,
    deliveryDays: 4,
    notes: 'Top tier high-performance developer laptops with 3 years warranty.',
    status: 'Submitted',
    dateSubmitted: '2025-05-21',
    rating: 4.8
  },
  {
    id: 'Q-004',
    rfqId: 'RFQ-2025-0002',
    rfqTitle: 'Laptops purchase',
    vendorId: 'V3',
    vendorName: 'Star Laptops & Gadgets',
    lineItems: [
      { id: 'L3', item: 'Core i7 Laptop', qty: 15, unit: 'NOS', unitPrice: 53000 },
      { id: 'L4', item: 'Desktop Screen', qty: 10, unit: 'NOS', unitPrice: 14000 }
    ],
    taxRate: 18,
    subtotal: 935000,
    gstAmount: 168300,
    grandTotal: 1103300,
    deliveryDays: 8,
    notes: 'Reliable speed laptops and slim bezel screens.',
    status: 'Submitted',
    dateSubmitted: '2025-05-22',
    rating: 4.2
  },
  {
    id: 'Q-005',
    rfqId: 'RFQ-2025-0002',
    rfqTitle: 'Laptops purchase',
    vendorId: 'V1',
    vendorName: 'Comfort Seating Store', // Also bids electronics since they are diverse
    lineItems: [
      { id: 'L3', item: 'Core i7 Laptop', qty: 15, unit: 'NOS', unitPrice: 51000 },
      { id: 'L4', item: 'Desktop Screen', qty: 10, unit: 'NOS', unitPrice: 13500 }
    ],
    taxRate: 18,
    subtotal: 899990,
    gstAmount: 161998,
    grandTotal: 1061988,
    deliveryDays: 14,
    notes: 'Most economical bulk rate. Standard shipping times apply.',
    status: 'Submitted',
    dateSubmitted: '2025-05-23',
    rating: 4.5
  }
];

export const INITIAL_APPROVALS: ApprovalWorkflow[] = [
  {
    id: 'APP-001',
    rfqId: 'RFQ-2025-0001',
    rfqTitle: 'Office Chairs & Desks',
    quotationId: 'Q-002',
    vendorId: 'V4',
    vendorName: 'Simple Office Furnitures',
    grandTotal: 200010,
    deliveryDays: 10,
    rating: 3.8,
    status: 'Pending',
    currentStepIndex: 2, // L2 Approval
    steps: [
      { name: 'Submitted', label: 'Submitted', status: 'completed', user: 'Rahul Mehta (Procurement Officer)', date: '2025-05-20, 09:15 AM', remark: 'Quotation selected through automated comparison' },
      { name: 'L1 Review', label: 'L1 Review', status: 'completed', user: 'Rahul Mehta (Procurement head)', date: '2025-05-20, 10:32 AM', remark: 'Pricing aligns with basic office requirements.' },
      { name: 'L2 Approval', label: 'L2 Approval', status: 'current', user: 'Priya Shah (Finance Manager)', remark: 'Awaiting' },
      { name: 'Generate PO', label: 'Generate PO', status: 'pending' }
    ],
    history: [
      { user: 'Rahul Mehta', role: 'Procurement Head', action: 'Approved L1', remark: 'Pricing aligns with basic office requirements.', date: 'May 20, 10:32 AM' }
    ]
  }
];

export const INITIAL_POS: PurchaseOrder[] = [
  {
    id: 'PO-2025-0068',
    rfqId: 'RFQ-2025-0001',
    quotationId: 'Q-002',
    vendorId: 'V4',
    vendorName: 'Simple Office Furnitures',
    vendorGst: '27GSTIN343434DB4523',
    vendorAddress: '456, Industrial Estate, Surat, Gujarat',
    organisationName: 'VendorBridge Enterprise',
    organisationAddress: '123 Business Park, Ahmedabad, Gujarat',
    organisationGst: '25383434A8FB1Z9',
    dateCreated: '2025-05-21',
    poNumber: 'PO-2025-0068',
    status: 'Confirmed',
    lineItems: [
      { id: 'L1', item: 'Office Chair', qty: 25, unit: 'NOS', unitPrice: 3500 },
      { id: 'L2', item: 'Standing Desk', qty: 10, unit: 'NOS', unitPrice: 8200 }
    ],
    subtotal: 169500,
    cgst: 15255,
    sgst: 15255,
    grandTotal: 200010
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2025-001',
    poId: 'PO-2025-0068',
    rfqId: 'RFQ-2025-0001',
    vendorId: 'V4',
    vendorName: 'Simple Office Furnitures',
    vendorGst: '27GSTIN343434DB4523',
    vendorAddress: '456, Industrial Estate, Surat, Gujarat',
    organisationName: 'VendorBridge Enterprise',
    organisationAddress: '123 Business Park, Ahmedabad, Gujarat',
    organisationGst: '25383434A8FB1Z9',
    invoiceNumber: 'INV-2025-50284',
    poNumber: 'PO-2025-0068',
    dateCreated: '2025-05-22',
    dueDate: '2025-06-22',
    subtotal: 169500,
    cgst: 15255,
    sgst: 15255,
    grandTotal: 200010,
    status: 'Pending Payment'
  },
  {
    id: 'INV-2025-002',
    poId: 'PO-2025-0099',
    rfqId: 'RFQ-2025-0009',
    vendorId: 'V2',
    vendorName: 'SuperTech Laptops',
    vendorGst: '27AABCS1429B2Z0',
    vendorAddress: 'B-404, Tech Arcade, Pune, Maharashtra',
    organisationName: 'VendorBridge Enterprise',
    organisationAddress: '123 Business Park, Ahmedabad, Gujarat',
    organisationGst: '25383434A8FB1Z9',
    invoiceNumber: 'INV-2025-41092',
    poNumber: 'PO-2025-0072',
    dateCreated: '2025-04-12',
    dueDate: '2025-05-12',
    subtotal: 120000,
    cgst: 10800,
    sgst: 10800,
    grandTotal: 141600,
    status: 'Paid'
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'ACT-001',
    type: 'Quotation',
    message: 'Quotation selected - Simple Office Furnitures selected for Office Chairs & Desks',
    user: 'Rahul Mehta',
    timestamp: '2025-05-23, 9:15 PM'
  },
  {
    id: 'ACT-002',
    type: 'Approval',
    message: 'PO-2025-0068 awaiting L2 approval by Priya Shah',
    user: 'Rahul Mehta',
    timestamp: '2025-05-22, 09:15 AM'
  },
  {
    id: 'ACT-003',
    type: 'RFQ',
    message: 'RFQ published - Office Chairs & Desks sent to 2 vendors',
    user: 'Rahul Mehta',
    timestamp: '2025-05-19, 04:30 PM'
  },
  {
    id: 'ACT-004',
    type: 'Vendor',
    message: 'Vendor added - Star Laptops & Gadgets registered',
    user: 'System Agent',
    timestamp: '2025-05-18, 3:20 PM'
  }
];
