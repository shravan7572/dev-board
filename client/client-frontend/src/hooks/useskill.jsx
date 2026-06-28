import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSkills, addSkill, deleteSkill } from "../api/skills"

export function useSkills(username) {
    return useQuery({
        queryKey: ["skills", username],
        queryFn: () => getSkills(username),
        enabled: !!username
    })
}

export function useAddSkill(username) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: addSkill,
        onSuccess: () => {
            queryClient.invalidateQueries(["skills", username])
        }
    })
}

export function useDeleteSkill(username) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteSkill,
        onSuccess: () => {
            queryClient.invalidateQueries(["skills", username])
        }
    })
}