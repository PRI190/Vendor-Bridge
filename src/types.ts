export type UserRole = 'Procurement Officer' | 'Vendor' | 'Manager' | 'Admin';

export interface Vendor {
  id: string;
  name: string;
  category: string;
  gstNo: string;
  contactNo: string;
  email: string;
  status: 'Active' | 'Pending' | 'Blocked';
  rating: number;
  country: string;
  about?: string;
  photoUrl?: string;
  trustScore?: number; // 0 to 100
  riskCategory?: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Suspicious (Fake)'; 
  isFakeVendor?: boolean; 
  onTimeDeliveryRate?: number; // e.g. 98%
  complianceCleared?: boolean;
}

export interface LineItem {
  id: string;
  item: string;
  qty: number;
  unit: string;
  unitPrice?: number;
  estimatedPrice?: number;
}

export interface RFQ {
  id: string;
  title: string;
  category: string;
  deadline: string;
  description: string;
  status: 'Draft' | 'Sent to Vendors' | 'Quotations Received' | 'Under Review' | 'Approved' | 'Rejected' | 'PO Generated';
  dateCreated: string;
  assignedVendors: string[]; // Vendor IDs
  lineItems: LineItem[];
  attachments: { name: string; size: string }[];
}

export interface Quotation {
  id: string;
  rfqId: string;
  rfqTitle: string;
  vendorId: string;
  vendorName: string;
  lineItems: LineItem[];
  taxRate: number; // e.g. 18 for 18%
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
  deliveryDays: number;
  notes: string;
  status: 'Draft' | 'Submitted' | 'Selected' | 'Rejected';
  dateSubmitted?: string;
  rating?: number; // vendor rating for comparison
}

export interface ApprovalStep {
  name: string;
  label: string;
  status: 'completed' | 'current' | 'pending' | 'rejected';
  user?: string;
  date?: string;
  remark?: string;
}

export interface ApprovalWorkflow {
  id: string;
  rfqId: string;
  rfqTitle: string;
  quotationId: string;
  vendorId: string;
  vendorName: string;
  grandTotal: number;
  deliveryDays: number;
  rating: number;
  status: 'Pending' | 'L1 Approved' | 'Approved' | 'Rejected';
  currentStepIndex: number;
  steps: ApprovalStep[];
  history: {
    user: string;
    role: string;
    action: string;
    remark: string;
    date: string;
  }[];
}

export interface PurchaseOrder {
  id: string;
  rfqId: string;
  quotationId: string;
  vendorId: string;
  vendorName: string;
  vendorGst: string;
  vendorAddress: string;
  organisationName: string;
  organisationAddress: string;
  organisationGst: string;
  dateCreated: string;
  poNumber: string;
  status: 'Issued' | 'Confirmed' | 'Delivered';
  lineItems: LineItem[];
  subtotal: number;
  cgst: number; // 9%
  sgst: number; // 9%
  grandTotal: number;
}

export interface Invoice {
  id: string;
  poId: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  vendorGst: string;
  vendorAddress: string;
  organisationName: string;
  organisationAddress: string;
  organisationGst: string;
  invoiceNumber: string;
  poNumber: string;
  dateCreated: string;
  dueDate: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
  status: 'Pending Payment' | 'Paid';
}

export interface ActivityLog {
  id: string;
  type: 'RFQ' | 'Quotation' | 'Approval' | 'Invoice' | 'Vendor';
  message: string;
  user: string;
  timestamp: string;
}
