package com.crypto.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class PaymentDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String accountNumber;
    private String accountHolderName;
    private String bankName;
    private String ifsc;

    @OneToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private  User user;

}
