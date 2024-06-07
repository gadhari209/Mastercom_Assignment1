package com.mastercom.assignment1.Hotel.service;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import com.mastercom.assignment1.Hotel.entity.Items;
import com.mastercom.assignment1.Hotel.repository.ItemRepository;

@Service
public class ItemService {
    @Autowired
    private ItemRepository itemRepository;
    
    

    public List<Items> getAllItems() {
        return itemRepository.findAll();
    }

    
    
    
    public Items getItemById(Long itemCode) {
    	if (itemCode <= 0) {
            throw new IllegalArgumentException("Item code must be a positive number");
        }
    	
        return itemRepository.findById(itemCode).orElseThrow(() -> new RuntimeException("Item not found with itemCode: " + itemCode));
    }
    
    
    

    public Items saveItem(Items item) {
        if (itemRepository.existsById(item.getItemCode())) {
            throw new RuntimeException("Item with itemCode " + item.getItemCode() + " already exists");
        }if (item.getItemName() == null || item.getItemName().isEmpty()) {
        	
            throw new IllegalArgumentException("Item name cannot be empty");
        }
        if (item.getItemPrice() == null || item.getItemPrice() <= 0) {
            throw new IllegalArgumentException("Item price must be a positive number");
        }
        return itemRepository.save(item);
    }
    
    
    
    

    public void deleteItem(Long itemCode) {
    	if (itemCode <= 0) {
            throw new IllegalArgumentException("Item code must be a positive number");
        }
        
    	try {
            itemRepository.deleteById(itemCode);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Cannot delete item. It is referenced in invoice details.");
        }
    }
    
    
    
    
    

    public Items updateItem(Long itemCode, Items itemDetails) {
        Items existingItem = itemRepository.findById(itemCode).orElseThrow(() -> new RuntimeException("Item not found with itemCode: " + itemCode));
        if (itemDetails.getItemName() == null || itemDetails.getItemName().isEmpty()) {
            throw new IllegalArgumentException("Item name cannot be empty");
        }
        if (itemDetails.getItemPrice() == null || itemDetails.getItemPrice() <= 0) {
            throw new IllegalArgumentException("Item price must be a positive number");
        }
        existingItem.setItemName(itemDetails.getItemName());
        existingItem.setItemPrice(itemDetails.getItemPrice());
        existingItem.setStatus(itemDetails.getStatus());
        return itemRepository.save(existingItem);
    }
}
