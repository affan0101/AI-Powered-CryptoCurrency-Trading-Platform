package com.crypto.repository;

import com.crypto.Model.PaymentDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentDetailsRepository extends JpaRepository<PaymentDetails,Long> {

    PaymentDetails findByUserId(Long userId);
}

