package com.mastercom.assignment1.Hotel.service;

import static org.mockito.ArgumentMatchers.any;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import com.mastercom.assignment1.Hotel.entity.Items;
import com.mastercom.assignment1.Hotel.repository.ItemRepository;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class ItemServiceTest {

    @InjectMocks
    private ItemService itemService;

    @Mock
    private ItemRepository itemRepository;

    private Items item;


    @BeforeEach
    public void setUp() {
        item = new Items();
        item.setItemCode(1L);
        item.setItemName("Test Item");
        item.setItemPrice(100.0);
        item.setStatus("Available");
        
    }

    @Test
    public void testGetAllItems() {
        List<Items> itemsList = Arrays.asList(item);
        when(itemRepository.findAll()).thenReturn(itemsList);

        List<Items> result = itemService.getAllItems();
        assertEquals(1, result.size());
        verify(itemRepository, times(1)).findAll();
    }

    @Test
    public void testGetItemByIdSuccess() {
        when(itemRepository.findById(anyLong())).thenReturn(Optional.of(item));

        Items result = itemService.getItemById(1L);
        assertNotNull(result);
        assertEquals("Test Item", result.getItemName());
        verify(itemRepository, times(1)).findById(anyLong());
    }

    @Test
    public void testGetItemByIdNotFound() {
        when(itemRepository.findById(anyLong())).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            itemService.getItemById(1L);
        });
        assertEquals("Item not found with itemCode: 1", exception.getMessage());
        verify(itemRepository, times(1)).findById(anyLong());
    }

    @Test
    public void testSaveItemSuccess() {
        when(itemRepository.existsById(anyLong())).thenReturn(false);
        when(itemRepository.save(any(Items.class))).thenReturn(item);

        Items result = itemService.saveItem(item);
        assertNotNull(result);
        assertEquals("Test Item", result.getItemName());
        verify(itemRepository, times(1)).existsById(anyLong());
        verify(itemRepository, times(1)).save(any(Items.class));
    }

    @Test
    public void testSaveItemAlreadyExists() {
        when(itemRepository.existsById(anyLong())).thenReturn(true);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            itemService.saveItem(item);
        });
        assertEquals("Item with itemCode 1 already exists", exception.getMessage());
        verify(itemRepository, times(1)).existsById(anyLong());
        verify(itemRepository, times(0)).save(any(Items.class));
    }

    @Test
    public void testDeleteItemSuccess() {
        doNothing().when(itemRepository).deleteById(anyLong());

        itemService.deleteItem(1L);
        verify(itemRepository, times(1)).deleteById(anyLong());
    }

    @Test
    public void testDeleteItemReferencedInInvoice() {
        doThrow(DataIntegrityViolationException.class).when(itemRepository).deleteById(anyLong());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            itemService.deleteItem(1L);
        });
        assertEquals("Cannot delete item. It is referenced in invoice details.", exception.getMessage());
        verify(itemRepository, times(1)).deleteById(anyLong());
    }

    @Test
    public void testUpdateItemSuccess() {
        when(itemRepository.findById(anyLong())).thenReturn(Optional.of(item));
        when(itemRepository.save(any(Items.class))).thenReturn(item);

        Items itemDetails = new Items();
        itemDetails.setItemName("Updated Item");
        itemDetails.setItemPrice(200.0);
        itemDetails.setStatus("Unavailable");

        Items result = itemService.updateItem(1L, itemDetails);
        assertNotNull(result);
        assertEquals("Updated Item", result.getItemName());
        verify(itemRepository, times(1)).findById(anyLong());
        verify(itemRepository, times(1)).save(any(Items.class));
    }

    @Test
    public void testUpdateItemNotFound() {
        when(itemRepository.findById(anyLong())).thenReturn(Optional.empty());

        Items itemDetails = new Items();
        itemDetails.setItemName("Updated Item");
        itemDetails.setItemPrice(200.0);
        itemDetails.setStatus("Unavailable");

        Exception exception = assertThrows(RuntimeException.class, () -> {
            itemService.updateItem(1L, itemDetails);
        });
        assertEquals("Item not found with itemCode: 1", exception.getMessage());
        verify(itemRepository, times(1)).findById(anyLong());
        verify(itemRepository, times(0)).save(any(Items.class));
    }
}
