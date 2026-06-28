import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getreaction, addreaction } from "../api/reaction"

export function useReactions(username) {
    return useQuery({
        queryKey: ["reactions", username],
        queryFn: () => getReactions(username),
        enabled: !!username,
        staleTime: 1000 * 60 * 5,  // ← add this! cache for 5 mins
        refetchOnWindowFocus: false  
    })
}

export function useToggleReaction(username) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (type) => toggleReaction(username, type),
        onSuccess: () => {
            queryClient.invalidateQueries(["reactions", username])
        },
        staleTime: 1000 * 60 * 5,  // ← add this! cache for 5 mins
        refetchOnWindowFocus: false  
    })
}