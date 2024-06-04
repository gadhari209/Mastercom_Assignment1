package com.mastercom.assignment1.Hotel.Controller;

import com.mastercom.assignment1.Hotel.entity.Invoice;
import com.mastercom.assignment1.Hotel.entity.InvoiceDetails;
import com.mastercom.assignment1.Hotel.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @Autowired
    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }
  

    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice) {
        return invoiceService.createInvoice(invoice);
    }
    @PutMapping("/{invoiceId}/status")
    public Invoice updateInvoiceStatus(@PathVariable Long invoiceId, @RequestBody String newStatus) {
        return invoiceService.updateInvoiceStatus(invoiceId, newStatus);
    }

    @GetMapping("/{invoiceNo}")
    public Invoice getInvoiceByInvoiceNo(@PathVariable Long invoiceNo) {
        return invoiceService.getInvoiceByInvoiceNo(invoiceNo);
    }
    
}
