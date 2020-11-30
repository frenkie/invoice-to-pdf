import React, { useState, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import { Invoice, InvoiceItem } from './types';
import { Config } from '../config';
import moment from 'moment';

function getSubtotal(invoiceItems: InvoiceItem[]): number {
    let subtotal = 0;

    invoiceItems.forEach((item) => {
        subtotal += item.total;
    });

    return subtotal;
}

function getTax(subtotal: number): number {
    return subtotal * 0.21;
}

function getTotal(subtotal: number): number {
    return subtotal + getTax(subtotal);
}

function getHumanReadablePrice(price: number) {
    return price.toFixed(2).replace('.', ',');
}

interface RowProps {
    data: InvoiceItem;
}

function InvoiceItemRow({ data }: RowProps): JSX.Element {
    return (
        <tr>
            <td>{data.description}</td>
            <td>{data.unit}</td>
            <td>{data.amount}</td>
            <td>{getHumanReadablePrice(data.pricePerUnit)}</td>
            <td>{getHumanReadablePrice(data.total)}</td>
        </tr>
    );
}

export default function (): JSX.Element {
    const [invoiceData, setInvoiceData] = useState<Invoice | undefined>(
        undefined
    );

    useEffect(() => {
        fetch(`data/${Config.invoiceId}.json`).then(async (result) => {
            const data = await result.json();
            setInvoiceData(data);
        });
    });

    if (invoiceData == undefined) {
        return <>Loading invoice..</>;
    } else {
        const subtotal = getSubtotal(invoiceData.invoice.items);
        const tax = getTax(subtotal);
        const total = getTotal(subtotal);

        return (
            <>
                <header>
                    <img src="img/logo.jpg" width="350" />
                    <div className="invoice-meta">
                        <h1>factuur</h1>
                        <dl>
                            <dt>factuurnummer</dt>
                            <dd>{invoiceData.invoice.nr}</dd>
                            <dt>factuurdatum</dt>
                            <dd>
                                {moment(
                                    invoiceData.invoice.date,
                                    'DD-MM-YYYY'
                                ).format('DD-MM-YYYY')}
                            </dd>
                            <dt>vervaldatum</dt>
                            <dd>
                                {moment(
                                    invoiceData.invoice.expires,
                                    'DD-MM-YYYY'
                                ).format('DD-MM-YYYY')}
                            </dd>
                        </dl>
                    </div>
                </header>
                <main>
                    <div>
                        <h2 className="client-title">
                            {invoiceData.client.name}
                        </h2>
                        <span>{invoiceData.client.address}</span>
                        <br />
                        <span>
                            {invoiceData.client.postal}{' '}
                            {invoiceData.client.city}
                        </span>
                        <br />
                    </div>
                    <table className="invoice-items">
                        <thead>
                            <tr>
                                <th>omschrijving</th>
                                <th>unit</th>
                                <th>aantal</th>
                                <th>bedrag/unit</th>
                                <th>totaal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceData.invoice.items.map(
                                (data: InvoiceItem, i) => (
                                    <InvoiceItemRow data={data} key={i} />
                                )
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={4}>
                                    <span className="invoice-items__subtotal">
                                        subtotaal
                                    </span>
                                </td>
                                <td>
                                    <span className="invoice-items__subtotal">
                                        {getHumanReadablePrice(subtotal)}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>BTW 21%</td>
                                <td>{getHumanReadablePrice(tax)}</td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                    <span className="invoice-items__total">
                                        totaal
                                    </span>
                                </td>
                                <td>
                                    <span className="invoice-items__total">
                                        €{getHumanReadablePrice(total)}
                                    </span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                    <p>
                        Graag zie ik uw betaling binnen de gestelde vervaldatum
                        overgemaakt op rekeningnummer NL43 SNSB 0960.6189.02
                        onder vermelding van het factuurnummer{' '}
                        {invoiceData.invoice.nr}.
                    </p>
                    <p>
                        Met vriendelijke groet,
                        <br />
                        <br />
                        frankbosma.nl
                    </p>
                    <p>Frank Bosma</p>
                </main>
            </>
        );
    }
}
