import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getReactions, toggleReaction } from "../api/reactions"

export function useReactions(username) {
    return useQuery({
        queryKey: ["reactions", username],
        queryFn: () => getReactions(username),
        enabled: !!username
    })
}

export function useToggleReaction(username) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (type) => toggleReaction(username, type),
        onSuccess: () => {
            queryClient.invalidateQueries(["reactions", username])
        }
    })
}