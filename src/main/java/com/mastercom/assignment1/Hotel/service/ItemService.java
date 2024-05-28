package com.mastercom.assignment1.Hotel.service;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
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
        return itemRepository.findById(itemCode).orElseThrow(() -> new RuntimeException("Item not found with itemCode: " + itemCode));
    }

    public Items saveItem(Items item) {
        if (itemRepository.existsById(item.getItemCode())) {
            throw new RuntimeException("Item with itemCode " + item.getItemCode() + " already exists");
        }
        return itemRepository.save(item);
    }

    public void deleteItem(Long itemCode) {
        itemRepository.deleteById(itemCode);
    }

    public Items updateItem(Long itemCode, Items itemDetails) {
        Items existingItem = itemRepository.findById(itemCode).orElseThrow(() -> new RuntimeException("Item not found with itemCode: " + itemCode));
        existingItem.setItemName(itemDetails.getItemName());
        existingItem.setItemPrice(itemDetails.getItemPrice());
        existingItem.setStatus(itemDetails.getStatus());
        return itemRepository.save(existingItem);
    }
}
