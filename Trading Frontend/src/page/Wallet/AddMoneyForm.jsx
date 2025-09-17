import React, { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// 1. Receives props from the parent Wallet component
const AddMoneyForm = ({ onClose, onPayment, loading }) => {
    const [amount, setAmount] = useState("");
    // 2. Use uppercase values to match the API endpoint
    const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (amount > 0) {
            // 3. Calls the handler function passed down from the parent
            onPayment(amount, paymentMethod);
        }
    };

    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    Top Up Your Wallet
                </DialogTitle>
                <DialogDescription>
                    Add funds to your wallet using your preferred payment method.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">Enter Amount</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                        <Input id="amount" type="number" placeholder="9999" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-8 text-lg font-medium h-12" required/>
                    </div>
                </div>

                <div className="grid gap-3">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select payment method</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-3">
                        <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-300 dark:hover:border-orange-600 transition-colors">
                            <RadioGroupItem value="RAZORPAY" id="razorpay" />
                            <Label htmlFor="razorpay" className="flex items-center gap-2 cursor-pointer font-medium">
                                <span className="text-orange-600 dark:text-orange-400">•</span> Razorpay
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-300 dark:hover:border-orange-600 transition-colors">
                            <RadioGroupItem value="STRIPE" id="stripe" />
                            <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer font-medium">
                                <span className="text-orange-600 dark:text-orange-400">•</span> Stripe
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white" disabled={loading}>
                        {loading ? "Processing..." : "Submit"}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default AddMoneyForm;