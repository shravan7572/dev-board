import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getprofile, updateprofle } from "../api/profile";

export function useProflie(username) {
    return useQuery({
        queryKey: ["Profile", username],
        queryFn: () => getprofile(username),
        enabled: !!username,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
}

export function useUpdateProfile() {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: updateprofle,
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["Profile"] });
        },
    });
}
