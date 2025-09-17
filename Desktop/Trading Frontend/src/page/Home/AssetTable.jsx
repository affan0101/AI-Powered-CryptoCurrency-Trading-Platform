import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 20; // rows per page

const AssetTable = ({ coins }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  /* ---------- client-side slice ---------- */
  const pages   = Math.ceil((coins?.length || 0) / PAGE_SIZE);
  const rows    = useMemo(() => {
    if (!coins?.length) return [];
    const start = (page - 1) * PAGE_SIZE;
    return coins.slice(start, start + PAGE_SIZE);
  }, [coins, page]);

  /* ---------- existing formatters ---------- */
  const formatNumber = (n) =>
    n == null ? "N/A" : new Intl.NumberFormat("en-US").format(n);

  const formatPrice = (p) => {
    if (p == null) return "N/A";
    if (p < 1) return p.toFixed(6);
    if (p < 1000) return p.toFixed(2);
    return formatNumber(Number(p.toFixed(2)));
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* ---------------- TABLE ---------------- */}
      <Table>
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900">
            <TableHead className="text-orange-600 dark:text-orange-400 font-semibold">COINS</TableHead>
            <TableHead className="text-orange-600 dark:text-orange-400 font-semibold">SYMBOL</TableHead>
            <TableHead className="text-orange-600 dark:text-orange-400 font-semibold">VOLUME</TableHead>
            <TableHead className="text-orange-600 dark:text-orange-400 font-semibold">MARKET CAP</TableHead>
            <TableHead className="text-orange-600 dark:text-orange-400 font-semibold">24H</TableHead>
            <TableHead className="text-right text-orange-600 dark:text-orange-400 font-semibold">PRICE</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length ? (
            rows.map((coin) => (
              <TableRow
                key={coin.id}
                onClick={() => navigate(`/market/${coin.id}`)}
                className="group hover:bg-gradient-to-r from-orange-50/50 to-yellow-50/50 dark:hover:from-orange-900/20 dark:hover:to-yellow-900/20 transition-all duration-300 border-b border-orange-100/20 dark:border-gray-700/20 last:border-b-0 cursor-pointer"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 border border-orange-200 dark:border-orange-600">
                      <AvatarImage src={coin.image} alt={coin.name} className="p-1" />
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs">
                        {coin.symbol?.slice(0, 2) || "CR"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {coin.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-gray-600 dark:text-gray-400 font-medium uppercase">
                  {coin.symbol}
                </TableCell>

                <TableCell className="text-gray-600 dark:text-gray-400">
                  ${formatNumber(coin.total_volume)}
                </TableCell>

                <TableCell className="text-gray-600 dark:text-gray-400">
                  ${formatNumber(coin.market_cap)}
                </TableCell>

                <TableCell>
                  <div
                    className={`flex items-center gap-1 font-semibold ${
                      coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {coin.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </div>
                </TableCell>

                <TableCell className="text-right font-bold text-gray-900 dark:text-white">
                  ${formatPrice(coin.current_price)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                {coins ? "No coins found" : "Loading coins…"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* -------------- shadcn Pagination -------------- */}
      {pages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  onClick={() => setPage(p)}
                  isActive={p === page}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(p + 1, pages))}
                className={page === pages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AssetTable;