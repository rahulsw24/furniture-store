import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '../api/products';

export const useProducts = () => {
    return useQuery({
        queryKey: ['products'], // This is the unique ID for the cache
        queryFn: getAllProducts,

        // CONFIGURATION FOR FRESHNESS:
        staleTime: 1000 * 60 * 5, // Consider data "fresh" for 5 minutes
        gcTime: 1000 * 60 * 30,    // Keep in cache for 30 minutes

        // This ensures that if a product is added, the user gets it eventually 
        // without manual refresh:
        refetchOnWindowFocus: true, // Auto-update when user switches back to your tab
    });
};