package com.mastercom.assignment1.Hotel.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.mastercom.assignment1.Hotel.entity.Items;
import com.mastercom.assignment1.Hotel.service.ItemService;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/items")
public class ItemController {
    @Autowired
    private ItemService itemService;

    @GetMapping
    public List<Items> getAllItems() {
        return itemService.getAllItems();
    }

    @GetMapping("/{itemCode}")
    public Items getItemById(@PathVariable Long itemCode) {
        return itemService.getItemById(itemCode);
    }

    @PostMapping
    public Items createItem(@RequestBody Items item) {
        return itemService.saveItem(item);
    }

    @DeleteMapping("/{itemCode}")
    public void deleteItem(@PathVariable Long itemCode) {
        itemService.deleteItem(itemCode);
    }

    @PutMapping("/{itemCode}")
    public Items updateItem(@PathVariable Long itemCode, @RequestBody Items itemDetails) {
        return itemService.updateItem(itemCode, itemDetails);
    }
}
