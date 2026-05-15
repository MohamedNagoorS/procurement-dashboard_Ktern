# SAP Fiori Procurement Dashboard

A comprehensive, responsive SAP Fiori application for procurement management, featuring real-time KPIs, interactive charts, and detailed purchase order insights.

## Features

### Dashboard Overview
- **5 KPI Cards** displaying:
  - Total Purchase Orders
  - Open Purchase Orders
  - Released Purchase Orders
  - Delayed Deliveries
  - Total Procurement Amount

### Analytics & Charts
- **Donut Chart**: PO Status Distribution
- **Bar Chart**: Monthly Procurement Amount (Last 6 months)
- **Bar Chart**: Vendor-wise PO Analysis (Top 10)
- **Donut Chart**: Company Code-wise PO Count

### Purchase Order Insights Table
- Comprehensive table with columns:
  - PO Number
  - Vendor Name
  - Company Code
  - Net Amount
  - Currency
  - Delivery Date
  - Status
- **Features**:
  - Global search across all fields
  - Sorting capabilities
  - Filtering options
  - Export to Excel
  - Pagination (20 items per page)
  - Visual indicators for overdue deliveries (red highlight)
  - Status-based semantic coloring

### Navigation
- Click KPI cards to filter table by status
- Click table rows to view detailed PO information
- Breadcrumb navigation

### Responsive Design
- Optimized for Desktop, Tablet, and Mobile devices
- SAP Fiori Horizon theme
- Adaptive layouts

## Technical Stack

- **Framework**: SAPUI5 1.120.0
- **Theme**: SAP Fiori Horizon
- **Language**: JavaScript
- **OData**: V2.0
- **Build Tool**: UI5 Tooling
- **Package Manager**: npm

## Project Structure

```
procurement-dashboard/
├── webapp/
│   ├── controller/
│   │   ├── App.controller.js
│   │   ├── Dashboard.controller.js
│   │   └── Detail.controller.js
│   ├── view/
│   │   ├── App.view.xml
│   │   ├── Dashboard.view.xml
│   │   └── Detail.view.xml
│   ├── model/
│   │   ├── models.js
│   │   └── formatter.js
│   ├── css/
│   │   └── style.css
│   ├── i18n/
│   │   └── i18n.properties
│   ├── Component.js
│   ├── manifest.json
│   └── index.html
├── ui5.yaml
├── package.json
└── README.md
```

## Prerequisites

- Node.js (LTS version)
- npm
- SAP system with EKKO, EKPO, and LFA1 tables
- OData service exposing purchase order data

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure OData Service**:
   - Update `webapp/manifest.json` with your OData service URL
   - Ensure the service exposes a `PurchaseOrders` entity set

## Development

### Run Locally

```bash
npm start
```

The application will open at `http://localhost:8080/index.html`

### Build for Production

```bash
npm run build
```

The built application will be in the `dist/` folder.

## SAP Backend Integration

### Required ABAP Objects

The application expects an OData service with the following structure:

#### Entity: PurchaseOrders

| Field | Type | Description |
|-------|------|-------------|
| PONumber | String | Purchase Order Number (Key) |
| VendorName | String | Vendor Name |
| VendorCode | String | Vendor Code |
| CompanyCode | String | Company Code |
| NetAmount | Decimal | Net Amount |
| Currency | String | Currency Code |
| DeliveryDate | Date | Delivery Date |
| Status | String | PO Status (OPEN/RELEASED/CLOSED) |
| CreatedBy | String | Created By User |
| CreatedOn | Date | Creation Date |
| ContactPerson | String | Vendor Contact Person |
| Phone | String | Vendor Phone |

### ABAP CDS Views (To be created)

1. **ZI_PROCUREMENT_PO_HEADER** - Interface view for EKKO
2. **ZI_PROCUREMENT_PO_ITEMS** - Interface view for EKPO
3. **ZI_PROCUREMENT_VENDOR** - Interface view for LFA1
4. **ZI_PROCUREMENT_DASHBOARD** - Combined view
5. **ZC_PROCUREMENT_DASHBOARD** - Consumption view with annotations

### OData Service

- **Service Definition**: ZSD_PROCUREMENT_DASHBOARD
- **Service Binding**: ZSB_PROCUREMENT_DASHBOARD_O4 (OData V4)
- **Package**: ZPCK_KTERN_MN
- **Transport**: L25K907722

## Deployment

### Deploy to SAP BTP

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy using Cloud Foundry CLI:
   ```bash
   cf push
   ```

### Deploy to SAP Gateway

1. Build the application
2. Upload to SAP Gateway using SAP Web IDE or ABAP Development Tools
3. Register in SAP Fiori Launchpad

## Configuration

### Proxy Configuration

For local development with a remote SAP system, configure the proxy in `ui5.yaml`:

```yaml
server:
  customMiddleware:
    - name: ui5-middleware-simpleproxy
      afterMiddleware: compression
      mountPath: /sap
      configuration:
        baseUri: "http://your-sap-system:8000"
        strictSSL: false
```

### Theme Customization

To change the theme, update `webapp/index.html`:

```html
data-sap-ui-theme="sap_horizon"
```

Available themes: `sap_horizon`, `sap_fiori_3`, `sap_belize`

## Features Implementation Status

- ✅ Dashboard with KPI cards
- ✅ Interactive charts (Donut, Bar, Column)
- ✅ Purchase order table with all features
- ✅ Search functionality
- ✅ Sorting
- ✅ Filtering (basic)
- ✅ Export to Excel
- ✅ Pagination
- ✅ Visual indicators
- ✅ Navigation
- ✅ Detail view
- ✅ Responsive design
- ✅ SAP Fiori Horizon theme
- ⏳ Advanced filtering dialog (TODO)
- ⏳ Sort dialog (TODO)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Copyright © 2026. All rights reserved.

## Support

For issues and questions, please contact the development team.

## Version History

### v1.0.0 (2026-05-15)
- Initial release
- Dashboard with 5 KPI cards
- 4 interactive charts
- Purchase order table with search, sort, filter, export
- Detail view for purchase orders
- Responsive design
- SAP Fiori Horizon theme
