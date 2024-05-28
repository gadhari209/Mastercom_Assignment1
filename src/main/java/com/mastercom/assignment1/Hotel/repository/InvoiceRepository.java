package com.mastercom.assignment1.Hotel.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.mastercom.assignment1.Hotel.entity.Invoice;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceNo(Long invoiceNo);
}
