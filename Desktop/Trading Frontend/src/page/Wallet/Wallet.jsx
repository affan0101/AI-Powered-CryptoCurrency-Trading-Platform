import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Wallet as WalletIcon,
  Copy,
  RefreshCw,
  Plus,
  Download,
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddMoneyForm from "./AddMoneyForm";
import WithdrawalForm from "./WithdrawalForm";
import TransferForm from "./TransferForm";

// Redux Actions
import {
  depositMoney,
  getUserWallet,
  getWalletTransaction,
  paymentHandler,
} from "../../State/Wallet/Action";
import { getPaymentDetails, withdrawalRequest } from "@/State/Withdrawal/Action";

// Helper hook to read URL query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Wallet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery();

  const { wallet, withdrawal } = useSelector((store) => store);
  const { userWallet, transactions, loading } = wallet;
  const jwt = localStorage.getItem("jwt");

  const orderId = query.get("order_id");
  const paymentId = query.get("payment_id");
  const razorPayPaymentId = query.get("razorpay_payment_id");

  const [dialogOpen, setDialogOpen] = useState({
    addMoney: false,
    withdraw: false,
    transfer: false,
  });

  useEffect(() => {
    if (jwt) {
      handleFetchUserWallet();
      handleFetchUserWalletHistory();
      dispatch(getPaymentDetails({ jwt })); // Fetch payment details
    }
  }, [jwt, dispatch]);

  useEffect(() => {
    if (orderId && jwt) {
      dispatch(
        depositMoney({
          jwt,
          orderId,
          paymentId: razorPayPaymentId || paymentId,
          navigate,
        })
      );
    }
  }, [orderId, paymentId, razorPayPaymentId, jwt, dispatch, navigate]);

  const handleFetchUserWallet = () => {
    dispatch(getUserWallet(jwt));
  };

  const handleFetchUserWalletHistory = () => {
    dispatch(getWalletTransaction({ jwt: localStorage.getItem("jwt") }));
  };

  const handlePayment = (amount, paymentMethod) => {
    dispatch(paymentHandler({ jwt, amount, paymentMethod }));
  };
  
  const handleWithdrawal = (amount) => {
    dispatch(withdrawalRequest({jwt,amount}));
    handleDialogClose("withdraw");
  }

  const copyToClipboard = () => {
    if (userWallet?.id) {
      navigator.clipboard.writeText(userWallet.id);
    }
  };

  const refreshBalance = () => {
    handleFetchUserWallet();
    dispatch(getWalletTransaction({ jwt }));
  };

  const handleDialogOpen = (type) =>
    setDialogOpen((prev) => ({ ...prev, [type]: true }));
  const handleDialogClose = (type) =>
    setDialogOpen((prev) => ({ ...prev, [type]: false }));

  const formatTransactionType = (type) => {
    if (!type) return "TRANSACTION";
    return type.replace(/_/g, " ").toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            My Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your funds and transaction history
          </p>
        </div>

        {/* Wallet Card */}
        <Card className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 border-orange-200 dark:border-gray-700 shadow-lg mb-8">
          <CardHeader className="pb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <WalletIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Wallet Balance</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {userWallet?.id ? `#${userWallet.id}` : "Loading..."}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToClipboard}
                      className="h-6 w-6 text-gray-500 hover:text-orange-600"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={refreshBalance}
                className="h-8 w-8 text-gray-500 hover:text-orange-600"
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                $
                {(userWallet?.balance || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {/* Add Money */}
              <Dialog
                open={dialogOpen.addMoney}
                onOpenChange={(open) =>
                  setDialogOpen((prev) => ({ ...prev, addMoney: open }))
                }
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => handleDialogOpen("addMoney")}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg shadow-orange-400/30"
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      "Add Money"
                    )}
                  </Button>
                </DialogTrigger>
                <AddMoneyForm
                  onClose={() => handleDialogClose("addMoney")}
                  onPayment={handlePayment}
                  loading={loading}
                />
              </Dialog>

              {/* Withdrawal */}
              <Dialog
                open={dialogOpen.withdraw}
                onOpenChange={(open) =>
                  setDialogOpen((prev) => ({ ...prev, withdraw: open }))
                }
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => handleDialogOpen("withdraw")}
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-900/20"
                    disabled={loading || !withdrawal.paymentDetails}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Withdraw
                  </Button>
                </DialogTrigger>
                <WithdrawalForm
                  paymentDetails={withdrawal.paymentDetails}
                  onWithdraw={handleWithdrawal}
                  onClose={() => handleDialogClose("withdraw")}
                />
              </Dialog>

              {/* Transfer */}
              <Dialog
                open={dialogOpen.transfer}
                onOpenChange={(open) =>
                  setDialogOpen((prev) => ({ ...prev, transfer: open }))
                }
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => handleDialogOpen("transfer")}
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    disabled={loading}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Transfer
                  </Button>
                </DialogTrigger>
                <TransferForm
                  onClose={() => handleDialogClose("transfer")}
                  balance={userWallet?.balance || 0}
                  jwt={jwt}
                />
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 border-orange-200 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-500" />
                <p className="text-gray-500 mt-2">Loading transactions...</p>
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-orange-100 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "DEPOSIT" ||
                          transaction.type === "CREDIT" ||
                          transaction.amount > 0
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-red-100 dark:bg-red-900/30"
                        }`}
                      >
                        {transaction.type === "DEPOSIT" ||
                        transaction.type === "CREDIT" ||
                        transaction.amount > 0 ? (
                          <ArrowDownLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatTransactionType(transaction.type)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === "DEPOSIT" ||
                          transaction.type === "CREDIT" ||
                          transaction.amount > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "DEPOSIT" ||
                        transaction.type === "CREDIT" ||
                        transaction.amount > 0
                          ? "+"
                          : "-"}
                        ${Math.abs(transaction.amount || 0).toFixed(2)}
                      </p>
                       <Badge
                        variant="outline"
                        className={"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs"}
                      >
                       {"completed"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wallet;