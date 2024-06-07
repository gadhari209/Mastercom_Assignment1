package com.mastercom.assignment1.Hotel.entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "items", uniqueConstraints = {@UniqueConstraint(columnNames = "itemCode")})
public class Items {
    @Id
    private Long itemCode;
    private String itemName;
    private Double itemPrice;
    private String status;
    
    @OneToMany(mappedBy = "item", cascade = CascadeType.REMOVE)
    private List<InvoiceDetails> invoiceDetails;
    
    
    
	public Long getItemCode() {
		return itemCode;
	}
	public void setItemCode(Long itemCode) {
		this.itemCode = itemCode;
	}
	public String getItemName() {
		return itemName;
	}
	public void setItemName(String itemName) {
		this.itemName = itemName;
	}
	public Double getItemPrice() {
		return itemPrice;
	}
	public void setItemPrice(Double itemPrice) {
		this.itemPrice = itemPrice;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}

    
}
