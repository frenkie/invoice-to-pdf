# Simple invoice tool

Makes for an easier styled PDF invoice generator with JSON data input. 

## installation
`npm install` with Node >= 12 should do the trick.

## configuration

Create a data folder in the root with invoice JSON files.

Content structure in JSON (or use TypeScript interfaces):

```

{
  "client": {
    "name": "First Last",
    "address": "street + number",
    "postal": "1111 AB",
    "city": "Amsterdam"
  },
  "invoice": {
    "nr": "same as filename",
    "date": "DD-MM-YYYY",
    "expires": "DD-MM-YYYY",
    "items": [
      {
        "description": "Omschrijving",
        "unit": "vaste prijs",
        "amount": "1",
        "pricePerUnit": 1000,
        "total": 1000 // without taxes
      }
    ]
  }
}

```

Reference the invoice to PDF in `config.tsx` through it's name without the extension.

Rename `index.example.html` to `index.html` and adjust your invoice specs.

## running
`npm run dev` will expose the website that you can save to PDF on `localhost:1234`.