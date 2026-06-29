import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getreaction, addreaction } from "../api/reaction";

export function useReactions(username) {
    return useQuery({
        queryKey: ["reactions", username],
        queryFn: () => getreaction(username),
        enabled: !!username,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
}

export function useToggleReaction(username) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (type) => addreaction(username, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reactions", username] });
        },
    });
}
