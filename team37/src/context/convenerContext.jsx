import React, { createContext, useState, useContext , useCallback, useEffect} from 'react';

// Create the convener context
const ConvenerContext = createContext();

// Custom hook to accces the convener context
export const useConveners = () => {
    return useContext(ConvenerContext);
}

// The provider component
export const ConvenerProvider = ({ children }) => {
    const [conveners, setConveners] = useState([]);
    const [loadingConveners, setLoadingConveners] = useState(false);

    const fetchConveners = useCallback(
        async (eventid) => {
        if(!eventid) return;
        try{
            setLoadingConveners(true);
            const res = await fetch(`/api/event/conveners/${eventid}`);
            const data = await res.json();
            setConveners(data.conveners || []);
            console.log("Fetched conveners:", data.conveners);
        }catch(error){
            console.error("Error fetching convenors:", error);
        }finally{
            setLoadingConveners(false);
        }

        },[]);


    
    const handleAddConvener = useCallback(async (eventid, categoryToAdd, judgeToAdd) => {
        try {
             return await fetch(`/api/conveners/${eventid}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category: categoryToAdd, userid: judgeToAdd }),
            });

        } catch (error) {
            console.error("Error adding convener:", error);
            alert("An unexpected error occurred while adding convener.");
            
        }
    }, [fetchConveners]);

    const handleRemoveConvener = useCallback(async (eventid, userid) => {
        try{
            const res = await fetch(`/api/conveners/${eventid}/${userid}`, {
                method: "DELETE",
            });
            if (res.ok) {
                // Refresh the list
                await fetchConveners(eventid);
            }
        } catch(error){
            console.error("Error removing convener:", error);
        }
    },[fetchConveners]);

    
    // Inside ConvenerContext.js

    const handleAutoAllocate = useCallback(async (eventid) => {
        const confirm = window.confirm("Automatically assign conveners by category?");
        if (!confirm) return;

        try {
            setLoadingConveners(true);
            const res = await fetch(`/api/conveners/appoint/${eventid}`, { method: "POST" });
            
            if (res.ok) {
                // This correctly refreshes the conveners list within the context.
                await fetchConveners(eventid);
            } else {
                const result = await res.json();
                alert(result.message || "Failed to auto allocate conveners");
            }
        } catch (err) {
            alert("Error during auto allocation");
            console.error(err);
        } finally {
            setLoadingConveners(false);
        }
    }, [fetchConveners]);

    const rejectAppointmentAndReallocate = useCallback(async (userid, eventid) => {
        try {
            const res = await fetch(`/api/conveners/reject/${userid}/reallocate/${eventid}`, {
                method: "POST",
            });

            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.message || "Failed to reject appointment");
            }

            // After a successful rejection, refresh the conveners list for the admin page.
            // Any component using 'conveners' will now update automatically.
            await fetchConveners(eventid);


        } catch (err) {
            alert("Error: " + err.message);
            console.error(err);
        }
    }, [fetchConveners]); // Depends on the stable fetchConveners function



    const value = { conveners, loadingConveners, rejectAppointmentAndReallocate, fetchConveners, handleAddConvener, handleRemoveConvener, handleAutoAllocate };
    return (
        <ConvenerContext.Provider value={value}>
            {children}
        </ConvenerContext.Provider>
    );



}
