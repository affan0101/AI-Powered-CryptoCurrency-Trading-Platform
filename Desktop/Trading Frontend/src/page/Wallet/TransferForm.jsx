import React, { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { transferMoney } from "../../State/Wallet/Action";
import { Loader2 } from "lucide-react";

const TransferForm = ({ onClose, balance, jwt }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(store => store.wallet);

  const [formData, setFormData] = useState({
    amount: "",
    recipientWalletId: "",
    purpose: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || formData.amount <= 0 || formData.amount > balance) {
      alert("Please enter a valid amount");
      return;
    }
    
    if (!formData.recipientWalletId) {
      alert("Please enter recipient wallet ID");
      return;
    }

    dispatch(transferMoney({
      jwt: jwt,
      walletId: formData.recipientWalletId, // This should be the recipient's wallet ID
      reqData: {
        amount: parseFloat(formData.amount),
        purpose: formData.purpose || "Transfer"
      }
    })).then(() => {
      onClose(); // Close the dialog after successful transfer
    }).catch((error) => {
      console.error("Transfer failed:", error);
    });
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
          Transfer To Other Wallet
        </DialogTitle>
        <DialogDescription>
          Send money to another wallet address.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="grid gap-6 py-4">
        <div className="grid gap-2">
          <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enter Amount
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="100.00"
              value={formData.amount}
              onChange={handleChange}
              className="pl-8 h-12"
              min="0.01"
              step="0.01"
              max={balance}
              required
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Available balance: ${balance.toLocaleString()}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="recipientWalletId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enter Wallet ID
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">#</span>
            <Input
              id="recipientWalletId"
              name="recipientWalletId"
              type="text"
              placeholder="Enter recipient wallet ID"
              value={formData.recipientWalletId}
              onChange={handleChange}
              className="pl-8 h-12"
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="purpose" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Purpose (Optional)
          </Label>
          <Textarea
            id="purpose"
            name="purpose"
            placeholder="Purpose of transfer..."
            value={formData.purpose}
            onChange={handleChange}
            className="min-h-[80px]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default TransferForm;