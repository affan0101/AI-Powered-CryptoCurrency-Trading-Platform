import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArchiveIcon, TrashIcon, PlusIcon } from "@radix-ui/react-icons";
import PaymentDetailForm from "./PaymentDetailForm";
import { addpaymentDetails, getPaymentDetails } from "@/State/Withdrawal/Action";

const PaymentDetail = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const { paymentDetails } = useSelector((store) => store.withdrawal);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getPaymentDetails({ jwt }));
    }
  }, [jwt, dispatch]);

  const handleAddPayment = (newPayment) => {
    dispatch(addpaymentDetails({ paymentDetails: newPayment, jwt }));
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
            Payment Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your bank account information
          </p>
        </div>

        {/* Payment Methods */}
        {paymentDetails ? (
          <div className="grid gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800/90 border border-orange-200/30 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                    <ArchiveIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {paymentDetails.bankName}
                    </h2>
                    <p className="text-orange-600 dark:text-orange-400">
                      A/C No.: **** **** ****{" "}
                      {paymentDetails.accountNumber.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    A/C Holder
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {paymentDetails.accountHolderName}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    IFSC Code
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {paymentDetails.ifsc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArchiveIcon className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No payment methods
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add your bank account to get started
            </p>
          </div>
        )}

        {/* Add Button */}
        {!paymentDetails && (
          <div className="text-center">
            <button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-orange-500/30"
            >
              <PlusIcon className="h-5 w-5 inline mr-2" />
              Add payment details
            </button>
          </div>
        )}

        {/* Payment Detail Form Dialog */}
        <PaymentDetailForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleAddPayment}
        />
      </div>
    </div>
  );
};

export default PaymentDetail;