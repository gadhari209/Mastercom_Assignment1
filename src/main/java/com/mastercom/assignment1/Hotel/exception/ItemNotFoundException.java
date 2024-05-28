package com.mastercom.assignment1.Hotel.exception;

@SuppressWarnings("serial")
public class ItemNotFoundException extends Exception {
    public ItemNotFoundException(String message) {
        super(message);
    }
}