import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import{getproject,addproject,updatedproject, deleteproject}from"../api/project";

export function useProject(username){
    return useQuery({
        queryKey:["project",username],
        queryFn:()=>getproject(username),
        enabled: !!username,
        staleTime: 1000 * 60 * 5,  // ← add this! cache for 5 mins
        refetchOnWindowFocus: false  
    })
}

export function useAddProject(username){
    const queryclient=useQueryClient();
    return useMutation({
        mutationFn:addproject,
        onSuccess:()=>{
            queryclient.invalidateQueries(['project',username])
        },
        staleTime: 1000 * 60 * 5,  // ← add this! cache for 5 mins
        refetchOnWindowFocus: false  
        
    })
}

export function useUpdateProject(username){
    const queryclient=useQueryClient();
    return useMutation({
        mutationFn:({id,data})=>updatedproject(id,data),
        onSuccess:()=>{
            queryclient.invalidateQueries(['project',username])
        },
        staleTime: 1000 * 60 * 5,  // ← add this! cache for 5 mins
        refetchOnWindowFocus: false  
        
    })
}

export function usedeleteProject(username){
    const queryclient=useQueryClient();
    return useMutation({
        mutationFn:deleteproject,
        onSuccess:()=>{
            queryclient.invalidateQueries(['project',username])
        },
        staleTime: 1000 * 60 * 5,  // ← add this! cache for 5 mins
        refetchOnWindowFocus: false  
        
    })
}