import { useQuery } from "@tanstack/react-query";
import type { PortfolioItem } from "@shared/schema";

export function usePortfolio() {
  return useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
