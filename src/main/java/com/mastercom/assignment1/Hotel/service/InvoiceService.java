package com.mastercom.assignment1.Hotel.service;

import com.mastercom.assignment1.Hotel.entity.Invoice;
import com.mastercom.assignment1.Hotel.entity.InvoiceDetails;
import com.mastercom.assignment1.Hotel.entity.Items;
import com.mastercom.assignment1.Hotel.repository.InvoiceRepository;
import com.mastercom.assignment1.Hotel.repository.ItemRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ItemRepository itemsRepository;

    @Autowired
    public InvoiceService(InvoiceRepository invoiceRepository, ItemRepository itemsRepository) {
        this.invoiceRepository = invoiceRepository;
        this.itemsRepository = itemsRepository;
    }
    
    
    
    

    public Invoice createInvoice(Invoice invoice) {
    	// Validate if invoice details are empty
        if (invoice.getInvoiceDetailsList() == null || invoice.getInvoiceDetailsList().isEmpty()) {
            throw new IllegalArgumentException("Invoice must have at least one detail");
        }
        double totalAmount = 0.0;
        for (InvoiceDetails details : invoice.getInvoiceDetailsList()) {
            // Fetch existing item from the database
            Optional<Items> itemOpt = itemsRepository.findById(details.getItem().getItemCode());
            if (itemOpt.isPresent()) {
                details.setItem(itemOpt.get());
            } else {
                throw new RuntimeException("Item not found with code: " + details.getItem().getItemCode());
            }
         // Validate if item price and quantity are positive numbers
            if (details.getItemPrice() <= 0 || details.getQuantity() <= 0) {
                throw new IllegalArgumentException("Item price and quantity must be positive numbers");
            }
            details.setInvoice(invoice);
            totalAmount += details.getItemPrice() * details.getQuantity();
        }
        invoice.setTotalAmount(totalAmount);
        return invoiceRepository.save(invoice);
    }
    
    
    
    
    public Invoice updateInvoiceStatus(Long invoiceId, String newStatus) {
    	
    	// Validate invoiceId
        if (invoiceId == null || invoiceId <= 0) {
            throw new IllegalArgumentException("Invalid invoice ID");
        }
     // Validate newStatus
        if (!isValidInvoiceStatus(newStatus)) {
            throw new IllegalArgumentException("Invalid invoice status: " + newStatus);
        }

        Optional<Invoice> invoiceOptional = invoiceRepository.findById(invoiceId);
        if (invoiceOptional.isPresent()) {
            Invoice invoice = invoiceOptional.get();
            invoice.setBillStatus(newStatus);
            return invoiceRepository.save(invoice);
        } else {
            throw new RuntimeException("Invoice not found with id: " + invoiceId);
        }
    }
    private boolean isValidInvoiceStatus(String status) {
        // Check for valid invoice status values (case-insensitive)
        return status.equalsIgnoreCase("paid") || status.equalsIgnoreCase("unpaid") || status.equalsIgnoreCase("cancelled");
    }
    
    
    
    
    
    public Invoice getInvoiceByInvoiceNo(Long invoiceNo) {
    	
    	if (invoiceNo == null || invoiceNo <= 0) {
            throw new IllegalArgumentException("Invalid invoice number");
        }
        Optional<Invoice> invoiceOptional = invoiceRepository.findByInvoiceNo(invoiceNo);
        if (invoiceOptional.isPresent()) {
            return invoiceOptional.get();
        } else {
            throw new RuntimeException("Invoice not found with invoice number: " + invoiceNo);
        }
    }
    

    
}
