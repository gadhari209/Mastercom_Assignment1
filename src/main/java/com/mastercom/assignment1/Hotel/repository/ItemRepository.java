package com.mastercom.assignment1.Hotel.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.mastercom.assignment1.Hotel.entity.Items;

public interface ItemRepository extends JpaRepository<Items, Long>{
	boolean existsByItemName(String itemName);
}
