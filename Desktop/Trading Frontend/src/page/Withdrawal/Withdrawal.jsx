import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Download, Calendar, Filter, Loader2 } from "lucide-react";
import { getAllWithdrawalHistory } from '@/State/Withdrawal/Action';

function Withdrawal() {
  const dispatch = useDispatch();
  const { history, loading } = useSelector((store) => store.withdrawal);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getAllWithdrawalHistory({ jwt }));
    }
  }, [jwt, dispatch]);

  const getStatusBadge = (status) => {
    const lowerCaseStatus = status.toLowerCase();
    switch (lowerCaseStatus) {
      case "success":
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700";
      case "declined":
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-700";
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Withdrawal History</h1>
        <div className="flex space-x-2">
          <button className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-700">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-700">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </button>
          <button className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="rounded-md border border-orange-200 dark:border-orange-800/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
              <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">Date & Time</TableHead>
              <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">Method</TableHead>
              <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4">Amount</TableHead>
              <TableHead className="text-orange-600 dark:text-orange-400 font-semibold py-4 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                 <TableRow>
                 <TableCell colSpan="4" className="text-center py-12">
                   <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-500" />
                   <p className="text-gray-500 mt-2">Loading history...</p>
                 </TableCell>
               </TableRow>
            ) : history.length > 0 ? (
                history.map((withdrawal) => (
                    <TableRow
                      key={withdrawal.id}
                      className="group hover:bg-gradient-to-r from-orange-50/70 to-yellow-50/70 dark:hover:from-orange-900/30 dark:hover:to-yellow-900/30 transition-all duration-300 border-b border-orange-100/20 dark:border-gray-700/20 last:border-b-0"
                    >
                      <TableCell className="py-4 font-medium text-gray-900 dark:text-white">
                        {formatDate(withdrawal.date)}
                      </TableCell>
                      <TableCell className="py-4 font-medium text-gray-900 dark:text-white">
                        Bank Account
                      </TableCell>
                      <TableCell className="py-4 font-medium text-gray-900 dark:text-white">
                        ${withdrawal.amount}
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <Badge className={getStatusBadge(withdrawal.status) + " float-right md:float-none"}>
                          {withdrawal.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
            ): (
                <TableRow>
                <TableCell colSpan="4" className="text-center py-12">
                    <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mb-4">
                      <TrendingDown className="h-10 w-10" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No withdrawals yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">Your withdrawal history will appear here</p>
                </TableCell>
                </TableRow>
            )}
           
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Withdrawal;