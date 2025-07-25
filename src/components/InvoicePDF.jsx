import React from 'react';
import { Font } from '@react-pdf/renderer';

import { 
  Page, 
  Text, 
  View, 
  Document, 
  StyleSheet, 
  Image 
} from '@react-pdf/renderer';

Font.register({
    family: 'Open Sans',
    fonts: [
      {
        src: '/fonts/OpenSans-Regular.ttf',
        fontWeight: 400,
      },
      {
        src: '/fonts/OpenSans-SemiBold.ttf',
        fontWeight: 600,
      },
      {
        src: '/fonts/OpenSans-Bold.ttf',
        fontWeight: 700,
      },
    ],
  });

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Open Sans',
        fontWeight: 400, // Regular by default
        fontSize: 10,
      },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#112131',
    borderBottomStyle: 'solid',
  },
  title: {
    fontSize: 24,
    fontWeight: 700, // Bold
    color: '#333',
  },
  invoiceInfo: {
    fontSize: 12,
    textAlign: 'right',
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    width: '30%',
  },
  value: {
    width: '70%',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    fontWeight: 600, // SemiBold
    backgroundColor: '#f5f5f5',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderBottomStyle: 'solid',
  },
  col1: { width: '50%' },
  col2: { width: '15%', textAlign: 'right' },
  col3: { width: '15%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right' },
  totals: {
    marginTop: 20,
    alignSelf: 'flex-end',
    width: '30%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
  signature: {
    width: '45%',
    paddingTop: 40,
  },
  invoiceNumber: {
    fontSize: 12,
    fontWeight: 600, // SemiBold
    textAlign: 'right',
  },
  bodyText: {
    lineHeight: 1.5,
  },
  grandTotal: {
    fontWeight: 700, // Bold
    fontSize: 14,
  },
  amount: {
    fontWeight: 600, // SemiBold
    fontVariantNumeric: 'tabular-nums',
  },
  numberCell: {
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums', // Aligns numbers properly
  }
});

const InvoicePDF = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with company info */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={{ marginTop: 5 }}>{invoice.sender.name}</Text>
          {invoice.sender.address && (
            <Text style={{ marginTop: 3 }}>{invoice.sender.address}</Text>
          )}
          {invoice.sender.gstin && (
            <Text style={{ marginTop: 3 }}>GSTIN: {invoice.sender.gstin}</Text>
          )}
        </View>
        
        <View style={styles.invoiceInfo}>
          <Text style={{ fontWeight: 'bold' }}>Invoice #: {invoice.invoiceNumber}</Text>
          <Text style={{ marginTop: 5 }}>Date: {new Date(invoice.date).toLocaleDateString()}</Text>
          {invoice.dueDate && (
            <Text style={{ marginTop: 3 }}>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</Text>
          )}
        </View>
      </View>

      {/* Recipient details */}
      <View style={styles.section}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Bill To:</Text>
        <Text>{invoice.recipient.name}</Text>
        {invoice.recipient.address && (
          <Text>{invoice.recipient.address}</Text>
        )}
        {invoice.recipient.gstin && (
          <Text>GSTIN: {invoice.recipient.gstin}</Text>
        )}
      </View>

      {/* Items table */}
      <View style={styles.section}>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Description</Text>
          <Text style={styles.col2}>Qty</Text>
          <Text style={styles.col3}>Price</Text>
          <Text style={styles.col4}>Amount</Text>
        </View>
        
        {invoice.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.col1}>{item.description}</Text>
            <Text style={styles.col2}>{item.quantity}</Text>
            <Text style={styles.col3}>₹{item.price.toFixed(2)}</Text>
            <Text style={styles.col4}>₹{(item.quantity * item.price).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text>Subtotal:</Text>
          <Text>₹{invoice.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>Tax ({invoice.taxRate}%):</Text>
          <Text>₹{invoice.taxAmount.toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text>Total:</Text>
          <Text>₹{invoice.total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Notes */}
      {invoice.notes && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>Notes:</Text>
          <Text>{invoice.notes}</Text>
        </View>
      )}

      {/* Footer with signatures */}
      <View style={styles.footer}>
        <View style={styles.signature}>
          <Text>_________________________</Text>
          <Text>Sender Signature</Text>
        </View>
        <View style={styles.signature}>
          <Text>_________________________</Text>
          <Text>Recipient Signature</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;