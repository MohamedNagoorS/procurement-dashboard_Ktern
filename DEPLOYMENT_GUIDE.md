# SAP Fiori Procurement Dashboard - Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the SAP Fiori Procurement Dashboard application.

## Prerequisites
- SAP system with ABAP Development Tools (ADT) access
- Node.js and npm installed
- SAP Fiori tools installed
- Access to package ZPCK_KTERN_MN
- Transport request L25K907722

## Backend Components (Already Created)

### 1. CDS View: ZI_PROCUREMENT_DASHBOARD
**Location:** ZPCK_KTERN_MN → Core Data Services → Data Definitions
**Status:** ✅ Active
**Description:** Procurement Dashboard CDS view based on I_PurchaseOrderAPI01

### 2. Service Definition: ZSRV_PO_KTERN
**Location:** ZPCK_KTERN_MN → Business Services
**Status:** ✅ Active
**Description:** Exposes ZI_PROCUREMENT_DASHBOARD as PurchaseOrders entity

### 3. Service Binding: ZSRV_PO_KTERN_O2
**Location:** ZPCK_KTERN_MN → Business Services
**Status:** ✅ Active & Published
**Type:** OData V2 - UI
**Service URL:** `/sap/opu/odata/sap/ZSRV_PO_KTERN_O2/`

## Frontend Application

### Application Structure
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
├── package.json
├── ui5.yaml
└── README.md
```

## Deployment Steps

### Option 1: Deploy to SAP BTP (Cloud Foundry)

1. **Login to Cloud Foundry**
   ```bash
   cf login -a <api-endpoint>
   ```

2. **Build the Application**
   ```bash
   cd /home/nodeuser/workspace/procurement-dashboard
   npm run build
   ```

3. **Deploy**
   ```bash
   cf push
   ```

### Option 2: Deploy to SAP NetWeaver (On-Premise)

1. **Build the Application**
   ```bash
   cd /home/nodeuser/workspace/procurement-dashboard
   npm run build
   ```

2. **Deploy using SAP Fiori Tools**
   ```bash
   npm run deploy
   ```

3. **Configure Deployment**
   - Target System: Your SAP system
   - Package: ZPCK_KTERN_MN
   - Transport: L25K907722
   - BSP Application Name: ZPROCURE_DASH

### Option 3: Local Testing

1. **Start the Application Locally**
   ```bash
   cd /home/nodeuser/workspace/procurement-dashboard
   npm start
   ```

2. **Access the Application**
   - URL: http://localhost:8080
   - The app will proxy OData requests to your SAP backend

## Configuration

### Backend Configuration (Already Done)
- ✅ CDS View activated
- ✅ Service Definition activated
- ✅ Service Binding published
- ✅ OData service available at: `/sap/opu/odata/sap/ZSRV_PO_KTERN_O2/`

### Frontend Configuration (Already Done)
- ✅ manifest.json updated with correct service URL
- ✅ All views and controllers implemented
- ✅ Routing configured
- ✅ i18n texts defined

## Testing the Application

### 1. Test OData Service
Access the service metadata:
```
https://<your-sap-system>/sap/opu/odata/sap/ZSRV_PO_KTERN_O2/$metadata
```

### 2. Test Entity Set
Access purchase orders:
```
https://<your-sap-system>/sap/opu/odata/sap/ZSRV_PO_KTERN_O2/PurchaseOrders
```

### 3. Test Fiori Application
1. Launch the application
2. Verify KPI cards display data
3. Check charts render correctly
4. Test table search and filtering
5. Test navigation to detail page
6. Test export to Excel functionality

## Features Implemented

### Dashboard Features
- ✅ 5 KPI Cards (Total POs, Open POs, Released POs, Delayed Deliveries, Total Amount)
- ✅ 4 Interactive Charts (Status Distribution, Monthly Procurement, Vendor Analysis, Company Code Distribution)
- ✅ Purchase Orders Table with:
  - Search functionality
  - Sorting
  - Filtering
  - Pagination
  - Export to Excel
  - Visual indicators for overdue deliveries
  - Status colors

### Detail Page Features
- ✅ Purchase Order header information
- ✅ Vendor details
- ✅ Delivery information
- ✅ Status display
- ✅ Navigation back to dashboard

### Responsive Design
- ✅ Desktop optimized
- ✅ Tablet responsive
- ✅ Mobile friendly

## Troubleshooting

### Issue: OData Service Not Found
**Solution:** Verify service binding is published in transaction `/IWFND/MAINT_SERVICE`

### Issue: No Data Displayed
**Solution:** 
1. Check CDS view has data: Run in ABAP Development Tools
2. Verify service binding is active
3. Check user authorizations

### Issue: CORS Errors in Local Development
**Solution:** Configure proxy in ui5.yaml or use SAP Fiori tools proxy

### Issue: Charts Not Rendering
**Solution:** Verify sap.viz.ui5.controls library is loaded in manifest.json

## Maintenance

### Updating the Application
1. Make changes to the code
2. Test locally
3. Build the application
4. Deploy to target system
5. Clear browser cache

### Updating Backend
1. Modify CDS view if needed
2. Activate changes
3. Service binding will automatically reflect changes

## Support

For issues or questions:
- Check SAP Fiori documentation
- Review ABAP CDS documentation
- Check OData service logs in transaction `/IWFND/ERROR_LOG`

## Version History

### Version 1.0.0 (Current)
- Initial release
- Full dashboard with KPIs and charts
- Purchase order table with search/filter/export
- Detail page navigation
- Responsive design
- Integration with SAP MM tables (EKKO, EKPO, LFA1)

## Technical Details

### Backend
- **CDS View:** ZI_PROCUREMENT_DASHBOARD
- **Base Views:** I_PurchaseOrderAPI01, I_PurchaseOrderItemAPI01, I_Supplier
- **Service:** ZSRV_PO_KTERN_O2 (OData V2)
- **Package:** ZPCK_KTERN_MN
- **Transport:** L25K907722

### Frontend
- **Framework:** SAPUI5 1.120+
- **Type:** Freestyle Application
- **Theme:** SAP Fiori Horizon
- **Libraries:** sap.m, sap.f, sap.viz.ui5.controls, sap.ui.export

## Security Considerations

- Service uses standard SAP authorization checks
- CDS view has `@AccessControl.authorizationCheck: #NOT_REQUIRED` (modify if needed)
- Implement proper authorization objects in production
- Use HTTPS in production environments

## Performance Optimization

- OData service uses efficient CDS views
- Frontend implements lazy loading
- Table uses growing/pagination
- Charts use aggregated data
- Proper indexing on database tables

---

**Application Status:** ✅ Ready for Deployment
**Last Updated:** May 15, 2026
**Created By:** CodeGenie AI Assistant
