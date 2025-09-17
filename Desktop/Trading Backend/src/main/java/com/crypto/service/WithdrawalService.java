package com.crypto.service;

import com.crypto.Model.User;
import com.crypto.Model.Withdrawal;
import lombok.With;

import java.util.List;

public interface WithdrawalService {
    Withdrawal requestWithdrawal(Long amount, User User);
    Withdrawal procedWithdrawal(Long withdrawalId,boolean accept);
    List<Withdrawal> getUserWithdrawalHistory(User user);
    List<Withdrawal> getAllWithdrawalRequest();
}
