import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as Icons from "@radix-ui/react-icons";

function PaymentDetailForm({ open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState({
    accountHolder: "",
    ifscCode: "",
    accountNumber: "",
    confirmAccountNumber: "",
    bankName: "",
  });
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showConfirmAccountNumber, setShowConfirmAccountNumber] =
    useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.accountHolder.trim()) {
      newErrors.accountHolder = "Account holder name is required";
    }

    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC code is required";
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (
      formData.accountNumber.length < 9 ||
      formData.accountNumber.length > 18
    ) {
      newErrors.accountNumber = "Account number must be 9-18 digits";
    }

    if (!formData.confirmAccountNumber.trim()) {
      newErrors.confirmAccountNumber = "Please confirm account number";
    } else if (formData.accountNumber !== formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = "Account numbers do not match";
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // ✅ Aligned property names with the display component
      onSubmit({
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountHolderName: formData.accountHolder, // Changed from accountHolder
        ifsc: formData.ifscCode.toUpperCase(), // Changed from ifscCode
      });
      setFormData({
        accountHolder: "",
        ifscCode: "",
        accountNumber: "",
        confirmAccountNumber: "",
        bankName: "",
      });
    }
  };

  const maskAccountNumber = (number) => {
    if (!number) return "";
    if (number.length <= 4) return number;
    return "**** **** **** " + number.slice(-4);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      className="bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border border-orange-200/30 dark:border-gray-700/50 rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
              <Icons.DashboardIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl text-gray-900 dark:text-white">
                Add Payment Details
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Enter your bank account information
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 ">
          {/* Bank Name */}
          <div className="space-y-2">
            <Label
              htmlFor="bankName"
              className="text-gray-700 dark:text-gray-300"
            >
              Bank Name
            </Label>
            <Input
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              placeholder="Enter bank name"
              className={`border-orange-200 dark:border-gray-600 focus:border-orange-500 ${
                errors.bankName ? "border-red-500" : ""
              }`}
            />
            {errors.bankName && (
              <p className="text-red-500 text-sm">{errors.bankName}</p>
            )}
          </div>

          {/* Account Holder Name */}
          <div className="space-y-2">
            <Label
              htmlFor="accountHolder"
              className="text-gray-700 dark:text-gray-300"
            >
              Account Holder Name
            </Label>
            <Input
              id="accountHolder"
              name="accountHolder"
              value={formData.accountHolder}
              onChange={handleInputChange}
              placeholder="Enter account holder name"
              className={`border-orange-200 dark:border-gray-600 focus:border-orange-500 ${
                errors.accountHolder ? "border-red-500" : ""
              }`}
            />
            {errors.accountHolder && (
              <p className="text-red-500 text-sm">{errors.accountHolder}</p>
            )}
          </div>

          {/* IFSC Code */}
          <div className="space-y-2">
            <Label
              htmlFor="ifscCode"
              className="text-gray-700 dark:text-gray-300"
            >
              IFSC Code
            </Label>
            <Input
              id="ifscCode"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleInputChange}
              placeholder="e.g., YESB0000099"
              className={`border-orange-200 dark:border-gray-600 focus:border-orange-500 ${
                errors.ifscCode ? "border-red-500" : ""
              }`}
            />
            {errors.ifscCode && (
              <p className="text-red-500 text-sm">{errors.ifscCode}</p>
            )}
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label
              htmlFor="accountNumber"
              className="text-gray-700 dark:text-gray-300"
            >
              Account Number
            </Label>
            <div className="relative">
              <Input
                id="accountNumber"
                name="accountNumber"
                type={showAccountNumber ? "text" : "password"}
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="Enter account number"
                className={`pr-10 border-orange-200 dark:border-gray-600 focus:border-orange-500 ${
                  errors.accountNumber ? "border-red-500" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 text-orange-500"
                onClick={() => setShowAccountNumber(!showAccountNumber)}
              >
                {showAccountNumber ? (
                  <Icons.EyeClosedIcon className="h-4 w-4" />
                ) : (
                  <Icons.EyeOpenIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.accountNumber && (
              <p className="text-red-500 text-sm">{errors.accountNumber}</p>
            )}
          </div>

          {/* Confirm Account Number */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmAccountNumber"
              className="text-gray-700 dark:text-gray-300"
            >
              Confirm Account Number
            </Label>
            <div className="relative">
              <Input
                id="confirmAccountNumber"
                name="confirmAccountNumber"
                type={showConfirmAccountNumber ? "text" : "password"}
                value={formData.confirmAccountNumber}
                onChange={handleInputChange}
                placeholder="Confirm account number"
                className={`pr-10 border-orange-200 dark:border-gray-600 focus:border-orange-500 ${
                  errors.confirmAccountNumber ? "border-red-500" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 text-orange-500"
                onClick={() =>
                  setShowConfirmAccountNumber(!showConfirmAccountNumber)
                }
              >
                {showConfirmAccountNumber ? (
                  <Icons.EyeClosedIcon className="h-4 w-4" />
                ) : (
                  <Icons.EyeOpenIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmAccountNumber && (
              <p className="text-red-500 text-sm">
                {errors.confirmAccountNumber}
              </p>
            )}
          </div>

          {/* Preview */}
          {formData.accountNumber && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                Preview: {maskAccountNumber(formData.accountNumber)}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold"
            >
              SUBMIT
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentDetailForm;