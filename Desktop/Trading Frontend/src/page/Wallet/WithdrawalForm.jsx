import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WithdrawalForm = ({ onClose, paymentDetails, onWithdraw }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if(amount > 0) {
      onWithdraw(amount);
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
          Withdraw Funds
        </DialogTitle>
        <DialogDescription>
          Transfer money from your wallet to your bank account.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid gap-6 py-4">
        <div className="grid gap-2">
          <Label
            htmlFor="withdraw-amount"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Amount (USD)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
              $
            </span>
            <Input
              id="withdraw-amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-8 h-12"
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="bank-account"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Bank Account
          </Label>
          {paymentDetails ? (
             <div className="w-full h-12 flex items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm">
                <span>{paymentDetails.bankName} •••• {paymentDetails.accountNumber.slice(-4)}</span>
             </div>
          ): (
            <div className="w-full h-12 flex items-center rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm">
                <span>Please add a payment method first.</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
            disabled={!paymentDetails || !amount}
          >
            Withdraw
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default WithdrawalForm;