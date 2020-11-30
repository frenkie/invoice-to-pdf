export interface Client {
    name: string;
    address: string;
    postal: string;
    city: string;
}

export type Config = {
    invoiceId: string;
};

export interface InvoiceItem {
    description: string;
    unit: string;
    amount: string;
    pricePerUnit: number;
    total: number;
}

export interface Invoice {
    client: Client;
    invoice: InvoiceMeta;
}

export interface InvoiceMeta {
    nr: string;
    date: string; // format DD-MM-YYYY
    expires: string; // format DD-MM-YYYY
    items: InvoiceItem[];
}
