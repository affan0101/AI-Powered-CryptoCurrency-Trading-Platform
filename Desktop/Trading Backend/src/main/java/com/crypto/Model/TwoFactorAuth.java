package com.crypto.Model;

import com.crypto.domain.VerificationType;
import lombok.Data;


@Data
public class TwoFactorAuth {
    private boolean isEnabled=false;
    private VerificationType sendTo;
}
