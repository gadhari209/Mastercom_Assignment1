package com.mastercom.assignment1.Hotel.service;

import com.mastercom.assignment1.Hotel.entity.Invoice;
import com.mastercom.assignment1.Hotel.entity.InvoiceDetails;
import com.mastercom.assignment1.Hotel.entity.Items;
import com.mastercom.assignment1.Hotel.repository.InvoiceRepository;
import com.mastercom.assignment1.Hotel.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private ItemRepository itemsRepository;

    @InjectMocks
    private InvoiceService invoiceService;

    private Invoice invoice;
    private InvoiceDetails invoiceDetails;
    private Items item;

    @BeforeEach
    void setUp() {
        item = new Items();
        item.setItemCode(1L);
        item.setItemPrice(100.0);

        invoiceDetails = new InvoiceDetails();
        invoiceDetails.setItem(item);
        invoiceDetails.setItemPrice(100.0);
        invoiceDetails.setQuantity(2);

        invoice = new Invoice();
        invoice.setInvoiceDetailsList(Arrays.asList(invoiceDetails));
    }

    @Test
    
    
    void testCreateInvoice() {
        when(itemsRepository.findById(1L)).thenReturn(Optional.of(item));
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(invoice);

        Invoice createdInvoice = invoiceService.createInvoice(invoice);

        assertNotNull(createdInvoice);
        assertEquals(200.0, createdInvoice.getTotalAmount());
        verify(invoiceRepository, times(1)).save(invoice);
    }

    @Test
    void testCreateInvoiceWithNoDetails() {
        invoice.setInvoiceDetailsList(null);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            invoiceService.createInvoice(invoice);
        });

        assertEquals("Invoice must have at least one detail", exception.getMessage());
    }

    @Test
    void testCreateInvoiceWithInvalidItem() {
        invoiceDetails.setItemPrice(0); // Set invalid item price
        when(itemsRepository.findById(1L)).thenReturn(Optional.of(item));

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            invoiceService.createInvoice(invoice);
        });

        assertEquals("Item price and quantity must be positive numbers", exception.getMessage());
    }

    @Test
    void testUpdateInvoiceStatus() {
        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(invoice);

        Invoice updatedInvoice = invoiceService.updateInvoiceStatus(1L, "paid");

        assertNotNull(updatedInvoice);
        assertEquals("paid", updatedInvoice.getBillStatus());
        verify(invoiceRepository, times(1)).save(invoice);
    }

    @Test
    void testUpdateInvoiceStatusWithInvalidId() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            invoiceService.updateInvoiceStatus(null, "paid");
        });

        assertEquals("Invalid invoice ID", exception.getMessage());
    }

    @Test
    void testGetInvoiceByInvoiceNo() {
        when(invoiceRepository.findByInvoiceNo(1L)).thenReturn(Optional.of(invoice));

        Invoice foundInvoice = invoiceService.getInvoiceByInvoiceNo(1L);

        assertNotNull(foundInvoice);
        assertEquals(invoice, foundInvoice);
        verify(invoiceRepository, times(1)).findByInvoiceNo(1L);
    }

    @Test
    void testGetInvoiceByInvalidInvoiceNo() {
        when(invoiceRepository.findByInvoiceNo(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            invoiceService.getInvoiceByInvoiceNo(1L);
        });

        assertEquals("Invoice not found with invoice number: 1", exception.getMessage());
    }
}

